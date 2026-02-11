# SCHEDULING REQUIREMENTS - FINAL VERSION

## Version 4.0 - FINAL & CORRECT

---

## 🎯 FINAL CLARIFICATIONS

### ✅ **CONFIRMED:**

1. **Group Activity**: ONE assessor per group (not 2)
2. **Business Case**: Individual activity, NO groups (completely independent)
3. **Assessor Continuity**: Business Case & Leadership Questionnaire must have at least ONE assessor from participant's Group Activity

---

## 1. ACTIVITY TYPES & EXECUTION

### 1.1 Individual Activities (Role Play, TOYF, Business Case)

- **Execution**: One participant at a time in a room
- **Assessors**: 1 or more based on availability
- **Time Slot**: Each participant needs their own time slot
- **Duration**: `duration_of_each_activity` minutes
- **Room**: Dedicated room per activity

### 1.2 Role Play & TOYF (Parallel Activities)

#### 1.2.1 Execution Model

- ✅ Run in **PARALLEL** (different participants do different activities at same time)
- ✅ Cross-scheduling pattern for maximum efficiency
- ✅ Each participant does BOTH activities (at different times)

#### 1.2.2 Cross-Scheduling Pattern

**For EVEN participants (e.g., 6 participants):**

```
Slot 1 (9:00): P1→Role Play (Room A) | P6→TOYF (Room B)
Slot 2 (9:35): P2→Role Play (Room A) | P5→TOYF (Room B)
Slot 3 (10:10): P3→Role Play (Room A) | P4→TOYF (Room B)
Slot 4 (10:45): P4→Role Play (Room A) | P3→TOYF (Room B)
Slot 5 (11:20): P5→Role Play (Room A) | P2→TOYF (Room B)
Slot 6 (11:55): P6→Role Play (Room A) | P1→TOYF (Room B)
```

**For ODD participants (e.g., 7 participants):**

```
Slot 1: P1→Role Play | P7→TOYF
Slot 2: P2→Role Play | P6→TOYF
Slot 3: P3→Role Play | P5→TOYF
Slot 4: P4→Role Play | [Empty]     ← Middle participant solo
Slot 5: P5→Role Play | P3→TOYF
Slot 6: P6→Role Play | P2→TOYF
Slot 7: P7→Role Play | P1→TOYF
Slot 8: [Empty]      | P4→TOYF     ← Middle participant solo
```

### 1.3 Group Activity ✅ FINAL

#### 1.3.1 Execution Model

- ✅ **ALL participants in ONE room at ONE time**
- ✅ Participants divided into groups for assessment purposes only
- ✅ **ONE assessor per group** (CORRECTED)
- ✅ All groups operate simultaneously in the same room

#### 1.3.2 Group Formation Algorithm ✅ FINAL

```
Formula:
- Number of groups = Number of available assessors (but ensure min 2 participants per group)
- Each group gets exactly 1 assessor
- Participants distributed evenly
- **MINIMUM 2 participants per group** (REQUIRED)
- If participants < assessors × 2, reduce number of groups

Example 1:
Input: 6 participants, 4 assessors
Output: 3 groups (NOT 4 - need minimum 2 per group)
  - Group 1: P1, P2 → Assessor A1
  - Group 2: P3, P4 → Assessor A2
  - Group 3: P5, P6 → Assessor A3
  Note: A4 not used (would create group with only 1 participant)

Example 2:
Input: 6 participants, 2 assessors
Output: 2 groups
  - Group 1: P1, P2, P3 → Assessor A1
  - Group 2: P4, P5, P6 → Assessor A2

Example 3:
Input: 7 participants, 3 assessors
Output: 3 groups
  - Group 1: P1, P2, P3 → Assessor A1
  - Group 2: P4, P5 → Assessor A2
  - Group 3: P6, P7 → Assessor A3
```

#### 1.3.3 Scheduling Model

```
10:00-10:30: Group Activity (Room A)
  - ALL participants present: P1, P2, P3, P4, P5, P6
  - Group 1 (P1, P2, P3) assessed by A1
  - Group 2 (P4, P5, P6) assessed by A2
  - Everyone in same room, same time
  - Assessors work independently with their assigned groups
```

### 1.4 Business Case ✅ FINAL

#### 1.4.1 Execution Model

- ✅ **Completely INDIVIDUAL activity** (NO groups)
- ✅ Each participant does Business Case separately
- ✅ One participant per room per time slot
- ✅ Can use multiple rooms to parallelize
- ✅ **CRITICAL**: Must have at least ONE assessor from participant's Group Activity

#### 1.4.2 Scheduling Model

```
Example: 6 participants, 3 rooms available

11:00-11:30:
  Room A: P1 (Assessor A1 - from P1's Group Activity) ✅
  Room B: P2 (Assessor A2 - from P2's Group Activity) ✅
  Room C: P3 (Assessor A1 - from P3's Group Activity) ✅

11:35-12:05:
  Room A: P4 (Assessor A2 - from P4's Group Activity) ✅
  Room B: P5 (Assessor A1 - from P5's Group Activity) ✅
  Room C: P6 (Assessor A2 - from P6's Group Activity) ✅

Note:
- Each participant assessed individually
- Can have 1 or more assessors
- At least one must be from their Group Activity
```

### 1.5 Leadership Questionnaire

- **Execution**: Individual, no room required
- **Time Slot**: DOES Not need time slot, can be done at any time througout class time
- **Assessors**: Must include at least ONE assessor from participant's Group Activity
- **Duration**: NA
- **Room**: Not required
- **Scheduling**: Can overlap with other questionnaires (different assessors, no room conflict)
  For this we dont need to assign any time or room, we only assign assessor

---

## 2. ACTIVITY SEQUENCE ORDER

### 2.1 Fixed Sequence

```
Order 1: Role Play + TOYF (PARALLEL - cross-scheduled)
         ↓
Order 2: Group Activity (ALL participants together)
         ↓
Order 3: Business Case (Individual, no groups)
         ↓
Order 4: Leadership Questionnaire (Individual, no room)
```

### 2.2 Sequence Rules

1. Role Play & TOYF must complete BEFORE Group Activity
2. Group Activity must complete BEFORE Business Case
3. Business Case must complete BEFORE Questionnaire
4. No buffer time needed

---

## 3. ASSESSOR ASSIGNMENT RULES ✅ FINAL

### 3.1 Group Activity Assessors

- ✅ **ONE assessor per group**
- ✅ Number of groups = Number of available assessors
- ✅ Each group gets exactly one assessor
- ✅ This assessor establishes continuity for Business Case and Questionnaire

### 3.2 Assessor Continuity ✅ FINAL

**Rule**: Business Case and Questionnaire must include at least ONE assessor from the participant's Group Activity

**Example:**

```
Group Activity (10:00-10:30, Room A):
  - Group 1: P1, P2, P3 → Assessor A1
  - Group 2: P4, P5, P6 → Assessor A2

Business Case (individual):
  - P1 (11:00, Room A) → A1 ✅ (Group Activity assessor)
  - P1 (11:00, Room A) → A1, A3 ✅ (A1 from Group + additional A3)
  - P1 (11:00, Room A) → A3 ❌ (Missing A1 from Group)

  - P4 (11:00, Room B) → A2 ✅ (Group Activity assessor)
  - P4 (11:00, Room B) → A2, A3 ✅ (A2 from Group + additional A3)
  - P4 (11:00, Room B) → A1 ❌ (Wrong - A1 is not P4's Group assessor)

Questionnaire:
  - P1 → A1 ✅ (or A1 + others)
  - P1 → A3 ❌ (Missing A1 from Group)
  - P4 → A2 ✅ (or A2 + others)
  - P4 → A1 ❌ (Wrong - A1 is not P4's Group assessor)
```

**Key Points:**

- Each participant has ONE specific assessor from Group Activity
- Business Case MUST include this assessor (can add others)
- Questionnaire MUST include this assessor (can add others)
- Cannot substitute with a different assessor

### 3.3 Role Play & TOYF Assessors

- ✅ No continuity requirement
- ✅ Can use any available assessors from mapping
- ✅ Independent from Group Activity

---

## 4. ROOM ASSIGNMENT RULES

### 4.1 General Rules

- ✅ Each scenario can only use rooms specified in `room_assessment_mapping`
- ✅ NO multiple activities in same room at same time
- ✅ One activity per room per time slot

### 4.2 Activity-Specific Room Rules

**Role Play & TOYF (Parallel):**

- Each participant needs a separate room
- Must use different rooms to avoid conflicts
- Cross-scheduled to maximize room utilization

**Group Activity:**

- ALL groups use the SAME room at the SAME time
- Only 1 room needed

**Business Case:**

- Individual activity (one participant per room)
- Multiple rooms can be used simultaneously
- Each participant in different room (if rooms available)

**Questionnaire:**

- No room required

---

## 5. GROUP FORMATION ALGORITHM ✅ FINAL

```typescript
function formGroupsForGroupActivity(
  participants: string[],
  assessors: string[],
): Group[] {
  // Validate minimum requirements
  if (assessors.length < 1) {
    throw new Error('Need at least 1 assessor for Group Activity');
  }

  if (participants.length < 2) {
    throw new Error('Need at least 2 participants for Group Activity');
  }

  // Calculate maximum number of groups (ensuring min 2 participants per group)
  const maxGroups = Math.floor(participants.length / 2);
  const numGroups = Math.min(assessors.length, maxGroups);

  if (numGroups === 0) {
    throw new Error(
      `Cannot form groups: need at least 2 participants per group. Have ${participants.length} participants and ${assessors.length} assessors.`,
    );
  }

  // Calculate participants per group
  const baseGroupSize = Math.floor(participants.length / numGroups);
  const remainder = participants.length % numGroups;

  // Create groups
  const groups: Group[] = [];
  let participantIndex = 0;

  for (let i = 0; i < numGroups; i++) {
    // Distribute remainder across first groups
    const groupSize = baseGroupSize + (i < remainder ? 1 : 0);

    // Ensure minimum 2 participants per group
    if (groupSize < 2) {
      throw new Error(
        `Group ${i + 1} would have only ${groupSize} participant. Minimum is 2.`,
      );
    }

    const group: Group = {
      id: `group_${i + 1}`,
      participants: participants.slice(
        participantIndex,
        participantIndex + groupSize,
      ),
      assessor: assessors[i], // Single assessor
    };

    groups.push(group);
    participantIndex += groupSize;
  }

  return groups;
}

interface Group {
  id: string;
  participants: string[]; // 2+ participants (MINIMUM 2)
  assessor: string; // Single assessor (not array)
}
```

**Examples:**

```
Input: 6 participants, 4 assessors
Output: 3 groups (NOT 4 - minimum 2 per group)
  - Group 1: [P1, P2] with A1
  - Group 2: [P3, P4] with A2
  - Group 3: [P5, P6] with A3
  Note: A4 not used (6/4 = 1.5 participants per group would violate minimum)

Input: 6 participants, 2 assessors
Output: 2 groups
  - Group 1: [P1, P2, P3] with A1
  - Group 2: [P4, P5, P6] with A2

Input: 7 participants, 3 assessors
Output: 3 groups
  - Group 1: [P1, P2, P3] with A1
  - Group 2: [P4, P5] with A2
  - Group 3: [P6, P7] with A3

Input: 10 participants, 4 assessors
Output: 4 groups (10/4 = 2.5 participants per group ✅)
  - Group 1: [P1, P2, P3] with A1 (3 participants)
  - Group 2: [P4, P5, P6] with A2 (3 participants)
  - Group 3: [P7, P8] with A3 (2 participants)
  - Group 4: [P9, P10] with A4 (2 participants)

Input: 5 participants, 4 assessors
Output: 2 groups (NOT 4 - would create groups with 1 participant)
  - Group 1: [P1, P2, P3] with A1
  - Group 2: [P4, P5] with A2
  Note: A3 and A4 not used

Input: 3 participants, 4 assessors
Output: 1 group
  - Group 1: [P1, P2, P3] with A1
  Note: A2, A3, A4 not used (3/2 = 1.5 max groups)
```

---

## 6. TIMING RULES

### 6.1 Working Hours

- Daily start time: `daily_start_time`
- Daily end time: `daily_end_time`
- Multi-day support: ✅ (same hours each day)

### 6.2 Breaks

- ✅ First break (tea/coffee)
- ✅ Lunch break
- ✅ Second break (tea/coffee)
- ✅ **Activities MUST NOT overlap with breaks**
- Each day has its own break configuration

### 6.3 Activity Duration & Buffers

- Individual activities: `duration_of_each_activity` minutes
- Group activities: `group_activity_duration` minutes
- ✅ **Buffer time**: No time needed
- Time slots must avoid break periods

---

## 7. CONFLICT PREVENTION (HARD CONSTRAINTS)

### 7.1 Must Prevent

1. ❌ Participant in two activities at same time
2. ❌ Assessor observing two participants at same time
3. ❌ Two activities in same room at same time
4. ❌ Activities during break times
5. ❌ Assessor continuity violation (Business Case/Questionnaire missing Group Activity assessor)

---

## 8. COMPLETE EXAMPLE SCHEDULE

### 8.1 Input

- **6 participants**: P1, P2, P3, P4, P5, P6
- **4 assessors**: A1, A2, A3, A4
- **3 rooms**: Room A, B, C
- **1 day schedule**

### 8.2 Expected Output ✅ FINAL

```
=== ROLE PLAY & TOYF (Parallel - Cross-Scheduled) ===
09:00-09:30: P1 Role Play (Room A, A1,A2) | P6 TOYF (Room B, A3,A4)
09:35-10:05: P2 Role Play (Room A, A1,A2) | P5 TOYF (Room B, A3,A4)
10:10-10:40: P3 Role Play (Room A, A1,A2) | P4 TOYF (Room B, A3,A4)

[BREAK 10:40-10:55]

11:00-11:30: P4 Role Play (Room A, A1,A2) | P3 TOYF (Room B, A3,A4)
11:35-12:05: P5 Role Play (Room A, A1,A2) | P2 TOYF (Room B, A3,A4)
12:10-12:40: P6 Role Play (Room A, A1,A2) | P1 TOYF (Room B, A3,A4)

[LUNCH 12:40-13:10]

=== GROUP ACTIVITY (All Together, 1 Assessor per Group) ===
13:15-13:45: ALL participants (P1-P6) in Room A
  - Group 1: P1, P2, P3 → Assessor A1 (one assessor)
  - Group 2: P4, P5, P6 → Assessor A2 (one assessor)
  Note: A3 and A4 not used in Group Activity

[BREAK 13:45-14:00]

=== BUSINESS CASE (Individual, No Groups) ===
14:05-14:35: P1 (Room A, A1) - A1 is P1's Group Activity assessor ✅
14:05-14:35: P4 (Room B, A2) - A2 is P4's Group Activity assessor ✅
14:40-15:10: P2 (Room A, A1) - A1 is P2's Group Activity assessor ✅
14:40-15:10: P5 (Room B, A2) - A2 is P5's Group Activity assessor ✅
15:15-15:45: P3 (Room A, A1) - A1 is P3's Group Activity assessor ✅
15:15-15:45: P6 (Room B, A2) - A2 is P6's Group Activity assessor ✅

=== QUESTIONNAIRE (Individual, No Room) ===
15:50-16:20: P1 (No room, A1) - Can overlap with P4 below
15:50-16:20: P4 (No room, A2) - Can overlap with P1 above
16:25-16:55: P2 (No room, A1)
16:25-16:55: P5 (No room, A2)
17:00-17:30: P3 (No room, A1)
17:00-17:30: P6 (No room, A2)
```

**Key Points:**

- Role Play & TOYF: Cross-scheduled (6 slots total)
- Group Activity: All participants together, 2 groups with 1 assessor each
- Business Case: Individual, each participant with their Group Activity assessor
- Questionnaire: Individual, can overlap (different assessors, no rooms)

---

## 9. KEY CONSTRAINTS SUMMARY

### 9.1 Critical Rules ✅ FINAL

1. ✅ **Parallel Scheduling**: Role Play & TOYF cross-scheduled
2. ✅ **Group Activity**: ALL participants, ONE time, ONE room, ONE assessor per group
3. ✅ **Business Case**: Individual activity (NO groups), at least 1 assessor from Group Activity
4. ✅ **Assessor Continuity**: Each participant's Group Activity assessor MUST assess their Business Case and Questionnaire
5. ✅ **No activities during breaks**
6. ✅ **Minimum group size**: 2 participants (STRICTLY enforced - no single-participant groups allowed)

### 9.2 Flexibility

- ✅ Group sizes can vary (not all groups need same size)
- ✅ Business Case can have 1+ assessors (but must include Group Activity assessor)
- ✅ Questionnaire can have 1+ assessors (but must include Group Activity assessor)
- ✅ Some assessors may not participate in Group Activity (if more assessors than needed)

---

## 10. DATA STRUCTURES

### 10.1 Group Structure ✅ FINAL

```typescript
interface Group {
  id: string;
  participants: string[]; // 1+ participants
  assessor: string; // Single assessor (NOT array)
}
```

### 10.2 Assessor Continuity Mapping ✅ FINAL

```typescript
// Map each participant to their single Group Activity assessor
Map<participantId, assessorId>

Example:
{
  "P1": "A1", // P1's Group Activity assessor is A1
  "P2": "A1", // P2's Group Activity assessor is A1
  "P3": "A1", // P3's Group Activity assessor is A1
  "P4": "A2", // P4's Group Activity assessor is A2
  "P5": "A2", // P5's Group Activity assessor is A2
  "P6": "A2", // P6's Group Activity assessor is A2
}
```

---

## 11. VALIDATION RULES

### 11.1 Pre-flight Checks

1. ✅ At least 1 assessor for Group Activity
2. ✅ At least 1 room for Group Activity
3. ✅ At least 1 room each for Role Play and TOYF
4. ✅ Group Activity assessors must also be available for Business Case and Questionnaire
5. ✅ Sufficient time slots for all activities

### 11.2 Solution Validation

1. ✅ No participant time conflicts
2. ✅ No assessor time conflicts
3. ✅ No room time conflicts
4. ✅ All activities avoid breaks
5. ✅ Sequence order respected (with 5-min buffer)
6. ✅ Business Case has correct assessor (from Group Activity)
7. ✅ Questionnaire has correct assessor (from Group Activity)

---

## 12. ERROR MESSAGES & SUGGESTIONS

### 12.1 Common Errors

```
Error: "Insufficient assessors for Group Activity"
Suggestion: "Need at least 1 assessor for Group Activity. Found: 0"

Error: "Assessor continuity violation"
Suggestion: "Participant P1 Business Case requires assessor A1 (from Group Activity), but assigned A3"

Error: "Business Case must be individual"
Suggestion: "Business Case should not have groups. Each participant assessed separately."

Error: "Group Activity missing assessor"
Suggestion: "Each group must have exactly 1 assessor. Group 2 has 0 assessors assigned."
```

---

## END OF FINAL REQUIREMENTS

**This is the definitive, correct specification. Ready for implementation!** 🚀

### Summary of Final Corrections:

1. ✅ Group Activity: **1 assessor per group** (not 2)
2. ✅ Business Case: **Individual activity, NO groups**
3. ✅ Number of groups: **= Number of assessors** (1:1 ratio)
4. ✅ Assessor continuity: Each participant tracks their **single** Group Activity assessor
