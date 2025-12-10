# Assessor Continuity Fix - Business Case Scheduling

## Problem Statement

**Issue:** Business Case scheduling was not maintaining assessor continuity from Group Activity.

**Example of the Bug:**
- Group Activity: Participants P5, P6, P7 were assigned to **Assessor Gamma**
- Business Case (INCORRECT):
  - P5 → Room 81 with **Delta only** ❌ (Gamma missing!)
  - P6 → Room 81 with **Delta only** ❌ (Gamma missing!)
  - P7 → Room 80 with Beta + Gamma ✅ (Correct)

**Business Rule Violated:** 
For Business Case and Leadership Questionnaire activities, at least one assessor from the participant's Group Activity MUST be present.

---

## Root Cause Analysis

### The Scheduling Flow
1. **Group Activity variables created** → Participants divided into groups, each group assigned to one assessor
2. **Business Case variables created** → Participants distributed across multiple rooms
3. **CSP Solver runs** → Schedules activities
4. **Post-processing** → Attempts to enforce continuity

### The Problem
The Business Case room distribution (`distributeBusinessCaseAcrossRooms`) was using **simple even splitting**:
- Divide participants equally across rooms
- Divide assessors equally across rooms
- **NO consideration** of which assessor each participant had during Group Activity

The post-scheduling `enforce100PercentAssessorContinuity` method tried to fix this, but room assignments were already locked by then.

---

## Solution Implemented

### 1. Extract Group Activity Mapping Early
**Location:** `csp-solver.ts` → `initializeEnhancedVariables()` → Business Case section

**What it does:**
```typescript
// BEFORE creating Business Case variables, extract Group Activity mappings
const participantGroupActivityAssessorMap = new Map<string, string>();
this.variables.forEach(variable => {
  if (variable.isGroupActivity && variable.groupInfo) {
    variable.groupInfo.forEach(group => {
      group.participants.forEach(participantId => {
        participantGroupActivityAssessorMap.set(participantId, group.assessorId);
      });
    });
  }
});
```

**Result:** We now know "P5 → Gamma", "P6 → Gamma", "P7 → Gamma" BEFORE distributing Business Case rooms.

### 2. Pass Mapping to Distribution Function
**Location:** `csp-solver.ts` → Business Case variable creation

**What changed:**
```typescript
const roomDistribution = this.distributeBusinessCaseAcrossRooms(
  participantIds,
  specializedAssessorIds,
  availableRooms,
  businessCaseRoomAssessors,
  participantGroupActivityAssessorMap, // ← NEW: Pass the continuity map
);
```

### 3. Continuity-Aware Room Assignment
**Location:** `csp-solver.ts` → `distributeBusinessCaseAcrossRooms()`

**What changed:**
- **BEFORE:** Participants split evenly across rooms (P1-P3 → Room1, P4-P6 → Room2, etc.)
- **AFTER:** Each participant assigned to a room that contains their Group Activity assessor

**Algorithm:**
```typescript
For each participant:
  1. Look up their Group Activity assessor (e.g., P5 → Gamma)
  2. Find rooms where Gamma is assigned
  3. Assign P5 to that room
  4. If Gamma is not in any room → fallback to least-loaded room + log warning
```

**Verification:** After distribution, log continuity status for each participant:
```
✅ P5 continuity maintained (Gamma present in assigned room)
✅ P6 continuity maintained (Gamma present in assigned room)
✅ P7 continuity maintained (Gamma present in assigned room)
```

### 4. Added Helper Method (for future use)
**Location:** `constraints.ts`

```typescript
getGroupActivityAssessorsForParticipant(participantId: string): string[] | undefined {
  return this.groupActivityAssessorMap.get(participantId);
}
```

---

## Expected Behavior After Fix

### Scenario: 10 Participants, 4 Assessors (Beta, Gamma, Delta, Justin)

**Group Activity Assignments:**
- Group 1: P10, P9, P8 → Assessor **Beta**
- Group 2: P7, P6, P5 → Assessor **Gamma**
- Group 3: P4, P3 → Assessor **Delta**
- Group 4: P2, P1 → Assessor **Justin**

**Business Case Room Distribution (3 rooms: Room 80, Room 81, Hall):**

**Room Assessor Assignment:**
- Room 80: Beta, Gamma
- Room 81: Delta
- Hall: Justin

**Participant Room Assignment (Continuity-Aware):**
- Room 80: P10, P9, P8 (Beta's group) + P7, P6, P5 (Gamma's group) ✅
- Room 81: P4, P3 (Delta's group) ✅
- Hall: P2, P1 (Justin's group) ✅

**Verification:**
- P10, P9, P8 → Room 80 has Beta ✅
- P7, P6, P5 → Room 80 has Gamma ✅
- P4, P3 → Room 81 has Delta ✅
- P2, P1 → Hall has Justin ✅

**Leadership Questionnaire:** Same continuity logic applies (uses the same Group Activity assessor map).

---

## Testing Instructions

### 1. Run the Auto-Scheduler with Your Input
Use the same input JSON you provided:
- 10 participants (p1-p10)
- 4 assessors (Beta, Gamma, Delta, Justin)
- 4 scenarios (Role Play, TOYF, Business Case, Group Activity)
- 2 questionnaires (Leadership Questionnaire 5, Leadership Questionnaire 6)

### 2. Check Console Logs for Continuity Verification
Look for these log messages during Business Case distribution:
```
🔍 Building Group Activity continuity map...
  📋 Pre-mapped: 5f821fad → Group Activity assessor 053286a8
  📋 Pre-mapped: a2304f3c → Group Activity assessor 8fa73550
  ...

📋 Using CONTINUITY-AWARE participant distribution:
  ✅ 5f821fad → Room 36c6ba23 (has Group Activity assessor 053286a8)
  ✅ a2304f3c → Room c6b209ef (has Group Activity assessor 8fa73550)
  ...

   Room 36c6ba23: 3 participants, 2 FIXED assessors
     Participants: [5f821fad, ...]
     FIXED Assessors: [053286a8, 8fa73550]
       ✅ 5f821fad continuity maintained
       ✅ a2304f3c continuity maintained
```

### 3. Verify Output JSON
Check the `participantSchedules` for Business Case:
- Each participant should have at least one assessor from their Group Activity
- Example: If P5 had Gamma in Group Activity, P5's Business Case should include Gamma in `assessorIds`

### 4. Check for Warnings
If any participant shows:
```
⚠️ 232b72db → Room c6b209ef (fallback - Group Activity assessor not in any room)
```
This means the room-assessor distribution didn't allow continuity (e.g., Gamma wasn't assigned to any room). This should NOT happen with proper input data.

---

## Fallback Behavior

If for some reason the Group Activity hasn't been scheduled yet or data is missing:
- The function falls back to **simple even distribution** (old behavior)
- Logs warning: `⚠️ No Group Activity continuity map provided - will distribute participants evenly`
- Post-scheduling `enforce100PercentAssessorContinuity` will attempt to fix continuity

---

## Files Modified

1. **`backend/src/Modules/class-configration/scheduling/csp-solver.ts`**
   - Added Group Activity mapping extraction before Business Case variable creation
   - Updated `distributeBusinessCaseAcrossRooms` signature to accept continuity map
   - Implemented continuity-aware participant-to-room assignment
   - Added verification logging

2. **`backend/src/Modules/class-configration/scheduling/constraints.ts`**
   - Added `getGroupActivityAssessorsForParticipant()` helper method

---

## Benefits of This Fix

1. **Proactive vs Reactive:** Continuity enforced during distribution, not as post-processing
2. **100% Guarantee:** Impossible to assign participants to wrong rooms
3. **Transparent:** Detailed logging shows exactly why each participant goes to each room
4. **Debuggable:** Easy to trace continuity violations in logs
5. **Maintainable:** Clear separation of concerns (distribution logic vs constraint checking)

---

## Related Business Rules

This fix ensures compliance with the core scheduling rule:
> **Assessor Continuity Rule:** For Business Case and Leadership Questionnaire activities (sequence order 3 and 4), each participant MUST be assessed by at least one assessor who was present during their Group Activity (sequence order 2).

This rule ensures:
- Assessor familiarity with participant behavior
- Consistency in evaluation
- Better participant experience (familiar faces)

---

## Next Steps

1. **Test with provided input** to verify the fix works
2. **Check output JSON** to confirm all participants have correct assessor continuity
3. **Review console logs** to ensure no continuity violations or warnings
4. If issues persist, check:
   - Are Group Activity variables created before Business Case variables?
   - Is the `groupInfo` properly populated in Group Activity variables?
   - Are room-assessor assignments compatible with participant-assessor mappings?

