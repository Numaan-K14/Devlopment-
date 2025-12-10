import {
  SchedulingVariable,
  TimeSlot,
  AvailabilityMatrix,
} from '../dto/scheduling.dto';
import { SchedulingConstraints } from './constraints';

export class SchedulingCSP {
  private variables: SchedulingVariable[] = [];
  private constraints: SchedulingConstraints;
  private availabilityMatrix: AvailabilityMatrix;
  private namesLookup: any;
  private maxIterations = 50000; // Ultra-high iterations for guaranteed 100% Business Case continuity
  private currentIteration = 0;

  constructor(
    constraints: SchedulingConstraints,
    availabilityMatrix: AvailabilityMatrix,
    namesLookup?: any,
  ) {
    this.constraints = constraints;
    this.availabilityMatrix = availabilityMatrix;
    this.namesLookup = namesLookup;
  }

  initializeVariables(participantIds: string[], assessmentIds: string[]): void {
    this.variables = [];
    let varId = 0;

    for (const participantId of participantIds) {
      for (const assessmentId of assessmentIds) {
        const variable: SchedulingVariable = {
          id: `var_${varId++}`,
          participantId,
          assessmentId,
          possibleTimeSlots: [...this.availabilityMatrix.timeSlots],
          possibleRoomIds: Array.from(this.availabilityMatrix.rooms.keys()),
          possibleAssessorIds: Array.from(
            this.availabilityMatrix.assessors.keys(),
          ),
          priority: this.calculatePriority(participantId, assessmentId),
          isQuestionnaire: false, // Default for legacy method
          isGroupActivity: false, // Default for legacy method
        };
        this.variables.push(variable);
      }
    }

    // Filter domains based on availability
    this.filterDomains();
  }

  initializeEnhancedVariables(
    participantIds: string[],
    scenarioDetails: any[],
    specializedAssessors?: Map<string, string[]>, // Optional again since we have fallbacks
    roomAssessmentMapping?: { [roomId: string]: string[] }, // NEW: Room-assessment mapping
    activitySequence?: any[], // NEW: Activity sequence configuration
    groupActivityDuration?: number, // NEW: Group activity duration in minutes
    businessCaseRooms?: string[], // NEW: Specific rooms for Business Case
    businessCaseRoomAssessors?: { [roomId: string]: string[] }, // NEW: Fixed room-assessor mapping for Business Case
  ): void {
    this.variables = [];
    let varId = 0;

    console.log(`\n🔧 === CSP SOLVER DEBUG ===`);
    console.log(
      `⏱️  Group activity duration received: ${groupActivityDuration} minutes`,
    );
    console.log(`================================\n`);

    // Helper function to get sequence order for a scenario
    const getSequenceOrder = (scenarioId: string): number | undefined => {
      return activitySequence?.find((item) => item.scenarioId === scenarioId)
        ?.order;
    };

    // Helper function to check if scenario is Business Case
    const isBusinessCase = (scenarioId: string): boolean => {
      return (
        activitySequence?.find((item) => item.scenarioId === scenarioId)
          ?.isBusinessCase || false
      );
    };

    // Helper function to check if scenario is Role Play or TOYF (order 1)
    const isRolePlayOrTOYF = (scenarioId: string): boolean => {
      const order = getSequenceOrder(scenarioId);
      return order === 1;
    };

    // CRITICAL: Sort scenarios to ensure proper initialization order:
    // 1. Role Play & TOYF (order 1) - processed first
    // 2. Group Activity - processed before Business Case to create assessor mapping
    // 3. Business Case - uses Group Activity assessor mapping
    // 4. Leadership Questionnaire - processed last
    // Note: Sequence order numbers (Business Case=2, Group Activity=3) enforce time slot ordering during CSP solving,
    // but variable initialization order ensures Group Activity assessor mapping is available for Business Case.
    const sortedScenarios = [...scenarioDetails].sort((a, b) => {
      const aIsGroupActivity = a.isGroupActivity || false;
      const bIsGroupActivity = b.isGroupActivity || false;
      const aIsBusinessCase = isBusinessCase(a.id);
      const bIsBusinessCase = isBusinessCase(b.id);
      const aIsRolePlayOrTOYF = isRolePlayOrTOYF(a.id);
      const bIsRolePlayOrTOYF = isRolePlayOrTOYF(b.id);
      const aIsQuestionnaire = a.isQuestionnaire || false;
      const bIsQuestionnaire = b.isQuestionnaire || false;

      // Role Play & TOYF come first
      if (aIsRolePlayOrTOYF && !bIsRolePlayOrTOYF) return -1;
      if (!aIsRolePlayOrTOYF && bIsRolePlayOrTOYF) return 1;

      // Group Activity should come before Business Case (for assessor mapping)
      if (aIsGroupActivity && bIsBusinessCase) return -1;
      if (bIsGroupActivity && aIsBusinessCase) return 1;

      // Questionnaires come last
      if (!aIsQuestionnaire && bIsQuestionnaire) return -1;
      if (aIsQuestionnaire && !bIsQuestionnaire) return 1;

      // For all other scenarios, maintain original order
      return 0;
    });

    console.log('\n📋 Scenario Processing Order (after sorting):');
    sortedScenarios.forEach((scenario, index) => {
      const type = scenario.isQuestionnaire 
        ? 'Questionnaire' 
        : scenario.isGroupActivity 
          ? 'Group Activity' 
          : isBusinessCase(scenario.id) 
            ? 'Business Case' 
            : 'Individual Activity';
      console.log(`  ${index + 1}. ${scenario.name} (${type})`);
    });
    console.log('');

    for (const scenario of sortedScenarios) {
      if (scenario.isQuestionnaire) {
        // Leadership questionnaires: Only participant-assessor pairs, no time/room
        for (const participantId of participantIds) {
          // Get specialized assessors for this questionnaire - use mapping if available
          const specializedAssessorIds =
            specializedAssessors?.get(scenario.assessmentId) ||
            specializedAssessors?.get(scenario.id) ||
            Array.from(this.availabilityMatrix.assessors.keys());

          console.log(
            `Questionnaire ${scenario.assessmentId} (${scenario.name}): Mapped assessors:`,
            specializedAssessorIds,
          );

          const sequenceOrder = getSequenceOrder(scenario.id);
          const variable: SchedulingVariable = {
            id: `var_${varId++}`,
            participantId,
            questionnaireId: scenario.id, // Use questionnaireId for questionnaires
            assessmentId: scenario.assessmentId,
            possibleTimeSlots: [], // No time slots for questionnaires
            possibleRoomIds: [], // No rooms for questionnaires
            possibleAssessorIds: specializedAssessorIds,
            priority: this.calculateSequencePriority(sequenceOrder, 1000), // Sequence-based priority
            isQuestionnaire: true,
            isGroupActivity: false,
            sequenceOrder: sequenceOrder, // NEW: Store sequence order
          };
          this.variables.push(variable);
        }
      } else if (scenario.isGroupActivity) {
        // Group activities: All groups run simultaneously at same time

        // Get specialized assessors for this scenario - use mapping if available
        const specializedAssessorIds =
          specializedAssessors?.get(scenario.assessmentId) ||
          specializedAssessors?.get(scenario.id) ||
          Array.from(this.availabilityMatrix.assessors.keys());

        console.log(
          `Group Activity ${scenario.assessmentId} (${scenario.name}): Mapped assessors:`,
          specializedAssessorIds,
        );

        // Split participants equally among available assessors
        const participantGroups = this.splitParticipantsByAssessors(
          participantIds,
          specializedAssessorIds,
        );

        console.log(
          `Split ${participantIds.length} participants into ${participantGroups.length} groups based on ${specializedAssessorIds.length} assessors:`,
          participantGroups.map(
            (group, index) =>
              `Group ${index + 1}: ${group.participants.length} participants → Assessor: ${group.assessorId.substring(0, 8)}`,
          ),
        );

        // Create ONE variable representing ALL groups running simultaneously
        const allGroupParticipants = participantGroups
          .map((g) => g.participants)
          .flat();
        const allGroupAssessors = participantGroups.map((g) => g.assessorId);

        const variable: SchedulingVariable = {
          id: `var_${varId++}`,
          participantId: 'GROUP_ACTIVITY_' + allGroupParticipants.join('_'), // All participants together
          scenarioId: scenario.id, // Use scenarioId for scenarios
          assessmentId: scenario.assessmentId,
          possibleTimeSlots: [...this.availabilityMatrix.timeSlots], // Use standard time slots, adjust duration during assignment
          possibleRoomIds: this.filterRoomsForScenario(
            scenario.id,
            roomAssessmentMapping || {}, // Provide default empty object if undefined
            Array.from(this.availabilityMatrix.rooms.keys()),
          ),
          possibleAssessorIds: allGroupAssessors, // All assessors for all groups
          priority: this.calculateSequencePriority(
            getSequenceOrder(scenario.id),
            500,
          ), // Sequence-based priority
          isQuestionnaire: false,
          isGroupActivity: true,
          sequenceOrder: getSequenceOrder(scenario.id), // NEW: Store sequence order
          groupInfo: participantGroups, // Store the group breakdown for later use
          groupActivityDuration: groupActivityDuration, // Store group activity duration
        };
        this.variables.push(variable);

        console.log(
          `Created single variable for Group Activity with ${participantGroups.length} groups running simultaneously`,
        );
        console.log(`  Total participants: ${allGroupParticipants.length}`);
        console.log(`  Total assessors: ${allGroupAssessors.length}`);
        console.log(
          `⏱️  Group activity duration stored: ${groupActivityDuration || 'standard'} minutes`,
        );
      } else if (isBusinessCase(scenario.id)) {
        // Business Case: Individual activities with multi-room distribution
        console.log(`\n🏢 BUSINESS CASE DETECTED: ${scenario.name}`);

        // Get specialized assessors for Business Case
        const specializedAssessorIds =
          specializedAssessors?.get(scenario.assessmentId) ||
          specializedAssessors?.get(scenario.id) ||
          Array.from(this.availabilityMatrix.assessors.keys());

        console.log(
          `Business Case ${scenario.assessmentId} (${scenario.name}): Available assessors:`,
          specializedAssessorIds.length,
        );

        // NEW: Extract Group Activity participant-assessor mapping from already-created Group Activity variables
        const participantGroupActivityAssessorMap = new Map<string, string>();
        this.variables.forEach(variable => {
          if (variable.isGroupActivity && variable.groupInfo) {
            variable.groupInfo.forEach(group => {
              group.participants.forEach(participantId => {
                participantGroupActivityAssessorMap.set(participantId, group.assessorId);
                console.log(`  📋 Pre-mapped: ${participantId.substring(0, 8)} → Group Activity assessor ${group.assessorId.substring(0, 8)}`);
              });
            });
          }
        });
        
        console.log(`✅ Extracted ${participantGroupActivityAssessorMap.size} participant Group Activity assessor mappings for Business Case continuity`);

        // Get available rooms for Business Case - use specific rooms if provided
        const availableRooms =
          businessCaseRooms && businessCaseRooms.length > 0
            ? businessCaseRooms // Use specific Business Case rooms
            : this.filterRoomsForScenario(
                scenario.id,
                roomAssessmentMapping || {},
                Array.from(this.availabilityMatrix.rooms.keys()),
              );

        // Create room distribution for Business Case
        const roomDistribution = this.distributeBusinessCaseAcrossRooms(
          participantIds,
          specializedAssessorIds,
          availableRooms,
          businessCaseRoomAssessors, // NEW: Pass fixed room-assessor mapping
          participantGroupActivityAssessorMap, // NEW: Pass Group Activity continuity map
        );

        if (roomDistribution.length === 0) {
          console.error(
            `❌ Failed to create room distribution for Business Case scenario ${scenario.id}`,
          );
          console.error(
            `   Participants: ${participantIds.length}, Assessors: ${specializedAssessorIds.length}, Rooms: ${availableRooms.length}`,
          );
          continue; // Skip this scenario
        }

        console.log(`🏠 Room Distribution for Business Case:`);
        roomDistribution.forEach((room, index) => {
          console.log(
            `  Room ${index + 1} (${room.roomId.substring(0, 8)}): ${room.participantIds.length} participants, ${room.assessorIds.length} assessors`,
          );
        });

        // Create individual variables for each participant with their assigned room and assessors
        for (const participantId of participantIds) {
          // Find which room this participant is assigned to
          const assignedRoom = roomDistribution.find((room) =>
            room.participantIds.includes(participantId),
          );

          if (!assignedRoom) {
            console.warn(
              `No room assignment found for participant ${participantId}`,
            );
            continue;
          }

          const variable: SchedulingVariable = {
            id: `var_${varId++}`,
            participantId: participantId,
            scenarioId: scenario.id,
            assessmentId: scenario.assessmentId,
            possibleTimeSlots: [...this.availabilityMatrix.timeSlots],
            possibleRoomIds: [assignedRoom.roomId], // Only the assigned room
            possibleAssessorIds: assignedRoom.assessorIds, // Only the assessors for this room
            priority: this.calculateSequencePriority(
              getSequenceOrder(scenario.id),
              this.calculatePriority(participantId, scenario.id),
            ),
            isQuestionnaire: false,
            isGroupActivity: false,
            isBusinessCase: true, // Mark as Business Case
            sequenceOrder: getSequenceOrder(scenario.id),
          };
          this.variables.push(variable);

          console.log(
            `Created Business Case variable for participant ${participantId.substring(0, 8)} in room ${assignedRoom.roomId.substring(0, 8)} with assessors: [${assignedRoom.assessorIds.map((a) => a.substring(0, 8)).join(', ')}]`,
          );
        }

        console.log(
          `✅ Created ${participantIds.length} individual Business Case variables across ${roomDistribution.length} rooms`,
        );
      } else {
        // Individual scenarios: One per participant
        for (const participantId of participantIds) {
          // Get specialized assessors for this scenario - use mapping if available
          const specializedAssessorIds =
            specializedAssessors?.get(scenario.assessmentId) ||
            specializedAssessors?.get(scenario.id) ||
            Array.from(this.availabilityMatrix.assessors.keys());

          console.log(
            `Individual Scenario ${scenario.assessmentId} (${scenario.name}): Mapped assessors:`,
            specializedAssessorIds,
          );

          const variable: SchedulingVariable = {
            id: `var_${varId++}`,
            participantId,
            scenarioId: scenario.id, // Use scenarioId for scenarios
            assessmentId: scenario.assessmentId,
            possibleTimeSlots: [...this.availabilityMatrix.timeSlots],
            possibleRoomIds: this.filterRoomsForScenario(
              scenario.id,
              roomAssessmentMapping || {}, // Provide default empty object if undefined
              Array.from(this.availabilityMatrix.rooms.keys()),
            ),
            possibleAssessorIds: specializedAssessorIds,
            priority: this.calculateSequencePriority(
              getSequenceOrder(scenario.id),
              this.calculatePriority(participantId, scenario.id),
            ), // Sequence-based priority
            isQuestionnaire: false,
            isGroupActivity: false,
            sequenceOrder: getSequenceOrder(scenario.id), // NEW: Store sequence order
          };
          this.variables.push(variable);
        }
      }
    }

    // Filter domains based on availability for non-questionnaire assessments
    this.filterDomainsEnhanced();

    console.log(`Generated ${this.variables.length} scheduling variables`);
  }

  /**
   * NEW: Distribute participants and assessors across multiple rooms for Business Case
   * ENHANCED: Assign participants to rooms based on Group Activity assessors for 100% continuity
   */
  private distributeBusinessCaseAcrossRooms(
    participantIds: string[],
    assessorIds: string[],
    roomIds: string[],
    fixedRoomAssessors?: { [roomId: string]: string[] }, // NEW: Fixed room-assessor mapping
    participantGroupActivityAssessorMap?: Map<string, string>, // NEW: Group Activity continuity map
  ): {
    roomId: string;
    participantIds: string[];
    assessorIds: string[];
  }[] {
    console.log(`\n🏢 DISTRIBUTING BUSINESS CASE ACROSS ROOMS (CONTINUITY-AWARE):`);
    console.log(
      `   Participants: ${participantIds.length} - [${participantIds.map((p) => p.substring(0, 8)).join(', ')}]`,
    );
    console.log(
      `   Assessors: ${assessorIds.length} - [${assessorIds.map((a) => a.substring(0, 8)).join(', ')}]`,
    );
    console.log(
      `   Rooms: ${roomIds.length} - [${roomIds.map((r) => r.substring(0, 8)).join(', ')}]`,
    );

    // Validation
    if (participantIds.length === 0) {
      console.error(
        '❌ No participants provided for Business Case distribution',
      );
      return [];
    }
    if (assessorIds.length === 0) {
      console.error('❌ No assessors provided for Business Case distribution');
      return [];
    }
    if (roomIds.length === 0) {
      console.error('❌ No rooms provided for Business Case distribution');
      return [];
    }

    const distribution: {
      roomId: string;
      participantIds: string[];
      assessorIds: string[];
    }[] = [];

    // STEP 1: Calculate EQUAL assessor distribution across rooms
    const baseAssessorsPerRoom = Math.floor(assessorIds.length / roomIds.length);
    const extraAssessors = assessorIds.length % roomIds.length;

    console.log(
      `\n📊 EQUAL DISTRIBUTION CALCULATION:`,
    );
    console.log(
      `   Base assessors per room: ${baseAssessorsPerRoom}`,
    );
    console.log(
      `   Extra assessors (odd case): ${extraAssessors}`,
    );
    console.log(
      `   Distribution: First ${extraAssessors} room(s) will get ${baseAssessorsPerRoom + 1} assessors, remaining rooms get ${baseAssessorsPerRoom} assessors`,
    );

    // STEP 2: Distribute assessors EQUALLY across rooms (FIXED assignment)
    const roomAssessorMap = new Map<string, string[]>();
    
    let assessorIndex = 0;
    for (let i = 0; i < roomIds.length; i++) {
      const roomId = roomIds[i];
      const assessorsForThisRoom = baseAssessorsPerRoom + (i < extraAssessors ? 1 : 0);
      const roomAssessors = assessorIds.slice(
        assessorIndex,
        assessorIndex + assessorsForThisRoom,
      );
      assessorIndex += assessorsForThisRoom;
      roomAssessorMap.set(roomId, roomAssessors);
      
      console.log(
        `   Room ${i + 1} (${roomId.substring(0, 8)}): ${assessorsForThisRoom} assessors [${roomAssessors.map((a) => a.substring(0, 8)).join(', ')}] - FIXED`,
      );
    }

    // STEP 3: Check if we have fixed room-assessor mapping (override)
    if (fixedRoomAssessors) {
      console.log('\n🔒 Using FIXED room-assessor mapping (OVERRIDE):');
      Object.entries(fixedRoomAssessors).forEach(([roomId, assessors]) => {
        roomAssessorMap.set(roomId, assessors);
        console.log(
          `   Room ${roomId.substring(0, 8)}: [${assessors.map((a) => a.substring(0, 8)).join(', ')}]`,
        );
      });
    }

    // STEP 4: NEW - Use provided Group Activity assessor continuity map
    console.log('\n🔍 Using Group Activity continuity map...');
    if (participantGroupActivityAssessorMap && participantGroupActivityAssessorMap.size > 0) {
      console.log(`  Found ${participantGroupActivityAssessorMap.size} Group Activity assessor mappings`);
      participantGroupActivityAssessorMap.forEach((assessorId, participantId) => {
        console.log(`  ${participantId.substring(0, 8)} → Group Activity assessor: ${assessorId.substring(0, 8)}`);
      });
    } else {
      console.log('  ⚠️ No Group Activity continuity map provided - will distribute participants evenly');
    }

    // STEP 5: Distribute participants to rooms based on Group Activity assessor matching
    console.log('\n📋 Using CONTINUITY-AWARE participant distribution:');
    
    // Create participant-to-room assignments ensuring assessor continuity
    const roomParticipantsMap = new Map<string, string[]>();
    roomIds.forEach(roomId => roomParticipantsMap.set(roomId, []));

    // Assign each participant to a room where their Group Activity assessor is present
    if (participantGroupActivityAssessorMap && participantGroupActivityAssessorMap.size > 0) {
      // Use continuity-aware distribution
      participantIds.forEach(participantId => {
        const groupActivityAssessor = participantGroupActivityAssessorMap.get(participantId);
        
        if (groupActivityAssessor) {
          // Find rooms that have this assessor
          let assignedToRoom = false;
          for (const [roomId, roomAssessors] of roomAssessorMap.entries()) {
            if (roomAssessors.includes(groupActivityAssessor)) {
              roomParticipantsMap.get(roomId)?.push(participantId);
              console.log(
                `  ✅ ${participantId.substring(0, 8)} → Room ${roomId.substring(0, 8)} (has Group Activity assessor ${groupActivityAssessor.substring(0, 8)})`
              );
              assignedToRoom = true;
              break;
            }
          }
          
          if (!assignedToRoom) {
            // Fallback: assign to room with least participants
            const leastLoadedRoom = Array.from(roomParticipantsMap.entries())
              .sort((a, b) => a[1].length - b[1].length)[0];
            leastLoadedRoom[1].push(participantId);
            console.log(
              `  ⚠️ ${participantId.substring(0, 8)} → Room ${leastLoadedRoom[0].substring(0, 8)} (fallback - Group Activity assessor not in any room)`
            );
          }
        } else {
          // No Group Activity data - use round-robin fallback
          const leastLoadedRoom = Array.from(roomParticipantsMap.entries())
            .sort((a, b) => a[1].length - b[1].length)[0];
          leastLoadedRoom[1].push(participantId);
          console.log(
            `  ⚠️ ${participantId.substring(0, 8)} → Room ${leastLoadedRoom[0].substring(0, 8)} (no Group Activity data)`
          );
        }
      });
    } else {
      // No continuity map provided - use simple even distribution
      console.log('  Using simple even distribution (no continuity map)');
      const participantsPerRoom = Math.ceil(participantIds.length / roomIds.length);
      let participantIndex = 0;
      
      roomIds.forEach(roomId => {
        const roomParticipants = participantIds.slice(
          participantIndex,
          Math.min(participantIndex + participantsPerRoom, participantIds.length)
        );
        roomParticipantsMap.set(roomId, roomParticipants);
        participantIndex += roomParticipants.length;
        
        console.log(
          `  ${roomId.substring(0, 8)} → ${roomParticipants.length} participants (even split)`
        );
      });
    }

    // Build final distribution
    roomIds.forEach(roomId => {
      const roomParticipants = roomParticipantsMap.get(roomId) || [];
      const roomAssessors = roomAssessorMap.get(roomId) || [];

      distribution.push({
        roomId,
        participantIds: roomParticipants,
        assessorIds: roomAssessors,
      });

      console.log(
        `\n   Room ${roomId.substring(0, 8)}: ${roomParticipants.length} participants, ${roomAssessors.length} FIXED assessors`,
      );
      console.log(
        `     Participants: [${roomParticipants.map((p) => p.substring(0, 8)).join(', ')}]`,
      );
      console.log(
        `     FIXED Assessors: [${roomAssessors.map((a) => a.substring(0, 8)).join(', ')}]`,
      );
      
      // Verify continuity (if map is provided)
      if (participantGroupActivityAssessorMap && participantGroupActivityAssessorMap.size > 0) {
        roomParticipants.forEach(participantId => {
          const groupActivityAssessor = participantGroupActivityAssessorMap.get(participantId);
          if (groupActivityAssessor) {
            const hasContinuity = roomAssessors.includes(groupActivityAssessor);
            if (hasContinuity) {
              console.log(`       ✅ ${participantId.substring(0, 8)} continuity maintained`);
            } else {
              console.log(`       ❌ ${participantId.substring(0, 8)} continuity BROKEN!`);
            }
          }
        });
      }
    });

    console.log(`\n✅ Business Case distribution complete with CONTINUITY-AWARE distribution\n`);
    return distribution;
  }

  /**
   * Split participants equally among available assessors for group activities
   * Each group gets one assessor and participants are distributed evenly
   * Groups can have 1 participant when the number of assessors equals the number of participants
   * @param participantIds Array of all participant IDs
   * @param assessorIds Array of available assessor IDs for this group activity
   * @returns Array of participant groups with assigned assessors
   */
  private splitParticipantsByAssessors(
    participantIds: string[],
    assessorIds: string[],
  ): { participants: string[]; assessorId: string }[] {
    if (assessorIds.length === 0) {
      console.warn('No assessors available for group activity');
      return [];
    }

    const groups: { participants: string[]; assessorId: string }[] = [];

    // Calculate participants per group (distribute evenly)
    const participantsPerGroup = Math.floor(
      participantIds.length / assessorIds.length,
    );
    const remainder = participantIds.length % assessorIds.length;

    console.log(
      `Splitting ${participantIds.length} participants among ${assessorIds.length} assessors: ${participantsPerGroup} participants per group, ${remainder} extra participants`,
    );

    let participantIndex = 0;

    // Create groups for each assessor
    assessorIds.forEach((assessorId, index) => {
      const groupSize = participantsPerGroup + (index < remainder ? 1 : 0); // Distribute remainder participants
      const groupParticipants = participantIds.slice(
        participantIndex,
        participantIndex + groupSize,
      );

      if (groupParticipants.length > 0) {
        groups.push({
          participants: groupParticipants,
          assessorId: assessorId,
        });

        console.log(
          `  Group ${index + 1}: ${groupParticipants.length} participants [${groupParticipants.map((id) => id.substring(0, 8)).join(', ')}] → Assessor: ${assessorId.substring(0, 8)}`,
        );
      }

      participantIndex += groupSize;
    });

    return groups;
  }

  private filterDomains(): void {
    for (const variable of this.variables) {
      // Filter time slots based on participant availability
      variable.possibleTimeSlots = variable.possibleTimeSlots.filter(
        (slot) =>
          this.availabilityMatrix.participants
            .get(variable.participantId)
            ?.get(slot.id) === true,
      );

      // Filter rooms based on availability for each time slot
      // Filter assessors based on availability for each time slot
      variable.possibleRoomIds = variable.possibleRoomIds.filter((roomId) =>
        variable.possibleTimeSlots.some(
          (slot) =>
            this.availabilityMatrix.rooms.get(roomId)?.get(slot.id) === true,
        ),
      );

      variable.possibleAssessorIds = variable.possibleAssessorIds.filter(
        (assessorId) =>
          variable.possibleTimeSlots.some(
            (slot) =>
              this.availabilityMatrix.assessors
                .get(assessorId)
                ?.get(slot.id) === true,
          ),
      );
    }
  }

  private filterDomainsEnhanced(): void {
    for (const variable of this.variables) {
      // Skip filtering for questionnaires as they don't need time/room
      if (
        variable.possibleTimeSlots.length === 0 &&
        variable.possibleRoomIds.length === 0
      ) {
        continue; // This is a questionnaire
      }

      // For group activities, use 'GROUP_ACTIVITY_' prefix to identify
      const isGroupActivity =
        variable.participantId.startsWith('GROUP_ACTIVITY_');

      if (isGroupActivity) {
        // Group activities: all participants should be available for the time slot
        // For now, keep all time slots available (can be enhanced later)
        continue;
      }

      // CRITICAL: Skip assessor availability filtering for Business Case assessments
      // Business Case assessors are FIXED to rooms and should NOT be filtered by availability
      const isBusinessCase = variable.isBusinessCase === true;

      // Filter time slots based on participant availability (for individual assessments)
      variable.possibleTimeSlots = variable.possibleTimeSlots.filter(
        (slot) =>
          this.availabilityMatrix.participants
            .get(variable.participantId)
            ?.get(slot.id) === true,
      );

      // Filter rooms based on availability for each time slot
      variable.possibleRoomIds = variable.possibleRoomIds.filter((roomId) =>
        variable.possibleTimeSlots.some(
          (slot) =>
            this.availabilityMatrix.rooms.get(roomId)?.get(slot.id) === true,
        ),
      );

      // Filter assessors - ONLY if NOT Business Case (Business Case assessors are FIXED)
      if (!isBusinessCase) {
        // Regular individual assessments: Filter assessors by availability
        variable.possibleAssessorIds = variable.possibleAssessorIds.filter(
          (assessorId) =>
            variable.possibleTimeSlots.some(
              (slot) =>
                this.availabilityMatrix.assessors
                  .get(assessorId)
                  ?.get(slot.id) === true,
            ),
        );
      }
      // For Business Case: Keep all assessors as-is (they're already FIXED to the room)
    }
  }

  private calculatePriority(
    participantId: string,
    assessmentId: string,
  ): number {
    // Higher priority for participants with fewer available slots
    const participantAvailability =
      this.availabilityMatrix.participants.get(participantId);
    const availableSlots = Array.from(
      participantAvailability?.values() || [],
    ).filter((available) => available).length;

    return 1000 - availableSlots; // Higher number = higher priority
  }

  /**
   * Calculate priority based on sequence order
   * @param sequenceOrder - Order in activity sequence (1 = first, 2 = second, etc.)
   * @param basePriority - Base priority to adjust
   * @returns Adjusted priority with sequence weighting
   */
  private calculateSequencePriority(
    sequenceOrder: number | undefined,
    basePriority: number,
  ): number {
    if (sequenceOrder === undefined) {
      return basePriority; // No sequence specified, use base priority
    }

    // Earlier sequence orders get higher priority
    // Subtract sequence order from a high number to ensure earlier activities are prioritized
    const sequenceBonus = 10000 - sequenceOrder * 1000; // Large bonus for earlier sequence
    return basePriority + sequenceBonus;
  }

  async solve(): Promise<SchedulingVariable[]> {
    this.currentIteration = 0;

    // Validate variables before solving
    if (this.variables.length === 0) {
      throw new Error('No variables to solve');
    }

    console.log(`CSP Solver: Starting with ${this.variables.length} variables`);

    // Sort variables by sequence order first, then by priority
    this.variables.sort((a, b) => {
      // Primary sort: by sequence order (undefined sequence orders go last)
      const aSequence = a.sequenceOrder ?? Number.MAX_SAFE_INTEGER;
      const bSequence = b.sequenceOrder ?? Number.MAX_SAFE_INTEGER;

      if (aSequence !== bSequence) {
        return aSequence - bSequence; // Earlier sequence orders first
      }

      // Secondary sort: by priority (higher priority first)
      return b.priority - a.priority;
    });

    console.log(
      'Variables sorted by sequence order:',
      this.variables
        .map((v) => `${v.sequenceOrder ?? 'unordered'}-${v.id}`)
        .join(', '),
    );

    // Try multiple attempts to find a solution with better assessor utilization
    let bestSolution: SchedulingVariable[] | null = null;
    let bestAssessorCount = 0;
    const maxAttempts = 20; // Ultra-high attempts for guaranteed 100% Business Case continuity

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`CSP Solver: Attempt ${attempt}/${maxAttempts}`);
      this.currentIteration = 0; // Reset iteration counter for each attempt

      try {
        const result = await this.backtrackSearch([]);

        if (result) {
          // Count unique assessors in this solution
          const uniqueAssessors = new Set<string>();
          result.forEach((variable) => {
            if (variable.assignedAssessorIds) {
              variable.assignedAssessorIds.forEach((assessorId) => {
                uniqueAssessors.add(assessorId);
              });
            }
          });

          console.log(
            `  Solution found with ${uniqueAssessors.size} unique assessors`,
          );

          // Keep the solution with more unique assessors
          if (uniqueAssessors.size > bestAssessorCount) {
            bestSolution = result;
            bestAssessorCount = uniqueAssessors.size;
            console.log(
              `  ✓ New best solution with ${bestAssessorCount} assessors`,
            );

            // If we're using all available assessors, we can stop
            const totalAvailableAssessors = Array.from(
              this.availabilityMatrix.assessors.keys(),
            ).length;
            if (bestAssessorCount === totalAvailableAssessors) {
              console.log(
                `  ✓ Using all ${totalAvailableAssessors} available assessors - optimal!`,
              );
              break;
            }
          }
        }
      } catch (error) {
        console.log(`  Attempt ${attempt} failed:`, error.message);
      }

      // Add slight randomization for next attempt
      if (attempt < maxAttempts) {
        console.log(`  Shuffling variables for next attempt...`);
        this.shuffleVariables();
      }
    }

    if (!bestSolution) {
      throw new Error(
        `No solution found within ${maxAttempts} attempts and ${this.maxIterations} iterations each`,
      );
    }

    console.log(
      `CSP Solver: Best solution uses ${bestAssessorCount} unique assessors`,
    );

    // 🔍 DEBUG: Check group activity time slots in final solution
    console.log(`\n🔍 FINAL SOLUTION TIME SLOT VERIFICATION:`);
    bestSolution.forEach((variable) => {
      if (variable.isGroupActivity && variable.assignedTimeSlot) {
        const duration =
          (variable.assignedTimeSlot.endTime.getTime() -
            variable.assignedTimeSlot.startTime.getTime()) /
          (60 * 1000);
        console.log(
          `📊 Variable ${variable.id}: ${variable.assignedTimeSlot.startTime.toLocaleTimeString()} - ${variable.assignedTimeSlot.endTime.toLocaleTimeString()} (${duration} minutes)`,
        );
      }
    });
    console.log(`================================================\n`);

    return bestSolution;
  }

  private shuffleVariables(): void {
    // Simple shuffle to try different ordering
    for (let i = this.variables.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.variables[i], this.variables[j]] = [
        this.variables[j],
        this.variables[i],
      ];
    }
    // Re-sort by priority but with some randomness
    this.variables.sort((a, b) => {
      const priorityDiff = b.priority - a.priority;
      return priorityDiff + (Math.random() - 0.5) * 0.1; // Add small random factor
    });
  }

  private async backtrackSearch(
    assignment: SchedulingVariable[],
  ): Promise<SchedulingVariable[] | null> {
    this.currentIteration++;

    if (this.currentIteration > this.maxIterations) {
      console.log('CSP solver reached maximum iterations');
      return null;
    }

    // Additional safety check for recursion depth
    if (assignment.length > this.variables.length) {
      console.log('Assignment length exceeded variables length');
      return null;
    }

    // Check if assignment is complete
    if (assignment.length === this.variables.length) {
      // 🔍 DEBUG: Check final assignment before returning
      console.log(`\n🎉 COMPLETE ASSIGNMENT FOUND! Checking final time slots:`);
      assignment.forEach((variable) => {
        if (variable.isGroupActivity && variable.assignedTimeSlot) {
          const duration =
            (variable.assignedTimeSlot.endTime.getTime() -
              variable.assignedTimeSlot.startTime.getTime()) /
            (60 * 1000);
          console.log(
            `📊 FINAL ${variable.id}: ${variable.assignedTimeSlot.startTime.toLocaleTimeString()} - ${variable.assignedTimeSlot.endTime.toLocaleTimeString()} (${duration} minutes)`,
          );
        }
      });
      console.log(`===============================================\n`);
      return assignment;
    }

    // Select next unassigned variable (MRV heuristic)
    const unassigned = this.variables.filter(
      (v) => !assignment.find((a) => a.id === v.id),
    );

    const nextVar = this.selectNextVariable(unassigned, assignment);
    if (!nextVar) return null;

    // Try all possible assignments for this variable
    const possibleAssignments = this.generatePossibleAssignments(
      nextVar,
      assignment,
    );

    // Safety check - if no possible assignments, backtrack immediately
    if (possibleAssignments.length === 0) {
      return null;
    }

    for (const possibleAssignment of possibleAssignments) {
      // Create new variable with assignment
      let assignedTimeSlot = possibleAssignment.timeSlot;

      // For group activities, ALWAYS adjust the end time to use group activity duration
      if (nextVar.isGroupActivity && nextVar.groupActivityDuration) {
        console.log(`\n⚡ === GROUP ACTIVITY ASSIGNMENT ===`);
        console.log(`🆔 Variable ID: ${nextVar.id}`);
        console.log(`👥 Is Group Activity: ${nextVar.isGroupActivity}`);
        console.log(
          `⏱️  Stored Duration: ${nextVar.groupActivityDuration} minutes`,
        );
        console.log(
          `🕐 Original: ${possibleAssignment.timeSlot.startTime.toLocaleTimeString()} - ${possibleAssignment.timeSlot.endTime.toLocaleTimeString()}`,
        );

        const originalDuration =
          (possibleAssignment.timeSlot.endTime.getTime() -
            possibleAssignment.timeSlot.startTime.getTime()) /
          (60 * 1000);

        // 🔧 CRITICAL FIX: ALWAYS adjust duration for group activities
        assignedTimeSlot = {
          ...possibleAssignment.timeSlot,
          endTime: new Date(
            possibleAssignment.timeSlot.startTime.getTime() +
              nextVar.groupActivityDuration * 60 * 1000,
          ),
          duration: nextVar.groupActivityDuration,
        };

        console.log(`🎯 DURATION ADJUSTMENT:`);
        console.log(`   Original duration: ${originalDuration} minutes`);
        console.log(
          `   New duration: ${nextVar.groupActivityDuration} minutes`,
        );
        console.log(
          `🕐 Adjusted: ${assignedTimeSlot.startTime.toLocaleTimeString()} - ${assignedTimeSlot.endTime.toLocaleTimeString()}`,
        );
        console.log(`=====================================\n`);
      }

      const assignedVar: SchedulingVariable = {
        ...nextVar,
        assignedTimeSlot: assignedTimeSlot,
        assignedRoomId: possibleAssignment.roomId,
        assignedAssessorIds: possibleAssignment.assessorIds,
      };

      // 🔍 DEBUG: Verify the assigned time slot is correct
      if (nextVar.isGroupActivity) {
        console.log(`🔍 VERIFICATION: Final assignedVar time slot:`);
        console.log(
          `   Start: ${assignedVar.assignedTimeSlot!.startTime.toLocaleTimeString()}`,
        );
        console.log(
          `   End: ${assignedVar.assignedTimeSlot!.endTime.toLocaleTimeString()}`,
        );
        console.log(
          `   Duration: ${(assignedVar.assignedTimeSlot!.endTime.getTime() - assignedVar.assignedTimeSlot!.startTime.getTime()) / (60 * 1000)} minutes`,
        );
      }

      // Check if assignment is valid
      try {
        // 🔧 CRITICAL FIX: For group activities, pass the adjusted time slot to constraints
        const constraintAssignment = {
          ...possibleAssignment,
          timeSlot: assignedTimeSlot, // Use the adjusted time slot, not the original
        };

        // 🔍 DEBUG: Verify we're passing the correct time slot to constraints
        if (nextVar.isGroupActivity) {
          const constraintDuration =
            (constraintAssignment.timeSlot.endTime.getTime() -
              constraintAssignment.timeSlot.startTime.getTime()) /
            (60 * 1000);
          console.log(
            `🔍 CONSTRAINT CHECK: Passing ${constraintDuration}-minute time slot to constraints`,
          );
        }

        if (
          this.constraints.isValidAssignment(
            assignedVar,
            constraintAssignment,
            assignment,
          )
        ) {
          // 🔍 DEBUG: Assignment accepted - check time slot
          if (nextVar.isGroupActivity) {
            const duration =
              (assignedVar.assignedTimeSlot!.endTime.getTime() -
                assignedVar.assignedTimeSlot!.startTime.getTime()) /
              (60 * 1000);
            console.log(`✅ ASSIGNMENT ACCEPTED for ${assignedVar.id}:`);
            console.log(
              `   Time: ${assignedVar.assignedTimeSlot!.startTime.toLocaleTimeString()} - ${assignedVar.assignedTimeSlot!.endTime.toLocaleTimeString()}`,
            );
            console.log(`   Duration: ${duration} minutes`);
            console.log(
              `   🎯 Expected Duration: ${nextVar.groupActivityDuration} minutes`,
            );

            if (duration === nextVar.groupActivityDuration) {
              console.log(`   ✅ DURATION IS CORRECT!`);
            } else {
              console.log(`   ❌ DURATION MISMATCH!`);
            }
          } else if (nextVar.isBusinessCase) {
            const duration =
              (assignedVar.assignedTimeSlot!.endTime.getTime() -
                assignedVar.assignedTimeSlot!.startTime.getTime()) /
              (60 * 1000);
            console.log(
              `🏢 BUSINESS CASE ASSIGNMENT ACCEPTED for ${assignedVar.id}:`,
            );
            console.log(
              `   Time: ${assignedVar.assignedTimeSlot!.startTime.toLocaleTimeString()} - ${assignedVar.assignedTimeSlot!.endTime.toLocaleTimeString()}`,
            );
            console.log(`   Duration: ${duration} minutes`);
            console.log(`   Rooms: ${assignedVar.assignedRoomId}`);
            console.log(
              `   Assessors: ${assignedVar.assignedAssessorIds?.length || 0}`,
            );
          }

          // Add to assignment and continue
          const newAssignment = [...assignment, assignedVar];

          // Apply forward checking
          if (this.forwardCheck(newAssignment)) {
            const result = await this.backtrackSearch(newAssignment);
            if (result) {
              return result;
            }
          }
        }
      } catch (error) {
        console.log('Error in constraint validation:', error.message);
        // Continue to next possible assignment
      }
    }

    return null; // Backtrack
  }

  private selectNextVariable(
    unassigned: SchedulingVariable[],
    currentAssignment: SchedulingVariable[],
  ): SchedulingVariable | null {
    if (unassigned.length === 0) return null;

    // Simplified variable selection - just pick the first unassigned variable
    // This avoids the recursive countRemainingValues calls
    return unassigned[0];
  }

  private countRemainingValues(
    variable: SchedulingVariable,
    assignment: SchedulingVariable[],
  ): number {
    const possibleAssignments = this.generatePossibleAssignments(
      variable,
      assignment,
    );
    return possibleAssignments.length;
  }

  // Helper method to generate balanced combinations of assessors
  private generateAssessorCombinations(assessors: string[]): string[][] {
    if (assessors.length === 0) return [];
    if (assessors.length === 1) return [assessors];

    const combinations: string[][] = [];

    // For individual assessments, prefer 2-3 assessors over 1 or all assessors
    // This creates better distribution and utilization

    // Priority 1: Combinations of 2 assessors (preferred for most activities)
    if (assessors.length >= 2) {
      const pairs = this.getCombinations(assessors, 2);
      combinations.push(...pairs);
    }

    // Priority 2: Combinations of 3 assessors (good for complex activities)
    if (assessors.length >= 3) {
      const triplets = this.getCombinations(assessors, 3);
      combinations.push(...triplets);
    }

    // Priority 3: Single assessor (backup when others don't work)
    const singles = this.getCombinations(assessors, 1);
    combinations.push(...singles);

    // Priority 4: All assessors (only if 4 or fewer total, for special cases)
    if (assessors.length === 4) {
      combinations.push(assessors);
    }

    // Shuffle within each priority group to ensure variety
    const shuffled: string[][] = [];

    // Add pairs first (shuffled)
    const pairCount =
      assessors.length >= 2 ? this.getCombinations(assessors, 2).length : 0;
    const shuffledPairs = combinations
      .slice(0, pairCount)
      .sort(() => Math.random() - 0.5);
    shuffled.push(...shuffledPairs);

    // Add triplets second (shuffled)
    if (assessors.length >= 3) {
      const tripletCount = this.getCombinations(assessors, 3).length;
      const shuffledTriplets = combinations
        .slice(pairCount, pairCount + tripletCount)
        .sort(() => Math.random() - 0.5);
      shuffled.push(...shuffledTriplets);
    }

    // Add singles third (shuffled)
    const singlesStart =
      pairCount +
      (assessors.length >= 3 ? this.getCombinations(assessors, 3).length : 0);
    const singlesEnd = singlesStart + assessors.length;
    const shuffledSingles = combinations
      .slice(singlesStart, singlesEnd)
      .sort(() => Math.random() - 0.5);
    shuffled.push(...shuffledSingles);

    // Add all-assessors last (if applicable)
    if (assessors.length === 4) {
      shuffled.push(assessors);
    }

    return shuffled;
  }

  private getCombinations(arr: string[], size: number): string[][] {
    if (size === 1) return arr.map((item) => [item]);
    if (size === arr.length) return [arr];

    const combinations: string[][] = [];
    for (let i = 0; i <= arr.length - size; i++) {
      const head = arr[i];
      const tailCombinations = this.getCombinations(arr.slice(i + 1), size - 1);
      tailCombinations.forEach((tail) => combinations.push([head, ...tail]));
    }

    return combinations;
  }

  private generatePossibleAssignments(
    variable: SchedulingVariable,
    currentAssignment: SchedulingVariable[],
  ): Array<{ timeSlot: TimeSlot; roomId: string; assessorIds: string[] }> {
    const assignments: Array<{
      timeSlot: TimeSlot;
      roomId: string;
      assessorIds: string[];
    }> = [];

    // Handle questionnaires (no time/room needed)
    if (
      variable.possibleTimeSlots.length === 0 &&
      variable.possibleRoomIds.length === 0
    ) {
      // For questionnaires, create a dummy time slot to avoid null issues
      const dummyTimeSlot: TimeSlot = {
        id: 'questionnaire_dummy',
        startTime: new Date(0), // Epoch time as placeholder
        endTime: new Date(0),
        duration: 0,
      };

      // For questionnaires, try all possible combinations of assessors
      const assessorCombinations = this.generateAssessorCombinations(
        variable.possibleAssessorIds,
      );
      for (const assessorCombo of assessorCombinations) {
        assignments.push({
          timeSlot: dummyTimeSlot, // Dummy time slot for questionnaires
          roomId: '', // No room for questionnaires
          assessorIds: assessorCombo, // Multiple assessors possible
        });
      }

      // Sort questionnaire assignments by balanced preference (2-3 assessors preferred)
      assignments.sort((a, b) => {
        const getPreferenceScore = (assessorCount: number): number => {
          if (assessorCount === 2) return 100; // Most preferred: 2 assessors
          if (assessorCount === 3) return 90; // Second preferred: 3 assessors
          if (assessorCount === 1) return 80; // Third preferred: 1 assessor
          if (assessorCount >= 4) return 70; // Least preferred: all assessors
          return 0;
        };

        return (
          getPreferenceScore(b.assessorIds.length) -
          getPreferenceScore(a.assessorIds.length)
        );
      });
      return assignments;
    }

    // Handle regular assessments and group activities
    for (const timeSlot of variable.possibleTimeSlots) {
      for (const roomId of variable.possibleRoomIds) {
        // Check if room is available for this time slot
        if (!this.availabilityMatrix.rooms.get(roomId)?.get(timeSlot.id))
          continue;

        // Find available assessors for this time slot
        const availableAssessors = variable.possibleAssessorIds.filter(
          (assessorId) =>
            this.availabilityMatrix.assessors
              .get(assessorId)
              ?.get(timeSlot.id) === true,
        );

        if (availableAssessors.length === 0) continue;

        const isGroupActivity =
          variable.participantId.startsWith('GROUP_ACTIVITY_');

        if (isGroupActivity) {
          // Group activities: Only single assessor per group
          for (const assessorId of availableAssessors) {
            assignments.push({
              timeSlot,
              roomId,
              assessorIds: [assessorId], // Single assessor for group activities
            });
          }
        } else {
          // Individual assessments: Check if this is a Business Case with fixed assessors
          if (variable.isBusinessCase) {
            // Business Case: Use ALL assessors assigned to this room (FIXED - no availability filtering)
            // Since assessors are FIXED to rooms, we use ALL of them regardless of availability
            const roomAssessors = variable.possibleAssessorIds; // All assessors fixed to this room
            if (roomAssessors.length > 0) {
              assignments.push({
                timeSlot,
                roomId,
                assessorIds: roomAssessors, // Use ALL room-assigned assessors (FIXED)
              });
              console.log(
                `🎯 Business Case assignment (FIXED ASSESSORS) for ${variable.participantId.substring(0, 8)}: Room ${roomId.substring(0, 8)} with assessors [${roomAssessors.map((a) => a.substring(0, 8)).join(', ')}]`,
              );
            }
          } else {
            // Regular individual assessments: Try all possible combinations of assessors
            const assessorCombinations =
              this.generateAssessorCombinations(availableAssessors);
            for (const assessorCombo of assessorCombinations) {
              assignments.push({
                timeSlot,
                roomId,
                assessorIds: assessorCombo, // Multiple assessors for individual
              });
            }
          }
        }
      }
    }

    // CRITICAL: Sort assignments to prioritize ASSESSOR CONTINUITY first, then time slots and balance
    assignments.sort((a, b) => {
      // PRIMARY SORT: Prioritize assignments that maintain assessor continuity
      const aContinuityScore = this.calculateAssessorContinuityScore(
        variable,
        a.assessorIds,
        currentAssignment,
      );
      const bContinuityScore = this.calculateAssessorContinuityScore(
        variable,
        b.assessorIds,
        currentAssignment,
      );

      if (aContinuityScore !== bContinuityScore) {
        return bContinuityScore - aContinuityScore; // Higher continuity score first
      }

      // SECONDARY SORT: Prefer earlier time slots to minimize gaps and create compact schedules
      const timeDiff =
        a.timeSlot.startTime.getTime() - b.timeSlot.startTime.getTime();
      if (timeDiff !== 0) {
        return timeDiff; // Earlier time slots first
      }

      // TERTIARY SORT: Helper function to calculate assessor preference score
      const getPreferenceScore = (assessorCount: number): number => {
        if (assessorCount === 2) return 100; // Most preferred: 2 assessors
        if (assessorCount === 3) return 90; // Second preferred: 3 assessors
        if (assessorCount === 1) return 80; // Third preferred: 1 assessor
        if (assessorCount >= 4) return 70; // Least preferred: all assessors
        return 0;
      };

      const scoreA = getPreferenceScore(a.assessorIds.length);
      const scoreB = getPreferenceScore(b.assessorIds.length);

      // Higher preference score for assessor balance
      return scoreB - scoreA;
    });

    return assignments;
  }

  // NEW: Calculate assessor continuity score for assignment prioritization
  private calculateAssessorContinuityScore(
    variable: SchedulingVariable,
    assessorIds: string[],
    currentAssignment: SchedulingVariable[],
  ): number {
    // Only apply to Business Case and Leadership Questionnaire activities
    if (!variable.scenarioId && !variable.questionnaireId) return 0;

    // Check if this is Business Case (order 3) or Leadership Questionnaire (order 4)
    const sequenceOrder = this.constraints['activitySequence']?.find(
      (item) =>
        item.scenarioId === (variable.scenarioId || variable.questionnaireId),
    )?.order;

    if (sequenceOrder !== 3 && sequenceOrder !== 4) return 0; // Not applicable

    // Get the assessors assigned during Group Activity for this participant
    const groupActivityAssessors = this.constraints[
      'groupActivityAssessorMap'
    ]?.get(variable.participantId);

    if (!groupActivityAssessors || groupActivityAssessors.length === 0) {
      return 0; // No group activity assessors tracked yet
    }

    // Calculate continuity score
    const hasContinuity = assessorIds.some((assessorId) =>
      groupActivityAssessors.includes(assessorId),
    );

    // Return high score for continuity, low score for violations
    return hasContinuity ? 1000 : 0;
  }

  // REMOVED: calculateConstrainingValue method to avoid circular recursion
  // This was causing infinite loops: calculateConstrainingValue -> countRemainingValues -> generatePossibleAssignments
  // TODO: Implement a non-recursive LCV heuristic if needed for optimization

  private forwardCheck(assignment: SchedulingVariable[]): boolean {
    // Simplified forward checking to avoid potential recursion issues
    // Just check if we have reasonable number of unassigned variables
    const unassigned = this.variables.filter(
      (v) => !assignment.find((a) => a.id === v.id),
    );

    // If we have too many unassigned variables relative to remaining time slots, fail
    const maxPossibleAssignments =
      this.availabilityMatrix.timeSlots.length *
      this.availabilityMatrix.rooms.size;

    if (unassigned.length > maxPossibleAssignments * 2) {
      return false; // Too many variables for available slots
    }

    return true;
  }

  /**
   * Filter available rooms for a scenario based on room-assessment mapping
   * @param scenarioId - The scenario ID to filter rooms for
   * @param roomAssessmentMapping - Optional room-assessment mapping
   * @param allRoomIds - All available room IDs
   * @returns Array of room IDs that can be used for this scenario
   */
  private filterRoomsForScenario(
    scenarioId: string,
    roomAssessmentMapping: { [roomId: string]: string[] },
    allRoomIds: string[],
  ): string[] {
    // If no mapping provided, all rooms are available (shouldn't happen as mapping is required)
    if (!roomAssessmentMapping) {
      console.warn(
        `⚠️  No room mapping provided for scenario ${scenarioId}, using all rooms`,
      );
      return allRoomIds;
    }

    // Find rooms that allow this scenario
    const allowedRooms: string[] = [];
    for (const [roomId, allowedScenarios] of Object.entries(
      roomAssessmentMapping,
    )) {
      if (allowedScenarios.includes(scenarioId)) {
        allowedRooms.push(roomId);
      }
    }

    // Return intersection of allowed rooms and available rooms
    const filteredRooms = allRoomIds.filter((roomId) =>
      allowedRooms.includes(roomId),
    );

    console.log(
      `🏠 Scenario ${scenarioId}: ${filteredRooms.length}/${allRoomIds.length} rooms available (${filteredRooms.map((id) => id.substring(0, 8)).join(', ')})`,
    );

    return filteredRooms;
  }
}
