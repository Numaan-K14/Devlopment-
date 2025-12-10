# SCHEDULING REQUIREMENTS - CORRECTED VERSION
## Version 3.0 - Final Corrections

---

## 🔴 CRITICAL CORRECTIONS FROM V2

### ❌ **WRONG (V2):**
- Business Case is multi-room group activity (all at same time)
- Minimum 3 participants per group
- Number of groups = Number of assessors
- Group Activity: Sequential groups at different times

### ✅ **CORRECT (V3):**
- **Business Case is INDIVIDUAL activity** (one participant at a time)
- **Minimum 2 participants per group**
- **Number of groups = (Participants / 2) with 2 assessors per group** (not 1 assessor per group)
- **Group Activity: ALL participants in ONE room at ONE time** (not sequential groups)

---

## 1. ACTIVITY TYPES & EXECUTION

### 1.1 Individual Activities (Role Play, TOYF, Business Case)
- **Execution**: One participant at a time in a room
- **Assessors**: Minimum 1, can be 2+ based on availability
- **Time Slot**: Each participant needs their own time slot
- **Duration**: `duration_of_each_activity` minutes
- **Room**: Dedicated room per activity

#### 1.1.1 Business Case Specifics
- ✅ **Individual activity** (NOT group activity)
- ✅ Each participant does Business Case individually
- ✅ Can use multiple rooms to parallelize
- ✅ **Constraint**: At least one assessor MUST be from Group Activity

**Example:**
```
09:00-09:30: P1 Business Case (Room A, Assessor A1 from Group Activity)
09:00-09:30: P2 Business Case (Room B, Assessor A2 from Group Activity)
09:35-10:05: P3 Business Case (Room A, Assessor A1 from Group Activity)
```

### 1.2 Parallel Activities (Role Play & TOYF)

#### 1.2.1 Parallel Scheduling Strategy
✅ **Cross-scheduling pattern** to maximize room utilization:

**For EVEN number of participants:**
```
Time Slot 1 (9:00-9:30):
  P1 → Role Play (Room A)
  P6 → TOYF (Room B)

Time Slot 2 (9:35-10:05):
  P2 → Role Play (Room A)
  P5 → TOYF (Room B)

Time Slot 3 (10:10-10:40):
  P3 → Role Play (Room A)
  P4 → TOYF (Room B)

Time Slot 4 (10:45-11:15):
  P4 → Role Play (Room A)
  P3 → TOYF (Room B)

Time Slot 5 (11:20-11:50):
  P5 → Role Play (Room A)
  P2 → TOYF (Room B)

Time Slot 6 (11:55-12:25):
  P6 → Role Play (Room A)
  P1 → TOYF (Room B)
```

**For ODD number of participants:**
```
Time Slot 1 (9:00-9:30):
  P1 → Role Play (Room A)
  P7 → TOYF (Room B)

Time Slot 2 (9:35-10:05):
  P2 → Role Play (Room A)
  P6 → TOYF (Room B)

Time Slot 3 (10:10-10:40):
  P3 → Role Play (Room A)
  P5 → TOYF (Room B)

Time Slot 4 (10:45-11:15):
  P4 → Role Play (Room A)
  [Room B: Empty]

Time Slot 5 (11:20-11:50):
  P5 → Role Play (Room A)
  P3 → TOYF (Room B)

Time Slot 6 (11:55-12:25):
  P6 → Role Play (Room A)
  P2 → TOYF (Room B)

Time Slot 7 (12:30-13:00):
  P7 → Role Play (Room A)
  P1 → TOYF (Room B)

Time Slot 8 (13:05-13:35):
  [Room A: Empty]
  P4 → TOYF (Room B)
```

**Pattern:**
- First half: P1-PN do Role Play, PN-P1 do TOYF (reversed)
- Middle (if odd): Middle participant does Role Play alone
- Second half: P(N-1)-P1 do TOYF, P1-P(N-1) do Role Play (reversed)
- End (if odd): Middle participant does TOYF alone

### 1.3 Group Activity ✅ CORRECTED

#### 1.3.1 Execution Model
- ✅ **ALL participants in ONE room at ONE time**
- ✅ **NOT sequential groups** - everyone together
- ✅ Participants divided into groups for assessment purposes
- ✅ Each group has 2 assessors
- ✅ Groups run simultaneously in the same room

#### 1.3.2 Group Formation Algorithm ✅ CORRECTED

**Rule**: Create groups with **2 assessors per group** (not 1)

```
Input:
- Total participants: N
- Available assessors: A

Algorithm:
1. Number of groups = A / 2 (need 2 assessors per group)
2. Minimum group size = 2 participants
3. Target group size = N / (A / 2)
4. Distribute participants evenly

Example 1:
- 6 participants (P1-P6)
- 4 assessors (A1-A4)
- Number of groups = 4 / 2 = 2
- Group size = 6 / 2 = 3 participants per group
- Result:
  - Group 1: P1, P2, P3 → Assessors A1, A2
  - Group 2: P4, P5, P6 → Assessors A3, A4

Example 2:
- 7 participants (P1-P7)
- 4 assessors (A1-A4)
- Number of groups = 4 / 2 = 2
- Group size = 7 / 2 = 3.5 → distribute as 4+3
- Result:
  - Group 1: P1, P2, P3, P4 → Assessors A1, A2
  - Group 2: P5, P6, P7 → Assessors A3, A4

Example 3:
- 8 participants (P1-P8)
- 6 assessors (A1-A6)
- Number of groups = 6 / 2 = 3
- Group size = 8 / 3 = 2.66 → distribute as 3+3+2
- Result:
  - Group 1: P1, P2, P3 → Assessors A1, A2
  - Group 2: P4, P5, P6 → Assessors A3, A4
  - Group 3: P7, P8 → Assessors A5, A6
```

#### 1.3.3 Scheduling Model
```
10:00-10:30: Group Activity (Room A)
  - ALL participants present: P1, P2, P3, P4, P5, P6
  - Group 1 (P1,P2,P3) assessed by A1, A2
  - Group 2 (P4,P5,P6) assessed by A3, A4
  - Everyone in same room, same time
```

### 1.4 Leadership Questionnaire
- **Execution**: Individual, no room required
- **Time Slot**: ✅ DOES need time slot
- **Assessors**: Must include at least one assessor from Group Activity
- **Duration**: `duration_of_each_activity` minutes

---

## 2. ACTIVITY SEQUENCE ORDER

### 2.1 Fixed Sequence
```
Order 1: Role Play + TOYF (PARALLEL - cross-scheduled)
         ↓
Order 2: Group Activity (ALL together)
         ↓
Order 3: Business Case (Individual)
         ↓
Order 4: Leadership Questionnaire (Individual, no room)
```

---

## 3. ASSESSOR ASSIGNMENT RULES ✅ CORRECTED

### 3.1 Group Activity Assessors
- ✅ **2 assessors per group** (not 1)
- ✅ Each group gets a pair of assessors
- ✅ These assessors establish continuity for Business Case and Questionnaire

### 3.2 Assessor Continuity ✅ CORRECTED

**Rule**: At least ONE assessor from Group Activity MUST assess Business Case and Questionnaire

**Example:**
```
Group Activity (10:00-10:30, Room A):
- Group 1: P1, P2, P3 → Assessors A1, A2
- Group 2: P4, P5, P6 → Assessors A3, A4

Business Case (individual):
- P1 (11:00-11:30, Room A) → A1 or A2 (at least one) ✅
- P1 (11:00-11:30, Room A) → A1, A2 (both) ✅
- P1 (11:00-11:30, Room A) → A1, A5 (A1 + new assessor) ✅
- P1 (11:00-11:30, Room A) → A5, A6 (neither from Group) ❌

Questionnaire:
- P1 (12:00-12:30, no room) → A1 or A2 (at least one) ✅
- P1 (12:00-12:30, no room) → A3, A4 (wrong group assessors) ❌
```

**Flexibility:**
- Can have 1 assessor (must be from Group Activity)
- Can have 2+ assessors (at least 1 must be from Group Activity)
- Additional assessors can be anyone from the assessment mapping

---

## 4. ROOM ASSIGNMENT RULES ✅ CORRECTED

### 4.1 Group Activity Room
- ✅ **ONE room only**
- ✅ **ALL participants at SAME time**
- ✅ Not sequential - everyone together

### 4.2 Business Case Rooms ✅ CORRECTED
- ✅ **Individual activity** (one participant per room per time slot)
- ✅ Can use multiple rooms to parallelize
- ✅ Different participants can do Business Case simultaneously in different rooms

**Example:**
```
11:00-11:30:
  Room A: P1 doing Business Case (Assessor A1)
  Room B: P2 doing Business Case (Assessor A3)
  Room C: P3 doing Business Case (Assessor A2)
```

---

## 5. GROUP FORMATION ALGORITHM ✅ CORRECTED

```typescript
function formGroupsForGroupActivity(participants, assessors) {
  // Validate
  if (assessors.length < 2) {
    throw new Error('Need at least 2 assessors for Group Activity')
  }
  
  // Calculate number of groups (2 assessors per group)
  const numGroups = Math.floor(assessors.length / 2)
  
  if (numGroups === 0) {
    throw new Error(`Need at least 2 assessors, have ${assessors.length}`)
  }
  
  // Calculate participants per group
  const baseGroupSize = Math.floor(participants.length / numGroups)
  const remainder = participants.length % numGroups
  
  // Create groups
  const groups = []
  let participantIndex = 0
  
  for (let i = 0; i < numGroups; i++) {
    const groupSize = baseGroupSize + (i < remainder ? 1 : 0)
    
    // Validate minimum size
    if (groupSize < 2) {
      throw new Error(`Group ${i + 1} would have only ${groupSize} participant(s). Minimum is 2.`)
    }
    
    const group = {
      id: `group_${i + 1}`,
      participants: participants.slice(participantIndex, participantIndex + groupSize),
      assessors: [assessors[i * 2], assessors[i * 2 + 1]]
    }
    
    groups.push(group)
    participantIndex += groupSize
  }
  
  return groups
}
```

**Examples:**

```
Input: 6 participants, 4 assessors
Output: 2 groups
  - Group 1: [P1, P2, P3] with [A1, A2]
  - Group 2: [P4, P5, P6] with [A3, A4]

Input: 5 participants, 4 assessors
Output: 2 groups
  - Group 1: [P1, P2, P3] with [A1, A2]
  - Group 2: [P4, P5] with [A3, A4]

Input: 10 participants, 6 assessors
Output: 3 groups
  - Group 1: [P1, P2, P3, P4] with [A1, A2]
  - Group 2: [P5, P6, P7] with [A3, A4]
  - Group 3: [P8, P9, P10] with [A5, A6]

Input: 3 participants, 3 assessors
Error: Need 4 assessors minimum (2 groups × 2 assessors)
Suggestion: Use only 2 assessors → 1 group of 3 with [A1, A2]
```

---

## 6. PARALLEL SCHEDULING ALGORITHM

### 6.1 Cross-Scheduling for Role Play & TOYF

```typescript
function scheduleParallelActivities(participants, rolePlayScenario, toyfScenario, timeSlots) {
  const n = participants.length
  const schedule = []
  
  if (n % 2 === 0) {
    // Even number - perfect cross-scheduling
    for (let i = 0; i < n; i++) {
      schedule.push({
        timeSlot: timeSlots[i],
        rolePlay: participants[i % n],
        toyf: participants[(n - 1 - i) % n]
      })
    }
  } else {
    // Odd number - middle participant needs special handling
    const middle = Math.floor(n / 2)
    
    // First half
    for (let i = 0; i < middle; i++) {
      schedule.push({
        timeSlot: timeSlots[i],
        rolePlay: participants[i],
        toyf: participants[n - 1 - i]
      })
    }
    
    // Middle - Role Play only
    schedule.push({
      timeSlot: timeSlots[middle],
      rolePlay: participants[middle],
      toyf: null
    })
    
    // Second half
    for (let i = middle + 1; i < n; i++) {
      schedule.push({
        timeSlot: timeSlots[i],
        rolePlay: participants[n - 1 - (i - middle - 1)],
        toyf: participants[i - middle - 1]
      })
    }
    
    // End - TOYF only for middle participant
    schedule.push({
      timeSlot: timeSlots[n],
      rolePlay: null,
      toyf: participants[middle]
    })
  }
  
  return schedule
}
```

---

## 7. UPDATED EXAMPLE SCHEDULE

### 7.1 Sample Input
- 6 participants (P1-P6)
- 4 assessors (A1-A4)
- 3 rooms (Room A, B, C)
- 1 day schedule

### 7.2 Expected Output ✅ CORRECTED
```
=== ROLE PLAY & TOYF (Parallel) ===
09:00-09:30: P1 Role Play (Room A, A1) | P6 TOYF (Room B, A3)
09:35-10:05: P2 Role Play (Room A, A1) | P5 TOYF (Room B, A3)
10:10-10:40: P3 Role Play (Room A, A1) | P4 TOYF (Room B, A3)
10:45-11:15: P4 Role Play (Room A, A1) | P3 TOYF (Room B, A3)
11:20-11:50: P5 Role Play (Room A, A1) | P2 TOYF (Room B, A3)
11:55-12:25: P6 Role Play (Room A, A1) | P1 TOYF (Room B, A3)

[LUNCH 12:25-12:55]

=== GROUP ACTIVITY (All Together) ===
13:00-13:30: ALL participants (P1-P6) in Room A
             - Group 1: P1, P2, P3 → Assessors A1, A2
             - Group 2: P4, P5, P6 → Assessors A3, A4

[BREAK 13:30-13:45]

=== BUSINESS CASE (Individual) ===
13:50-14:20: P1 (Room A, A1) | P4 (Room B, A3)
14:25-14:55: P2 (Room A, A2) | P5 (Room B, A4)
15:00-15:30: P3 (Room A, A1) | P6 (Room B, A3)

=== QUESTIONNAIRE (Individual, No Room) ===
15:35-16:05: P1 (A1 or A2)
16:10-16:40: P2 (A1 or A2)
16:45-17:15: P3 (A1 or A2)
15:35-16:05: P4 (A3 or A4) - Can overlap with P1
16:10-16:40: P5 (A3 or A4) - Can overlap with P2
16:45-17:15: P6 (A3 or A4) - Can overlap with P3
```

---

## 8. KEY CHANGES SUMMARY

| Aspect | V2 (Wrong) | V3 (Correct) |
|--------|-----------|--------------|
| Business Case | Group activity, multi-room, simultaneous | Individual activity, one-at-a-time |
| Group Activity Timing | Sequential groups at different times | All participants together at same time |
| Assessors per Group | 1 | 2 |
| Minimum Group Size | 3 | 2 |
| Number of Groups | = Number of assessors | = Number of assessors / 2 |
| Group Activity Room | Sequential use | All at once |
| Continuity Requirement | Must have exact assessor | At least one assessor from group |

---

## 9. CRITICAL CONSTRAINTS ✅ UPDATED

1. ✅ **Parallel Scheduling**: Role Play & TOYF cross-scheduled for maximum efficiency
2. ✅ **Group Activity**: ALL participants in ONE room at ONE time (2 assessors per group)
3. ✅ **Business Case**: Individual activity (at least 1 assessor from Group Activity)
4. ✅ **Assessor Continuity**: At least ONE Group Activity assessor for Business Case & Questionnaire
5. ✅ **Minimum Group Size**: 2 participants (not 3)
6. ✅ **5-minute buffer** between activities
7. ✅ **No activities during breaks**

---

## END OF CORRECTED REQUIREMENTS

