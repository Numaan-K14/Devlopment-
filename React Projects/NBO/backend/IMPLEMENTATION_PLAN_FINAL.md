# IMPLEMENTATION PLAN - FINAL VERSION
## Based on SCHEDULING_REQUIREMENTS_FINAL.md

---

## OVERVIEW

This implementation plan provides a step-by-step guide to building a **clean, CSP-based scheduling algorithm** from scratch.

### Key Features:
- ✅ Parallel scheduling (Role Play & TOYF cross-scheduled)
- ✅ Group Activity (all participants together, 1 assessor per group, min 2 participants per group)
- ✅ Business Case (individual, assessor continuity required)
- ✅ Questionnaire (no time/room, only assessor assignment)
- ✅ No buffer time between activities
- ✅ Break avoidance
- ✅ Multi-day support

---

## PHASE 1: CORE UTILITY CLASSES

### 1.1 TimeSlotGenerator

**Purpose**: Generate available time slots avoiding breaks

**Location**: `backend/src/Modules/class-configration/scheduling/utils/time-slot-generator.ts`

```typescript
export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  date: string; // YYYY-MM-DD
  dayIndex: number;
}

export class TimeSlotGenerator {
  /**
   * Generate time slots for multi-day schedule
   * Automatically avoids all break periods
   */
  generateTimeSlots(input: SchedulingInput): TimeSlot[] {
    const allSlots: TimeSlot[] = [];
    
    // For each day in daily_breaks
    for (const dailyBreak of input.daily_breaks) {
      const daySlots = this.generateDaySlots(
        dailyBreak.date,
        input.daily_start_time,
        input.daily_end_time,
        input.duration_of_each_activity,
        dailyBreak
      );
      allSlots.push(...daySlots);
    }
    
    return allSlots;
  }
  
  /**
   * Generate slots for a single day, avoiding breaks
   */
  private generateDaySlots(
    date: string,
    startTime: string,
    endTime: string,
    duration: number,
    breakConfig: DailyBreakConfiguration
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    // Parse UTC datetime strings
    const dayStart = new Date(startTime);
    const dayEnd = new Date(endTime);
    
    let currentTime = new Date(dayStart);
    let slotId = 0;
    
    while (currentTime < dayEnd) {
      const slotEndTime = new Date(currentTime.getTime() + duration * 60 * 1000);
      
      // Skip if slot would extend beyond day end
      if (slotEndTime > dayEnd) break;
      
      // Check if overlaps with any break
      if (!this.overlapsWithAnyBreak(currentTime, slotEndTime, breakConfig)) {
        slots.push({
          id: `slot_${date}_${slotId++}`,
          startTime: new Date(currentTime),
          endTime: new Date(slotEndTime),
          duration,
          date,
          dayIndex: 0 // Will be set if needed
        });
      }
      
      // Move to next potential slot (no buffer)
      currentTime = new Date(currentTime.getTime() + duration * 60 * 1000);
    }
    
    return slots;
  }
  
  /**
   * Check if time range overlaps with any break
   */
  private overlapsWithAnyBreak(
    slotStart: Date,
    slotEnd: Date,
    breakConfig: DailyBreakConfiguration
  ): boolean {
    const breaks = [
      { start: new Date(breakConfig.first_break_start_time), end: new Date(breakConfig.first_break_end_time) },
      { start: new Date(breakConfig.lunch_break_start_time), end: new Date(breakConfig.lunch_break_end_time) },
      { start: new Date(breakConfig.second_break_start_time), end: new Date(breakConfig.second_break_end_time) }
    ];
    
    for (const breakTime of breaks) {
      if (slotStart < breakTime.end && breakTime.start < slotEnd) {
        return true; // Overlaps
      }
    }
    
    return false;
  }
}
```

---

### 1.2 GroupFormation

**Purpose**: Form groups for Group Activity with validation

**Location**: `backend/src/Modules/class-configration/scheduling/utils/group-formation.ts`

```typescript
export interface Group {
  id: string;
  participants: string[]; // 2+ participants
  assessor: string; // Single assessor
}

export class GroupFormation {
  /**
   * Form groups ensuring minimum 2 participants per group
   */
  formGroups(participants: string[], assessors: string[]): Group[] {
    // Validate minimum requirements
    if (assessors.length < 1) {
      throw new Error('Need at least 1 assessor for Group Activity');
    }
    
    if (participants.length < 2) {
      throw new Error('Need at least 2 participants for Group Activity');
    }
    
    // Calculate maximum groups (ensuring min 2 participants per group)
    const maxGroups = Math.floor(participants.length / 2);
    const numGroups = Math.min(assessors.length, maxGroups);
    
    if (numGroups === 0) {
      throw new Error(
        `Cannot form groups: need at least 2 participants per group. ` +
        `Have ${participants.length} participants and ${assessors.length} assessors.`
      );
    }
    
    // Calculate participants per group
    const baseGroupSize = Math.floor(participants.length / numGroups);
    const remainder = participants.length % numGroups;
    
    // Create groups
    const groups: Group[] = [];
    let participantIndex = 0;
    
    for (let i = 0; i < numGroups; i++) {
      const groupSize = baseGroupSize + (i < remainder ? 1 : 0);
      
      // Validate minimum 2 participants
      if (groupSize < 2) {
        throw new Error(
          `Group ${i + 1} would have only ${groupSize} participant. Minimum is 2.`
        );
      }
      
      groups.push({
        id: `group_${i + 1}`,
        participants: participants.slice(participantIndex, participantIndex + groupSize),
        assessor: assessors[i]
      });
      
      participantIndex += groupSize;
    }
    
    console.log(`✅ Formed ${groups.length} groups (${assessors.length} assessors available)`);
    groups.forEach(g => {
      console.log(`  - ${g.id}: ${g.participants.length} participants with assessor ${g.assessor.substring(0, 8)}`);
    });
    
    return groups;
  }
  
  /**
   * Validate if group formation is possible
   */
  validateGroupFormation(numParticipants: number, numAssessors: number): {
    valid: boolean;
    message?: string;
    suggestedGroups?: number;
  } {
    if (numAssessors < 1) {
      return {
        valid: false,
        message: 'Need at least 1 assessor for Group Activity'
      };
    }
    
    if (numParticipants < 2) {
      return {
        valid: false,
        message: 'Need at least 2 participants for Group Activity'
      };
    }
    
    const maxGroups = Math.floor(numParticipants / 2);
    const actualGroups = Math.min(numAssessors, maxGroups);
    
    if (actualGroups === 0) {
      return {
        valid: false,
        message: `Cannot form groups with ${numParticipants} participants and ${numAssessors} assessors`
      };
    }
    
    return {
      valid: true,
      suggestedGroups: actualGroups
    };
  }
}
```

---

### 1.3 ParallelActivityScheduler

**Purpose**: Cross-schedule Role Play and TOYF for maximum efficiency

**Location**: `backend/src/Modules/class-configration/scheduling/utils/parallel-scheduler.ts`

```typescript
export interface ParallelSlot {
  timeSlot: TimeSlot;
  rolePlay: {
    participantId: string;
    room: string;
    assessors: string[];
  } | null;
  toyf: {
    participantId: string;
    room: string;
    assessors: string[];
  } | null;
}

export class ParallelActivityScheduler {
  /**
   * Cross-schedule Role Play and TOYF
   * Pattern: P1→RP|P6→TOYF, P2→RP|P5→TOYF, P3→RP|P4→TOYF, etc.
   */
  scheduleParallelActivities(
    participants: string[],
    timeSlots: TimeSlot[],
    rolePlayRooms: string[],
    toyfRooms: string[],
    rolePlayAssessors: string[],
    toyfAssessors: string[]
  ): ParallelSlot[] {
    const n = participants.length;
    const schedule: ParallelSlot[] = [];
    
    if (rolePlayRooms.length === 0 || toyfRooms.length === 0) {
      throw new Error('Need at least 1 room for Role Play and 1 room for TOYF');
    }
    
    // Select primary rooms (can optimize to use multiple rooms later)
    const rpRoom = rolePlayRooms[0];
    const toyfRoom = toyfRooms[0];
    
    if (n % 2 === 0) {
      // Even number of participants - perfect cross-scheduling
      for (let i = 0; i < n; i++) {
        schedule.push({
          timeSlot: timeSlots[i],
          rolePlay: {
            participantId: participants[i],
            room: rpRoom,
            assessors: rolePlayAssessors
          },
          toyf: {
            participantId: participants[n - 1 - i],
            room: toyfRoom,
            assessors: toyfAssessors
          }
        });
      }
    } else {
      // Odd number - handle middle participant specially
      const middle = Math.floor(n / 2);
      let slotIndex = 0;
      
      // First half
      for (let i = 0; i < middle; i++) {
        schedule.push({
          timeSlot: timeSlots[slotIndex++],
          rolePlay: {
            participantId: participants[i],
            room: rpRoom,
            assessors: rolePlayAssessors
          },
          toyf: {
            participantId: participants[n - 1 - i],
            room: toyfRoom,
            assessors: toyfAssessors
          }
        });
      }
      
      // Middle participant - Role Play only
      schedule.push({
        timeSlot: timeSlots[slotIndex++],
        rolePlay: {
          participantId: participants[middle],
          room: rpRoom,
          assessors: rolePlayAssessors
        },
        toyf: null
      });
      
      // Second half (reversed)
      for (let i = middle + 1; i < n; i++) {
        schedule.push({
          timeSlot: timeSlots[slotIndex++],
          rolePlay: {
            participantId: participants[n - 1 - (i - middle - 1)],
            room: rpRoom,
            assessors: rolePlayAssessors
          },
          toyf: {
            participantId: participants[i - middle - 1],
            room: toyfRoom,
            assessors: toyfAssessors
          }
        });
      }
      
      // Middle participant - TOYF only
      schedule.push({
        timeSlot: timeSlots[slotIndex++],
        rolePlay: null,
        toyf: {
          participantId: participants[middle],
          room: toyfRoom,
          assessors: toyfAssessors
        }
      });
    }
    
    console.log(`✅ Cross-scheduled ${n} participants in ${schedule.length} time slots`);
    return schedule;
  }
}
```

---

### 1.4 AssessorContinuityTracker

**Purpose**: Track Group Activity assessors for Business Case/Questionnaire continuity

**Location**: `backend/src/Modules/class-configration/scheduling/utils/continuity-tracker.ts`

```typescript
export class AssessorContinuityTracker {
  private groupActivityAssignments: Map<string, string> = new Map();
  
  /**
   * Set Group Activity assessor for a participant
   */
  setGroupActivityAssessor(participantId: string, assessorId: string): void {
    this.groupActivityAssignments.set(participantId, assessorId);
  }
  
  /**
   * Get Group Activity assessor for a participant
   */
  getGroupActivityAssessor(participantId: string): string | undefined {
    return this.groupActivityAssignments.get(participantId);
  }
  
  /**
   * Validate that proposed assessors include Group Activity assessor
   */
  validateContinuity(
    participantId: string,
    proposedAssessors: string[]
  ): boolean {
    const requiredAssessor = this.groupActivityAssignments.get(participantId);
    
    if (!requiredAssessor) {
      console.warn(`No Group Activity assessor found for ${participantId}`);
      return false;
    }
    
    return proposedAssessors.includes(requiredAssessor);
  }
  
  /**
   * Get valid assessor combinations for Business Case/Questionnaire
   * Must include at least the Group Activity assessor
   */
  getValidAssessorCombinations(
    participantId: string,
    availableAssessors: string[]
  ): string[][] {
    const requiredAssessor = this.groupActivityAssignments.get(participantId);
    
    if (!requiredAssessor) {
      throw new Error(`No Group Activity assessor found for ${participantId}`);
    }
    
    const combinations: string[][] = [];
    
    // Single assessor (required one)
    combinations.push([requiredAssessor]);
    
    // Required assessor + each additional assessor
    for (const additionalAssessor of availableAssessors) {
      if (additionalAssessor !== requiredAssessor) {
        combinations.push([requiredAssessor, additionalAssessor]);
      }
    }
    
    return combinations;
  }
  
  /**
   * Get all mappings (for debugging)
   */
  getAllMappings(): Map<string, string> {
    return new Map(this.groupActivityAssignments);
  }
}
```

---

## PHASE 2: CSP SOLVER CORE

### 2.1 Variable Structure

**Location**: `backend/src/Modules/class-configration/scheduling/csp/variable.ts`

```typescript
export interface SchedulingVariable {
  id: string;
  participantId: string; // Or "GROUP_ALL" for Group Activity
  activityId: string;
  activityType: 'role_play' | 'toyf' | 'group_activity' | 'business_case' | 'questionnaire';
  sequenceOrder: number; // 1=RP&TOYF, 2=Group, 3=BC, 4=Quest
  
  // For Group Activity
  isGroupActivity: boolean;
  groupInfo?: {
    allParticipants: string[];
    groups: Group[];
  };
  
  // For Business Case
  isBusinessCase: boolean;
  requiredAssessor?: string; // From Group Activity
  
  // For Questionnaire
  isQuestionnaire: boolean;
  needsRoom: boolean; // false for questionnaire
  
  // Domain (possible values)
  possibleTimeSlots: TimeSlot[];
  possibleRooms: string[];
  possibleAssessors: string[][]; // Combinations
  
  // Assignment (actual values)
  assignedTimeSlot?: TimeSlot;
  assignedRoom?: string;
  assignedAssessors?: string[];
}
```

---

### 2.2 Constraint Checker

**Location**: `backend/src/Modules/class-configration/scheduling/csp/constraints.ts`

```typescript
export class ConstraintChecker {
  
  /**
   * Check if two time slots overlap
   */
  private timeSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
    return slot1.startTime < slot2.endTime && slot2.startTime < slot1.endTime;
  }
  
  /**
   * Check participant time conflict
   */
  checkParticipantTimeConflict(
    var1: SchedulingVariable,
    var2: SchedulingVariable
  ): boolean {
    // Skip if different participants
    if (var1.participantId !== var2.participantId) return false;
    
    // Skip if either is GROUP_ALL (handled separately)
    if (var1.participantId === 'GROUP_ALL' || var2.participantId === 'GROUP_ALL') {
      return false;
    }
    
    if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;
    
    return this.timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot);
  }
  
  /**
   * Check assessor time conflict
   */
  checkAssessorTimeConflict(
    var1: SchedulingVariable,
    var2: SchedulingVariable
  ): boolean {
    if (!var1.assignedAssessors || !var2.assignedAssessors) return false;
    if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;
    
    // Find shared assessors
    const sharedAssessors = var1.assignedAssessors.filter(a =>
      var2.assignedAssessors!.includes(a)
    );
    
    if (sharedAssessors.length === 0) return false;
    
    // If they share an assessor, check time overlap
    return this.timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot);
  }
  
  /**
   * Check room time conflict
   */
  checkRoomTimeConflict(
    var1: SchedulingVariable,
    var2: SchedulingVariable
  ): boolean {
    // Skip if no rooms (questionnaire)
    if (!var1.assignedRoom || !var2.assignedRoom) return false;
    
    // Different rooms = no conflict
    if (var1.assignedRoom !== var2.assignedRoom) return false;
    
    if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;
    
    return this.timeSlotsOverlap(var1.assignedTimeSlot, var2.assignedTimeSlot);
  }
  
  /**
   * Check sequence order constraint
   */
  checkSequenceOrder(
    var1: SchedulingVariable,
    var2: SchedulingVariable,
    allVariables: SchedulingVariable[]
  ): boolean {
    // Handle Group Activity separately
    if (var1.isGroupActivity || var2.isGroupActivity) {
      return this.checkGroupActivitySequence(var1, var2, allVariables);
    }
    
    // Same participant check
    if (var1.participantId !== var2.participantId) return true;
    
    if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return true;
    
    // Lower sequence order must finish before higher sequence order starts
    if (var1.sequenceOrder < var2.sequenceOrder) {
      return var1.assignedTimeSlot.endTime <= var2.assignedTimeSlot.startTime;
    }
    
    return true;
  }
  
  /**
   * Check Group Activity sequence (all participants must be free)
   */
  private checkGroupActivitySequence(
    var1: SchedulingVariable,
    var2: SchedulingVariable,
    allVariables: SchedulingVariable[]
  ): boolean {
    const groupVar = var1.isGroupActivity ? var1 : var2;
    const otherVar = var1.isGroupActivity ? var2 : var1;
    
    if (!groupVar.assignedTimeSlot || !otherVar.assignedTimeSlot) return true;
    
    // Check if otherVar's participant is in the group
    if (!groupVar.groupInfo) return true;
    
    const isInGroup = groupVar.groupInfo.allParticipants.includes(otherVar.participantId);
    if (!isInGroup) return true;
    
    // Ensure proper sequence
    if (groupVar.sequenceOrder < otherVar.sequenceOrder) {
      // Group Activity before other activity
      return groupVar.assignedTimeSlot.endTime <= otherVar.assignedTimeSlot.startTime;
    } else {
      // Other activity before Group Activity
      return otherVar.assignedTimeSlot.endTime <= groupVar.assignedTimeSlot.startTime;
    }
  }
  
  /**
   * Check assessor continuity constraint
   */
  checkAssessorContinuity(
    variable: SchedulingVariable,
    continuityTracker: AssessorContinuityTracker
  ): boolean {
    // Only applies to Business Case and Questionnaire
    if (!variable.isBusinessCase && !variable.isQuestionnaire) return true;
    
    if (!variable.assignedAssessors || variable.assignedAssessors.length === 0) {
      return false;
    }
    
    return continuityTracker.validateContinuity(
      variable.participantId,
      variable.assignedAssessors
    );
  }
  
  /**
   * Check all constraints for a variable
   */
  isConsistent(
    variable: SchedulingVariable,
    allVariables: SchedulingVariable[],
    continuityTracker: AssessorContinuityTracker
  ): boolean {
    // Check against all other assigned variables
    for (const other of allVariables) {
      if (other.id === variable.id) continue;
      if (!other.assignedTimeSlot) continue; // Skip unassigned
      
      // Participant time conflict
      if (this.checkParticipantTimeConflict(variable, other)) {
        return false;
      }
      
      // Assessor time conflict
      if (this.checkAssessorTimeConflict(variable, other)) {
        return false;
      }
      
      // Room time conflict
      if (this.checkRoomTimeConflict(variable, other)) {
        return false;
      }
      
      // Sequence order
      if (!this.checkSequenceOrder(variable, other, allVariables)) {
        return false;
      }
    }
    
    // Assessor continuity
    if (!this.checkAssessorContinuity(variable, continuityTracker)) {
      return false;
    }
    
    return true;
  }
}
```

---

## PHASE 3: BACKTRACKING SOLVER

### 3.1 Main CSP Solver

**Location**: `backend/src/Modules/class-configration/scheduling/csp/solver.ts`

```typescript
export class CSPSolver {
  private constraintChecker: ConstraintChecker;
  private maxIterations: number = 10000;
  
  constructor() {
    this.constraintChecker = new ConstraintChecker();
  }
  
  /**
   * Solve CSP using backtracking with MRV and LCV heuristics
   */
  solve(
    variables: SchedulingVariable[],
    continuityTracker: AssessorContinuityTracker
  ): SchedulingVariable[] | null {
    console.log(`🔍 Starting CSP Solver with ${variables.length} variables...`);
    
    let iterations = 0;
    const result = this.backtrack(variables, continuityTracker, iterations);
    
    if (!result) {
      console.error(`❌ No solution found after ${iterations} iterations`);
      return null;
    }
    
    console.log(`✅ Solution found after ${iterations} iterations`);
    return result;
  }
  
  /**
   * Backtracking search with constraint propagation
   */
  private backtrack(
    variables: SchedulingVariable[],
    continuityTracker: AssessorContinuityTracker,
    iterations: number
  ): SchedulingVariable[] | null {
    iterations++;
    
    if (iterations > this.maxIterations) {
      throw new Error('Exceeded maximum iterations');
    }
    
    // Base case: all variables assigned
    if (this.allAssigned(variables)) {
      return variables;
    }
    
    // Select next unassigned variable (MRV heuristic)
    const variable = this.selectUnassignedVariable(variables);
    if (!variable) return null;
    
    // Try each value in domain (LCV heuristic)
    const orderedValues = this.orderDomainValues(variable);
    
    for (const value of orderedValues) {
      // Assign value
      variable.assignedTimeSlot = value.timeSlot;
      variable.assignedRoom = value.room;
      variable.assignedAssessors = value.assessors;
      
      // Update continuity tracker if Group Activity
      if (variable.isGroupActivity && variable.groupInfo) {
        for (const group of variable.groupInfo.groups) {
          for (const participantId of group.participants) {
            continuityTracker.setGroupActivityAssessor(participantId, group.assessor);
          }
        }
      }
      
      // Check consistency
      if (this.constraintChecker.isConsistent(variable, variables, continuityTracker)) {
        // Recursive call
        const result = this.backtrack(variables, continuityTracker, iterations);
        if (result) return result;
      }
      
      // Backtrack
      variable.assignedTimeSlot = undefined;
      variable.assignedRoom = undefined;
      variable.assignedAssessors = undefined;
    }
    
    return null;
  }
  
  /**
   * Check if all variables are assigned
   */
  private allAssigned(variables: SchedulingVariable[]): boolean {
    return variables.every(v => v.assignedTimeSlot !== undefined);
  }
  
  /**
   * Select unassigned variable using MRV heuristic
   */
  private selectUnassignedVariable(
    variables: SchedulingVariable[]
  ): SchedulingVariable | null {
    const unassigned = variables.filter(v => !v.assignedTimeSlot);
    
    if (unassigned.length === 0) return null;
    
    // Sort by: 1) Sequence order, 2) Domain size, 3) Group Activity first
    return unassigned.sort((a, b) => {
      // Priority 1: Sequence order (lower first)
      if (a.sequenceOrder !== b.sequenceOrder) {
        return a.sequenceOrder - b.sequenceOrder;
      }
      
      // Priority 2: Group Activity first (constrains others)
      if (a.isGroupActivity && !b.isGroupActivity) return -1;
      if (!a.isGroupActivity && b.isGroupActivity) return 1;
      
      // Priority 3: Domain size (MRV - most constrained first)
      const aDomainSize = a.possibleTimeSlots.length * a.possibleAssessors.length;
      const bDomainSize = b.possibleTimeSlots.length * b.possibleAssessors.length;
      
      return aDomainSize - bDomainSize;
    })[0];
  }
  
  /**
   * Order domain values using LCV heuristic
   */
  private orderDomainValues(
    variable: SchedulingVariable
  ): Array<{ timeSlot: TimeSlot; room: string | undefined; assessors: string[] }> {
    const values: Array<{ timeSlot: TimeSlot; room: string | undefined; assessors: string[] }> = [];
    
    // Generate all combinations
    for (const timeSlot of variable.possibleTimeSlots) {
      const rooms = variable.possibleRooms.length > 0 ? variable.possibleRooms : [undefined];
      
      for (const room of rooms) {
        for (const assessorCombo of variable.possibleAssessors) {
          values.push({ timeSlot, room, assessors: assessorCombo });
        }
      }
    }
    
    // Sort by LCV (least constraining value first)
    // For now, use simple ordering (can optimize later)
    return values;
  }
}
```

---

## PHASE 4: VARIABLE INITIALIZATION

### 4.1 Variable Initializer

**Location**: `backend/src/Modules/class-configration/scheduling/csp/variable-initializer.ts`

```typescript
export class VariableInitializer {
  
  /**
   * Initialize Role Play and TOYF variables (pre-scheduled)
   */
  initializeParallelActivities(
    participants: string[],
    rolePlayScenario: any,
    toyfScenario: any,
    timeSlots: TimeSlot[],
    roomMapping: any,
    assessorMapping: any,
    parallelScheduler: ParallelActivityScheduler
  ): SchedulingVariable[] {
    const schedule = parallelScheduler.scheduleParallelActivities(
      participants,
      timeSlots,
      roomMapping[rolePlayScenario.id],
      roomMapping[toyfScenario.id],
      assessorMapping[rolePlayScenario.id],
      assessorMapping[toyfScenario.id]
    );
    
    const variables: SchedulingVariable[] = [];
    
    for (const slot of schedule) {
      if (slot.rolePlay) {
        variables.push({
          id: `RP_${slot.rolePlay.participantId}`,
          participantId: slot.rolePlay.participantId,
          activityId: rolePlayScenario.id,
          activityType: 'role_play',
          sequenceOrder: 1,
          isGroupActivity: false,
          isBusinessCase: false,
          isQuestionnaire: false,
          needsRoom: true,
          assignedTimeSlot: slot.timeSlot,
          assignedRoom: slot.rolePlay.room,
          assignedAssessors: slot.rolePlay.assessors,
          possibleTimeSlots: [], // Already assigned
          possibleRooms: [],
          possibleAssessors: []
        });
      }
      
      if (slot.toyf) {
        variables.push({
          id: `TOYF_${slot.toyf.participantId}`,
          participantId: slot.toyf.participantId,
          activityId: toyfScenario.id,
          activityType: 'toyf',
          sequenceOrder: 1,
          isGroupActivity: false,
          isBusinessCase: false,
          isQuestionnaire: false,
          needsRoom: true,
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
  
  /**
   * Initialize Group Activity variable
   */
  initializeGroupActivity(
    participants: string[],
    groupActivityScenario: any,
    assessorMapping: any,
    roomMapping: any,
    timeSlots: TimeSlot[],
    groupFormation: GroupFormation
  ): SchedulingVariable {
    const assessors = assessorMapping[groupActivityScenario.id];
    const groups = groupFormation.formGroups(participants, assessors);
    
    const allAssessors = groups.map(g => g.assessor);
    
    return {
      id: 'GROUP_ACTIVITY_ALL',
      participantId: 'GROUP_ALL',
      activityId: groupActivityScenario.id,
      activityType: 'group_activity',
      sequenceOrder: 2,
      isGroupActivity: true,
      isBusinessCase: false,
      isQuestionnaire: false,
      needsRoom: true,
      groupInfo: {
        allParticipants: participants,
        groups: groups
      },
      possibleTimeSlots: timeSlots,
      possibleRooms: [roomMapping[groupActivityScenario.id][0]], // Single room
      possibleAssessors: [allAssessors] // All assessors together
    };
  }
  
  /**
   * Initialize Business Case variables
   */
  initializeBusinessCase(
    participants: string[],
    businessCaseScenario: any,
    assessorMapping: any,
    roomMapping: any,
    timeSlots: TimeSlot[],
    continuityTracker: AssessorContinuityTracker
  ): SchedulingVariable[] {
    const variables: SchedulingVariable[] = [];
    const availableAssessors = assessorMapping[businessCaseScenario.id];
    const availableRooms = roomMapping[businessCaseScenario.id];
    
    for (const participantId of participants) {
      const requiredAssessor = continuityTracker.getGroupActivityAssessor(participantId);
      
      if (!requiredAssessor) {
        throw new Error(`No Group Activity assessor for ${participantId}`);
      }
      
      // Get valid combinations
      const validCombinations = continuityTracker.getValidAssessorCombinations(
        participantId,
        availableAssessors
      );
      
      variables.push({
        id: `BC_${participantId}`,
        participantId,
        activityId: businessCaseScenario.id,
        activityType: 'business_case',
        sequenceOrder: 3,
        isGroupActivity: false,
        isBusinessCase: true,
        isQuestionnaire: false,
        needsRoom: true,
        requiredAssessor,
        possibleTimeSlots: timeSlots,
        possibleRooms: availableRooms,
        possibleAssessors: validCombinations
      });
    }
    
    return variables;
  }
  
  /**
   * Initialize Questionnaire variables
   */
  initializeQuestionnaire(
    participants: string[],
    questionnaireScenario: any,
    assessorMapping: any,
    continuityTracker: AssessorContinuityTracker
  ): SchedulingVariable[] {
    const variables: SchedulingVariable[] = [];
    const availableAssessors = assessorMapping[questionnaireScenario.id];
    
    for (const participantId of participants) {
      const requiredAssessor = continuityTracker.getGroupActivityAssessor(participantId);
      
      if (!requiredAssessor) {
        throw new Error(`No Group Activity assessor for ${participantId}`);
      }
      
      // Get valid combinations (must include required assessor)
      const validCombinations = continuityTracker.getValidAssessorCombinations(
        participantId,
        availableAssessors
      );
      
      variables.push({
        id: `QUEST_${participantId}`,
        participantId,
        activityId: questionnaireScenario.id,
        activityType: 'questionnaire',
        sequenceOrder: 4,
        isGroupActivity: false,
        isBusinessCase: false,
        isQuestionnaire: true,
        needsRoom: false, // No room needed
        requiredAssessor,
        possibleTimeSlots: [], // No time slot needed
        possibleRooms: [],
        possibleAssessors: validCombinations
      });
    }
    
    return variables;
  }
}
```

---

## PHASE 5: MAIN ORCHESTRATOR

### 5.1 Auto-Scheduling Service

**Location**: `backend/src/Modules/class-configration/scheduling/auto-scheduling.service.ts`

```typescript
@Injectable()
export class AutoSchedulingService {
  
  async generateOptimalSchedule(input: SchedulingInput): Promise<any> {
    try {
      console.log('🚀 Starting schedule generation...');
      
      // Phase 1: Validate input
      await this.validateInput(input);
      
      // Phase 2: Initialize utilities
      const timeSlotGenerator = new TimeSlotGenerator();
      const groupFormation = new GroupFormation();
      const parallelScheduler = new ParallelActivityScheduler();
      const continuityTracker = new AssessorContinuityTracker();
      const variableInitializer = new VariableInitializer();
      const cspSolver = new CSPSolver();
      
      // Phase 3: Generate time slots
      const allTimeSlots = timeSlotGenerator.generateTimeSlots(input);
      console.log(`✅ Generated ${allTimeSlots.length} time slots`);
      
      // Phase 4: Get scenario details
      const scenarioDetails = await this.categorizeScenariosAndQuestionnaires(
        input.scenarioIds,
        input.questionnaireIds
      );
      
      const rolePlayScenario = scenarioDetails.find(s => s.name.toLowerCase().includes('role play'));
      const toyfScenario = scenarioDetails.find(s => s.name.toLowerCase().includes('toyf'));
      const groupActivityScenario = scenarioDetails.find(s => s.isGroupActivity);
      const businessCaseScenario = scenarioDetails.find(s => s.name.toLowerCase().includes('business'));
      const questionnaireScenario = scenarioDetails.find(s => s.isQuestionnaire);
      
      // Phase 5: Initialize variables
      console.log('📋 Initializing variables...');
      
      // 5.1: Pre-schedule parallel activities
      const parallelVars = variableInitializer.initializeParallelActivities(
        input.participantIds,
        rolePlayScenario,
        toyfScenario,
        allTimeSlots,
        input.room_assessment_mapping,
        input.assessment_assessor_mapping,
        parallelScheduler
      );
      
      // Filter used time slots
      const usedSlots = new Set(parallelVars.map(v => v.assignedTimeSlot!.id));
      const remainingSlots = allTimeSlots.filter(s => !usedSlots.has(s.id));
      
      // 5.2: Initialize Group Activity
      const groupActivityVar = variableInitializer.initializeGroupActivity(
        input.participantIds,
        groupActivityScenario,
        input.assessment_assessor_mapping,
        input.room_assessment_mapping,
        remainingSlots,
        groupFormation
      );
      
      // 5.3: Initialize Business Case
      const businessCaseVars = variableInitializer.initializeBusinessCase(
        input.participantIds,
        businessCaseScenario,
        input.assessment_assessor_mapping,
        input.room_assessment_mapping,
        remainingSlots,
        continuityTracker
      );
      
      // 5.4: Initialize Questionnaire
      const questionnaireVars = variableInitializer.initializeQuestionnaire(
        input.participantIds,
        questionnaireScenario,
        input.assessment_assessor_mapping,
        continuityTracker
      );
      
      // Phase 6: Combine all variables
      const allVariables = [
        ...parallelVars,
        groupActivityVar,
        ...businessCaseVars,
        ...questionnaireVars
      ];
      
      console.log(`📊 Total variables: ${allVariables.length}`);
      
      // Phase 7: Solve CSP
      const solution = cspSolver.solve(allVariables, continuityTracker);
      
      if (!solution) {
        throw new Error('No solution found');
      }
      
      // Phase 8: Format output
      const schedule = this.formatOutput(solution, input, scenarioDetails);
      
      console.log('✅ Schedule generation completed!');
      
      return {
        success: true,
        schedule
      };
      
    } catch (error) {
      console.error('❌ Schedule generation failed:', error);
      throw error;
    }
  }
  
  private async validateInput(input: SchedulingInput): Promise<void> {
    // Validate input parameters
    if (!input.participantIds || input.participantIds.length < 2) {
      throw new Error('Need at least 2 participants');
    }
    
    // Add more validations...
  }
  
  private formatOutput(
    solution: SchedulingVariable[],
    input: SchedulingInput,
    scenarioDetails: any[]
  ): any {
    // Format solution into final output structure
    // Group by scenarios, create participant schedules, etc.
    // Implementation details...
  }
}
```

---

## IMPLEMENTATION TIMELINE

### Day 1: Core Utilities
- ✅ TimeSlotGenerator
- ✅ GroupFormation
- ✅ ParallelActivityScheduler
- ✅ AssessorContinuityTracker
- ✅ Unit tests

### Day 2: CSP Core
- ✅ Variable structure
- ✅ ConstraintChecker
- ✅ All constraint implementations
- ✅ Unit tests

### Day 3: Solver & Variables
- ✅ CSP Solver (backtracking)
- ✅ MRV heuristic
- ✅ LCV heuristic
- ✅ VariableInitializer
- ✅ Integration tests

### Day 4: Service & Output
- ✅ AutoSchedulingService
- ✅ Input validation
- ✅ Output formatting
- ✅ Error handling
- ✅ End-to-end tests

### Day 5: Testing & Polish
- ✅ Test with real data
- ✅ Performance optimization
- ✅ Bug fixes
- ✅ Documentation

---

## READY TO START! 🚀

**Shall we begin with Day 1: Core Utilities?**

Just say "yes" and I'll start implementing!

