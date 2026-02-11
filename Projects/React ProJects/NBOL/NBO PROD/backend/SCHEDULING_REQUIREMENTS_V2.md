# SCHEDULING REQUIREMENTS - COMPLETE SPECIFICATION
## Version 2.0 - Clean Start

---

## 1. ACTIVITY TYPES & EXECUTION

### 1.1 Individual Activities (Role Play, TOYF)
- **Execution**: One participant at a time in a room
- **Assessors**: Minimum 1, can be 2+ based on availability
- **Time Slot**: Each participant needs their own time slot
- **Duration**: `duration_of_each_activity` minutes
- **Room**: Dedicated room per activity
- **Parallel Execution**: ✅ **Role Play and TOYF run in PARALLEL**
  - Different participants can do different activities at the same time
  - Example: P1 does Role Play in Room A at 9:00 while P2 does TOYF in Room B at 9:00

### 1.2 Group Activity
- **Execution**: Multiple participants together in groups
- **Group Size**: Minimum 3 participants per group
- **Group Formation**: Automatically divide based on number of available assessors
  - If 4 assessors available → 4 groups
  - Each group gets 1 assessor
  - Distribute participants evenly across groups
- **Scheduling**: ✅ **Sequential - ALL groups at DIFFERENT times in SAME room**
  - Group 1: 9:00-9:30 (Room A)
  - Group 2: 9:30-10:00 (Room A)
  - Group 3: 10:00-10:30 (Room A)
- **Duration**: `group_activity_duration` minutes
- **Room**: Single room shared by all groups (at different times)

### 1.3 Business Case
- **Execution**: ✅ **Multi-room group activity**
- **Room Distribution**: Participants split across multiple available rooms
  - All participants do Business Case at the SAME TIME
  - But in DIFFERENT rooms
  - Example: P1,P2 in Room A + P3,P4 in Room B (both 10:30-11:00)
- **Assessors**: Same assessor from Group Activity (continuity required)
- **Duration**: `duration_of_each_activity` minutes

### 1.4 Leadership Questionnaire
- **Execution**: Individual, no room required
- **Time Slot**: ✅ **DOES need time slot** (not offline)
- **Timing**: Can be scheduled anytime during class timings
- **Assessors**: Same assessor from Group Activity (continuity required)
- **Room**: Not required
- **Duration**: `duration_of_each_activity` minutes

---

## 2. ACTIVITY SEQUENCE ORDER

### 2.1 Fixed Sequence
```
Order 1: Role Play + TOYF (PARALLEL)
         ↓
Order 2: Group Activity
         ↓
Order 3: Business Case
         ↓
Order 4: Leadership Questionnaire
```

### 2.2 Sequence Rules
1. **Role Play & TOYF**: Must happen BEFORE Group Activity
2. **Group Activity**: Must happen BEFORE Business Case
3. **Business Case**: Must happen BEFORE Questionnaire
4. **Parallel Activities**: Role Play and TOYF can happen simultaneously for different participants

---

## 3. ASSESSOR ASSIGNMENT RULES

### 3.1 General Rules
- ✅ One assessor can observe only ONE participant at a time (no simultaneous observations)
- ✅ Minimum 1 assessor per activity
- ✅ Can have 2+ assessors based on availability and participants

### 3.2 Assessor Continuity (CRITICAL REQUIREMENT)

**Rule**: Group Activity assessor MUST assess the same participants in Business Case and Questionnaire

**Example:**
```
Group Activity:
- Group 1: P1, P2, P3 → Assessor A1
- Group 2: P4, P5, P6 → Assessor A2

Business Case (Multi-room, same time):
- Room A: P1, P2, P3 → Assessor A1 ✅
- Room B: P4, P5, P6 → Assessor A2 ✅

Questionnaire:
- P1 → Assessor A1 ✅
- P2 → Assessor A1 ✅
- P3 → Assessor A1 ✅
- P4 → Assessor A2 ✅
- P5 → Assessor A2 ✅
- P6 → Assessor A2 ✅
```

**Invalid Example:**
```
Group Activity:
- Group 1: P1, P2 → Assessor A1

Business Case:
- Room A: P1, P2 → Assessor A3 ❌ (WRONG! Must be A1)
```

### 3.3 Role Play & TOYF Assessors
- ✅ Can use different assessors (no continuity requirement)
- ✅ Any available assessor from the mapping

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
- Example: P1 in Room A (Role Play), P2 in Room B (TOYF) at 9:00

**Group Activity:**
- ALL groups use the SAME room at DIFFERENT times
- Sequential scheduling required
- Only 1 room needed (even if multiple mapped)

**Business Case (Multi-room):**
- Participants split across ALL mapped rooms
- All rooms used at the SAME time
- Example: If 3 rooms mapped → distribute 6 participants as 2+2+2

**Questionnaire:**
- No room required

---

## 5. TIMING RULES

### 5.1 Working Hours
- Daily start time: `daily_start_time`
- Daily end time: `daily_end_time`
- Multi-day support: ✅ (same hours each day)

### 5.2 Breaks
- ✅ First break (tea/coffee)
- ✅ Lunch break
- ✅ Second break (tea/coffee)
- ✅ **Activities MUST NOT overlap with breaks**
- Each day has its own break configuration

### 5.3 Activity Duration & Buffers
- Individual activities: `duration_of_each_activity` minutes
- Group activities: `group_activity_duration` minutes
- ✅ **Buffer time**: 5 minutes between activities
- Time slots must avoid break periods

---

## 6. CONFLICT PREVENTION (HARD CONSTRAINTS)

### 6.1 Must Prevent
1. ❌ Participant in two activities at same time
2. ❌ Assessor observing two participants at same time
3. ❌ Two activities in same room at same time
4. ❌ Activities during break times
5. ❌ Assessor continuity violation (Group Activity → Business Case → Questionnaire)

---

## 7. GROUP FORMATION ALGORITHM

### 7.1 Group Activity Groups
```
Input:
- Total participants: N
- Available assessors for Group Activity: A

Algorithm:
1. Number of groups = A (one group per assessor)
2. Group size = N / A (distribute evenly)
3. If N % A != 0, distribute remainder across groups
4. Ensure minimum 3 participants per group
   - If not possible, reduce number of groups

Example:
- 6 participants (P1-P6)
- 2 assessors (A1, A2)
- Result:
  - Group 1: P1, P2, P3 → Assessor A1
  - Group 2: P4, P5, P6 → Assessor A2
```

### 7.2 Business Case Room Distribution
```
Input:
- Total participants: N
- Available rooms for Business Case: R
- Groups from Group Activity: G (with assessor assignments)

Algorithm:
1. Keep Group Activity groupings intact
2. Distribute groups across R rooms
3. All groups start at SAME time
4. Each group in a different room
5. Maintain assessor from Group Activity

Example:
- 6 participants in 2 groups
- 3 rooms available
- Result (all at 10:30):
  - Room A: Group 1 (P1,P2,P3) → Assessor A1
  - Room B: Group 2 (P4,P5,P6) → Assessor A2
  - Room C: Empty (or can distribute further)
```

---

## 8. SCHEDULING ALGORITHM OUTLINE

### 8.1 High-Level Flow
```
1. Validate input parameters
2. Generate time slots (avoid breaks)
3. Check capacity (days sufficient?)
4. Initialize variables for each participant-activity pair
5. Solve CSP:
   a. Assign Role Play & TOYF (parallel)
   b. Form Group Activity groups
   c. Assign Group Activity (sequential groups)
   d. Assign Business Case (multi-room, maintain groups/assessors)
   e. Assign Questionnaire (maintain assessors)
6. Validate solution (no conflicts)
7. Return schedule
```

### 8.2 CSP Variables
```
For each participant P and activity A:
- Variable: (P, A)
- Domain: {time slots} × {rooms} × {assessors}

Special Variables:
- Group Activity: (GROUP_G, Group Activity) where G = group ID
- Business Case: (GROUP_G, Business Case) with multi-room assignment
```

### 8.3 CSP Constraints

**1. Time Slot Constraints:**
- One participant per time slot (except parallel activities)
- No activities during breaks

**2. Room Constraints:**
- One activity per room per time slot
- Room must be in room_assessment_mapping
- Group Activity: same room for all groups
- Business Case: multiple rooms simultaneously

**3. Assessor Constraints:**
- One participant per assessor per time slot
- Assessor must be in assessment_assessor_mapping
- Continuity: Group Activity assessor = Business Case assessor = Questionnaire assessor

**4. Sequence Constraints:**
- Role Play & TOYF before Group Activity
- Group Activity before Business Case
- Business Case before Questionnaire

**5. Parallel Constraints:**
- Role Play and TOYF can run simultaneously (different participants, different rooms)

**6. Group Activity Constraints:**
- All groups sequential (different times)
- Same room for all groups
- Minimum 3 participants per group

**7. Business Case Constraints:**
- All participants at same time
- Split across multiple rooms
- Maintain Group Activity groupings
- Maintain assessor continuity

---

## 9. ERROR HANDLING

### 9.1 Should Fail With Clear Message
1. ❌ Insufficient days (not enough time slots)
2. ❌ Insufficient rooms for parallel activities
3. ❌ Insufficient assessors for groups
4. ❌ Cannot form groups (< 3 participants per group)
5. ❌ Cannot maintain assessor continuity
6. ❌ No valid solution found after N iterations

### 9.2 Error Messages Should Include
- What went wrong
- Current vs. required resources
- Specific suggestions to fix (e.g., "Add 1 more day" or "Add 2 more rooms")

---

## 10. OUTPUT FORMAT

### 10.1 Grouped by Assessment
```json
{
  "scenarios": [
    {
      "id": "role-play-1",
      "name": "Role Play",
      "type": "scenario",
      "participantSchedules": [
        {
          "participantId": "P1",
          "startTime": "2025-11-23T09:00:00Z",
          "endTime": "2025-11-23T09:30:00Z",
          "roomId": "Room-A",
          "assessorIds": ["A1", "A2"]
        }
      ]
    },
    {
      "id": "group-activity",
      "name": "Group Activity",
      "type": "group_activity",
      "groups": [
        {
          "groupId": "group_1",
          "participantIds": ["P1", "P2", "P3"],
          "assessorId": "A1",
          "roomId": "Room-A",
          "startTime": "2025-11-23T10:00:00Z",
          "endTime": "2025-11-23T10:30:00Z"
        },
        {
          "groupId": "group_2",
          "participantIds": ["P4", "P5", "P6"],
          "assessorId": "A2",
          "roomId": "Room-A",
          "startTime": "2025-11-23T10:35:00Z",
          "endTime": "2025-11-23T11:05:00Z"
        }
      ]
    }
  ]
}
```

---

## 11. PRIORITY & OPTIMIZATION GOALS

### 11.1 Priority Order (1 = Highest)
1. **Maintain assessor continuity** (Group Activity → Business Case → Questionnaire)
2. **Prevent all conflicts** (participant/assessor/room/time)
3. **Respect sequence order** (Role Play & TOYF → Group → Business → Questionnaire)
4. **Minimize total schedule duration**
5. **Balance assessor workload**
6. **Maximize room utilization**

---

## 12. CRITICAL SUCCESS FACTORS

### 12.1 Must Work Correctly
✅ Role Play & TOYF parallel execution
✅ Group Activity sequential groups (same room, different times)
✅ Business Case multi-room distribution (same time, different rooms)
✅ Assessor continuity from Group Activity through Business Case and Questionnaire
✅ Minimum 3 participants per group
✅ 5-minute buffer between activities
✅ No activities during breaks

---

## 13. EXAMPLE SCHEDULE

### 13.1 Sample Input
- 6 participants (P1-P6)
- 4 assessors (A1-A4)
- 3 rooms (Room A, B, C)
- 1 day schedule

### 13.2 Expected Output
```
09:00-09:30: P1 Role Play (Room A, A1+A2) | P2 TOYF (Room B, A3+A4)
09:35-10:05: P3 Role Play (Room A, A1+A2) | P4 TOYF (Room B, A3+A4)
10:10-10:40: P5 Role Play (Room A, A1+A2) | P6 TOYF (Room B, A3+A4)

[BREAK 10:40-10:55]

11:00-11:30: Group 1 (P1,P2,P3) - Room A - Assessor A1
11:35-12:05: Group 2 (P4,P5,P6) - Room A - Assessor A2

[LUNCH 12:05-12:35]

12:40-13:10: Business Case - ALL participants at same time
             Room B: Group 1 (P1,P2,P3) - Assessor A1
             Room C: Group 2 (P4,P5,P6) - Assessor A2

13:15-13:45: P1 Questionnaire - No room - Assessor A1
13:50-14:20: P2 Questionnaire - No room - Assessor A1
14:25-14:55: P3 Questionnaire - No room - Assessor A1
13:15-13:45: P4 Questionnaire - No room - Assessor A2
13:50-14:20: P5 Questionnaire - No room - Assessor A2
14:25-14:55: P6 Questionnaire - No room - Assessor A2
```

**Note**: Questionnaires can overlap in time since they don't need rooms and have different assessors.

---

## END OF REQUIREMENTS

