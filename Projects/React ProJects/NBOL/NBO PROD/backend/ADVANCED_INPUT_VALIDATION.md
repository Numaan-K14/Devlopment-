# Advanced Input Validation

## Overview
Comprehensive validation system that catches configuration errors **before** scheduling begins, providing clear and actionable error messages.

## Validation Layers

### Layer 1: Basic Input Validation (`input-validator-v2.ts`)
Validates basic structure and requirements without scenario metadata.

### Layer 2: Activity Configuration Validation (`scheduler-v2.service.ts`)
Advanced validation after activity detection, using scenario metadata for precise checks.

## Validation Rules

### 1. Assessor Continuity ✅
**Rule**: Group Activity assessors MUST also assess Business Case and Questionnaire for the same participants.

**Why**: Ensures consistent assessment by familiar assessors across activity types.

**Error Example**:
```
ASSESSOR_CONTINUITY_ERROR: Business Case "Business Case Scenerio 1" does not have any Group Activity assessors.
At least one assessor must be shared with Group Activity for continuity.
Group Activity assessors: [assessor-1, assessor-2]
Business Case assessors: [assessor-3, assessor-4]
```

**Fix**: Add at least one Group Activity assessor to the Business Case assessor mapping.

---

### 2. Parallel Activity Room Conflicts ✅
**Rule**: Role Play and TOYF cannot share the same room since they run in parallel.

**Why**: Prevents room conflicts when activities are scheduled simultaneously.

**Error Example**:
```
PARALLEL_ROOM_CONFLICT: Role Play "RolePlay Scenerio 1" and TOYF "TOYF 1" share room(s) [room-101].
Since these activities run in parallel, they cannot use the same room.
Please assign different rooms to each activity.
```

**Fix**: Assign different rooms to Role Play and TOYF in `room_assessment_mapping`.

**Correct Configuration**:
```json
{
  "room_assessment_mapping": {
    "room-101": ["roleplay-id"],  // Role Play only
    "room-102": ["toyf-id"]        // TOYF only
  }
}
```

---

### 3. Group Activity Assessors ✅
**Rule**: Group Activity requires at least 2 assessors for proper group formation.

**Why**: Minimum 2 participants per group requires at least 2 assessors.

**Error Example**:
```
GROUP_ACTIVITY_ASSESSOR_ERROR: Group Activity requires at least 2 assessors for proper group formation.
Currently assigned: 1 assessor(s).
Please assign at least 2 assessors to the Group Activity.
```

**Fix**: Add more assessors to the Group Activity in `assessment_assessor_mapping`.

**Warning** (not an error):
If you have 6 participants but only 2 assessors, you'll get:
```
Group Activity has 2 assessor(s) but 2 would be optimal for 6 participants (targeting ~3 participants per group).
```

---

### 4. Room Assignment ✅
**Rule**: All activities that require rooms (Role Play, TOYF, Group Activity, Business Case) must have at least one room assigned.

**Why**: Activities need physical spaces to occur.

**Error Example**:
```
ROOM_ASSIGNMENT_ERROR: Activity "RolePlay Scenerio 1" requires a room but has no room assigned.
Please assign at least one room to this activity in room_assessment_mapping.
```

**Fix**: Add the activity to at least one room's activity list.

---

### 5. Basic Validations (Also Checked)
- ✅ Required fields (dates, facility, project, durations)
- ✅ Date range validity
- ✅ Minimum 2 participants (for Group Activity)
- ✅ No duplicate participants
- ✅ At least one scenario
- ✅ All scenarios have assessors
- ✅ All questionnaires have assessors
- ✅ Time capacity (sufficient hours to schedule all activities)
- ✅ Break time validations

## Validation Timing

### Pre-Scheduling (Phase 1)
```
Phase 1: Validating input...
```
- Basic structure validation
- Date/time validation
- Participant/scenario counts
- Time capacity estimation

### Post-Detection (Phase 3.5)
```
Phase 3.5: Validating activity configuration...
```
- Assessor continuity
- Parallel room conflicts
- Group Activity assessor count
- Room assignments

## Example: Complete Valid Input

```json
{
  "participantIds": ["p1", "p2", "p3", "p4", "p5", "p6"],
  "scenarioIds": ["roleplay-1", "toyf-1", "group-1", "business-1"],
  "questionnaireIds": ["quest-1"],
  "assessment_assessor_mapping": {
    "roleplay-1": ["assessor-a", "assessor-b"],
    "toyf-1": ["assessor-c", "assessor-d"],
    "group-1": ["assessor-a", "assessor-b"],      // ← Group assessors
    "business-1": ["assessor-a", "assessor-c"],   // ← Has assessor-a (from group) ✅
    "quest-1": ["assessor-b", "assessor-d"]       // ← Has assessor-b (from group) ✅
  },
  "room_assessment_mapping": {
    "room-101": ["roleplay-1", "business-1"],     // ← Role Play in 101
    "room-102": ["toyf-1", "business-1"],         // ← TOYF in 102 (different!) ✅
    "room-103": ["group-1"]                        // ← Group Activity in 103
  },
  "duration_of_each_activity": 30,
  "group_activity_duration": 30,
  "start_date": "2025-11-23",
  "end_date": "2025-11-24",
  "daily_start_time": "2025-11-23T03:30:00.000Z",
  "daily_end_time": "2025-11-23T13:30:00.000Z",
  "facility_id": "facility-1",
  "project_id": "project-1",
  "daily_breaks": [...]
}
```

## Example: Invalid Input (Will Throw Error)

```json
{
  "assessment_assessor_mapping": {
    "roleplay-1": ["assessor-a"],
    "toyf-1": ["assessor-b"],
    "group-1": ["assessor-c"],                    // ← Group assessors
    "business-1": ["assessor-a", "assessor-b"],   // ← No assessor-c! ❌
    "quest-1": ["assessor-a"]                     // ← No assessor-c! ❌
  },
  "room_assessment_mapping": {
    "room-101": ["roleplay-1", "toyf-1"],         // ← Same room for parallel! ❌
    "room-103": ["group-1"]
  }
}
```

**Errors Thrown**:
1. ASSESSOR_CONTINUITY_ERROR for Business Case
2. ASSESSOR_CONTINUITY_ERROR for Questionnaire
3. PARALLEL_ROOM_CONFLICT for Role Play and TOYF
4. GROUP_ACTIVITY_ASSESSOR_ERROR (only 1 assessor assigned)

## Benefits

1. **Early Error Detection**: Catch configuration issues before wasting time on scheduling attempts
2. **Clear Error Messages**: Actionable messages that tell you exactly what to fix
3. **Prevents Invalid Schedules**: Impossible-to-schedule configurations are rejected immediately
4. **Better UX**: Users know exactly what's wrong and how to fix it
5. **Saves Resources**: No need to run complex scheduling algorithms on invalid inputs

## Files Modified
- `backend/src/Modules/class-configration/scheduling/input-validator-v2.ts`
- `backend/src/Modules/class-configration/scheduling/scheduler-v2.service.ts`

