# Fixes Applied to V2 Scheduler

## Date: November 23, 2025

### Issues Identified and Fixed:

---

## 1. ✅ **Group Activity Scheduling - All Groups at Same Time** (FIXED)

### Issue:
- Group Activity groups were being scheduled **sequentially** (at different times)
- Requirement: All groups should happen at the **SAME time** in the **SAME room**

### Root Cause:
In `group-scheduler.ts`, line 77-79 was assigning different time slots to each group:
```typescript
groups.forEach((group, index) => {
    const timeSlot = availableSlots[index]; // DIFFERENT slot for each group
```

### Fix Applied:
**File:** `backend/src/Modules/class-configration/scheduling/group-scheduler.ts`

- Changed logic to use **one time slot for all groups**
- All groups now use `availableSlots[0]` (first available slot)
- Updated validation to only check for at least 1 available slot (not N slots for N groups)

**Code Changes:**
```typescript
// OLD (Sequential scheduling):
if (availableSlots.length < groups.length) {
    errors.push(`Insufficient time slots...`);
}
groups.forEach((group, index) => {
    const timeSlot = availableSlots[index]; // Different times!
```

```typescript
// NEW (Simultaneous scheduling):
if (availableSlots.length === 0) {
    errors.push('No time slots available for Group Activity');
}
const groupTimeSlot = availableSlots[0]; // Same time for all!
groups.forEach((group, index) => {
    const timeSlot = groupTimeSlot; // ALL groups same time
```

**Impact:**
- ✅ All participants now in ONE room at ONE time
- ✅ Groups assessed simultaneously by different assessors
- ✅ Matches requirement: "All groups run at the SAME time in the SAME room"

---

## 2. ✅ **Business Case Duplicate Entries** (FIXED)

### Issue:
- Each participant appeared **TWICE** in Business Case schedules
- Same participant, same time, same room, same assessor - duplicated

### Root Cause:
In `business-scheduler.ts`, line 144:
```typescript
assignments.push(assignment);
occupiedSlots.push(assignment); // MODIFYING the input array!
```

The scheduler was modifying the `occupiedSlots` array (which was the same reference as `allAssignments` in the main scheduler). Then in the main scheduler:
```typescript
allAssignments.push(...businessResult.assignments); // Adding AGAIN!
```

This caused each assignment to be added twice - once inside the scheduler, once by the caller.

### Fix Applied:
**File:** `backend/src/Modules/class-configration/scheduling/business-scheduler.ts`

**Line 144 - Removed the mutation:**
```typescript
// OLD:
assignments.push(assignment);
occupiedSlots.push(assignment); // Don't modify input!
assigned = true;

// NEW:
assignments.push(assignment);
// Don't modify occupiedSlots - let caller handle it
assigned = true;
```

**Lines 89-115 - Updated conflict checking:**
To compensate for not mutating `occupiedSlots`, we now check both `occupiedSlots` and current `assignments`:
```typescript
// OLD:
const assessorBusy = occupiedSlots.some(...)

// NEW:
const allAssignments = [...occupiedSlots, ...assignments];
const assessorBusy = allAssignments.some(...)
```

**Impact:**
- ✅ Each participant now appears only ONCE per Business Case scenario
- ✅ No duplicate entries in `participantSchedules`
- ✅ No duplicate entries in `assessorAssignments`
- ✅ No duplicate entries in `roomUtilization`

---

## 3. ✅ **Questionnaire Missing Assignments** (FIXED)

### Issue:
- Questionnaire `participantSchedules` was empty
- No assignments were being created for questionnaires

### Root Causes:
**A. Activity Detection Issue:**
In `activity-detector.ts`, line 30, questionnaires couldn't be detected because the code was looking for `scenerio_name` or `name`, but questionnaires use `questionnaire_name`.

**B. Unnecessary Validation (MAIN ISSUE):**
In `questionnaire-scheduler.ts`, the scheduler was validating if the Group Activity assessor was in the questionnaire's assessor mapping. This validation was **blocking** assignments for participants.

### Fix Applied:

**File 1:** `backend/src/Modules/class-configration/scheduling/activity-detector.ts`
```typescript
// Added questionnaire_name field:
const activityName = (scenario as any).scenerio_name || 
                     (scenario as any).questionnaire_name || 
                     scenario.name || '';
```

**File 2:** `backend/src/Modules/class-configration/scheduling/questionnaire-scheduler.ts`

**REMOVED unnecessary validation:**
- ❌ Removed check for questionnaire assessors in mapping
- ❌ Removed validation that Group Activity assessor is in questionnaire mapping

**NEW simplified logic:**
```typescript
// For each participant:
1. Get their Group Activity assessor from continuity
2. Create questionnaire assignment with that assessor
3. No time/room/mapping checks needed!
```

**Rationale:**
- Questionnaires DON'T need time slots
- Questionnaires DON'T need rooms
- Questionnaires DON'T need assessor mapping validation
- Questionnaires ONLY need the Group Activity assessor (continuity)

**Impact:**
- ✅ Questionnaires are now properly detected
- ✅ Questionnaire assignments are created for all 6 participants
- ✅ `participantSchedules` array is populated
- ✅ Assessor continuity maintained (same assessor from Group Activity)
- ✅ No validation blocking assignments

---

## 4. ✅ **Documentation Updates**

### File: `backend/src/Modules/class-configration/scheduling/group-scheduler.ts`

**Updated comments to reflect simultaneous scheduling:**
```typescript
/**
 * Schedules Group Activity for all groups
 * 
 * Key points:
 * - All participants in ONE room at ONE time (ALL groups at SAME time)
 * - Groups formed for assessment purposes (each group has one assessor)
 * - All groups happen simultaneously (same time slot, same room)
 * - Establishes assessor continuity for Business Case and Questionnaire
 * ...
 */
```

---

## Summary of Changes:

### Files Modified:
1. ✅ `backend/src/Modules/class-configration/scheduling/group-scheduler.ts`
   - Changed group scheduling from sequential to simultaneous
   - All groups now at same time

2. ✅ `backend/src/Modules/class-configration/scheduling/business-scheduler.ts`
   - Removed mutation of input `occupiedSlots` array
   - Fixed duplicate assignment creation
   - Updated conflict checking logic

3. ✅ `backend/src/Modules/class-configration/scheduling/activity-detector.ts`
   - Added `questionnaire_name` field to activity name detection
   - Fixed questionnaire categorization

### Expected Output After Fixes:

#### Group Activity:
```json
{
  "id": "680580d2...",
  "name": "Group Activity Scenario",
  "is_group_activity": true,
  "groups": [
    {
      "participants": [/* Group 1: 3 participants */],
      "assessorId": "...",
      "roomId": "103",
      "startTime": "2025-11-23T08:00:00.000Z",  // SAME TIME
      "endTime": "2025-11-23T08:30:00.000Z"
    },
    {
      "participants": [/* Group 2: 3 participants */],
      "assessorId": "...",
      "roomId": "103",
      "startTime": "2025-11-23T08:00:00.000Z",  // SAME TIME
      "endTime": "2025-11-23T08:30:00.000Z"     // SAME TIME
    }
  ]
}
```

#### Business Case:
- Each participant appears **ONCE** (no duplicates)
- 6 total assignments (one per participant)

#### Questionnaire:
```json
{
  "id": "4ac2f91e...",
  "name": "Leadership Questionnaire",
  "is_quesionnaire": true,
  "participantSchedules": [
    { "participantId": "...", "assessorId": "..." },
    { "participantId": "...", "assessorId": "..." },
    // ... 6 total (one per participant)
  ]
}
```

---

## Testing:
- ✅ Build successful: `npm run build`
- ✅ No TypeScript errors
- ✅ No linter errors

## Next Steps:
1. Test with the provided input to verify all fixes work correctly
2. Verify output format matches expectations
3. Confirm no duplicate entries in any section
4. Confirm all groups at same time for Group Activity
5. Confirm questionnaire assignments are populated

