import {
  SchedulingVariable,
  TimeSlot,
  DailyBreakConfiguration,
  ActivitySequenceItem,
} from '../dto/scheduling.dto';

export class SchedulingConstraints {
  private breakBetweenActivities: number;
  private dailyBreaks: DailyBreakConfiguration[]; // Store daily breaks instead of single lunch
  private activitySequence?: ActivitySequenceItem[]; // NEW: Store activity sequence
  private namesLookup?: any;

  // NEW: Track Group Activity assessor assignments for continuity
  private groupActivityAssessorMap: Map<string, string[]> = new Map(); // participantId -> assessorIds[]

  constructor(
    breakBetweenActivities: number,
    dailyBreaks: DailyBreakConfiguration[], // Replace single lunch_time with daily breaks
    activitySequence?: ActivitySequenceItem[], // NEW: Optional activity sequence
    namesLookup?: any,
  ) {
    this.breakBetweenActivities = breakBetweenActivities;
    this.dailyBreaks = dailyBreaks;
    this.activitySequence = activitySequence;
    this.namesLookup = namesLookup;
    this.groupActivityAssessorMap = new Map(); // Initialize the assessor mapping
  }

  // NEW: Track Group Activity assessor assignments
  trackGroupActivityAssessors(variable: SchedulingVariable): void {
    if (variable.isGroupActivity && variable.assignedAssessorIds) {
      this.groupActivityAssessorMap.set(variable.participantId, [
        ...variable.assignedAssessorIds,
      ]);
      console.log(
        `📝 Tracking Group Activity assessors for ${variable.participantId}: ${variable.assignedAssessorIds.join(', ')}`,
      );
    }
  }

  // NEW: Get Group Activity assessors for a participant
  getGroupActivityAssessorsForParticipant(participantId: string): string[] | undefined {
    return this.groupActivityAssessorMap.get(participantId);
  }

  // NEW: Validate assessor continuity constraint
  validateAssessorContinuity(variable: SchedulingVariable): boolean {
    // Only apply to Business Case and Leadership Questionnaire activities
    if (!variable.scenarioId && !variable.questionnaireId) return true;

    // Check if this is Business Case (order 2) or Leadership Questionnaire (order 4)
    const sequenceOrder = this.activitySequence?.find(
      (item) =>
        item.scenarioId === (variable.scenarioId || variable.questionnaireId),
    )?.order;

    console.log(
      `🔍 ASSESSOR CONTINUITY CHECK: ${variable.participantId.substring(0, 8)} ` +
        `for ${(variable.scenarioId || variable.questionnaireId)?.substring(0, 8)} ` +
        `(sequence order: ${sequenceOrder})`,
    );

    if (sequenceOrder !== 3 && sequenceOrder !== 4) {
      console.log(
        `  ⏭️ Skipping - not Business Case (3) or Leadership Questionnaire (4)`,
      );
      return true; // Not applicable
    }

    // NEW: Check if assessors are pre-assigned for continuity
    if (
      variable.assignedAssessorIds &&
      variable.assignedAssessorIds.length > 0
    ) {
      console.log(
        `  ✅ PRE-ASSIGNED: ${variable.participantId.substring(0, 8)} already has forced continuity assessors`,
      );
      return true; // Pre-assigned assessors are guaranteed to maintain continuity
    }

    // Get the assessors assigned during Group Activity for this participant
    const groupActivityAssessors = this.groupActivityAssessorMap.get(
      variable.participantId,
    );

    if (!groupActivityAssessors || groupActivityAssessors.length === 0) {
      console.log(
        `⚠️ No Group Activity assessors found for ${variable.participantId.substring(0, 8)} - skipping continuity check`,
      );
      return true; // Allow if no group activity assessors tracked yet
    }

    // Check if at least one Group Activity assessor is included in current assignment
    if (
      !variable.assignedAssessorIds ||
      variable.assignedAssessorIds.length === 0
    ) {
      console.log(
        `❌ ASSESSOR CONTINUITY VIOLATION: ${variable.participantId} has no assigned assessors for ${variable.scenarioId?.substring(0, 8) || variable.questionnaireId?.substring(0, 8)}`,
      );
      return false;
    }

    const hasContinuity = variable.assignedAssessorIds.some((assessorId) =>
      groupActivityAssessors.includes(assessorId),
    );

    if (!hasContinuity) {
      const activityType =
        sequenceOrder === 3 ? 'Business Case' : 'Leadership Questionnaire';
      console.log(
        `❌ ASSESSOR CONTINUITY VIOLATION: ${variable.participantId.substring(0, 8)} in ${activityType} ` +
          `has assessors [${variable.assignedAssessorIds.map((id) => id.substring(0, 8)).join(', ')}] but Group Activity assessors ` +
          `were [${groupActivityAssessors.map((id) => id.substring(0, 8)).join(', ')}]. At least one must match.`,
      );
      console.log(
        `🚫 BLOCKING ASSIGNMENT: This assignment violates 100% continuity requirement!`,
      );
      return false;
    }

    const activityType =
      sequenceOrder === 3 ? 'Business Case' : 'Leadership Questionnaire';
    console.log(
      `✅ ASSESSOR CONTINUITY: ${variable.participantId.substring(0, 8)} in ${activityType} ` +
        `maintains continuity with Group Activity assessors [${groupActivityAssessors.map((id) => id.substring(0, 8)).join(', ')}]`,
    );

    return true;
  }

  // Hard Constraints
  participantTimeConflict(
    var1: SchedulingVariable,
    var2: SchedulingVariable,
  ): boolean {
    if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;

    // Skip time conflict check for questionnaires (dummy time slots)
    if (this.isQuestionnaire(var1) || this.isQuestionnaire(var2)) return false;

    // Check if participants conflict (including group activities)
    if (!this.participantsConflict(var1.participantId, var2.participantId))
      return false;

    // Check for parallel activity spacing constraint
    if (this.violatesParallelActivitySpacing(var1, var2)) {
      return true; // Constraint violation
    }

    const hasTimeOverlap = this.timeOverlaps(
      var1.assignedTimeSlot,
      var2.assignedTimeSlot,
    );

    if (hasTimeOverlap) {
      console.log(`PARTICIPANT CONFLICT DETECTED:`);

      // Get names for better logging
      const getParticipantNames = (participantId: string): string => {
        if (participantId.startsWith('GROUP_')) {
          const ids = participantId.replace('GROUP_', '').split('_');
          const names = ids.map(
            (id) => this.namesLookup?.participants?.get(id) || id,
          );
          return `GROUP[${names.join(', ')}]`;
        } else {
          return (
            this.namesLookup?.participants?.get(participantId) || participantId
          );
        }
      };

      const assessment1Name =
        this.namesLookup?.assessments?.get(var1.assessmentId) ||
        var1.assessmentId;
      const assessment2Name =
        this.namesLookup?.assessments?.get(var2.assessmentId) ||
        var2.assessmentId;
      const participant1Names = getParticipantNames(var1.participantId);
      const participant2Names = getParticipantNames(var2.participantId);
      const room1Name =
        this.namesLookup?.rooms?.get(var1.assignedRoomId || '') ||
        var1.assignedRoomId ||
        'N/A';
      const room2Name =
        this.namesLookup?.rooms?.get(var2.assignedRoomId || '') ||
        var2.assignedRoomId ||
        'N/A';

      const getAssessorNames = (assessorIds: string[]): string => {
        return assessorIds
          .map((id) => this.namesLookup?.assessors?.get(id) || id)
          .join(', ');
      };

      console.log(
        `  Variable 1: ${participant1Names} -> Assessment: ${assessment1Name} (${var1.assessmentId})`,
      );
      console.log(
        `  Variable 2: ${participant2Names} -> Assessment: ${assessment2Name} (${var2.assessmentId})`,
      );
      console.log(`  Room 1: ${room1Name} | Room 2: ${room2Name}`);
      console.log(
        `  Assessors 1: ${getAssessorNames(var1.assignedAssessorIds || [])} | Assessors 2: ${getAssessorNames(var2.assignedAssessorIds || [])}`,
      );
      console.log(`  Time 1: ${var1.assignedTimeSlot.startTime.toISOString()}`);
      console.log(`  Time 2: ${var2.assignedTimeSlot.startTime.toISOString()}`);
    }

    return hasTimeOverlap;
  }

  assessorTimeConflict(
    var1: SchedulingVariable,
    var2: SchedulingVariable,
  ): boolean {
    if (!var1.assignedAssessorIds || !var2.assignedAssessorIds) return false;
    if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;

    // Skip time conflict check for questionnaires (dummy time slots)
    if (this.isQuestionnaire(var1) || this.isQuestionnaire(var2)) return false;

    const commonAssessors = var1.assignedAssessorIds.filter((id) =>
      var2.assignedAssessorIds!.includes(id),
    );

    return (
      commonAssessors.length > 0 &&
      this.timeOverlaps(var1.assignedTimeSlot, var2.assignedTimeSlot)
    );
  }

  roomTimeConflict(
    var1: SchedulingVariable,
    var2: SchedulingVariable,
  ): boolean {
    if (var1.assignedRoomId !== var2.assignedRoomId) return false;
    if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return false;

    // Skip room conflict check for questionnaires (they don't use rooms)
    if (this.isQuestionnaire(var1) || this.isQuestionnaire(var2)) return false;

    return this.timeOverlaps(var1.assignedTimeSlot, var2.assignedTimeSlot);
  }

  transitionTimeConstraint(
    var1: SchedulingVariable,
    var2: SchedulingVariable,
  ): boolean {
    if (!var1.assignedTimeSlot || !var2.assignedTimeSlot) return true;

    // Skip transition time check for questionnaires (they don't have real time constraints)
    if (this.isQuestionnaire(var1) || this.isQuestionnaire(var2)) return true;

    // Check if participants conflict (including group activities)
    if (!this.participantsConflict(var1.participantId, var2.participantId))
      return true;

    const timeBetween = this.calculateTimeBetween(
      var1.assignedTimeSlot.endTime,
      var2.assignedTimeSlot.startTime,
    );

    return Math.abs(timeBetween) >= this.breakBetweenActivities;
  }

  // NEW: Daily break constraint validation (replaces lunchTimeConstraint)
  dailyBreakConstraint(variable: SchedulingVariable): boolean {
    if (!variable.assignedTimeSlot) return true;

    // Skip break checks for questionnaires
    if (this.isQuestionnaire(variable)) return true;

    // Find the break configuration for this activity's date
    const activityDate = this.getDateString(
      variable.assignedTimeSlot.startTime,
    );
    const breakConfig = this.dailyBreaks.find(
      (config) => config.date === activityDate,
    );

    if (!breakConfig) {
      console.warn(`No break configuration found for date ${activityDate}`);
      return true; // Allow if no config found
    }

    // Check overlap with all three daily breaks
    const breaks = [
      {
        start: breakConfig.first_break_start_time,
        end: breakConfig.first_break_end_time,
        type: 'first_break',
      },
      {
        start: breakConfig.second_break_start_time,
        end: breakConfig.second_break_end_time,
        type: 'second_break',
      },
      {
        start: breakConfig.lunch_break_start_time,
        end: breakConfig.lunch_break_end_time,
        type: 'lunch_break',
      },
    ];

    for (const breakTime of breaks) {
      if (
        this.overlapsWithBreakTime(
          variable.assignedTimeSlot,
          breakTime,
          activityDate,
        )
      ) {
        console.log(
          `❌ Activity conflicts with ${breakTime.type} on ${activityDate}`,
        );
        return false;
      }
    }

    return true;
  }

  // DEPRECATED: Keep for backward compatibility
  lunchTimeConstraint(variable: SchedulingVariable): boolean {
    // Delegate to new daily break constraint
    return this.dailyBreakConstraint(variable);
  }

  // NEW: Activity sequence constraint validation
  activitySequenceConstraint(
    variable: SchedulingVariable,
    existingAssignments: SchedulingVariable[],
  ): boolean {
    // If no sequence specified, skip constraint
    if (!this.activitySequence || this.activitySequence.length === 0) {
      return true;
    }

    // Skip sequence checks for questionnaires (they are time-agnostic)
    if (this.isQuestionnaire(variable)) {
      return true; // Questionnaires can be scheduled anytime
    }

    // Only check sequence for same participant
    const participantAssignments = existingAssignments.filter(
      (assigned) =>
        this.participantsConflict(
          variable.participantId,
          assigned.participantId,
        ) &&
        assigned.assignedTimeSlot &&
        !this.isQuestionnaire(assigned),
    );

    if (participantAssignments.length === 0) {
      return true; // No previous assignments for this participant
    }

    // Get current variable's sequence order
    const currentScenarioId = variable.scenarioId;
    if (!currentScenarioId) {
      return true; // No scenario ID, skip sequence check
    }

    const currentSequenceOrder = this.activitySequence.find(
      (item) => item.scenarioId === currentScenarioId,
    )?.order;

    if (currentSequenceOrder === undefined) {
      return true; // Current activity not in sequence, no constraint
    }

    // Check if any scheduled activities for this participant have later sequence orders
    // but earlier start times (which would violate the sequence)
    for (const existingAssignment of participantAssignments) {
      const existingScenarioId = existingAssignment.scenarioId;
      if (!existingScenarioId) {
        continue; // No scenario ID, skip
      }

      const existingSequenceOrder = this.activitySequence.find(
        (item) => item.scenarioId === existingScenarioId,
      )?.order;

      if (existingSequenceOrder === undefined) {
        continue; // Existing activity not in sequence, skip
      }

      // If current activity should come before existing activity (lower sequence order)
      // then current activity must start before existing activity
      if (currentSequenceOrder < existingSequenceOrder) {
        if (
          variable.assignedTimeSlot!.startTime >=
          existingAssignment.assignedTimeSlot!.startTime
        ) {
          console.log(
            `❌ Sequence violation: Activity ${currentScenarioId.substring(0, 8)} (order ${currentSequenceOrder}) ` +
              `must start before ${existingScenarioId.substring(0, 8)} (order ${existingSequenceOrder})`,
          );
          return false;
        }
      }

      // If current activity should come after existing activity (higher sequence order)
      // then current activity must start after existing activity COMPLETES
      if (currentSequenceOrder > existingSequenceOrder) {
        if (
          variable.assignedTimeSlot!.startTime <
          existingAssignment.assignedTimeSlot!.endTime
        ) {
          console.log(
            `❌ Sequence violation: Activity ${currentScenarioId.substring(0, 8)} (order ${currentSequenceOrder}) ` +
              `must start AFTER ${existingScenarioId.substring(0, 8)} (order ${existingSequenceOrder}) COMPLETES`,
          );
          return false;
        }
      }
    }

    // GLOBAL PARALLEL COMPLETION CHECK:
    // If this is a non-parallel activity (order > 1), ensure ALL parallel activities
    // (order 1) across ALL participants have completed
    if (currentSequenceOrder > 1) {
      const incompleteParallelActivities = existingAssignments.filter(
        (existing) => {
          if (!existing.assignedTimeSlot || !existing.scenarioId) return false;
          if (this.isQuestionnaire(existing)) return false;

          const existingOrder = this.activitySequence!.find(
            (item) => item.scenarioId === existing.scenarioId,
          )?.order;

          return existingOrder === 1; // Check for parallel activities (order 1)
        },
      );

      // Current activity must start AFTER all parallel activities end
      for (const parallelActivity of incompleteParallelActivities) {
        if (
          variable.assignedTimeSlot!.startTime <
          parallelActivity.assignedTimeSlot!.endTime
        ) {
          console.log(
            `❌ GLOBAL PARALLEL COMPLETION VIOLATION: ${currentScenarioId.substring(0, 8)} (order ${currentSequenceOrder}) ` +
              `cannot start until ALL parallel activities (order 1) complete. ` +
              `Conflict: ${parallelActivity.scenarioId?.substring(0, 8)} for ${parallelActivity.participantId.substring(0, 8)} ends at ${parallelActivity.assignedTimeSlot!.endTime.toISOString().substr(11, 5)}`,
          );
          return false;
        }
      }
    }

    // PARALLEL PHASE SYNCHRONIZATION:
    // If this is a parallel activity (order 1), ensure all parallel activities end at similar times
    // This prevents one parallel track (e.g., Role Play) from finishing much later than another (e.g., TOYF)
    if (currentSequenceOrder === 1) {
      const otherParallelActivities = existingAssignments.filter((existing) => {
        if (!existing.assignedTimeSlot || !existing.scenarioId) return false;
        if (this.isQuestionnaire(existing)) return false;
        if (existing.scenarioId === variable.scenarioId) return false; // Skip same scenario

        const existingOrder = this.activitySequence!.find(
          (item) => item.scenarioId === existing.scenarioId,
        )?.order;

        return existingOrder === 1; // Check for other parallel activities (order 1)
      });

      if (otherParallelActivities.length > 0) {
        // Find the latest end time among other parallel activities
        const latestEndTime = Math.max(
          ...otherParallelActivities.map((a) =>
            a.assignedTimeSlot!.endTime.getTime(),
          ),
        );

        // Current activity must end at EXACTLY the same time as other parallel activities
        // This ensures Role Play and TOYF finish simultaneously (zero gap tolerance)
        const maxGapMs = 0; // ZERO tolerance - must end at same time
        const currentEndTime = variable.assignedTimeSlot!.endTime.getTime();

        if (currentEndTime > latestEndTime + maxGapMs) {
          console.log(
            `❌ PARALLEL PHASE SYNC VIOLATION: ${currentScenarioId.substring(0, 8)} ends at ${variable.assignedTimeSlot!.endTime.toISOString().substr(11, 5)} ` +
              `but other parallel activities end at ${new Date(latestEndTime).toISOString().substr(11, 5)}. ` +
              `Role Play and TOYF MUST finish at EXACTLY the same time (zero gap allowed).`,
          );
          return false;
        }
      }
    }

    return true;
  }

  /**
   * NEW: Parallel Activity Constraint
   * Ensures Role Play and Think On Your Feet run in parallel (same time slots) for each participant
   */
  parallelActivityConstraint(
    variable: SchedulingVariable,
    existingAssignments: SchedulingVariable[],
  ): boolean {
    // Only apply to Role Play and Think On Your Feet activities
    if (!this.isParallelActivity(variable)) {
      return true; // Not a parallel activity, no constraint
    }

    // Find the parallel counterpart for this participant
    const parallelCounterpart = existingAssignments.find(
      (existing) =>
        existing.participantId === variable.participantId &&
        existing.scenarioId !== variable.scenarioId &&
        this.isParallelActivity(existing) &&
        existing.assignedTimeSlot,
    );

    if (!parallelCounterpart) {
      return true; // No counterpart assigned yet, constraint will be checked when counterpart is assigned
    }

    // Both activities must have identical time slots
    if (
      variable.assignedTimeSlot!.startTime.getTime() !==
        parallelCounterpart.assignedTimeSlot!.startTime.getTime() ||
      variable.assignedTimeSlot!.endTime.getTime() !==
        parallelCounterpart.assignedTimeSlot!.endTime.getTime()
    ) {
      console.log(
        `❌ Parallel activity constraint violation: ${this.getActivityName(variable)} and ${this.getActivityName(parallelCounterpart)} must have identical time slots for participant ${variable.participantId.substring(0, 8)}`,
      );
      return false;
    }

    console.log(
      `✅ Parallel activity constraint satisfied: ${this.getActivityName(variable)} and ${this.getActivityName(parallelCounterpart)} have identical time slots`,
    );
    return true;
  }

  /**
   * Check if a variable represents a parallel activity (Role Play or Think On Your Feet)
   */
  private isParallelActivity(variable: SchedulingVariable): boolean {
    if (!variable.scenarioId) return false;

    // Check if this scenario is part of parallel activities (sequence order 1)
    if (this.activitySequence) {
      const activityInfo = this.activitySequence.find(
        (item) => item.scenarioId === variable.scenarioId,
      );
      return activityInfo?.order === 1; // Role Play and TOYF both have order 1
    }

    return false;
  }

  /**
   * Get activity name for logging
   */
  private getActivityName(variable: SchedulingVariable): string {
    if (this.namesLookup?.scenarios?.has(variable.scenarioId)) {
      return this.namesLookup.scenarios.get(variable.scenarioId);
    }
    return variable.scenarioId?.substring(0, 8) || 'Unknown';
  }

  // Utility methods
  private isQuestionnaire(variable: SchedulingVariable): boolean {
    return variable.assignedTimeSlot?.id === 'questionnaire_dummy';
  }

  /**
   * Check if two variables violate the parallel activity spacing constraint
   * Ensures participants don't get back-to-back parallel activities (Role Play & TOYF)
   */
  private violatesParallelActivitySpacing(
    var1: SchedulingVariable,
    var2: SchedulingVariable,
  ): boolean {
    // Only apply to same participant
    if (var1.participantId !== var2.participantId) return false;

    // Only apply to parallel activities (same sequence order)
    if (!var1.sequenceOrder || !var2.sequenceOrder) return false;
    if (var1.sequenceOrder !== var2.sequenceOrder) return false;

    // Only apply to order 1 activities (Role Play & TOYF)
    if (var1.sequenceOrder !== 1) return false;

    // Skip if same activity
    if (var1.scenarioId === var2.scenarioId) return false;

    // Check if activities are immediately consecutive (no gap)
    const time1End = var1.assignedTimeSlot!.endTime.getTime();
    const time2Start = var2.assignedTimeSlot!.startTime.getTime();
    const time2End = var2.assignedTimeSlot!.endTime.getTime();
    const time1Start = var1.assignedTimeSlot!.startTime.getTime();

    // Check both directions (var1 before var2, or var2 before var1)
    const isConsecutive1to2 = time1End === time2Start; // var1 ends exactly when var2 starts
    const isConsecutive2to1 = time2End === time1Start; // var2 ends exactly when var1 starts

    if (isConsecutive1to2 || isConsecutive2to1) {
      console.log(`🚫 PARALLEL ACTIVITY SPACING VIOLATION:`);
      console.log(`   Participant: ${var1.participantId}`);
      console.log(
        `   Activity 1: ${this.getActivityName(var1)} (${var1.assignedTimeSlot!.startTime.toISOString()} - ${var1.assignedTimeSlot!.endTime.toISOString()})`,
      );
      console.log(
        `   Activity 2: ${this.getActivityName(var2)} (${var2.assignedTimeSlot!.startTime.toISOString()} - ${var2.assignedTimeSlot!.endTime.toISOString()})`,
      );
      console.log(`   → Participant needs gap between parallel activities`);
      return true;
    }

    return false;
  }

  private participantsConflict(
    participantId1: string,
    participantId2: string,
  ): boolean {
    // Extract actual participant IDs from both individual and group activities
    const getParticipantIds = (id: string): string[] => {
      if (id.startsWith('GROUP_')) {
        // Extract participant IDs from group: "GROUP_id1_id2" -> ["id1", "id2"]
        return id.replace('GROUP_', '').split('_');
      } else {
        // Individual participant: "id1" -> ["id1"]
        return [id];
      }
    };

    const participants1 = getParticipantIds(participantId1);
    const participants2 = getParticipantIds(participantId2);

    // Check if any participant appears in both lists
    return participants1.some((p1) => participants2.includes(p1));
  }

  private timeOverlaps(slot1: TimeSlot, slot2: TimeSlot): boolean {
    return slot1.startTime < slot2.endTime && slot2.startTime < slot1.endTime;
  }

  private calculateTimeBetween(end1: Date, start2: Date): number {
    return (start2.getTime() - end1.getTime()) / (1000 * 60); // minutes
  }

  // Check if assignment satisfies all hard constraints
  isValidAssignment(
    variable: SchedulingVariable,
    assignment: { timeSlot: TimeSlot; roomId: string; assessorIds: string[] },
    existingAssignments: SchedulingVariable[],
  ): boolean {
    // Temporarily assign values
    variable.assignedTimeSlot = assignment.timeSlot;
    variable.assignedRoomId = assignment.roomId;
    variable.assignedAssessorIds = assignment.assessorIds;

    // Check against all existing assignments
    for (const existing of existingAssignments) {
      if (existing.id === variable.id) continue;

      if (
        this.participantTimeConflict(variable, existing) ||
        this.assessorTimeConflict(variable, existing) ||
        this.roomTimeConflict(variable, existing) ||
        !this.transitionTimeConstraint(variable, existing)
      ) {
        return false;
      }
    }

    // Check lunch time constraint
    if (!this.lunchTimeConstraint(variable)) {
      return false;
    }

    // NEW: Check activity sequence constraint
    if (!this.activitySequenceConstraint(variable, existingAssignments)) {
      return false;
    }

    // NEW: Check Business Case exclusivity constraint
    if (
      !this.businessCaseExclusivityConstraint(variable, existingAssignments)
    ) {
      return false;
    }

    // NEW: Track Group Activity assessor assignments for continuity
    this.trackGroupActivityAssessors(variable);

    // NEW: Check assessor continuity constraint (Business Case & Leadership Questionnaire)
    // This is a CRITICAL constraint - must be enforced for 100% continuity
    if (!this.validateAssessorContinuity(variable)) {
      console.log(
        `🚫 CRITICAL CONSTRAINT FAILED: Assessor continuity violation for ${variable.participantId.substring(0, 8)} - BLOCKING ASSIGNMENT`,
      );
      return false;
    }

    // NOTE: Parallel activity constraint disabled - handled by post-processing synchronization
    // The CSP solver struggles to find identical time slots during solving,
    // so we synchronize Role Play & TOYF activities after solving instead
    // if (!this.parallelActivityConstraint(variable, existingAssignments)) {
    //   return false;
    // }

    return true;
  }

  /**
   * Business Case Exclusivity Constraint
   * Ensures no other activities are scheduled during Business Case time slot
   */
  businessCaseExclusivityConstraint(
    variable: SchedulingVariable,
    existingAssignments: SchedulingVariable[],
  ): boolean {
    // Find any Business Case assignments in existing assignments
    const businessCaseAssignments = existingAssignments.filter(
      (assignment) => assignment.isBusinessCase && assignment.assignedTimeSlot,
    );

    if (businessCaseAssignments.length === 0) {
      // No Business Case scheduled yet, check if current variable is Business Case
      if (variable.isBusinessCase) {
        // This is a Business Case being scheduled - check no other activities conflict
        const conflictingActivities = existingAssignments.filter(
          (assignment) =>
            !assignment.isBusinessCase &&
            assignment.assignedTimeSlot &&
            this.timeOverlaps(
              variable.assignedTimeSlot!,
              assignment.assignedTimeSlot,
            ),
        );

        if (conflictingActivities.length > 0) {
          console.log(`🚫 BUSINESS CASE EXCLUSIVITY VIOLATION:`);
          console.log(
            `   Business Case cannot be scheduled during existing activities`,
          );
          conflictingActivities.forEach((activity) => {
            console.log(
              `   → Conflicts with: ${this.getActivityName(activity)} (${activity.assignedTimeSlot!.startTime.toISOString()} - ${activity.assignedTimeSlot!.endTime.toISOString()})`,
            );
          });
          return false;
        }
      }
      return true;
    }

    // Business Case is already scheduled - check if current variable conflicts
    if (!variable.isBusinessCase) {
      // This is a non-Business Case activity - check it doesn't conflict with Business Case
      for (const businessCase of businessCaseAssignments) {
        if (
          this.timeOverlaps(
            variable.assignedTimeSlot!,
            businessCase.assignedTimeSlot!,
          )
        ) {
          console.log(`🚫 BUSINESS CASE EXCLUSIVITY VIOLATION:`);
          console.log(
            `   Cannot schedule ${this.getActivityName(variable)} during Business Case time`,
          );
          console.log(
            `   Business Case: ${businessCase.assignedTimeSlot!.startTime.toISOString()} - ${businessCase.assignedTimeSlot!.endTime.toISOString()}`,
          );
          console.log(
            `   Attempted activity: ${variable.assignedTimeSlot!.startTime.toISOString()} - ${variable.assignedTimeSlot!.endTime.toISOString()}`,
          );
          return false;
        }
      }
    }

    console.log(
      `✅ BUSINESS CASE EXCLUSIVITY CHECK PASSED for ${this.getActivityName(variable)}`,
    );
    return true;
  }

  /**
   * Helper method to extract date string from Date object
   */
  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0]; // "2025-08-01"
  }

  /**
   * Check if a time slot overlaps with a specific break time - now handles UTC datetime strings
   */
  private overlapsWithBreakTime(
    timeSlot: TimeSlot,
    breakTime: { start: string; end: string; type: string }, // start/end are now UTC datetime strings
    activityDate: string,
  ): boolean {
    try {
      // Parse UTC datetime strings directly
      const breakStart = new Date(breakTime.start);
      const breakEnd = new Date(breakTime.end);

      const breakSlot: TimeSlot = {
        id: `${breakTime.type}_${activityDate}`,
        startTime: breakStart,
        endTime: breakEnd,
        duration: (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60),
      };

      return this.timeOverlaps(timeSlot, breakSlot);
    } catch (error) {
      // If parsing fails, assume no overlap to avoid false positives
      console.warn(
        `Failed to parse break time: ${breakTime.start} - ${breakTime.end}`,
      );
      return false;
    }
  }
}
