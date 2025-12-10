# IMPLEMENTATION PLAN - Clean Scheduling Algorithm
## Version 2.0

---

## PHASE 1: CORE DATA STRUCTURES

### 1.1 Time Slot Generator
```typescript
class TimeSlotGenerator {
  - generateTimeSlots(input): TimeSlot[]
  - avoidBreaks(slots, breaks): TimeSlot[]
  - addBufferTime(duration): number
}
```

### 1.2 Group Formation
```typescript
class GroupFormation {
  - formGroups(participants, assessors): Group[]
  - validateMinimumSize(groups, minSize = 3): boolean
  - distributeParticipants(participants, numGroups): Group[]
}
```

### 1.3 Assessor Continuity Tracker
```typescript
class AssessorContinuityTracker {
  - groupActivityAssignments: Map<participantId, assessorId>
  - enforceForBusinessCase(assignment): boolean
  - enforceForQuestionnaire(assignment): boolean
}
```

---

## PHASE 2: CSP SOLVER DESIGN

### 2.1 Variable Structure
```typescript
interface SchedulingVariable {
  id: string;
  participantId: string;
  activityId: string;
  activityType: 'role_play' | 'toyf' | 'group_activity' | 'business_case' | 'questionnaire';
  sequenceOrder: number;
  
  // For Group Activity
  isGroupActivity: boolean;
  groupId?: string;
  groupParticipants?: string[];
  
  // For Business Case
  isBusinessCase: boolean;
  businessCaseRoomId?: string;
  
  // Domain
  possibleTimeSlots: TimeSlot[];
  possibleRooms: string[];
  possibleAssessors: string[];
  
  // Assignment
  assignedTimeSlot?: TimeSlot;
  assignedRoom?: string;
  assignedAssessors?: string[];
}
```

### 2.2 Constraint Types
```typescript
enum ConstraintType {
  PARTICIPANT_TIME_CONFLICT,
  ASSESSOR_TIME_CONFLICT,
  ROOM_TIME_CONFLICT,
  BREAK_OVERLAP,
  SEQUENCE_ORDER,
  ASSESSOR_CONTINUITY,
  GROUP_ACTIVITY_SEQUENTIAL,
  BUSINESS_CASE_SIMULTANEOUS,
  PARALLEL_ACTIVITIES,
}
```

### 2.3 CSP Solver Algorithm
```
function solve():
  1. Initialize variables (see Phase 3)
  2. Sort variables by constraint degree (most constrained first)
  3. Backtracking search:
     - Select unassigned variable
     - For each value in domain:
       - Assign value
       - If consistent with all constraints:
         - Forward checking (reduce domains of unassigned variables)
         - Recursively solve remaining variables
       - If success: return solution
       - Else: backtrack
  4. If no solution: throw error with suggestions
```

---

## PHASE 3: VARIABLE INITIALIZATION

### 3.1 Role Play & TOYF (Parallel)
```typescript
function initializeParallelActivities(participants, rolePlayScenario, toyfScenario):
  variables = []
  
  for each participant:
    // Role Play variable
    rpVar = {
      participantId: participant,
      activityId: rolePlayScenario.id,
      sequenceOrder: 1,
      possibleTimeSlots: allTimeSlots,
      possibleRooms: roomMapping[rolePlayScenario.id],
      possibleAssessors: assessorMapping[rolePlayScenario.id]
    }
    variables.push(rpVar)
    
    // TOYF variable
    toyfVar = {
      participantId: participant,
      activityId: toyfScenario.id,
      sequenceOrder: 1, // Same order = parallel
      possibleTimeSlots: allTimeSlots,
      possibleRooms: roomMapping[toyfScenario.id],
      possibleAssessors: assessorMapping[toyfScenario.id]
    }
    variables.push(toyfVar)
  
  return variables
```

### 3.2 Group Activity (Sequential Groups)
```typescript
function initializeGroupActivity(participants, groupActivityScenario):
  // Form groups
  assessors = assessorMapping[groupActivityScenario.id]
  groups = formGroups(participants, assessors)
  
  variables = []
  room = roomMapping[groupActivityScenario.id][0] // Single room
  
  for each group in groups:
    groupVar = {
      id: `GROUP_${group.id}_${groupActivityScenario.id}`,
      participantId: `GROUP_${group.id}`,
      activityId: groupActivityScenario.id,
      sequenceOrder: 2,
      isGroupActivity: true,
      groupId: group.id,
      groupParticipants: group.participants,
      possibleTimeSlots: allTimeSlots,
      possibleRooms: [room], // Fixed room
      possibleAssessors: [group.assessorId] // Fixed assessor
    }
    variables.push(groupVar)
  
  return { variables, groups }
```

### 3.3 Business Case (Multi-room)
```typescript
function initializeBusinessCase(participants, businessCaseScenario, groupsFromGroupActivity):
  variables = []
  rooms = roomMapping[businessCaseScenario.id]
  
  // Keep groups from Group Activity
  for each group in groupsFromGroupActivity:
    for each participant in group.participants:
      bcVar = {
        participantId: participant,
        activityId: businessCaseScenario.id,
        sequenceOrder: 3,
        isBusinessCase: true,
        groupId: group.id,
        possibleTimeSlots: allTimeSlots,
        possibleRooms: rooms, // Multiple rooms available
        possibleAssessors: [group.assessorId], // FIXED from Group Activity
        mustMatchTimeSlot: group.participants // All must have same time
      }
      variables.push(bcVar)
  
  return variables
```

### 3.4 Questionnaire (No Room)
```typescript
function initializeQuestionnaire(participants, questionnaireScenario, groupsFromGroupActivity):
  variables = []
  
  for each group in groupsFromGroupActivity:
    for each participant in group.participants:
      qVar = {
        participantId: participant,
        activityId: questionnaireScenario.id,
        sequenceOrder: 4,
        possibleTimeSlots: allTimeSlots,
        possibleRooms: [], // No room needed
        possibleAssessors: [group.assessorId], // FIXED from Group Activity
      }
      variables.push(qVar)
  
  return variables
```

---

## PHASE 4: CONSTRAINT IMPLEMENTATION

### 4.1 Time Conflict Constraints
```typescript
function checkParticipantTimeConflict(var1, var2): boolean {
  if (var1.participantId !== var2.participantId) return false
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false
  
  // Exception: Role Play & TOYF can't be parallel for same participant
  // (one participant can't be in two places at once)
  return timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot)
}

function checkAssessorTimeConflict(var1, var2): boolean {
  if (!var1.assignedAssessors || !var2.assignedAssessors) return false
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false
  
  // Check if they share any assessor
  const sharedAssessors = intersection(var1.assignedAssessors, var2.assignedAssessors)
  if (sharedAssessors.length === 0) return false
  
  // If they share assessor, check time overlap
  return timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot)
}

function checkRoomTimeConflict(var1, var2): boolean {
  if (!var1.assignedRoom || !var2.assignedRoom) return false
  if (var1.assignedRoom !== var2.assignedRoom) return false
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false
  
  return timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot)
}
```

### 4.2 Sequence Order Constraint
```typescript
function checkSequenceOrder(var1, var2): boolean {
  if (var1.participantId !== var2.participantId) return false
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false
  
  if (var1.sequenceOrder < var2.sequenceOrder) {
    // var1 must finish before var2 starts (with buffer)
    const var1End = var1.assignedTimeSlot.endTime + BUFFER_TIME
    return var1End <= var2.assignedTimeSlot.startTime
  }
  
  return true
}
```

### 4.3 Assessor Continuity Constraint
```typescript
function checkAssessorContinuity(groupActivityVar, laterVar): boolean {
  if (!groupActivityVar.isGroupActivity) return true
  if (laterVar.sequenceOrder <= 2) return true // Only applies to BC & Questionnaire
  
  const participant = laterVar.participantId
  const groupActivityAssessor = findAssessorForParticipant(groupActivityVar, participant)
  
  if (!laterVar.assignedAssessors) return true
  
  // laterVar MUST include the group activity assessor
  return laterVar.assignedAssessors.includes(groupActivityAssessor)
}
```

### 4.4 Group Activity Sequential Constraint
```typescript
function checkGroupActivitySequential(var1, var2): boolean {
  if (!var1.isGroupActivity || !var2.isGroupActivity) return true
  if (var1.groupId === var2.groupId) return true
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false
  
  // Different groups MUST NOT overlap in time (same room)
  return !timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot)
}
```

### 4.5 Business Case Simultaneous Constraint
```typescript
function checkBusinessCaseSimultaneous(var1, var2): boolean {
  if (!var1.isBusinessCase || !var2.isBusinessCase) return true
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false
  
  // All Business Case activities MUST have exact same time slot
  return var1.assignedTimeSlot.id === var2.assignedTimeSlot.id
}
```

### 4.6 Parallel Activities Constraint
```typescript
function checkParallelActivitiesConsistency(var1, var2): boolean {
  // Role Play & TOYF can run in parallel
  if (var1.sequenceOrder === 1 && var2.sequenceOrder === 1) {
    if (var1.participantId === var2.participantId) {
      // Same participant: Can't do both at same time
      if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return true
      return !timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot)
    } else {
      // Different participants: Can do different activities at same time
      // Just check room and assessor conflicts (handled by other constraints)
      return true
    }
  }
  
  return true
}
```

---

## PHASE 5: BACKTRACKING ALGORITHM

### 5.1 Variable Selection (MRV Heuristic)
```typescript
function selectUnassignedVariable(variables): SchedulingVariable {
  const unassigned = variables.filter(v => !v.assignedTimeSlot)
  
  // Sort by:
  // 1. Sequence order (earlier activities first)
  // 2. Domain size (most constrained first)
  // 3. Group activities first (they constrain others)
  
  return unassigned.sort((a, b) => {
    if (a.sequenceOrder !== b.sequenceOrder)
      return a.sequenceOrder - b.sequenceOrder
    
    const aDomainSize = a.possibleTimeSlots.length
    const bDomainSize = b.possibleTimeSlots.length
    
    if (aDomainSize !== bDomainSize)
      return aDomainSize - bDomainSize
    
    if (a.isGroupActivity && !b.isGroupActivity) return -1
    if (!a.isGroupActivity && b.isGroupActivity) return 1
    
    return 0
  })[0]
}
```

### 5.2 Value Ordering (LCV Heuristic)
```typescript
function orderDomainValues(variable, variables): Assignment[] {
  const assignments = []
  
  for each timeSlot in variable.possibleTimeSlots:
    for each room in variable.possibleRooms:
      for each assessorCombo in variable.possibleAssessors:
        assignments.push({
          timeSlot,
          room,
          assessors: assessorCombo
        })
  
  // Sort by how many constraints each assignment satisfies
  return assignments.sort((a, b) => {
    const aViolations = countPotentialViolations(variable, a, variables)
    const bViolations = countPotentialViolations(variable, b, variables)
    return aViolations - bViolations
  })
}
```

### 5.3 Forward Checking
```typescript
function forwardCheck(assigned, unassigned): boolean {
  for each unassignedVar in unassigned:
    // Remove inconsistent values from domain
    unassignedVar.possibleTimeSlots = unassignedVar.possibleTimeSlots.filter(slot => {
      // Check if this slot would conflict with assigned variable
      return !wouldConflict(assigned, { ...unassignedVar, assignedTimeSlot: slot })
    })
    
    // If domain becomes empty, fail
    if (unassignedVar.possibleTimeSlots.length === 0)
      return false
  
  return true
}
```

---

## PHASE 6: ERROR HANDLING & SUGGESTIONS

### 6.1 Error Types
```typescript
enum SchedulingError {
  INSUFFICIENT_TIME_SLOTS,
  INSUFFICIENT_ROOMS,
  INSUFFICIENT_ASSESSORS,
  CANNOT_FORM_GROUPS,
  CANNOT_MAINTAIN_CONTINUITY,
  NO_SOLUTION_FOUND,
}
```

### 6.2 Suggestion Generator
```typescript
function generateSuggestions(error, context): string[] {
  switch (error) {
    case INSUFFICIENT_TIME_SLOTS:
      const requiredSlots = context.requiredSlots
      const availableSlots = context.availableSlots
      const shortage = requiredSlots - availableSlots
      const additionalDays = Math.ceil(shortage / context.slotsPerDay)
      return [
        `Increase class duration by ${additionalDays} day(s)`,
        `Reduce activity duration from ${context.activityDuration}min to ${context.activityDuration - 5}min`,
      ]
    
    case INSUFFICIENT_ROOMS:
      return [
        `Add ${context.requiredRooms - context.availableRooms} more room(s)`,
        `Map scenario "${context.scenarioName}" to more rooms in room_assessment_mapping`,
      ]
    
    // ... more cases
  }
}
```

---

## PHASE 7: OUTPUT FORMATTER

### 7.1 Group by Scenario
```typescript
function formatOutput(solution, input): GroupedScheduleResult {
  const grouped = {
    scenarios: [],
    assessorAssignments: [],
    roomUtilization: [],
    dailyBreaks: []
  }
  
  // Group by scenario
  for each scenario in input.scenarios:
    const assignments = solution.filter(v => v.activityId === scenario.id)
    
    if (scenario.isGroupActivity) {
      grouped.scenarios.push({
        ...scenario,
        groups: formatGroups(assignments)
      })
    } else if (scenario.isBusinessCase) {
      grouped.scenarios.push({
        ...scenario,
        businessCaseRooms: formatBusinessCaseRooms(assignments)
      })
    } else {
      grouped.scenarios.push({
        ...scenario,
        participantSchedules: formatParticipantSchedules(assignments)
      })
    }
  
  return grouped
}
```

---

## IMPLEMENTATION ORDER

1. ✅ Create requirements document (DONE)
2. ✅ Create implementation plan (THIS FILE)
3. 📝 Create core data structures (TimeSlot, Group, etc.)
4. 📝 Implement TimeSlotGenerator
5. 📝 Implement GroupFormation
6. 📝 Implement AssessorContinuityTracker
7. 📝 Implement CSP Variable initialization
8. 📝 Implement all constraints
9. 📝 Implement backtracking algorithm
10. 📝 Implement error handling & suggestions
11. 📝 Implement output formatter
12. 📝 Test with your input data
13. 📝 Fix any bugs
14. 📝 Optimize performance

---

## NEXT STEP

Shall we start implementing Phase 1 (Core Data Structures)?

