# IMPLEMENTATION PLAN - Corrected Scheduling Algorithm
## Version 3.0 - Based on Corrected Requirements

---

## PHASE 1: CORE DATA STRUCTURES

### 1.1 Time Slot Generator
```typescript
class TimeSlotGenerator {
  /**
   * Generate time slots for entire schedule duration
   * @param input - Scheduling input with dates, times, breaks
   * @returns Array of available time slots (excluding breaks)
   */
  generateTimeSlots(input: SchedulingInput): TimeSlot[]
  
  /**
   * Check if a time range overlaps with any break
   */
  overlapsWithBreak(startTime: Date, endTime: Date, breaks: DailyBreak[]): boolean
  
  /**
   * Add buffer time to duration
   */
  addBuffer(duration: number, buffer: number = 5): number
}

interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  date: string; // YYYY-MM-DD
  dayIndex: number; // 0-based
}
```

### 1.2 Group Formation ✅ CORRECTED
```typescript
class GroupFormation {
  /**
   * Form groups for Group Activity
   * - 2 assessors per group (not 1)
   * - Minimum 2 participants per group (not 3)
   * - Number of groups = assessors / 2
   */
  formGroups(
    participants: string[], 
    assessors: string[]
  ): Group[]
  
  /**
   * Validate group formation is possible
   */
  validateGroupFormation(
    numParticipants: number, 
    numAssessors: number
  ): { valid: boolean; message?: string }
  
  /**
   * Distribute participants evenly across groups
   */
  distributeParticipants(
    participants: string[], 
    numGroups: number
  ): string[][]
}

interface Group {
  id: string;
  participants: string[]; // 2+ participants
  assessors: string[]; // Exactly 2 assessors
}
```

### 1.3 Parallel Activity Scheduler ✅ NEW
```typescript
class ParallelActivityScheduler {
  /**
   * Cross-schedule Role Play and TOYF for maximum efficiency
   * Pattern: P1→RP|P6→TOYF, P2→RP|P5→TOYF, etc.
   */
  scheduleParallelActivities(
    participants: string[],
    timeSlots: TimeSlot[],
    rolePlayRooms: string[],
    toyfRooms: string[],
    rolePlayAssessors: string[],
    toyfAssessors: string[]
  ): ParallelSchedule[]
  
  /**
   * Handle odd number of participants
   * Middle participant gets solo slots for each activity
   */
  handleOddParticipants(
    participants: string[],
    timeSlots: TimeSlot[]
  ): ParallelSchedule[]
}

interface ParallelSchedule {
  timeSlot: TimeSlot;
  rolePlay: {
    participantId: string | null;
    room: string;
    assessors: string[];
  } | null;
  toyf: {
    participantId: string | null;
    room: string;
    assessors: string[];
  } | null;
}
```

### 1.4 Assessor Continuity Tracker ✅ CORRECTED
```typescript
class AssessorContinuityTracker {
  /**
   * Track which assessors assessed which participants in Group Activity
   * Each participant has 2 assessors from their group
   */
  private groupActivityAssignments: Map<string, string[]>; // participantId → [assessor1, assessor2]
  
  /**
   * Set Group Activity assessors for a participant
   */
  setGroupActivityAssessors(participantId: string, assessors: string[]): void
  
  /**
   * Get Group Activity assessors for a participant
   */
  getGroupActivityAssessors(participantId: string): string[]
  
  /**
   * Validate Business Case assessor includes at least one from Group Activity
   */
  validateBusinessCaseAssessor(
    participantId: string, 
    proposedAssessors: string[]
  ): boolean
  
  /**
   * Validate Questionnaire assessor includes at least one from Group Activity
   */
  validateQuestionnaireAssessor(
    participantId: string, 
    proposedAssessors: string[]
  ): boolean
  
  /**
   * Get valid assessor combinations for Business Case/Questionnaire
   * Returns all possible combinations that satisfy continuity
   */
  getValidAssessorCombinations(
    participantId: string,
    availableAssessors: string[]
  ): string[][]
}
```

---

## PHASE 2: CSP SOLVER DESIGN

### 2.1 Variable Structure ✅ CORRECTED
```typescript
interface SchedulingVariable {
  id: string;
  participantId: string; // Or "GROUP_ALL" for Group Activity
  activityId: string;
  activityType: 'role_play' | 'toyf' | 'group_activity' | 'business_case' | 'questionnaire';
  sequenceOrder: number; // 1=RP&TOYF, 2=Group, 3=BC, 4=Quest
  
  // For Group Activity (ALL participants together)
  isGroupActivity: boolean;
  groupInfo?: {
    allParticipants: string[];
    groups: {
      id: string;
      participants: string[];
      assessors: string[]; // Exactly 2
    }[];
  };
  
  // For Business Case (individual, but needs continuity)
  isBusinessCase: boolean;
  requiredAssessorFrom: string[]; // Must include at least one from this list
  
  // For Parallel Activities (Role Play & TOYF)
  isParallel: boolean;
  parallelPair?: string; // Variable ID of parallel activity
  
  // Domain
  possibleTimeSlots: TimeSlot[];
  possibleRooms: string[]; // Empty for questionnaire
  possibleAssessors: string[][]; // Combinations of assessors
  
  // Assignment
  assignedTimeSlot?: TimeSlot;
  assignedRoom?: string;
  assignedAssessors?: string[];
}
```

### 2.2 Constraint Types ✅ UPDATED
```typescript
enum ConstraintType {
  // Time conflicts
  PARTICIPANT_TIME_CONFLICT,
  ASSESSOR_TIME_CONFLICT,
  ROOM_TIME_CONFLICT,
  BREAK_OVERLAP,
  
  // Sequence
  SEQUENCE_ORDER,
  
  // Assessor continuity
  ASSESSOR_CONTINUITY_BUSINESS_CASE, // At least 1 from Group Activity
  ASSESSOR_CONTINUITY_QUESTIONNAIRE, // At least 1 from Group Activity
  
  // Parallel activities
  PARALLEL_ROLE_PLAY_TOYF, // Cross-scheduling pattern
  
  // Group Activity
  GROUP_ACTIVITY_ALL_TOGETHER, // All participants same time, same room
  
  // NEW: Business Case is individual
  BUSINESS_CASE_INDIVIDUAL, // One participant at a time per room
}
```

### 2.3 CSP Solver Algorithm Flow ✅ UPDATED
```
function solve():
  1. Pre-schedule parallel activities (Role Play & TOYF)
     - Use cross-scheduling pattern
     - Handle odd participants
     - Fix time slots, rooms, assessors
  
  2. Schedule Group Activity
     - Form groups (2 assessors per group)
     - Find ONE time slot for ALL participants
     - Assign single room
     - Track assessor-participant mappings
  
  3. Schedule Business Case (individual)
     - For each participant (one at a time)
     - Must have at least 1 assessor from Group Activity
     - Can use multiple rooms to parallelize
  
  4. Schedule Questionnaire (individual, no room)
     - For each participant
     - Must have at least 1 assessor from Group Activity
     - No room needed (can overlap in time with different assessors)
  
  5. Validate final solution
  
  6. Return schedule
```

---

## PHASE 3: VARIABLE INITIALIZATION ✅ CORRECTED

### 3.1 Parallel Activities (Role Play & TOYF) - PRE-SCHEDULED
```typescript
function initializeAndScheduleParallelActivities(
  participants: string[],
  rolePlayScenario: any,
  toyfScenario: any,
  timeSlots: TimeSlot[],
  roomMapping: any,
  assessorMapping: any
): SchedulingVariable[] {
  
  const variables: SchedulingVariable[] = [];
  const n = participants.length;
  const parallelScheduler = new ParallelActivityScheduler();
  
  // Generate cross-scheduling pattern
  const schedule = parallelScheduler.scheduleParallelActivities(
    participants,
    timeSlots,
    roomMapping[rolePlayScenario.id],
    roomMapping[toyfScenario.id],
    assessorMapping[rolePlayScenario.id],
    assessorMapping[toyfScenario.id]
  );
  
  // Create pre-assigned variables
  for (const slot of schedule) {
    if (slot.rolePlay) {
      variables.push({
        id: `RP_${slot.rolePlay.participantId}_${slot.timeSlot.id}`,
        participantId: slot.rolePlay.participantId,
        activityId: rolePlayScenario.id,
        activityType: 'role_play',
        sequenceOrder: 1,
        isParallel: true,
        parallelPair: slot.toyf ? `TOYF_${slot.toyf.participantId}_${slot.timeSlot.id}` : undefined,
        // ALREADY ASSIGNED (not domains)
        assignedTimeSlot: slot.timeSlot,
        assignedRoom: slot.rolePlay.room,
        assignedAssessors: slot.rolePlay.assessors,
        possibleTimeSlots: [], // Empty - already assigned
        possibleRooms: [],
        possibleAssessors: []
      });
    }
    
    if (slot.toyf) {
      variables.push({
        id: `TOYF_${slot.toyf.participantId}_${slot.timeSlot.id}`,
        participantId: slot.toyf.participantId,
        activityId: toyfScenario.id,
        activityType: 'toyf',
        sequenceOrder: 1,
        isParallel: true,
        parallelPair: slot.rolePlay ? `RP_${slot.rolePlay.participantId}_${slot.timeSlot.id}` : undefined,
        // ALREADY ASSIGNED
        assignedTimeSlot: slot.timeSlot,
        assignedRoom: slot.toyf.room,
        assignedAssessors: slot.toyf.assessors,
        possibleTimeSlots: [],
        possibleRooms: [],
        possibleAssessors: []
      });
    }
  }
  
  return variables;
}
```

### 3.2 Group Activity (All Together) ✅ CORRECTED
```typescript
function initializeGroupActivity(
  participants: string[],
  groupActivityScenario: any,
  assessorMapping: any,
  roomMapping: any,
  timeSlots: TimeSlot[]
): { variable: SchedulingVariable; groups: Group[] } {
  
  // Form groups with 2 assessors per group
  const groupFormation = new GroupFormation();
  const assessors = assessorMapping[groupActivityScenario.id];
  const groups = groupFormation.formGroups(participants, assessors);
  
  // Create ONE variable for ALL participants
  const variable: SchedulingVariable = {
    id: `GROUP_ACTIVITY_ALL`,
    participantId: 'GROUP_ALL', // Special: represents all participants
    activityId: groupActivityScenario.id,
    activityType: 'group_activity',
    sequenceOrder: 2,
    isGroupActivity: true,
    groupInfo: {
      allParticipants: participants,
      groups: groups
    },
    possibleTimeSlots: timeSlots, // Any time slot after parallel activities
    possibleRooms: [roomMapping[groupActivityScenario.id][0]], // Single room
    possibleAssessors: [groups.flatMap(g => g.assessors)], // All assessors together
  };
  
  return { variable, groups };
}
```

### 3.3 Business Case (Individual) ✅ CORRECTED
```typescript
function initializeBusinessCase(
  participants: string[],
  businessCaseScenario: any,
  groups: Group[],
  assessorMapping: any,
  roomMapping: any,
  timeSlots: TimeSlot[],
  continuityTracker: AssessorContinuityTracker
): SchedulingVariable[] {
  
  const variables: SchedulingVariable[] = [];
  const availableAssessors = assessorMapping[businessCaseScenario.id];
  const availableRooms = roomMapping[businessCaseScenario.id];
  
  for (const participant of participants) {
    // Get Group Activity assessors for this participant (2 assessors)
    const groupAssessors = continuityTracker.getGroupActivityAssessors(participant);
    
    // Get all valid assessor combinations
    // Must include at least 1 from groupAssessors
    const validCombinations = continuityTracker.getValidAssessorCombinations(
      participant,
      availableAssessors
    );
    
    const variable: SchedulingVariable = {
      id: `BC_${participant}`,
      participantId: participant,
      activityId: businessCaseScenario.id,
      activityType: 'business_case',
      sequenceOrder: 3,
      isBusinessCase: true,
      requiredAssessorFrom: groupAssessors, // At least 1 must be present
      possibleTimeSlots: timeSlots, // After Group Activity
      possibleRooms: availableRooms, // Can use any mapped room
      possibleAssessors: validCombinations, // Only valid combinations
    };
    
    variables.push(variable);
  }
  
  return variables;
}
```

### 3.4 Questionnaire (Individual, No Room) ✅ CORRECTED
```typescript
function initializeQuestionnaire(
  participants: string[],
  questionnaireScenario: any,
  assessorMapping: any,
  timeSlots: TimeSlot[],
  continuityTracker: AssessorContinuityTracker
): SchedulingVariable[] {
  
  const variables: SchedulingVariable[] = [];
  const availableAssessors = assessorMapping[questionnaireScenario.id];
  
  for (const participant of participants) {
    // Get Group Activity assessors for this participant
    const groupAssessors = continuityTracker.getGroupActivityAssessors(participant);
    
    // Get valid assessor combinations (must include at least 1 from Group Activity)
    const validCombinations = continuityTracker.getValidAssessorCombinations(
      participant,
      availableAssessors
    );
    
    const variable: SchedulingVariable = {
      id: `QUEST_${participant}`,
      participantId: participant,
      activityId: questionnaireScenario.id,
      activityType: 'questionnaire',
      sequenceOrder: 4,
      requiredAssessorFrom: groupAssessors,
      possibleTimeSlots: timeSlots, // After Business Case
      possibleRooms: [], // No room needed
      possibleAssessors: validCombinations,
    };
    
    variables.push(variable);
  }
  
  return variables;
}
```

---

## PHASE 4: CONSTRAINT IMPLEMENTATION ✅ UPDATED

### 4.1 Time Conflict Constraints
```typescript
function checkParticipantTimeConflict(var1: SchedulingVariable, var2: SchedulingVariable): boolean {
  // Skip if different participants
  if (var1.participantId !== var2.participantId) return false;
  
  // Skip Group Activity (special case: participantId = "GROUP_ALL")
  if (var1.participantId === 'GROUP_ALL' || var2.participantId === 'GROUP_ALL') {
    // Check if participant is in the group
    return checkGroupActivityConflict(var1, var2);
  }
  
  // Check assigned time slots
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;
  
  return timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot);
}

function checkGroupActivityConflict(
  groupVar: SchedulingVariable, 
  participantVar: SchedulingVariable
): boolean {
  if (!groupVar.isGroupActivity) return false;
  if (!groupVar.assignedTimeSlot || !participantVar.assignedTimeSlot) return false;
  
  // Check if participant is in Group Activity
  const isInGroup = groupVar.groupInfo?.allParticipants.includes(participantVar.participantId);
  if (!isInGroup) return false;
  
  // Group Activity conflicts with participant's other activities at same time
  return timeSlotsOverlap(groupVar.assignedTimeSlot, participantVar.assignedTimeSlot);
}

function checkAssessorTimeConflict(var1: SchedulingVariable, var2: SchedulingVariable): boolean {
  if (!var1.assignedAssessors || !var2.assignedAssessors) return false;
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;
  
  // Check if they share any assessor
  const sharedAssessors = var1.assignedAssessors.filter(a => 
    var2.assignedAssessors!.includes(a)
  );
  
  if (sharedAssessors.length === 0) return false;
  
  // If they share assessor, check time overlap
  return timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot);
}

function checkRoomTimeConflict(var1: SchedulingVariable, var2: SchedulingVariable): boolean {
  // Skip if no rooms (questionnaire)
  if (!var1.assignedRoom || !var2.assignedRoom) return false;
  
  // Different rooms = no conflict
  if (var1.assignedRoom !== var2.assignedRoom) return false;
  
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;
  
  return timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot);
}

function checkBreakOverlap(variable: SchedulingVariable, breaks: DailyBreak[]): boolean {
  if (!variable.assignedTimeSlot) return false;
  
  const timeSlotGenerator = new TimeSlotGenerator();
  return timeSlotGenerator.overlapsWithBreak(
    variable.assignedTimeSlot.startTime,
    variable.assignedTimeSlot.endTime,
    breaks
  );
}
```

### 4.2 Sequence Order Constraint ✅ UPDATED
```typescript
function checkSequenceOrder(var1: SchedulingVariable, var2: SchedulingVariable): boolean {
  if (var1.participantId !== var2.participantId) return false;
  
  // Skip Group Activity (applies to all participants)
  if (var1.participantId === 'GROUP_ALL' || var2.participantId === 'GROUP_ALL') {
    return checkGroupActivitySequence(var1, var2);
  }
  
  if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;
  
  // Order: 1=RP&TOYF, 2=Group, 3=BC, 4=Quest
  if (var1.sequenceOrder < var2.sequenceOrder) {
    // var1 must finish before var2 starts (with buffer)
    const BUFFER_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
    const var1End = var1.assignedTimeSlot.endTime.getTime() + BUFFER_TIME;
    return var1End <= var2.assignedTimeSlot.startTime.getTime();
  }
  
  return true; // No constraint if var1 >= var2 in order
}

function checkGroupActivitySequence(
  groupVar: SchedulingVariable,
  participantVar: SchedulingVariable
): boolean {
  if (!groupVar.isGroupActivity) return false;
  if (!groupVar.assignedTimeSlot || !participantVar.assignedTimeSlot) return false;
  
  // Check if participant is in group
  const isInGroup = groupVar.groupInfo?.allParticipants.includes(participantVar.participantId);
  if (!isInGroup) return true; // Not relevant
  
  const BUFFER_TIME = 5 * 60 * 1000;
  
  // Group Activity (order 2) must finish before Business Case/Questionnaire (order 3,4)
  if (participantVar.sequenceOrder > 2) {
    const groupEnd = groupVar.assignedTimeSlot.endTime.getTime() + BUFFER_TIME;
    return groupEnd <= participantVar.assignedTimeSlot.startTime.getTime();
  }
  
  // Parallel activities (order 1) must finish before Group Activity
  if (participantVar.sequenceOrder === 1) {
    const participantEnd = participantVar.assignedTimeSlot.endTime.getTime() + BUFFER_TIME;
    return participantEnd <= groupVar.assignedTimeSlot.startTime.getTime();
  }
  
  return true;
}
```

### 4.3 Assessor Continuity Constraint ✅ CORRECTED
```typescript
function checkAssessorContinuity(
  variable: SchedulingVariable,
  continuityTracker: AssessorContinuityTracker
): boolean {
  // Only applies to Business Case and Questionnaire
  if (variable.sequenceOrder < 3) return true;
  
  if (!variable.assignedAssessors || variable.assignedAssessors.length === 0) {
    return false;
  }
  
  // Get Group Activity assessors for this participant
  const groupAssessors = continuityTracker.getGroupActivityAssessors(variable.participantId);
  
  if (!groupAssessors || groupAssessors.length === 0) {
    console.warn(`No Group Activity assessors found for ${variable.participantId}`);
    return false;
  }
  
  // Check if at least ONE Group Activity assessor is present
  const hasAtLeastOne = variable.assignedAssessors.some(assessor => 
    groupAssessors.includes(assessor)
  );
  
  if (!hasAtLeastOne) {
    console.log(
      `❌ Continuity violation: ${variable.participantId} ${variable.activityType}` +
      ` has assessors [${variable.assignedAssessors.join(',')}]` +
      ` but needs at least one from [${groupAssessors.join(',')}]`
    );
  }
  
  return hasAtLeastOne;
}
```

### 4.4 Parallel Activities Constraint (Pre-scheduled)
```typescript
// Not needed as constraint - parallel activities are PRE-SCHEDULED
// They have fixed assignments from Phase 3.1
```

### 4.5 Group Activity All Together Constraint ✅ NEW
```typescript
function checkGroupActivityAllTogether(
  groupVar: SchedulingVariable,
  allVariables: SchedulingVariable[]
): boolean {
  if (!groupVar.isGroupActivity) return true;
  if (!groupVar.assignedTimeSlot) return false;
  
  // All participants must be free at this time
  const groupTime = groupVar.assignedTimeSlot;
  const allParticipants = groupVar.groupInfo?.allParticipants || [];
  
  for (const participantId of allParticipants) {
    // Find other activities for this participant
    const participantActivities = allVariables.filter(v => 
      v.participantId === participantId && v.id !== groupVar.id
    );
    
    for (const activity of participantActivities) {
      if (activity.assignedTimeSlot) {
        // Check conflict
        if (timeSlotsOverlap(groupTime, activity.assignedTimeSlot)) {
          return false; // Participant has conflicting activity
        }
      }
    }
  }
  
  return true;
}
```

### 4.6 Business Case Individual Constraint ✅ NEW
```typescript
function checkBusinessCaseIndividual(
  bcVar: SchedulingVariable,
  allBusinessCaseVars: SchedulingVariable[]
): boolean {
  if (!bcVar.isBusinessCase) return true;
  if (!bcVar.assignedTimeSlot || !bcVar.assignedRoom) return false;
  
  // Check that no other participant uses same room at same time
  for (const otherVar of allBusinessCaseVars) {
    if (otherVar.id === bcVar.id) continue;
    if (!otherVar.assignedTimeSlot || !otherVar.assignedRoom) continue;
    
    // Same room + overlapping time = conflict
    if (otherVar.assignedRoom === bcVar.assignedRoom &&
        timeSlotsOverlap(bcVar.assignedTimeSlot, otherVar.assignedTimeSlot)) {
      return false;
    }
  }
  
  return true;
}
```

---

## PHASE 5: BACKTRACKING ALGORITHM ✅ UPDATED

### 5.1 Main Solve Function
```typescript
function solve(input: SchedulingInput): SchedulingVariable[] {
  console.log('🚀 Starting CSP Solver...');
  
  // Step 1: Generate time slots
  const timeSlotGenerator = new TimeSlotGenerator();
  const allTimeSlots = timeSlotGenerator.generateTimeSlots(input);
  console.log(`✅ Generated ${allTimeSlots.length} time slots`);
  
  // Step 2: Initialize continuity tracker
  const continuityTracker = new AssessorContinuityTracker();
  
  // Step 3: Pre-schedule parallel activities (Role Play & TOYF)
  console.log('📅 Pre-scheduling parallel activities...');
  const parallelVars = initializeAndScheduleParallelActivities(
    input.participantIds,
    findScenario(input, 'role_play'),
    findScenario(input, 'toyf'),
    allTimeSlots,
    input.room_assessment_mapping,
    input.assessment_assessor_mapping
  );
  console.log(`✅ Pre-scheduled ${parallelVars.length} parallel activities`);
  
  // Filter out used time slots
  const usedSlots = new Set(parallelVars.map(v => v.assignedTimeSlot!.id));
  const remainingSlots = allTimeSlots.filter(slot => !usedSlots.has(slot.id));
  
  // Step 4: Initialize Group Activity
  console.log('👥 Initializing Group Activity...');
  const { variable: groupVar, groups } = initializeGroupActivity(
    input.participantIds,
    findScenario(input, 'group_activity'),
    input.assessment_assessor_mapping,
    input.room_assessment_mapping,
    remainingSlots
  );
  console.log(`✅ Formed ${groups.length} groups`);
  
  // Step 5: Initialize Business Case
  console.log('💼 Initializing Business Case...');
  const businessCaseVars = initializeBusinessCase(
    input.participantIds,
    findScenario(input, 'business_case'),
    groups,
    input.assessment_assessor_mapping,
    input.room_assessment_mapping,
    remainingSlots,
    continuityTracker
  );
  
  // Step 6: Initialize Questionnaire
  console.log('📋 Initializing Questionnaire...');
  const questionnaireVars = initializeQuestionnaire(
    input.participantIds,
    findScenario(input, 'questionnaire'),
    input.assessment_assessor_mapping,
    remainingSlots,
    continuityTracker
  );
  
  // Step 7: Combine all variables
  const allVariables = [
    ...parallelVars, // Already assigned
    groupVar,        // Needs assignment
    ...businessCaseVars, // Need assignment
    ...questionnaireVars // Need assignment
  ];
  
  // Step 8: Run backtracking
  console.log('🔍 Running backtracking search...');
  const solution = backtrackSearch(allVariables, continuityTracker, input.daily_breaks);
  
  if (!solution) {
    throw new Error('No solution found');
  }
  
  console.log('✅ Solution found!');
  return solution;
}
```

### 5.2 Backtracking Search
```typescript
function backtrackSearch(
  variables: SchedulingVariable[],
  continuityTracker: AssessorContinuityTracker,
  breaks: DailyBreak[]
): SchedulingVariable[] | null {
  
  // Base case: all variables assigned
  if (allAssigned(variables)) {
    if (validateSolution(variables, continuityTracker, breaks)) {
      return variables;
    }
    return null;
  }
  
  // Select next unassigned variable (MRV heuristic)
  const variable = selectUnassignedVariable(variables);
  
  // Try each value in domain (LCV heuristic)
  const orderedValues = orderDomainValues(variable, variables);
  
  for (const value of orderedValues) {
    // Assign value
    variable.assignedTimeSlot = value.timeSlot;
    variable.assignedRoom = value.room;
    variable.assignedAssessors = value.assessors;
    
    // Update continuity tracker if Group Activity
    if (variable.isGroupActivity && variable.groupInfo) {
      for (const group of variable.groupInfo.groups) {
        for (const participantId of group.participants) {
          continuityTracker.setGroupActivityAssessors(participantId, group.assessors);
        }
      }
    }
    
    // Check if consistent
    if (isConsistent(variable, variables, continuityTracker, breaks)) {
      // Forward checking
      const savedDomains = forwardCheck(variable, variables);
      
      // Recursive call
      const result = backtrackSearch(variables, continuityTracker, breaks);
      
      if (result) {
        return result;
      }
      
      // Restore domains
      restoreDomains(variables, savedDomains);
    }
    
    // Backtrack
    variable.assignedTimeSlot = undefined;
    variable.assignedRoom = undefined;
    variable.assignedAssessors = undefined;
  }
  
  return null; // No solution in this branch
}
```

### 5.3 Variable Selection (MRV)
```typescript
function selectUnassignedVariable(variables: SchedulingVariable[]): SchedulingVariable {
  const unassigned = variables.filter(v => !v.assignedTimeSlot);
  
  // Sort by priority:
  // 1. Sequence order (Group Activity before Business Case)
  // 2. Domain size (most constrained first)
  // 3. Group Activity first (affects all participants)
  
  return unassigned.sort((a, b) => {
    // Priority 1: Sequence order
    if (a.sequenceOrder !== b.sequenceOrder) {
      return a.sequenceOrder - b.sequenceOrder;
    }
    
    // Priority 2: Group Activity first
    if (a.isGroupActivity && !b.isGroupActivity) return -1;
    if (!a.isGroupActivity && b.isGroupActivity) return 1;
    
    // Priority 3: Domain size (MRV)
    const aDomainSize = a.possibleTimeSlots.length * 
                        a.possibleRooms.length * 
                        a.possibleAssessors.length;
    const bDomainSize = b.possibleTimeSlots.length * 
                        b.possibleRooms.length * 
                        b.possibleAssessors.length;
    
    return aDomainSize - bDomainSize;
  })[0];
}
```

### 5.4 Value Ordering (LCV)
```typescript
interface AssignmentValue {
  timeSlot: TimeSlot;
  room: string | undefined;
  assessors: string[];
}

function orderDomainValues(
  variable: SchedulingVariable,
  allVariables: SchedulingVariable[]
): AssignmentValue[] {
  
  const values: AssignmentValue[] = [];
  
  // Generate all combinations
  for (const timeSlot of variable.possibleTimeSlots) {
    const rooms = variable.possibleRooms.length > 0 ? variable.possibleRooms : [undefined];
    
    for (const room of rooms) {
      for (const assessorCombo of variable.possibleAssessors) {
        values.push({
          timeSlot,
          room,
          assessors: assessorCombo
        });
      }
    }
  }
  
  // Sort by LCV (least constraining value)
  return values.sort((a, b) => {
    const aConstraints = countConstraints(variable, a, allVariables);
    const bConstraints = countConstraints(variable, b, allVariables);
    return aConstraints - bConstraints;
  });
}

function countConstraints(
  variable: SchedulingVariable,
  value: AssignmentValue,
  allVariables: SchedulingVariable[]
): number {
  let count = 0;
  
  // Temporarily assign
  const tempVar = { ...variable, ...value, assignedTimeSlot: value.timeSlot, assignedRoom: value.room, assignedAssessors: value.assessors };
  
  // Count how many unassigned variables would lose this value from domain
  for (const other of allVariables) {
    if (other.assignedTimeSlot) continue; // Skip assigned
    if (other.id === variable.id) continue; // Skip self
    
    // Check if this value would conflict
    if (wouldConflict(tempVar, other, value)) {
      count++;
    }
  }
  
  return count;
}
```

### 5.5 Consistency Check
```typescript
function isConsistent(
  variable: SchedulingVariable,
  allVariables: SchedulingVariable[],
  continuityTracker: AssessorContinuityTracker,
  breaks: DailyBreak[]
): boolean {
  
  // Check all constraints
  const checks = [
    // Time conflicts
    () => !checkBreakOverlap(variable, breaks),
    () => !hasParticipantTimeConflict(variable, allVariables),
    () => !hasAssessorTimeConflict(variable, allVariables),
    () => !hasRoomTimeConflict(variable, allVariables),
    
    // Sequence order
    () => checkSequenceOrderConsistency(variable, allVariables),
    
    // Assessor continuity
    () => checkAssessorContinuity(variable, continuityTracker),
    
    // Group Activity
    () => checkGroupActivityAllTogether(variable, allVariables),
    
    // Business Case individual
    () => checkBusinessCaseIndividual(variable, allVariables.filter(v => v.isBusinessCase)),
  ];
  
  for (const check of checks) {
    if (!check()) {
      return false;
    }
  }
  
  return true;
}
```

---

## PHASE 6: ERROR HANDLING ✅ UPDATED

### 6.1 Pre-flight Validation
```typescript
function validateSchedulingInput(input: SchedulingInput): void {
  const errors: string[] = [];
  
  // Check 1: Minimum assessors for Group Activity
  const groupActivityScenario = findScenario(input, 'group_activity');
  const groupAssessors = input.assessment_assessor_mapping[groupActivityScenario.id];
  
  if (groupAssessors.length < 2) {
    errors.push(
      `Group Activity requires at least 2 assessors (need 2 per group). ` +
      `Found: ${groupAssessors.length}`
    );
  }
  
  // Check 2: Can form valid groups?
  const numGroups = Math.floor(groupAssessors.length / 2);
  const minGroupSize = 2;
  const requiredParticipants = numGroups * minGroupSize;
  
  if (input.participantIds.length < requiredParticipants) {
    errors.push(
      `Cannot form ${numGroups} groups with minimum ${minGroupSize} participants each. ` +
      `Need at least ${requiredParticipants} participants, have ${input.participantIds.length}`
    );
  }
  
  // Check 3: Rooms for parallel activities
  const rolePlayScenario = findScenario(input, 'role_play');
  const toyfScenario = findScenario(input, 'toyf');
  
  const rpRooms = input.room_assessment_mapping[rolePlayScenario.id] || [];
  const toyfRooms = input.room_assessment_mapping[toyfScenario.id] || [];
  
  if (rpRooms.length === 0) {
    errors.push(`Role Play needs at least 1 room`);
  }
  if (toyfRooms.length === 0) {
    errors.push(`Think On Your Feet needs at least 1 room`);
  }
  
  // Check 4: Room for Group Activity
  const groupRooms = input.room_assessment_mapping[groupActivityScenario.id] || [];
  if (groupRooms.length === 0) {
    errors.push(`Group Activity needs at least 1 room`);
  }
  
  // Check 5: Sufficient time slots
  const timeSlotGenerator = new TimeSlotGenerator();
  const allSlots = timeSlotGenerator.generateTimeSlots(input);
  
  // Rough estimate: parallel activities need N slots (where N = participants)
  // Group Activity needs 1 slot
  // Business Case needs N slots (individual)
  // Questionnaire needs N slots (individual, can overlap)
  const requiredSlots = input.participantIds.length + 1 + input.participantIds.length;
  
  if (allSlots.length < requiredSlots) {
    errors.push(
      `Insufficient time slots. Need approximately ${requiredSlots}, have ${allSlots.length}. ` +
      `Add more days or extend working hours.`
    );
  }
  
  if (errors.length > 0) {
    throw new SchedulingError('INPUT_VALIDATION_FAILED', errors);
  }
}
```

### 6.2 Error Types & Suggestions
```typescript
class SchedulingError extends Error {
  constructor(
    public type: ErrorType,
    public details: string[],
    public suggestions?: string[]
  ) {
    super(`Scheduling Error: ${type}\n${details.join('\n')}`);
  }
}

enum ErrorType {
  INPUT_VALIDATION_FAILED = 'INPUT_VALIDATION_FAILED',
  INSUFFICIENT_TIME_SLOTS = 'INSUFFICIENT_TIME_SLOTS',
  CANNOT_FORM_GROUPS = 'CANNOT_FORM_GROUPS',
  NO_SOLUTION_FOUND = 'NO_SOLUTION_FOUND',
  CONTINUITY_VIOLATION = 'CONTINUITY_VIOLATION',
}

function generateSuggestions(error: ErrorType, context: any): string[] {
  switch (error) {
    case ErrorType.INSUFFICIENT_TIME_SLOTS:
      return [
        `Add ${context.additionalDays} more day(s) to the schedule`,
        `Extend daily working hours by ${context.additionalHours} hour(s)`,
        `Reduce activity duration from ${context.currentDuration}min to ${context.suggestedDuration}min`,
      ];
    
    case ErrorType.CANNOT_FORM_GROUPS:
      return [
        `Add ${context.additionalAssessors} more assessor(s) for Group Activity`,
        `Reduce number of participants to ${context.maxParticipants}`,
        `Group Activity requires 2 assessors per group and minimum 2 participants per group`,
      ];
    
    case ErrorType.CONTINUITY_VIOLATION:
      return [
        `Ensure Group Activity assessors are also mapped to Business Case`,
        `Ensure Group Activity assessors are also mapped to Questionnaire`,
        `Check assessment_assessor_mapping includes Group Activity assessors for all activities`,
      ];
    
    default:
      return ['Review input parameters and try again'];
  }
}
```

---

## PHASE 7: OUTPUT FORMATTER ✅ UPDATED

### 7.1 Convert Solution to Output
```typescript
function formatScheduleOutput(
  solution: SchedulingVariable[],
  input: SchedulingInput,
  groups: Group[]
): GroupedScheduleResult {
  
  return {
    scenarios: [
      formatRolePlaySchedule(solution, input),
      formatToyfSchedule(solution, input),
      formatGroupActivitySchedule(solution, input, groups),
      formatBusinessCaseSchedule(solution, input),
      formatQuestionnaireSchedule(solution, input),
    ],
    assessorAssignments: extractAssessorAssignments(solution),
    roomUtilization: calculateRoomUtilization(solution),
    dailyBreaks: generateDailyBreaks(input),
  };
}

function formatGroupActivitySchedule(
  solution: SchedulingVariable[],
  input: SchedulingInput,
  groups: Group[]
): AssessmentScheduleGroup {
  
  const groupVar = solution.find(v => v.isGroupActivity);
  if (!groupVar) throw new Error('Group Activity not found in solution');
  
  return {
    id: groupVar.activityId,
    name: 'Group Activity',
    type: 'group_activity',
    is_group_activity: true,
    groups: groups.map(group => ({
      groupId: group.id,
      participantIds: group.participants,
      assessorIds: group.assessors,
      roomId: groupVar.assignedRoom!,
      startTime: groupVar.assignedTimeSlot!.startTime,
      endTime: groupVar.assignedTimeSlot!.endTime,
      // Note: All groups have same time and room (all together)
    })),
    participantSchedules: [], // Not used for group activities
  };
}
```

---

## IMPLEMENTATION ORDER

### Phase 1: Core Infrastructure (Day 1)
1. ✅ Requirements document (DONE)
2. ✅ Implementation plan (THIS FILE)
3. 📝 Create TimeSlotGenerator class
4. 📝 Create GroupFormation class
5. 📝 Create ParallelActivityScheduler class
6. 📝 Create AssessorContinuityTracker class
7. 📝 Unit tests for all utility classes

### Phase 2: CSP Solver Core (Day 2)
8. 📝 Create SchedulingVariable interface
9. 📝 Implement variable initialization functions
10. 📝 Implement all constraint checking functions
11. 📝 Unit tests for constraints

### Phase 3: Backtracking Algorithm (Day 3)
12. 📝 Implement backtracking search
13. 📝 Implement MRV heuristic
14. 📝 Implement LCV heuristic
15. 📝 Implement forward checking
16. 📝 Integration tests

### Phase 4: Error Handling & Output (Day 4)
17. 📝 Implement input validation
18. 📝 Implement error types and suggestions
19. 📝 Implement output formatter
20. 📝 End-to-end tests with real data

### Phase 5: Integration & Testing (Day 5)
21. 📝 Integrate with existing NestJS service
22. 📝 Test with your actual input data
23. 📝 Fix bugs and optimize
24. 📝 Performance testing
25. 📝 Documentation

---

## NEXT STEP

Ready to start **Phase 1: Core Infrastructure**?

We'll create:
1. `TimeSlotGenerator` class
2. `GroupFormation` class
3. `ParallelActivityScheduler` class
4. `AssessorContinuityTracker` class

Shall we begin? 🚀

