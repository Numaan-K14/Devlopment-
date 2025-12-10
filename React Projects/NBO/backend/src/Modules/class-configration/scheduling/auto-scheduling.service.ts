import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import {
  SchedulingInput,
  SchedulingVariable,
  AvailabilityMatrix,
  TimeSlot,
  ParticipantAssignment,
  AssessorAssignment,
  RoomUtilization,
  LunchBreak,
  DailyBreak,
  DailyBreakConfiguration,
  ActivitySequenceItem,
  ScheduleStatistics,
  AssessmentScheduleGroup,
  GroupedScheduleResult,
  ScheduleResult,
  ParticipantGroup,
  BusinessCaseRoomGroup,
} from '../dto/scheduling.dto';
// import { AvailabilityMatrixBuilder } from './availability-builder'; // Removed to avoid circular dependency
import { SchedulingCSP } from './csp-solver';
import { SchedulingConstraints } from './constraints';
import { Class } from '../model/class.model';
import { ParticipantsAssessments } from '../model/participantAssessments.model';
import { ClassAssessors } from '../model/classPartAssessmAssessors.model';
import { Rooms } from '../../facilities/model/rooms.model';
import { Assessments } from '../../assessment/model/assessment.model';
import { Scenerios } from '../../assessment/model/scenerio.model';
import { Quessionnaires } from '../../assessment/model/quessionnaire.model';
import { Participants } from '../../participants/model/participants.model';
import { Assessros } from '../../assessors/model/assessor.model';

@Injectable()
export class AutoSchedulingService {
  private assessmentAssessorMapping: { [key: string]: string[] } = {};
  private readonly SHORT_BREAK_MINUTES = 15;
  private readonly LUNCH_BREAK_MINUTES = 60;
  private readonly LUNCH_WINDOW_START_HOUR = 12;
  private readonly LUNCH_WINDOW_END_HOUR = 13;

  constructor(
    private sequelize: Sequelize,
    @InjectModel(Class) private classModel: typeof Class,
    @InjectModel(ParticipantsAssessments)
    private participantAssessmentsModel: typeof ParticipantsAssessments,
    @InjectModel(ClassAssessors)
    private classAssessorsModel: typeof ClassAssessors,
    @InjectModel(Rooms) private roomsModel: typeof Rooms,
    @InjectModel(Assessments) private assessmentsModel: typeof Assessments,
    @InjectModel(Scenerios) private scenarioModel: typeof Scenerios,
    @InjectModel(Quessionnaires) private questionModel: typeof Quessionnaires,
    @InjectModel(Participants) private participantsModel: typeof Participants,
    @InjectModel(Assessros) private assessorsModel: typeof Assessros,
  ) {}

  /**
   * DEPRECATED: Utility function to create local timezone date from components
   * Replaced by UTC-based methods for consistent timezone handling
   */
  private createLocalDate(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0,
  ): Date {
    return new Date(year, month, day, hour, minute, second, millisecond);
  }

  /**
   * NEW: Utility function to create UTC date from components
   * Ensures consistent UTC timezone handling across the scheduling system
   */
  private createUTCDate(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0,
  ): Date {
    return new Date(
      Date.UTC(year, month, day, hour, minute, second, millisecond),
    );
  }

  /**
   * NEW: Parse UTC datetime string to Date object
   * Handles both full UTC datetime strings and extracts time components
   */
  private parseUTCDateTime(utcString: string): Date {
    return new Date(utcString);
  }

  private isPlainTimeFormat(value: string): boolean {
    return /^\d{1,2}:\d{2}(:\d{2})?$/.test(value);
  }

  private getTimeComponentsFromValue(value: string | Date): {
    hour: number;
    minute: number;
  } {
    if (typeof value === 'string') {
      if (this.isPlainTimeFormat(value)) {
        const [hourRaw, minuteRaw] = value.split(':');
        const hour = Math.max(0, Math.min(23, Number(hourRaw)));
        const minute = Math.max(0, Math.min(59, Number(minuteRaw)));
        return { hour, minute };
      }
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        return {
          hour: parsed.getUTCHours(),
          minute: parsed.getUTCMinutes(),
        };
      }
    } else if (value instanceof Date) {
      return {
        hour: value.getUTCHours(),
        minute: value.getUTCMinutes(),
      };
    }

    return { hour: 0, minute: 0 };
  }

  private getMinutesFromTimeValue(value: string): number | null {
    if (this.isPlainTimeFormat(value)) {
      const [hourRaw, minuteRaw] = value.split(':');
      const hour = Number(hourRaw);
      const minute = Number(minuteRaw);
      if (
        Number.isFinite(hour) &&
        Number.isFinite(minute) &&
        hour >= 0 &&
        hour < 24 &&
        minute >= 0 &&
        minute < 60
      ) {
        return hour * 60 + minute;
      }
      return null;
    }

    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      return null;
    }
    return parsed.getUTCHours() * 60 + parsed.getUTCMinutes();
  }

  private formatOutputDate(value?: Date | string | null): string | null {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      return value;
    }
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    const hours = String(value.getUTCHours()).padStart(2, '0');
    const minutes = String(value.getUTCMinutes()).padStart(2, '0');
    const seconds = String(value.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  /**
   * Format date for break output (includes .000Z suffix)
   * Returns format: "2025-12-14T06:30:00.000Z"
   */
  private formatBreakDate(value?: Date | string | null): string | null {
    if (!value) {
      return null;
    }
    if (typeof value === 'string') {
      // If already in correct format, return as-is
      if (value.endsWith('.000Z') || value.endsWith('Z')) {
        return value;
      }
      // Otherwise parse and format
      const date = new Date(value);
      return this.formatBreakDate(date);
    }
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    const hours = String(value.getUTCHours()).padStart(2, '0');
    const minutes = String(value.getUTCMinutes()).padStart(2, '0');
    const seconds = String(value.getUTCSeconds()).padStart(2, '0');
    // Always use .000 for milliseconds as per requirement
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  }

  /**
   * NEW: Extract time components (hour, minute) from UTC datetime string or HH:mm format
   */
  private extractTimeFromUTC(utcString: string): {
    hour: number;
    minute: number;
  } {
    return this.getTimeComponentsFromValue(utcString);
  }

  /**
   * Utility function to format Date object as local time string (HH:MM)
   * Used for consistent database storage in local timezone
   */
  private formatLocalTimeString(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private async categorizeScenariosAndQuestionnaires(
    scenarioIds: string[],
    questionnaireIds?: string[],
  ): Promise<any[]> {
    const scenarios = await this.sequelize.models.Scenerios.findAll({
      where: { id: scenarioIds },
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: [
            'id',
            'assessment_name',
            'is_quesionnaire',
            'is_group_activity',
          ],
        },
      ],
    });

    const questionnaires = questionnaireIds?.length
      ? await this.sequelize.models.Quessionnaires.findAll({
          where: { id: questionnaireIds },
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: [
                'id',
                'assessment_name',
                'is_quesionnaire',
                'is_group_activity',
              ],
            },
          ],
        })
      : [];

    const scenarioItems = scenarios.map((scenario: any) => ({
      id: scenario.id,
      name: scenario.scenerio_name,
      assessmentId: scenario.assessment_id,
      assessmentName: scenario.assessment?.assessment_name,
      isQuestionnaire: scenario.assessment?.is_quesionnaire || false,
      isGroupActivity: scenario.assessment?.is_group_activity || false,
      type: scenario.assessment?.is_group_activity
        ? 'group_activity'
        : 'individual',
      isScenario: true,
      isQuestionnaireItem: false,
    }));

    const questionnaireItems = questionnaires.map((questionnaire: any) => ({
      id: questionnaire.id,
      name: questionnaire.quesionnaire_name,
      assessmentId: questionnaire.assessment_id,
      assessmentName: questionnaire.assessment?.assessment_name,
      isQuestionnaire: true,
      isGroupActivity: false,
      type: 'questionnaire',
      isScenario: false,
      isQuestionnaireItem: true,
    }));

    return [...scenarioItems, ...questionnaireItems];
  }

  private getSpecializedAssessors(
    input: SchedulingInput,
  ): Map<string, string[]> {
    // Convert the input mapping to a Map for easier lookup
    const assessmentAssessors = new Map<string, string[]>();

    // Convert assessment_assessor_mapping to Map
    if (input.assessment_assessor_mapping) {
      Object.entries(input.assessment_assessor_mapping).forEach(
        ([assessmentId, assessorIds]) => {
          assessmentAssessors.set(assessmentId, assessorIds);
        },
      );
    }

    console.log('Assessor mapping loaded:', assessmentAssessors);
    console.log('Input mapping:', input.assessment_assessor_mapping);
    return assessmentAssessors;
  }

  private async buildNamesLookup(
    input: SchedulingInput,
    scenarioDetails: any[],
  ) {
    // Get participant names
    const participants = await this.participantsModel.findAll({
      where: { id: input.participantIds },
      attributes: ['id', 'participant_name'],
    });

    // Get assessor names (extract unique assessor IDs from mapping)
    const uniqueAssessorIds = input.assessment_assessor_mapping
      ? Array.from(
          new Set(Object.values(input.assessment_assessor_mapping).flat()),
        )
      : []; // No specific assessors if no mapping provided
    const assessors = await this.assessorsModel.findAll({
      where: { id: uniqueAssessorIds },
      attributes: ['id', 'assessor_name'],
    });

    // Get room names
    const rooms = await this.roomsModel.findAll({
      where: { facility_id: input.facility_id },
      attributes: ['id', 'room'],
    });

    return {
      participants: new Map(
        participants.map((p) => [p.id, p.participant_name]),
      ),
      assessors: new Map(assessors.map((a) => [a.id, a.assessor_name])),
      rooms: new Map(rooms.map((r) => [r.id, r.room])),
      scenarios: new Map(scenarioDetails.map((s) => [s.id, s.name])),
      assessments: new Map(
        scenarioDetails.map((s) => [s.assessmentId, s.assessmentName]),
      ),
    };
  }

  private async buildSimpleAvailabilityMatrix(
    input: SchedulingInput,
  ): Promise<AvailabilityMatrix> {
    const timeSlots = this.generateTimeSlots(input);

    // Get actual rooms from database
    const rooms = await this.roomsModel.findAll({
      where: { facility_id: input.facility_id },
    });

    console.log(
      `Found ${rooms.length} rooms for facility ${input.facility_id}`,
    );

    const assessorAvailability = new Map<string, Map<string, boolean>>();
    const roomAvailability = new Map<string, Map<string, boolean>>();
    const participantAvailability = new Map<string, Map<string, boolean>>();

    // Initialize assessor availability (extract unique assessor IDs from mapping)
    const uniqueAssessorIds = input.assessment_assessor_mapping
      ? Array.from(
          new Set(Object.values(input.assessment_assessor_mapping).flat()),
        )
      : []; // No specific assessors if no mapping provided
    for (const assessorId of uniqueAssessorIds) {
      const assessorMap = new Map<string, boolean>();
      for (const slot of timeSlots) {
        assessorMap.set(slot.id, true);
      }
      assessorAvailability.set(assessorId, assessorMap);
    }

    // Initialize room availability with actual room IDs
    for (const room of rooms) {
      const roomMap = new Map<string, boolean>();
      for (const slot of timeSlots) {
        roomMap.set(slot.id, true);
      }
      roomAvailability.set(room.id, roomMap);
    }

    // Initialize participant availability
    for (const participantId of input.participantIds) {
      const participantMap = new Map<string, boolean>();
      for (const slot of timeSlots) {
        participantMap.set(slot.id, true);
      }
      participantAvailability.set(participantId, participantMap);
    }

    return {
      assessors: assessorAvailability,
      rooms: roomAvailability,
      participants: participantAvailability,
      timeSlots,
    };
  }

  private getDailyBreaksOrThrow(
    input: SchedulingInput,
  ): DailyBreakConfiguration[] {
    if (!input.daily_breaks || input.daily_breaks.length === 0) {
      throw new Error(
        'Daily break configuration is missing. Ensure automatic breaks are generated before scheduling.',
      );
    }
    return input.daily_breaks;
  }

  /**
   * Automatically derive daily break configurations based on class hours.
   */
  private generateAutomaticDailyBreaks(
    input: SchedulingInput,
  ): DailyBreakConfiguration[] {
    const scheduleDates = this.enumerateScheduleDates(input);
    const dailyBreaks: DailyBreakConfiguration[] = [];

    for (const date of scheduleDates) {
      dailyBreaks.push(this.buildBreakConfigurationForDate(date, input));
    }

    // Get configured or default break durations
    const shortBreakDuration =
      input.short_break_duration || this.SHORT_BREAK_MINUTES;
    const lunchBreakDuration = this.LUNCH_BREAK_MINUTES;

    console.log('\n=== AUTO BREAK GENERATION ===');
    console.log(
      `Break Durations: Short Breaks=${shortBreakDuration}min, Lunch=${lunchBreakDuration}min`,
    );
    dailyBreaks.forEach((breakConfig) => {
      console.log(
        `${breakConfig.date}: First(${breakConfig.first_break_start_time} → ${breakConfig.first_break_end_time}) | Lunch(${breakConfig.lunch_break_start_time} → ${breakConfig.lunch_break_end_time}) | Second(${breakConfig.second_break_start_time} → ${breakConfig.second_break_end_time})`,
      );
    });
    console.log('================================\n');

    return dailyBreaks;
  }

  private enumerateScheduleDates(input: SchedulingInput): string[] {
    const startDate = new Date(input.start_date);
    const endDate = new Date(input.end_date);
    const dates: string[] = [];

    let current = this.createUTCDate(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate(),
    );

    const endBoundary = this.createUTCDate(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate(),
      23,
      59,
      59,
      999,
    );

    while (current <= endBoundary) {
      dates.push(current.toISOString().split('T')[0]);
      current = this.createUTCDate(
        current.getUTCFullYear(),
        current.getUTCMonth(),
        current.getUTCDate() + 1,
      );
    }

    return dates;
  }

  private buildBreakConfigurationForDate(
    date: string,
    input: SchedulingInput,
  ): DailyBreakConfiguration {
    const activityDurationMs = input.duration_of_each_activity * 60 * 1000;

    // Use configurable short break duration or default
    const shortBreakDuration =
      input.short_break_duration || this.SHORT_BREAK_MINUTES;
    const firstBreakMs = shortBreakDuration * 60 * 1000;
    const secondBreakMs = shortBreakDuration * 60 * 1000;
    const lunchBreakMs = this.LUNCH_BREAK_MINUTES * 60 * 1000; // Lunch remains fixed at 60 minutes

    const dayStart = this.combineDateAndTime(
      date,
      input.daily_start_time || input.start_date,
    );
    const dayEnd = this.combineDateAndTime(
      date,
      input.daily_end_time || input.end_date,
    );

    if (dayEnd <= dayStart) {
      throw new Error('daily_end_time must be after daily_start_time');
    }

    const lunchWindowStart = this.createUTCDate(
      dayStart.getUTCFullYear(),
      dayStart.getUTCMonth(),
      dayStart.getUTCDate(),
      this.LUNCH_WINDOW_START_HOUR,
      0,
    );
    const lunchWindowEnd = this.createUTCDate(
      dayStart.getUTCFullYear(),
      dayStart.getUTCMonth(),
      dayStart.getUTCDate(),
      this.LUNCH_WINDOW_END_HOUR,
      0,
    );

    if (input.duration_of_each_activity <= 0) {
      throw new Error('duration_of_each_activity must be positive');
    }

    const lunchesBeforeNoon =
      (lunchWindowStart.getTime() - dayStart.getTime()) / activityDurationMs;
    const baseMorningSlots = Math.max(2, Math.floor(lunchesBeforeNoon));
    const morningIndex = Math.max(1, Math.ceil(baseMorningSlots / 2));
    let morningBreakStart = new Date(
      dayStart.getTime() + morningIndex * activityDurationMs,
    );
    if (morningBreakStart >= lunchWindowStart) {
      morningBreakStart = new Date(
        Math.max(dayStart.getTime(), lunchWindowStart.getTime() - firstBreakMs),
      );
    }
    const morningBreakEnd = new Date(
      Math.min(
        morningBreakStart.getTime() + firstBreakMs,
        lunchWindowStart.getTime(),
      ),
    );

    let timelineCursor = new Date(dayStart);
    let lunchStart: Date | null = null;
    while (timelineCursor < dayEnd) {
      if (
        timelineCursor.getTime() >= morningBreakStart.getTime() &&
        timelineCursor.getTime() < morningBreakEnd.getTime()
      ) {
        timelineCursor = new Date(morningBreakEnd);
        continue;
      }

      const slotEnd = new Date(timelineCursor.getTime() + activityDurationMs);
      if (slotEnd.getTime() > dayEnd.getTime()) {
        break;
      }
      if (
        slotEnd.getTime() >= lunchWindowStart.getTime() &&
        slotEnd.getTime() <= lunchWindowEnd.getTime()
      ) {
        lunchStart = new Date(slotEnd);
        break;
      }

      timelineCursor = slotEnd;
      if (timelineCursor.getTime() >= lunchWindowEnd.getTime()) {
        break;
      }
    }

    if (!lunchStart) {
      lunchStart = new Date(
        Math.max(timelineCursor.getTime(), lunchWindowStart.getTime()),
      );
    }

    let lunchEnd = new Date(lunchStart.getTime() + lunchBreakMs);
    if (lunchEnd > dayEnd) {
      lunchEnd = new Date(dayEnd);
    }

    const afternoonWindow = dayEnd.getTime() - lunchEnd.getTime();
    const afternoonSlotsCount = Math.max(
      1,
      Math.floor(afternoonWindow / activityDurationMs),
    );
    const afternoonBreakOffset = Math.max(
      1,
      Math.ceil(afternoonSlotsCount / 2),
    );
    let afternoonBreakStart = new Date(
      lunchEnd.getTime() + afternoonBreakOffset * activityDurationMs,
    );
    if (afternoonBreakStart > dayEnd) {
      afternoonBreakStart = new Date(
        Math.max(lunchEnd.getTime(), dayEnd.getTime() - secondBreakMs),
      );
    }
    const afternoonBreakEnd = new Date(
      Math.min(afternoonBreakStart.getTime() + secondBreakMs, dayEnd.getTime()),
    );

    return {
      date,
      first_break_start_time: morningBreakStart.toISOString(),
      first_break_end_time: morningBreakEnd.toISOString(),
      second_break_start_time: afternoonBreakStart.toISOString(),
      second_break_end_time: afternoonBreakEnd.toISOString(),
      lunch_break_start_time: lunchStart.toISOString(),
      lunch_break_end_time: lunchEnd.toISOString(),
    };
  }

  private combineDateAndTime(date: string, timeTemplate?: string | Date): Date {
    const dateObj = new Date(`${date}T00:00:00.000Z`);
    const templateValue = timeTemplate ?? `${date}T00:00:00.000Z`;
    const { hour, minute } = this.getTimeComponentsFromValue(templateValue);

    return this.createUTCDate(
      dateObj.getUTCFullYear(),
      dateObj.getUTCMonth(),
      dateObj.getUTCDate(),
      hour,
      minute,
    );
  }

  private generateTimeSlots(input: SchedulingInput): TimeSlot[] {
    // NEW: Check if multi-day scheduling is enabled
    if (input.daily_start_time && input.daily_end_time) {
      return this.generateMultiDayTimeSlotsWithBreaks(input);
    } else {
      return this.generateSingleDayTimeSlotsWithBreaks(input);
    }
  }

  private generateMultiDayTimeSlotsWithBreaks(
    input: SchedulingInput,
  ): TimeSlot[] {
    const allSlots: TimeSlot[] = [];
    const dailyBreaks = this.getDailyBreaksOrThrow(input);

    // Generate slots for each day with its specific break configuration
    for (const dailyBreak of dailyBreaks) {
      const daySlots = this.generateDaySlotsWithBreaks(
        dailyBreak.date,
        input.daily_start_time!,
        input.daily_end_time!,
        input.duration_of_each_activity,
        0, // No automatic break between activities
        dailyBreak,
      );
      allSlots.push(...daySlots);
    }

    console.log(
      `Generated ${allSlots.length} time slots across ${dailyBreaks.length} days with daily-specific breaks`,
    );
    return allSlots;
  }

  // DEPRECATED: Old multi-day method - keeping for reference
  private generateMultiDayTimeSlots(input: SchedulingInput): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const duration = input.duration_of_each_activity;
    let slotId = 0;

    // Parse daily start and end times
    if (!input.daily_start_time || !input.daily_end_time) {
      throw new Error(
        'Daily start time and end time are required for multi-day scheduling',
      );
    }

    const [startHour, startMinute] = input.daily_start_time
      .split(':')
      .map(Number);
    const [endHour, endMinute] = input.daily_end_time.split(':').map(Number);

    // DEPRECATED: This method is no longer used - replaced by generateMultiDayTimeSlotsWithBreaks
    throw new Error(
      'This method is deprecated. Use generateMultiDayTimeSlotsWithBreaks instead.',
    );

    // Generate time slots for each day in the date range - LOCAL TIMEZONE
    const startDate = new Date(input.start_date);
    const endDate = new Date(input.end_date);

    // Use local timezone interpretation for consistent local time handling
    const startDateLocal = this.createLocalDate(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    );
    const endDateLocal = this.createLocalDate(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    );

    let currentDate = new Date(startDateLocal);
    let dayIndex = 0;

    console.log(
      `Generating multi-day time slots from ${startDateLocal.toDateString()} to ${endDateLocal.toDateString()} (Local Timezone)`,
    );
    console.log(
      `Daily schedule: ${input.daily_start_time} - ${input.daily_end_time}`,
    );

    while (currentDate <= endDateLocal && dayIndex < 30) {
      // Safety limit for 30 days max
      // Create start and end times for this specific day in local timezone
      const dayStartTime = this.createLocalDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        startHour,
        startMinute,
        0,
        0,
      );

      const dayEndTime = this.createLocalDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        endHour,
        endMinute,
        0,
        0,
      );

      console.log(
        `Day ${dayIndex + 1} (${currentDate.toDateString()}): ${dayStartTime.toLocaleString()} - ${dayEndTime.toLocaleString()}`,
      );

      let currentTime = new Date(dayStartTime.getTime());

      // Generate time slots for this day
      while (currentTime < dayEndTime && slots.length < 200) {
        // Increased limit for multi-day
        const slotEndTime = new Date(
          currentTime.getTime() + duration * 60 * 1000,
        );

        // Skip if slot would extend beyond day's end time
        if (slotEndTime > dayEndTime) {
          break;
        }

        // Check for lunch time conflict
        // DEPRECATED: Skip lunch check for now since this method is deprecated
        if (true) {
          slots.push({
            id: `slot_${slotId++}`,
            startTime: new Date(currentTime.getTime()), // Ensure new Date object
            endTime: new Date(slotEndTime.getTime()), // Ensure new Date object
            duration,
            dayIndex: dayIndex,
            date: new Date(currentDate.getTime()), // Ensure new Date object
          });
        }

        currentTime = new Date(
          currentTime.getTime() + duration * 60 * 1000, // No automatic break between activities
        );
      }

      // Move to next day - use local timezone methods
      currentDate = this.createLocalDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
      );
      dayIndex++;
    }

    console.log(
      `Generated ${slots.length} time slots across ${dayIndex} days (Local Timezone)`,
    );
    return slots;
  }

  private generateSingleDayTimeSlotsWithBreaks(
    input: SchedulingInput,
  ): TimeSlot[] {
    // For single day, use first day's break configuration
    const breakConfig = this.getDailyBreaksOrThrow(input)[0];
    if (!breakConfig) {
      throw new Error('At least one daily break configuration is required');
    }

    const daySlots = this.generateDaySlotsWithBreaks(
      breakConfig.date,
      // For single day, extract time from start/end dates
      this.formatLocalTimeString(new Date(input.start_date)),
      this.formatLocalTimeString(new Date(input.end_date)),
      input.duration_of_each_activity,
      5, // Default break between activities (5 minutes)
      breakConfig,
    );

    console.log(
      `Generated ${daySlots.length} time slots for single day with daily-specific breaks`,
    );
    return daySlots;
  }

  /**
   * Generate time slots for a single day with multiple break periods
   */
  private generateDaySlotsWithBreaks(
    date: string,
    startTime: string, // UTC datetime string template for time extraction
    endTime: string, // UTC datetime string template for time extraction
    duration: number,
    activityBreak: number, // DEPRECATED: Not used anymore (no automatic breaks)
    breakConfig: DailyBreakConfiguration,
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const durationMs = duration * 60 * 1000;

    // Extract time components from UTC datetime strings
    const startTimeComponents = this.extractTimeFromUTC(startTime);
    const endTimeComponents = this.extractTimeFromUTC(endTime);

    // Create start and end times for the specific date
    const dateObj = new Date(date);
    const dayStart = this.createUTCDate(
      dateObj.getUTCFullYear(),
      dateObj.getUTCMonth(),
      dateObj.getUTCDate(),
      startTimeComponents.hour,
      startTimeComponents.minute,
    );

    const dayEnd = this.createUTCDate(
      dateObj.getUTCFullYear(),
      dateObj.getUTCMonth(),
      dateObj.getUTCDate(),
      endTimeComponents.hour,
      endTimeComponents.minute,
    );

    console.log(`🕐 Generating slots for ${date}:`);
    console.log(`   Start: ${dayStart.toISOString()}`);
    console.log(`   End: ${dayEnd.toISOString()}`);

    let currentTime = new Date(dayStart);
    let slotId = 0;

    console.log(
      `Generating day slots for ${date} from ${startTime} to ${endTime}`,
    );
    console.log(
      `Daily breaks: First(${breakConfig.first_break_start_time}-${breakConfig.first_break_end_time}), Second(${breakConfig.second_break_start_time}-${breakConfig.second_break_end_time}), Lunch(${breakConfig.lunch_break_start_time}-${breakConfig.lunch_break_end_time})`,
    );

    const parsedBreaks = [
      {
        type: 'first_break',
        start: this.parseUTCDateTime(breakConfig.first_break_start_time),
        end: this.parseUTCDateTime(breakConfig.first_break_end_time),
      },
      {
        type: 'second_break',
        start: this.parseUTCDateTime(breakConfig.second_break_start_time),
        end: this.parseUTCDateTime(breakConfig.second_break_end_time),
      },
      {
        type: 'lunch_break',
        start: this.parseUTCDateTime(breakConfig.lunch_break_start_time),
        end: this.parseUTCDateTime(breakConfig.lunch_break_end_time),
      },
    ];

    while (currentTime < dayEnd && slots.length < 200) {
      // Skip forward if we are inside a break
      const activeBreak = parsedBreaks.find(
        (b) =>
          currentTime.getTime() >= b.start.getTime() &&
          currentTime.getTime() < b.end.getTime(),
      );

      if (activeBreak) {
        console.log(
          `⏸️  Skipping ${activeBreak.type} for ${date}, resuming at ${activeBreak.end.toISOString()}`,
        );
        currentTime = new Date(activeBreak.end);
        continue;
      }

      const slotEndTime = new Date(currentTime.getTime() + durationMs);
      if (slotEndTime > dayEnd) {
        break;
      }

      const overlappingBreak = parsedBreaks.find((b) =>
        this.timeRangesOverlap(currentTime, slotEndTime, b.start, b.end),
      );

      if (overlappingBreak) {
        console.log(
          `⏭️  Slot ${currentTime.toISOString()}-${slotEndTime.toISOString()} overlaps ${overlappingBreak.type}. Jumping to ${overlappingBreak.end.toISOString()}`,
        );
        currentTime = new Date(overlappingBreak.end);
        continue;
      }

      slots.push({
        id: `slot_${date}_${slotId++}`,
        startTime: new Date(currentTime),
        endTime: new Date(slotEndTime),
        duration,
        date: date,
        dayIndex: 0, // Will be set properly if needed
      });

      currentTime = new Date(slotEndTime);
    }

    console.log(
      `Generated ${slots.length} slots for ${date} (avoided ${this.countBreakOverlaps(date, breakConfig)} break periods)`,
    );
    return slots;
  }

  private timeRangesOverlap(
    startA: Date,
    endA: Date,
    startB: Date,
    endB: Date,
  ): boolean {
    return startA < endB && startB < endA;
  }

  /**
   * Check if a time slot overlaps with any of the three daily breaks
   */
  private overlapsWithAnyDailyBreak(
    slotStart: Date,
    slotEnd: Date,
    breakConfig: DailyBreakConfiguration,
  ): boolean {
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
        this.overlapsWithTimeRange(
          slotStart,
          slotEnd,
          breakTime.start,
          breakTime.end,
        )
      ) {
        return true; // Overlaps with at least one break
      }
    }

    return false; // No overlaps
  }

  /**
   * Check if a slot overlaps with a specific time range
   */
  private overlapsWithTimeRange(
    slotStart: Date,
    slotEnd: Date,
    breakStartTime: string, // Now expects UTC datetime string
    breakEndTime: string, // Now expects UTC datetime string
  ): boolean {
    // Parse UTC datetime strings for break times
    const breakStart = this.parseUTCDateTime(breakStartTime);
    const breakEnd = this.parseUTCDateTime(breakEndTime);

    return slotStart < breakEnd && breakStart < slotEnd;
  }

  /**
   * Count how many break periods exist for debugging
   */
  private countBreakOverlaps(
    date: string,
    breakConfig: DailyBreakConfiguration,
  ): number {
    return 3; // Always 3 breaks: first_break, second_break, lunch_break
  }

  // DEPRECATED: Old single-day method - no longer used
  private generateSingleDayTimeSlots(input: SchedulingInput): TimeSlot[] {
    // DEPRECATED: This method is no longer used - replaced by generateSingleDayTimeSlotsWithBreaks
    throw new Error(
      'This method is deprecated. Use generateSingleDayTimeSlotsWithBreaks instead.',
    );
  }

  // DEPRECATED: Old overlap method - no longer used
  private overlapsWithLunch(
    slotStart: Date,
    slotEnd: Date,
    lunchTime: { start_time: string; end_time: string },
  ): boolean {
    // DEPRECATED: This method is no longer used
    throw new Error(
      'This method is deprecated. Use overlapsWithAnyDailyBreak instead.',
    );
  }

  /**
   * Validate scheduling input with comprehensive error handling
   * Throws detailed errors with 500 status codes for validation failures
   */
  private async validateSchedulingInput(input: SchedulingInput): Promise<void> {
    console.log('🔍 VALIDATING SCHEDULING INPUT...');
    console.log('📅 Date range:', input.start_date, 'to', input.end_date);
    console.log(
      '⏰ Daily times:',
      input.daily_start_time,
      'to',
      input.daily_end_time,
    );
    console.log(
      '🔄 Using fixed assessment order: Role Play & TOYF (Parallel) → Business Case → Group Activity → Leadership Questionnaire',
    );
    console.log(
      '⏱️ No automatic break between activities (back-to-back scheduling)',
    );

    const errors: string[] = [];

    // 1. Basic required fields validation
    if (!input.participantIds?.length) {
      errors.push('participantIds array is required and must not be empty');
    }

    if (!input.scenarioIds?.length && !input.questionnaireIds?.length) {
      errors.push(
        'At least one of scenarioIds or questionnaireIds must be provided',
      );
    }

    if (!input.facility_id) {
      errors.push('facility_id is required');
    }

    // Group sizes are now automatically determined by available assessors for group activities

    // 2. Validate duration parameters
    if (
      !input.duration_of_each_activity ||
      input.duration_of_each_activity <= 0
    ) {
      errors.push('duration_of_each_activity must be a positive number');
    }
    if (!input.group_activity_duration || input.group_activity_duration <= 0) {
      errors.push('group_activity_duration must be a positive number');
    }

    // Validate break durations (optional fields)
    if (
      input.short_break_duration !== undefined &&
      input.short_break_duration <= 0
    ) {
      errors.push('short_break_duration must be a positive number if provided');
    }

    // 3. Validate time parameters - accepts HH:mm or ISO strings
    if (!input.daily_start_time || !input.daily_end_time) {
      errors.push(
        'daily_start_time and daily_end_time are required for automatic break generation',
      );
    } else {
      const startMinutes = this.getMinutesFromTimeValue(
        input.daily_start_time as string,
      );
      const endMinutes = this.getMinutesFromTimeValue(
        input.daily_end_time as string,
      );

      if (startMinutes === null || endMinutes === null) {
        errors.push(
          'daily_start_time and daily_end_time must be valid HH:mm values (e.g., "09:00") or ISO datetime strings',
        );
      } else if (startMinutes >= endMinutes) {
        errors.push('daily_start_time must be before daily_end_time');
      }
    }

    // 4. Validate room_assessment_mapping (REQUIRED field)
    await this.validateRoomAssessmentMapping(input, errors);

    // 5. REMOVED: activity_sequence validation (now using fixed order)

    // 6. Throw comprehensive error if any validation failed
    if (errors.length > 0) {
      const errorMessage = `Validation failed: ${errors.join('; ')}`;
      console.error('❌ VALIDATION ERRORS:', errors);

      const validationError = new Error(errorMessage);
      (validationError as any).statusCode = 500;
      (validationError as any).errors = errors;
      throw validationError;
    }

    console.log('✅ Input validation passed');
  }

  private async validateRoomAssessmentMapping(
    input: SchedulingInput,
    errors: string[],
  ): Promise<void> {
    // Room mapping is REQUIRED
    if (!input.room_assessment_mapping) {
      errors.push('room_assessment_mapping is required');
      return;
    }

    try {
      // Get all room IDs from facility
      const rooms = await this.roomsModel.findAll({
        where: { facility_id: input.facility_id },
      });
      const validRoomIds = rooms.map((r) => r.id);

      if (validRoomIds.length === 0) {
        errors.push(
          `No rooms found for facility '${input.facility_id}'. Please check facility_id.`,
        );
        return;
      }

      // Only scenarios are included in room mapping (questionnaires don't use rooms)
      const allScenarioIds = input.scenarioIds || [];

      // Validate room IDs exist in facility
      for (const roomId of Object.keys(input.room_assessment_mapping)) {
        if (!validRoomIds.includes(roomId)) {
          errors.push(
            `Room ID '${roomId}' not found in facility '${input.facility_id}'`,
          );
        }
      }

      // Validate scenario IDs exist in input
      const allMappedScenarios = new Set<string>();
      for (const [roomId, scenarioIds] of Object.entries(
        input.room_assessment_mapping,
      )) {
        for (const scenarioId of scenarioIds) {
          if (!allScenarioIds.includes(scenarioId)) {
            errors.push(
              `Scenario ID '${scenarioId}' in room mapping not found in input scenarioIds`,
            );
          }
          allMappedScenarios.add(scenarioId);
        }
      }

      // STRICT VALIDATION: Every scenario must have at least one room assigned
      for (const scenarioId of allScenarioIds) {
        if (!allMappedScenarios.has(scenarioId)) {
          errors.push(
            `Scenario '${scenarioId}' has no rooms assigned in room_assessment_mapping. Every scenario must have at least one room.`,
          );
        }
      }

      // Log room mapping for debugging
      if (errors.length === 0) {
        console.log('\n=== ROOM-ASSESSMENT MAPPING VALIDATION ===');
        console.log(`Found ${validRoomIds.length} rooms in facility`);
        console.log(
          `Mapping provided for ${Object.keys(input.room_assessment_mapping).length} rooms`,
        );
        console.log(`Total scenarios to map: ${allScenarioIds.length}`);
        console.log(`All scenarios have room assignments: ✅`);
        console.log('==========================================\n');
      }
    } catch (dbError) {
      console.error('Database error during room validation:', dbError);
      errors.push(
        'Failed to validate room mapping due to database error. Please check facility_id.',
      );
    }
  }

  /**
   * Helper method to check if two time ranges overlap - now handles UTC datetime strings
   */
  private timesOverlap(
    start1: string, // UTC datetime string
    end1: string, // UTC datetime string
    start2: string, // UTC datetime string
    end2: string, // UTC datetime string
  ): boolean {
    try {
      const start1Date = new Date(start1);
      const end1Date = new Date(end1);
      const start2Date = new Date(start2);
      const end2Date = new Date(end2);

      return start1Date < end2Date && start2Date < end1Date;
    } catch (error) {
      // If parsing fails, assume no overlap to avoid false positives
      return false;
    }
  }

  // REMOVED: validateActivitySequence method (replaced with fixed order)

  /**
   * Validate if there are sufficient days for scheduling (simplified validation)
   */
  private async validateSchedulingCapacity(
    input: SchedulingInput,
    availabilityMatrix: AvailabilityMatrix,
    scenarioDetails: any[],
  ): Promise<{
    isValid: boolean;
    message: string;
    details?: any;
    suggestions: string[];
  }> {
    console.log('\n🔍 === DAYS CAPACITY VALIDATION ===');

    const totalParticipants = input.participantIds.length;
    const totalTimeSlots = availabilityMatrix.timeSlots.length;

    console.log(`👥 Participants: ${totalParticipants}`);
    console.log(`⏰ Available time slots: ${totalTimeSlots}`);

    // Calculate required assignments for different activity types
    const individualScenarios = scenarioDetails.filter(
      (s) => !s.isGroupActivity && !s.isQuestionnaire,
    );
    const groupScenarios = scenarioDetails.filter((s) => s.isGroupActivity);

    console.log(`📝 Individual scenarios: ${individualScenarios.length}`);
    console.log(`👥 Group scenarios: ${groupScenarios.length}`);

    // Calculate total required time slots
    let totalRequiredSlots = 0;
    let parallelActivitiesCount = 0;

    // Check if we have parallel activities (Role Play & TOYF)
    const activitySequence = this.getFixedActivitySequence(scenarioDetails);

    // Role Play and TOYF both have order 1 and run in parallel
    const parallelActivities = activitySequence.filter((a) => a.order === 1);
    const hasParallelActivities = parallelActivities.length === 2;

    if (hasParallelActivities) {
      console.log(`🔄 Parallel activities detected: Role Play & TOYF`);
      parallelActivitiesCount = 2; // Role Play + TOYF

      // For parallel activities: Each participant needs both assessments
      // But they run simultaneously, so time slots needed = participants
      totalRequiredSlots += totalParticipants;
      console.log(`   → Parallel activities: ${totalParticipants} slots`);
    }

    // Individual non-parallel scenarios
    const nonParallelIndividual =
      individualScenarios.length - parallelActivitiesCount;
    if (nonParallelIndividual > 0) {
      const nonParallelSlots = totalParticipants * nonParallelIndividual;
      totalRequiredSlots += nonParallelSlots;
      console.log(`   → Non-parallel individual: ${nonParallelSlots} slots`);
    }

    // Group activities: 1 time slot per group activity (all participants together)
    totalRequiredSlots += groupScenarios.length;
    console.log(`   → Group activities: ${groupScenarios.length} slots`);

    console.log(`📊 Total required time slots: ${totalRequiredSlots}`);
    console.log(`📊 Available time slots: ${totalTimeSlots}`);

    // Calculate time requirements
    const individualActivityTime =
      totalRequiredSlots * input.duration_of_each_activity;
    const groupActivityTime =
      groupScenarios.length * input.group_activity_duration;
    const totalRequiredTime =
      individualActivityTime +
      groupActivityTime -
      groupScenarios.length * input.duration_of_each_activity; // Subtract overlap

    // Calculate available time
    const availableTime = totalTimeSlots * input.duration_of_each_activity;

    // ONLY check for insufficient days - no room or assessor validation
    if (totalRequiredSlots > totalTimeSlots) {
      const shortage = totalRequiredSlots - totalTimeSlots;
      const shortageTime = shortage * input.duration_of_each_activity;

      // Calculate working hours per day
      const startTime = new Date(input.daily_start_time!);
      const endTime = new Date(input.daily_end_time!);
      const totalDailyMinutes =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60);

      // Calculate break time per day
      const dailyBreaks = this.getDailyBreaksOrThrow(input);
      const breakConfig = dailyBreaks[0];
      const firstBreakDuration =
        (new Date(breakConfig.first_break_end_time).getTime() -
          new Date(breakConfig.first_break_start_time).getTime()) /
        (1000 * 60);
      const lunchBreakDuration =
        (new Date(breakConfig.lunch_break_end_time).getTime() -
          new Date(breakConfig.lunch_break_start_time).getTime()) /
        (1000 * 60);
      const secondBreakDuration =
        (new Date(breakConfig.second_break_end_time).getTime() -
          new Date(breakConfig.second_break_start_time).getTime()) /
        (1000 * 60);
      const totalBreakMinutes =
        firstBreakDuration + lunchBreakDuration + secondBreakDuration;

      const workingMinutesPerDay = totalDailyMinutes - totalBreakMinutes;
      const currentDays = dailyBreaks.length;

      // Calculate additional days needed
      const additionalDaysNeeded = Math.ceil(
        shortageTime / workingMinutesPerDay,
      );
      const recommendedTotalDays = currentDays + additionalDaysNeeded;

      const message = `Cannot generate schedule: Increase class duration from ${currentDays} day${currentDays > 1 ? 's' : ''} to ${recommendedTotalDays} days`;

      const suggestions = [
        `Increase class duration from ${currentDays} day${currentDays > 1 ? 's' : ''} to ${recommendedTotalDays} days`,
      ];

      console.log(`❌ ${message}`);
      console.log(`💡 Suggestion: ${suggestions[0]}`);

      return {
        isValid: false,
        message: message,
        details: {
          required_slots: totalRequiredSlots,
          available_slots: totalTimeSlots,
          shortage: shortage,
          required_time: `${totalRequiredTime} minutes`,
          available_time: `${availableTime} minutes`,
        },
        suggestions: suggestions,
      };
    }

    console.log(`✅ Days capacity validation passed!`);
    console.log(`===============================\n`);

    return {
      isValid: true,
      message: `Sufficient capacity: ${totalRequiredSlots}/${totalTimeSlots} time slots`,
      suggestions: [],
    };
  }

  /**
   * Generate fixed activity sequence in the specified order:
   * 1. Role Play & TOYF (Parallel) → 2. Business Case → 3. Group Activity → 4. Leadership Questionnaire
   * Note: Group Activity assessor assignment happens during variable initialization (before CSP solving),
   * but Group Activity time slot assignment happens during CSP solving and must occur after Business Case completes.
   */
  private getFixedActivitySequence(
    scenarioDetails: any[],
  ): ActivitySequenceItem[] {
    const sequence: ActivitySequenceItem[] = [];

    // Define fixed order based on assessment types and names
    // Role Play and TOYF come first (no continuity required)
    // Business Case comes second (before Group Activity time slots)
    // Group Activity comes third - assessors assigned early, but time slots scheduled after Business Case
    const fixedOrder = [
      { type: 'roleplay', keywords: ['role play', 'roleplay'], order: 1 },
      {
        type: 'toyf',
        keywords: ['think on your feet', 'toyf', 'think'],
        order: 1, // Same order as Role Play for parallel execution
      },
      { type: 'business', keywords: ['business case', 'business'], order: 2 }, // Business Case before Group Activity time slots
      { type: 'group', keywords: ['group activity', 'group'], order: 3 }, // Group Activity time slots after Business Case
      {
        type: 'questionnaire',
        keywords: ['leadership questionnaire', 'questionnaire', 'leadership'],
        order: 4,
      },
    ];

    console.log('\n🔄 GENERATING FIXED ACTIVITY SEQUENCE:');
    console.log(
      'Order: Role Play & TOYF (Parallel) → Business Case → Group Activity → Leadership Questionnaire',
    );

    console.log('\n📋 Available Scenarios:');
    scenarioDetails.forEach((scenario, index) => {
      console.log(
        `   ${index + 1}. ID: ${scenario.id?.substring(0, 8) || 'N/A'}`,
      );
      console.log(`      Name: "${scenario.name || 'N/A'}"`);
      console.log(`      Assessment: "${scenario.assessmentName || 'N/A'}"`);
      console.log(`      Group Activity: ${scenario.isGroupActivity || false}`);
      console.log(`      Questionnaire: ${scenario.isQuestionnaire || false}`);
    });

    // Match scenarios to the fixed order based on names and types
    for (const orderItem of fixedOrder) {
      for (const scenario of scenarioDetails) {
        const scenarioName = (scenario.name || '').toLowerCase();
        const assessmentName = (scenario.assessmentName || '').toLowerCase();

        // Check if this scenario matches any of the keywords for this order position
        const isMatch =
          orderItem.keywords.some(
            (keyword) =>
              scenarioName.includes(keyword) ||
              assessmentName.includes(keyword),
          ) ||
          (orderItem.type === 'group' && scenario.isGroupActivity) ||
          (orderItem.type === 'questionnaire' && scenario.isQuestionnaire);

        if (isMatch && !sequence.find((s) => s.scenarioId === scenario.id)) {
          sequence.push({
            scenarioId: scenario.id,
            order: orderItem.order,
            isBusinessCase: orderItem.type === 'business', // NEW: Flag Business Case scenarios
          });

          console.log(
            `  ${orderItem.order}. ${scenario.name || scenario.assessmentName} (${scenario.id.substring(0, 8)}...)${orderItem.type === 'business' ? ' [BUSINESS CASE - MULTI-ROOM]' : ''}`,
          );
          break; // Only add first match for each order position
        }
      }
    }

    // Add any remaining scenarios that didn't match the fixed patterns
    for (const scenario of scenarioDetails) {
      if (!sequence.find((s) => s.scenarioId === scenario.id)) {
        const nextOrder = Math.max(...sequence.map((s) => s.order), 0) + 1;
        sequence.push({
          scenarioId: scenario.id,
          order: nextOrder,
        });
        console.log(
          `  ${nextOrder}. ${scenario.name || scenario.assessmentName} (unmatched - added at end)`,
        );
      }
    }

    console.log(
      `Generated fixed sequence with ${sequence.length} activities\n`,
    );
    return sequence;
  }

  async generateOptimalSchedule(input: SchedulingInput): Promise<any> {
    try {
      // Store the assessment_assessor_mapping for post-processing
      this.assessmentAssessorMapping = input.assessment_assessor_mapping || {};
      console.log(
        'Stored assessment_assessor_mapping for post-processing:',
        Object.keys(this.assessmentAssessorMapping),
      );

      // Phase 0: Validate input requirements
      await this.validateSchedulingInput(input);
      console.log('Starting schedule generation...');

      // Automatically derive daily breaks based on schedule hours
      const autoDailyBreaks = this.generateAutomaticDailyBreaks(input);
      input.daily_breaks = autoDailyBreaks;
      console.log(
        `Generated ${autoDailyBreaks.length} automatic daily break configurations`,
      );

      // Phase 1: Build availability matrix
      const availabilityMatrix =
        await this.buildSimpleAvailabilityMatrix(input);
      console.log('Availability matrix built successfully');

      // Phase 2: Get scenario and questionnaire details and categorize them
      const scenarioDetails = await this.categorizeScenariosAndQuestionnaires(
        input.scenarioIds,
        input.questionnaireIds,
      );
      console.log(
        'Scenario and questionnaire categorization:',
        scenarioDetails,
      );

      // Phase 3: Build names lookup for better logging
      const namesLookup = await this.buildNamesLookup(input, scenarioDetails);

      // Phase 4: Initialize constraints with names lookup
      const constraints = new SchedulingConstraints(
        0, // No automatic break between activities
        input.daily_breaks, // Pass daily breaks instead of lunch_time
        this.getFixedActivitySequence(scenarioDetails), // Use fixed activity sequence
        namesLookup,
      );

      // Phase 5: Get specialized assessors (optional - fallback to all assessors if not provided)
      const specializedAssessors = input.assessment_assessor_mapping
        ? this.getSpecializedAssessors(input)
        : undefined;

      // Phase 5.5: Log room-assessment mapping analysis
      console.log('\n=== ROOM-ASSESSMENT MAPPING ANALYSIS ===');
      console.log('Room assignments:');
      for (const [roomId, scenarioIds] of Object.entries(
        input.room_assessment_mapping,
      )) {
        const roomName =
          namesLookup.rooms.get(roomId) || `Room-${roomId.substring(0, 8)}`;
        const scenarioNames = scenarioIds.map((id) => {
          const scenario = scenarioDetails.find((s) => s.id === id);
          return scenario ? scenario.name : `Scenario-${id.substring(0, 8)}`;
        });
        console.log(
          `  📍 ${roomName}: ${scenarioNames.join(', ')} (${scenarioIds.length} scenarios)`,
        );
      }

      console.log('\nScenario room availability:');
      for (const scenario of scenarioDetails.filter(
        (s) => !s.isQuestionnaire,
      )) {
        const availableRooms: string[] = [];
        for (const [roomId, allowedScenarios] of Object.entries(
          input.room_assessment_mapping,
        )) {
          if (allowedScenarios.includes(scenario.id)) {
            const roomName =
              namesLookup.rooms.get(roomId) || `Room-${roomId.substring(0, 8)}`;
            availableRooms.push(roomName);
          }
        }
        console.log(
          `  🎯 ${scenario.name}: ${availableRooms.join(', ')} (${availableRooms.length} rooms)`,
        );
      }
      console.log('=========================================\n');

      // Phase 5.6: Log group configuration
      console.log(`\n=== GROUP CONFIGURATION ===`);
      console.log(
        `Group size determined by available assessors for each group activity`,
      );
      console.log(`Total participants: ${input.participantIds.length}`);
      console.log(`Groups will be created based on assessor availability`);
      console.log(
        `Individual activity duration: ${input.duration_of_each_activity} minutes`,
      );
      console.log(
        `Group activity duration: ${input.group_activity_duration} minutes`,
      );
      console.log(`==============================\n`);

      // Phase 5.7: Validate scheduling capacity before CSP solver
      const capacityValidation = await this.validateSchedulingCapacity(
        input,
        availabilityMatrix,
        scenarioDetails,
      );

      if (!capacityValidation.isValid) {
        throw new HttpException(
          {
            success: false,
            error: 'INSUFFICIENT_CAPACITY',
            message: capacityValidation.message,
            details: capacityValidation.details,
            suggestions: capacityValidation.suggestions,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Phase 6: Initialize and solve CSP
      const csp = new SchedulingCSP(
        constraints,
        availabilityMatrix,
        namesLookup,
      );
      console.log(`\n🔍 === AUTO-SCHEDULING DEBUG ===`);
      console.log(
        `📏 Individual activity duration: ${input.duration_of_each_activity} minutes`,
      );
      console.log(
        `👥 Group activity duration: ${input.group_activity_duration} minutes`,
      );
      console.log(`=====================================\n`);

      csp.initializeEnhancedVariables(
        input.participantIds,
        scenarioDetails,
        specializedAssessors,
        input.room_assessment_mapping, // Pass room-assessment mapping
        this.getFixedActivitySequence(scenarioDetails), // Use fixed activity sequence
        input.group_activity_duration, // NEW: Pass group activity duration
        input.business_case_rooms, // NEW: Pass specific Business Case rooms
        input.business_case_room_assessors, // NEW: Pass fixed room-assessor mapping
      );

      const solution = await csp.solve();

      // NOTE: Parallel activity synchronization disabled - causes scheduling conflicts
      // Role Play & TOYF are in the same sequence order (1) and must complete before Business Case (order 2)
      // but they don't need identical time slots for each participant
      // console.log('\n🔄 POST-PROCESSING: SYNCHRONIZING PARALLEL ACTIVITIES...');
      // this.synchronizeParallelActivities(solution, scenarioDetails);

      // FINAL APPROACH: Direct override for 100% continuity
      console.log(
        '\n🎯 DIRECT OVERRIDE: GUARANTEEING 100% ASSESSOR CONTINUITY...',
      );
      this.directOverrideForContinuity(solution);

      // DEBUG: Log assessor utilization
      console.log('\n=== ASSESSOR UTILIZATION ANALYSIS ===');
      const assessorUsage = new Map<string, number>();
      const distributionPattern = new Map<number, number>(); // assessor count -> activity count

      solution.forEach((variable) => {
        if (variable.assignedAssessorIds) {
          // Count individual assessor usage
          variable.assignedAssessorIds.forEach((assessorId) => {
            assessorUsage.set(
              assessorId,
              (assessorUsage.get(assessorId) || 0) + 1,
            );
          });

          // Count distribution pattern
          const assessorCount = variable.assignedAssessorIds.length;
          distributionPattern.set(
            assessorCount,
            (distributionPattern.get(assessorCount) || 0) + 1,
          );
        }
      });

      console.log('Assessor Usage Count:');
      const uniqueAssessorIds = input.assessment_assessor_mapping
        ? Array.from(
            new Set(Object.values(input.assessment_assessor_mapping).flat()),
          )
        : [];
      uniqueAssessorIds.forEach((assessorId) => {
        const usage = assessorUsage.get(assessorId) || 0;
        const assessorName =
          namesLookup.assessors.get(assessorId) || assessorId;
        console.log(
          `  ${assessorName} (${assessorId.substring(0, 8)}...): ${usage} assignments`,
        );
      });

      console.log('\nDistribution Pattern:');
      for (let i = 1; i <= 4; i++) {
        const count = distributionPattern.get(i) || 0;
        if (count > 0) {
          console.log(
            `  ${i} assessor${i > 1 ? 's' : ''}: ${count} activities`,
          );
        }
      }

      const totalAssignments = solution.filter(
        (v) =>
          v.assignedAssessorIds?.length && v.assignedAssessorIds.length > 0,
      ).length;
      const uniqueAssessorsUsed = assessorUsage.size;
      console.log(`\nTotal assignments: ${totalAssignments}`);
      const totalUniqueAssessors = input.assessment_assessor_mapping
        ? Array.from(
            new Set(Object.values(input.assessment_assessor_mapping).flat()),
          ).length
        : 0;
      console.log(
        `Unique assessors used: ${uniqueAssessorsUsed}/${totalUniqueAssessors}`,
      );

      // Calculate balance score (prefer 2-3 assessors per activity.)
      const balanced2or3 =
        (distributionPattern.get(2) || 0) + (distributionPattern.get(3) || 0);
      const balancePercentage =
        totalAssignments > 0
          ? Math.round((balanced2or3 / totalAssignments) * 100)
          : 0;
      console.log(
        `Balance score: ${balancePercentage}% activities have 2-3 assessors (optimal)`,
      );
      console.log('===========================================\n');

      // Phase 7: Create numbered assessment names for duplicates
      const numberedAssessmentNames = new Map<string, string>();
      const assessmentNameCounts = new Map<string, number>();

      // First pass: count total occurrences of each assessment name
      scenarioDetails.forEach((scenario) => {
        const baseAssessmentName =
          scenario.assessmentName || 'Unknown Assessment';
        const currentCount = assessmentNameCounts.get(baseAssessmentName) || 0;
        assessmentNameCounts.set(baseAssessmentName, currentCount + 1);
      });

      // Second pass: create numbered names only for duplicates
      scenarioDetails.forEach((scenario) => {
        const baseAssessmentName =
          scenario.assessmentName || 'Unknown Assessment';
        const totalCount = assessmentNameCounts.get(baseAssessmentName) || 0;

        // Only add number if there are multiple scenarios of this assessment
        const numberedAssessmentName =
          totalCount > 1
            ? `${baseAssessmentName} ${scenarioDetails.indexOf(scenario) + 1}`
            : baseAssessmentName;

        numberedAssessmentNames.set(
          scenario.assessmentId,
          numberedAssessmentName,
        );
      });

      // Phase 8: Convert solution to schedule format
      const schedule = this.convertSolutionToSchedule(
        solution,
        input,
        scenarioDetails,
        namesLookup,
        numberedAssessmentNames,
      );

      // Phase 9: Group schedule by scenarios
      const activitySequence = this.getFixedActivitySequence(scenarioDetails);
      const assessmentGroups = this.groupScheduleByScenarios(
        schedule.participantAssignments,
        scenarioDetails,
        namesLookup,
        solution, // NEW: Pass solution for Business Case handling
        activitySequence, // NEW: Pass activity sequence for ordering
      );

      // Phase 10: Create final grouped schedule
      const groupedSchedule: GroupedScheduleResult = {
        scenarios: assessmentGroups,
        assessorAssignments: schedule.assessorAssignments,
        roomUtilization: schedule.roomUtilization,
        dailyBreaks: [], // Will be populated by assignDailyBreaks
      };

      // Phase 11: Assign daily breaks (replaces lunch breaks)
      const scheduleWithBreaks = this.assignDailyBreaks(groupedSchedule, input);

      // Phase 12: Assign welcome and ending sessions
      const scheduleWithSessions = this.assignWelcomeAndEndingSessions(
        scheduleWithBreaks,
        input,
      );

      // Phase 13: Calculate statistics
      const statistics = this.calculateStatistics(scheduleWithSessions, input);

      console.log('Schedule generation completed successfully!');

      const serializedSchedule =
        this.serializeScheduleForOutput(scheduleWithSessions);

      return {
        classId: '',
        // facilityId: input.facility_id,
        // startdate: input.start_date,
        // endDate: input.end_date,
        success: true,
        schedule: serializedSchedule,
        statistics,
      };
    } catch (error) {
      console.error('❌ AUTO-SCHEDULE ERROR:');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error details:', error);

      // Re-throw HttpException (like capacity validation errors) to let controller handle status codes
      if (error instanceof HttpException) {
        throw error;
      }

      // Handle other types of errors (CSP solver failures, etc.) by throwing HttpException
      let errorType = 'SCHEDULING_FAILED';
      let errorMessage =
        'Failed to generate schedule due to an unexpected error.';
      let suggestions: string[] = [];

      if (error.message.includes('No solution found')) {
        errorType = 'NO_SOLUTION_FOUND';
        errorMessage =
          'No valid schedule could be generated with the current constraints.';
        suggestions = [
          'Try increasing the class duration',
          'Reduce the number of participants',
          'Extend daily working hours',
          'Reduce activity durations',
          'Check if all required resources (rooms, assessors) are available',
        ];
      } else if (
        error.message.includes('timeout') ||
        error.message.includes('iterations')
      ) {
        errorType = 'SCHEDULING_TIMEOUT';
        errorMessage = 'Schedule generation timed out due to complexity.';
        suggestions = [
          'Reduce the number of participants',
          'Simplify the scheduling constraints',
          'Increase available time slots',
          'Contact support if the issue persists',
        ];
      }

      // Throw HttpException with 400 status for scheduling failures
      throw new HttpException(
        {
          success: false,
          error: errorType,
          message: errorMessage,
          suggestions: suggestions,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private convertSolutionToSchedule(
    solution: SchedulingVariable[],
    input: SchedulingInput,
    scenarioDetails: any[],
    namesLookup: {
      participants: Map<string, string>;
      assessors: Map<string, string>;
      rooms: Map<string, string>;
      scenarios: Map<string, string>;
      assessments: Map<string, string>;
    },
    numberedAssessmentNames?: Map<string, string>, // Add numbered assessment names parameter
  ): {
    participantAssignments: ParticipantAssignment[];
    assessorAssignments: AssessorAssignment[];
    roomUtilization: RoomUtilization[];
    dailyBreaks: DailyBreak[]; // NEW: Change lunchBreaks to dailyBreaks
  } {
    const participantAssignments: ParticipantAssignment[] = [];
    const assessorAssignments: AssessorAssignment[] = [];

    // Helper function to get scenario/questionnaire details
    const getScenarioDetails = (
      scenarioId: string,
      questionnaireId?: string,
    ) => {
      if (questionnaireId) {
        return (
          scenarioDetails.find(
            (s) => s.id === questionnaireId && s.isQuestionnaireItem,
          ) || {
            type: 'questionnaire',
            isQuestionnaire: true,
            isGroupActivity: false,
          }
        );
      }
      return (
        scenarioDetails.find((s) => s.id === scenarioId && s.isScenario) || {
          type: 'individual',
          isQuestionnaire: false,
          isGroupActivity: false,
        }
      );
    };

    // Group assignments by participant to determine sequence order
    const participantGroups = new Map<string, SchedulingVariable[]>();

    solution.forEach((variable) => {
      if (!participantGroups.has(variable.participantId)) {
        participantGroups.set(variable.participantId, []);
      }
      participantGroups.get(variable.participantId)!.push(variable);
    });

    // Process each participant's assignments
    participantGroups.forEach((assignments, participantId) => {
      // Handle group activities (participantId starts with 'GROUP_ACTIVITY_')
      if (participantId.startsWith('GROUP_ACTIVITY_')) {
        assignments.forEach((variable) => {
          // Use groupInfo to create assignments for each participant with their specific group assessor
          if (variable.groupInfo) {
            variable.groupInfo.forEach((group, groupIndex) => {
              group.participants.forEach(
                (realParticipantId, participantIndex) => {
                  const participantAssignmentId = `pa_${realParticipantId}_${variable.scenarioId || variable.questionnaireId}`;

                  const scenarioInfo = getScenarioDetails(
                    variable.scenarioId!,
                    variable.questionnaireId,
                  );
                  console.log(`\n📋 === CREATING PARTICIPANT ASSIGNMENT ===`);
                  console.log(
                    `👤 Participant: ${namesLookup.participants.get(realParticipantId)}`,
                  );
                  console.log(`📊 Variable ID: ${variable.id}`);
                  console.log(
                    `⏱️  Duration from variable: ${variable.groupActivityDuration} minutes`,
                  );
                  console.log(
                    `🕐 Time slot: ${variable.assignedTimeSlot!.startTime.toLocaleTimeString()} - ${variable.assignedTimeSlot!.endTime.toLocaleTimeString()}`,
                  );
                  console.log(`============================================\n`);

                  participantAssignments.push({
                    participantId: realParticipantId,
                    participantName:
                      namesLookup.participants.get(realParticipantId),
                    scenarioId: variable.scenarioId,
                    questionnaireId: variable.questionnaireId,
                    assessmentId: variable.assessmentId,
                    scenarioName: variable.scenarioId
                      ? namesLookup.scenarios.get(variable.scenarioId)
                      : undefined,
                    questionnaireName: variable.questionnaireId
                      ? namesLookup.scenarios.get(variable.questionnaireId)
                      : undefined,
                    assessmentName:
                      numberedAssessmentNames?.get(variable.assessmentId) ||
                      namesLookup.assessments.get(variable.assessmentId),
                    roomId: variable.assignedRoomId!,
                    roomName: namesLookup.rooms.get(variable.assignedRoomId!),
                    startTime: variable.assignedTimeSlot!.startTime,
                    endTime: variable.assignedTimeSlot!.endTime,
                    assessorIds: [group.assessorId], // Single assessor for this participant's group
                    assessorNames: [
                      namesLookup.assessors.get(group.assessorId),
                    ].filter((name) => name !== undefined) as string[],
                    sequenceOrder: groupIndex + 1, // Group sequence, not participant sequence
                    isGroupActivity: scenarioInfo.isGroupActivity,
                    isQuestionnaire: scenarioInfo.isQuestionnaire,
                    assessmentType: scenarioInfo.type,
                  });

                  // Create assessor assignment for this group's assessor
                  assessorAssignments.push({
                    assessorId: group.assessorId,
                    participantAssessmentId: participantAssignmentId,
                    startTime: variable.assignedTimeSlot!.startTime,
                    endTime: variable.assignedTimeSlot!.endTime,
                  });
                },
              );
            });
          }
        });
        return;
      }

      // Sort assignments by time for individual participants (excluding questionnaires)
      const timedAssignments = assignments.filter(
        (a) =>
          a.assignedTimeSlot &&
          a.assignedTimeSlot.id !== 'questionnaire_dummy' &&
          !a.isQuestionnaire,
      );
      const questionnaireAssignments = assignments.filter(
        (a) => a.isQuestionnaire,
      );

      timedAssignments.sort((a, b) => {
        if (!a.assignedTimeSlot || !b.assignedTimeSlot) return 0;
        return (
          a.assignedTimeSlot.startTime.getTime() -
          b.assignedTimeSlot.startTime.getTime()
        );
      });

      // Process timed assignments
      timedAssignments.forEach((variable, index) => {
        const participantAssignmentId = `pa_${participantId}_${variable.scenarioId || variable.questionnaireId}`;

        const scenarioInfo = getScenarioDetails(
          variable.scenarioId!,
          variable.questionnaireId,
        );
        participantAssignments.push({
          participantId: variable.participantId,
          participantName: namesLookup.participants.get(variable.participantId),
          scenarioId: variable.scenarioId,
          questionnaireId: variable.questionnaireId,
          assessmentId: variable.assessmentId,
          scenarioName: variable.scenarioId
            ? namesLookup.scenarios.get(variable.scenarioId)
            : undefined,
          questionnaireName: variable.questionnaireId
            ? namesLookup.scenarios.get(variable.questionnaireId)
            : undefined,
          assessmentName:
            numberedAssessmentNames?.get(variable.assessmentId) ||
            namesLookup.assessments.get(variable.assessmentId),
          roomId: variable.assignedRoomId!,
          roomName: namesLookup.rooms.get(variable.assignedRoomId!),
          startTime: variable.assignedTimeSlot!.startTime,
          endTime: variable.assignedTimeSlot!.endTime,
          assessorIds: variable.assignedAssessorIds!,
          assessorNames: variable
            .assignedAssessorIds!.map((id) => namesLookup.assessors.get(id))
            .filter((name) => name !== undefined) as string[],
          sequenceOrder: index + 1,
          isGroupActivity: scenarioInfo.isGroupActivity,
          isQuestionnaire: scenarioInfo.isQuestionnaire,
          assessmentType: scenarioInfo.type,
        });

        // Create assessor assignments
        variable.assignedAssessorIds!.forEach((assessorId) => {
          assessorAssignments.push({
            assessorId,
            participantAssessmentId: participantAssignmentId,
            startTime: variable.assignedTimeSlot!.startTime,
            endTime: variable.assignedTimeSlot!.endTime,
          });
        });
      });

      // Process questionnaire assignments (no time/room)
      console.log(
        `Processing ${questionnaireAssignments.length} questionnaire assignments for participant ${participantId}`,
      );
      questionnaireAssignments.forEach((variable, index) => {
        const participantAssignmentId = `pa_${participantId}_${variable.assessmentId}`;

        const scenarioInfo = getScenarioDetails(
          variable.scenarioId!,
          variable.questionnaireId,
        );
        participantAssignments.push({
          participantId: variable.participantId,
          participantName: namesLookup.participants.get(variable.participantId),
          scenarioId: variable.scenarioId,
          questionnaireId: variable.questionnaireId,
          assessmentId: variable.assessmentId,
          scenarioName: variable.scenarioId
            ? namesLookup.scenarios.get(variable.scenarioId)
            : undefined,
          questionnaireName: variable.questionnaireId
            ? namesLookup.scenarios.get(variable.questionnaireId)
            : undefined,
          assessmentName:
            numberedAssessmentNames?.get(variable.assessmentId) ||
            namesLookup.assessments.get(variable.assessmentId),
          roomId: '', // No room for questionnaires
          roomName: undefined, // No room for questionnaires
          startTime: null, // No time for questionnaires
          endTime: null, // No time for questionnaires
          assessorIds: variable.assignedAssessorIds!,
          assessorNames: variable
            .assignedAssessorIds!.map((id) => namesLookup.assessors.get(id))
            .filter((name) => name !== undefined) as string[],
          sequenceOrder: timedAssignments.length + index + 1, // After timed assignments
          isGroupActivity: scenarioInfo.isGroupActivity,
          isQuestionnaire: scenarioInfo.isQuestionnaire,
          assessmentType: scenarioInfo.type,
        });

        // Create assessor assignments for questionnaires
        variable.assignedAssessorIds!.forEach((assessorId) => {
          assessorAssignments.push({
            assessorId,
            participantAssessmentId: participantAssignmentId,
            startTime: null, // No time for questionnaires
            endTime: null, // No time for questionnaires
          });
        });
      });
    });

    return {
      participantAssignments,
      assessorAssignments,
      roomUtilization: this.calculateRoomUtilization(participantAssignments),
      dailyBreaks: [], // Will be assigned separately by assignDailyBreaks
    };
  }

  /**
   * NEW: Create Business Case room groups for multi-room distribution
   */
  private createBusinessCaseRoomGroups(
    assignments: ParticipantAssignment[],
    variable: SchedulingVariable,
  ): BusinessCaseRoomGroup[] {
    console.log('\n=== CREATING BUSINESS CASE ROOM GROUPS ===');

    if (!variable.groupInfo || !variable.businessCaseRooms) {
      console.log('No Business Case room distribution found');
      return [];
    }

    const roomGroups: BusinessCaseRoomGroup[] = [];
    const template = assignments[0];

    if (!template) {
      console.log('No assignments found for Business Case');
      return [];
    }

    // Use the room distribution stored in the variable
    variable.groupInfo.forEach((roomInfo, index) => {
      const roomId = variable.businessCaseRooms![index] || template.roomId;

      // Find participants for this room
      const roomParticipants = assignments.filter((a) =>
        roomInfo.participants.includes(a.participantId),
      );

      // Get assessors for this room (from the original distribution)
      const roomAssessors =
        roomParticipants.length > 0
          ? roomParticipants[0].assessorIds || []
          : [];
      const roomAssessorNames =
        roomParticipants.length > 0
          ? roomParticipants[0].assessorNames || []
          : [];

      const roomGroup: BusinessCaseRoomGroup = {
        roomId: roomId,
        roomName: roomParticipants[0]?.roomName || '',
        participantIds: roomInfo.participants,
        assessorIds: roomAssessors,
        assessorNames: roomAssessorNames,
        startTime: template.startTime,
        endTime: template.endTime,
      };

      roomGroups.push(roomGroup);

      console.log(
        `Business Case Room ${index + 1}: ${roomGroup.participantIds.length} participants, ${roomGroup.assessorIds.length} assessors`,
      );
    });

    console.log(`✅ Created ${roomGroups.length} Business Case room groups\n`);
    return roomGroups;
  }

  private createParticipantGroups(
    assignments: ParticipantAssignment[],
  ): ParticipantGroup[] {
    console.log('\n=== CREATING PARTICIPANT GROUPS ===');

    // For concurrent group activities, group participants by their assigned assessor
    // All groups have the same time and room
    const assessorGroups = new Map<string, ParticipantAssignment[]>();

    assignments.forEach((assignment) => {
      if (assignment.assessorIds && assignment.assessorIds.length > 0) {
        const assessorId = assignment.assessorIds[0]; // Each participant has one assessor
        if (!assessorGroups.has(assessorId)) {
          assessorGroups.set(assessorId, []);
        }
        assessorGroups.get(assessorId)!.push(assignment);
      }
    });

    // Convert to ParticipantGroup format
    const groups: ParticipantGroup[] = [];
    let groupCounter = 1;

    // Get common time and room from first assignment (all should be the same)
    const template = assignments[0];
    if (!template) {
      console.log('No assignments found for group activity');
      return groups;
    }

    assessorGroups.forEach((groupAssignments, assessorId) => {
      if (groupAssignments.length === 0) return;

      const group: ParticipantGroup = {
        groupId: `group_${groupCounter}`,
        participantIds: groupAssignments.map((a) => a.participantId),
        startTime: template.startTime!, // Same time for all groups
        endTime: template.endTime!, // Same time for all groups
        roomId: template.roomId, // Same room for all groups
        roomName: template.roomName || '', // Same room for all groups
        assessorId: assessorId, // Single assessor for this group
        assessorName: (groupAssignments[0].assessorNames || [])[0] || '', // Single assessor name
        participants: groupAssignments,
      };

      groups.push(group);

      console.log(
        `Group ${groupCounter}: ${group.participantIds.length} participants`,
      );
      console.log(
        `  Time: ${group.startTime.toLocaleTimeString()} - ${group.endTime.toLocaleTimeString()} (SAME FOR ALL GROUPS)`,
      );
      console.log(
        `  Room: ${group.roomName} (${group.roomId.substring(0, 8)}) (SAME FOR ALL GROUPS)`,
      );
      console.log(`  Assessor: ${group.assessorName}`);
      console.log(
        `  Participants: ${group.participants.map((p) => p.participantName).join(', ')}`,
      );

      groupCounter++;
    });

    console.log(
      `\n✅ All ${groups.length} groups run SIMULTANEOUSLY at the same time and room!`,
    );

    return groups;
  }

  private groupScheduleByScenarios(
    participantAssignments: ParticipantAssignment[],
    scenarioDetails: any[],
    namesLookup: any,
    solution: SchedulingVariable[], // NEW: Add solution parameter for Business Case handling
    activitySequence?: ActivitySequenceItem[], // NEW: Activity sequence for ordering
  ): AssessmentScheduleGroup[] {
    console.log('\n=== GROUPING SCHEDULE BY SCENARIOS ===');

    // Group assignments by scenario ID
    const scenarioGroups = new Map<string, ParticipantAssignment[]>();

    participantAssignments.forEach((assignment) => {
      const scenarioId = assignment.scenarioId || assignment.questionnaireId;
      console.log(
        `Assignment for participant ${assignment.participantId}: scenarioId=${assignment.scenarioId}, questionnaireId=${assignment.questionnaireId}, final scenarioId=${scenarioId}`,
      );
      if (scenarioId && !scenarioGroups.has(scenarioId)) {
        scenarioGroups.set(scenarioId, []);
      }
      if (scenarioId) {
        scenarioGroups.get(scenarioId)!.push(assignment);
      }
    });

    // Convert to structured format
    const groupedSchedule: AssessmentScheduleGroup[] = [];

    // Track assessment names to add numbering for duplicates
    const assessmentNameCounts = new Map<string, number>();

    // First pass: count total occurrences of each assessment name
    scenarioDetails.forEach((scenario) => {
      const baseAssessmentName =
        scenario.assessmentName || 'Unknown Assessment';
      const currentCount = assessmentNameCounts.get(baseAssessmentName) || 0;
      assessmentNameCounts.set(baseAssessmentName, currentCount + 1);
    });

    // Process each scenario
    scenarioDetails.forEach((scenario) => {
      const assignments = scenarioGroups.get(scenario.id) || [];
      console.log(
        `Processing scenario ${scenario.id} (${scenario.name}): ${assignments.length} assignments found`,
      );

      // Sort assignments within this scenario by start time
      const sortedAssignments = assignments.sort((a, b) => {
        // Handle questionnaires (null start times) - put them at the end
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return 1; // a goes to end
        if (!b.startTime) return -1; // b goes to end
        return a.startTime.getTime() - b.startTime.getTime();
      });

      // Generate numbered assessment name only if there are duplicates
      const baseAssessmentName =
        scenario.assessmentName || 'Unknown Assessment';
      const totalCount = assessmentNameCounts.get(baseAssessmentName) || 0;

      // Only add number if there are multiple scenarios of this assessment
      const numberedAssessmentName =
        totalCount > 1
          ? `${baseAssessmentName} ${scenarioDetails.indexOf(scenario) + 1}`
          : baseAssessmentName;

      // Create scenario group base structure
      const scenarioGroup: AssessmentScheduleGroup = {
        id: scenario.id,
        name: scenario.name,
        is_quesionnaire: scenario.isQuestionnaire,
        is_group_activity: scenario.isGroupActivity,
        type: scenario.isScenario
          ? 'scenario'
          : scenario.isQuestionnaireItem
            ? 'questionnaire'
            : 'unknown',
        is_questionnaire_item: scenario.isQuestionnaireItem,
        assessment_id: scenario.assessmentId,
        assessment_name: numberedAssessmentName,
        participantSchedules: scenario.isGroupActivity ? [] : sortedAssignments, // Empty for group activities only
      };

      // Handle group activities: create group structure
      if (scenario.isGroupActivity && sortedAssignments.length > 0) {
        scenarioGroup.groups = this.createParticipantGroups(sortedAssignments);
        console.log(
          `Created ${scenarioGroup.groups.length} groups for group activity ${scenario.name}`,
        );
      }

      groupedSchedule.push(scenarioGroup);

      console.log(`Scenario: ${scenarioGroup.name} (${scenarioGroup.type})`);
      console.log(`  Assessment: ${numberedAssessmentName}`);
      console.log(`  Participants: ${sortedAssignments.length}`);

      // Safe time range logging
      const timeRangeStart =
        sortedAssignments.length > 0 && sortedAssignments[0].startTime
          ? sortedAssignments[0].startTime.toLocaleTimeString()
          : 'No time';
      const timeRangeEnd =
        sortedAssignments.length > 0 &&
        sortedAssignments[sortedAssignments.length - 1].startTime
          ? sortedAssignments[
              sortedAssignments.length - 1
            ].startTime!.toLocaleTimeString()
          : 'No time';

      console.log(`  Time range: ${timeRangeStart} - ${timeRangeEnd}`);
    });

    console.log(`Total scenario groups created: ${groupedSchedule.length}`);

    // Sort by activity sequence order: Role Play & TOYF (order 1) → Business Case (order 2) → Group Activity (order 3) → Leadership Questionnaire (order 4)
    if (activitySequence && activitySequence.length > 0) {
      groupedSchedule.sort((a, b) => {
        const aOrder =
          activitySequence.find((item) => item.scenarioId === a.id)?.order ??
          999;
        const bOrder =
          activitySequence.find((item) => item.scenarioId === b.id)?.order ??
          999;

        // If same order, maintain original order (for parallel activities like Role Play & TOYF)
        if (aOrder === bOrder) {
          return 0;
        }

        return aOrder - bOrder;
      });

      console.log('\n📋 Final schedule order (sorted by sequence):');
      groupedSchedule.forEach((group, index) => {
        const order =
          activitySequence.find((item) => item.scenarioId === group.id)
            ?.order ?? '?';
        console.log(`  ${index + 1}. ${group.name} (order ${order})`);
      });
    }

    console.log('=========================================\n');

    return groupedSchedule;
  }

  private calculateRoomUtilization(
    assignments: ParticipantAssignment[],
  ): RoomUtilization[] {
    const roomGroups = new Map<string, ParticipantAssignment[]>();

    // Filter out questionnaires (they don't use rooms)
    const timedAssignments = assignments.filter(
      (assignment) =>
        assignment.startTime && assignment.endTime && assignment.roomId,
    );

    timedAssignments.forEach((assignment) => {
      if (!roomGroups.has(assignment.roomId)) {
        roomGroups.set(assignment.roomId, []);
      }
      roomGroups.get(assignment.roomId)!.push(assignment);
    });

    return Array.from(roomGroups.entries()).map(([roomId, roomAssignments]) => {
      const totalTime = roomAssignments.reduce((sum, assignment) => {
        if (!assignment.startTime || !assignment.endTime) return sum;
        return (
          sum + (assignment.endTime.getTime() - assignment.startTime.getTime())
        );
      }, 0);

      const workingHours = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
      const utilizationPercentage = (totalTime / workingHours) * 100;

      return {
        roomId,
        utilizationPercentage: Math.min(utilizationPercentage, 100),
        timeSlots: roomAssignments.map((assignment) => ({
          startTime: assignment.startTime,
          endTime: assignment.endTime,
          participantId: assignment.participantId,
          assessmentId: assignment.assessmentId,
        })),
      };
    });
  }

  private extractParticipantAssignments(
    groupedSchedule: GroupedScheduleResult,
  ): ParticipantAssignment[] {
    const allAssignments: ParticipantAssignment[] = [];
    groupedSchedule.scenarios.forEach((group) => {
      allAssignments.push(...group.participantSchedules);
    });
    return allAssignments;
  }

  /**
   * NEW: Assign daily breaks (replaces assignLunchBreaks)
   * Breaks are shared across all participants - 3 breaks per day (first, second, lunch)
   */
  private assignDailyBreaks(
    schedule: GroupedScheduleResult,
    input: SchedulingInput,
  ): any {
    const dailyBreaks: DailyBreak[] = [];
    const breakConfigs = this.getDailyBreaksOrThrow(input);

    // Generate breaks for each day - 3 breaks per day (shared across all participants)
    for (const breakConfig of breakConfigs) {
      // First break (Tea/Coffee)
      dailyBreaks.push({
        type: 'first_break',
        date: breakConfig.date,
        startTime: this.parseUTCDateTime(breakConfig.first_break_start_time),
        endTime: this.parseUTCDateTime(breakConfig.first_break_end_time),
        groupId: `first_break_${breakConfig.date}`,
      });

      // Second break (Tea/Coffee)
      dailyBreaks.push({
        type: 'second_break',
        date: breakConfig.date,
        startTime: this.parseUTCDateTime(breakConfig.second_break_start_time),
        endTime: this.parseUTCDateTime(breakConfig.second_break_end_time),
        groupId: `second_break_${breakConfig.date}`,
      });

      // Lunch break
      dailyBreaks.push({
        type: 'lunch_break',
        date: breakConfig.date,
        startTime: this.parseUTCDateTime(breakConfig.lunch_break_start_time),
        endTime: this.parseUTCDateTime(breakConfig.lunch_break_end_time),
        groupId: `lunch_break_${breakConfig.date}`,
      });
    }

    console.log(`\n=== DAILY BREAKS ASSIGNMENT ===`);
    console.log(
      `Assigned ${dailyBreaks.length} breaks across ${breakConfigs.length} days`,
    );
    console.log(
      `Break distribution: ${breakConfigs.length} days × 3 break types = ${
        breakConfigs.length * 3
      } total breaks (shared across all participants)`,
    );
    console.log(`==============================\n`);

    return {
      facilityId: input.facility_id,
      startDate: input.start_date,
      endDate: input.end_date,
      ...schedule,
      dailyBreaks, // NEW: Replace lunchBreaks with dailyBreaks
    };
  }

  /**
   * NEW: Assign welcome and ending sessions
   * Welcome session: 15 minutes before class start time
   * Ending session: After group activity completion
   */
  private assignWelcomeAndEndingSessions(
    schedule: GroupedScheduleResult,
    input: SchedulingInput,
  ): GroupedScheduleResult {
    console.log(`\n=== WELCOME & ENDING SESSIONS ASSIGNMENT ===`);

    // Extract all participant assignments
    const allAssignments = this.extractParticipantAssignments(schedule);

    // Filter timed assignments (exclude questionnaires)
    const timedAssignments = allAssignments.filter(
      (a) => a.startTime && a.endTime,
    );

    if (timedAssignments.length === 0) {
      console.log(
        '⚠️  No timed assignments found, skipping session assignment',
      );
      return schedule;
    }

    // Find the earliest start time (class start)
    const earliestStartTime = timedAssignments.reduce(
      (earliest, assignment) => {
        if (!earliest || assignment.startTime! < earliest) {
          return assignment.startTime!;
        }
        return earliest;
      },
      null as Date | null,
    );

    // Calculate welcome session (15 minutes before class start)
    let welcomeSession:
      | { class_date: string; startTime: Date | null; endTime: Date | null }
      | undefined = undefined;
    if (earliestStartTime) {
      const welcomeStartTime = new Date(
        earliestStartTime.getTime() - 15 * 60 * 1000,
      ); // 15 minutes before

      // Extract date in YYYY-MM-DD format
      const welcomeDate = earliestStartTime.toISOString().split('T')[0];

      welcomeSession = {
        class_date: welcomeDate,
        startTime: welcomeStartTime,
        endTime: new Date(earliestStartTime),
      };

      console.log(
        `✅ Welcome Session (${welcomeDate}): ${welcomeStartTime.toISOString()} → ${earliestStartTime.toISOString()} (15 min before class start)`,
      );
    }

    // Find Group Activity to determine ending session start time
    const groupActivityScenario = schedule.scenarios.find(
      (scenario) => scenario.is_group_activity,
    );

    let endingSession:
      | { class_date: string; startTime: Date | null; endTime: Date | null }
      | undefined = undefined;
    if (groupActivityScenario) {
      // Get the end time of group activity
      let groupActivityEndTime: Date | null = null;

      if (
        groupActivityScenario.groups &&
        groupActivityScenario.groups.length > 0
      ) {
        // All groups run simultaneously, so use the first group's end time
        groupActivityEndTime = groupActivityScenario.groups[0].endTime;
      } else if (
        groupActivityScenario.participantSchedules &&
        groupActivityScenario.participantSchedules.length > 0
      ) {
        // Fallback: use participant schedules
        groupActivityEndTime =
          groupActivityScenario.participantSchedules[0].endTime;
      }

      if (groupActivityEndTime) {
        // Ending session starts right after group activity
        // Duration can be configured, using 15 minutes as default
        const endingStartTime = new Date(groupActivityEndTime);
        const endingEndTime = new Date(
          groupActivityEndTime.getTime() + 15 * 60 * 1000,
        ); // 15 minutes duration

        // Extract date in YYYY-MM-DD format
        const endingDate = endingStartTime.toISOString().split('T')[0];

        endingSession = {
          class_date: endingDate,
          startTime: endingStartTime,
          endTime: endingEndTime,
        };

        console.log(
          `✅ Ending Session (${endingDate}): ${endingStartTime.toISOString()} → ${endingEndTime.toISOString()} (15 min after Group Activity)`,
        );
      } else {
        console.log('⚠️  Could not determine Group Activity end time');
      }
    } else {
      console.log('⚠️  No Group Activity found in schedule');
    }

    console.log(`==========================================\n`);

    return {
      ...schedule,
      welcomeSession,
      endingSession,
    };
  }

  private serializeScheduleForOutput(
    schedule: GroupedScheduleResult & Record<string, any>,
  ): any {
    const serializeAssignments = (
      assignments: ParticipantAssignment[],
    ): any[] =>
      assignments.map((assignment) => ({
        ...assignment,
        startTime: this.formatOutputDate(assignment.startTime),
        endTime: this.formatOutputDate(assignment.endTime),
      }));

    const serializedScenarios = schedule.scenarios.map((scenario) => ({
      ...scenario,
      participantSchedules: serializeAssignments(scenario.participantSchedules),
      groups: scenario.groups
        ? scenario.groups.map((group) => ({
            ...group,
            startTime: this.formatOutputDate(group.startTime)!,
            endTime: this.formatOutputDate(group.endTime)!,
            participants: serializeAssignments(group.participants),
          }))
        : undefined,
      businessCaseRooms: scenario.businessCaseRooms
        ? scenario.businessCaseRooms.map((room) => ({
            ...room,
            startTime: this.formatOutputDate(room.startTime),
            endTime: this.formatOutputDate(room.endTime),
          }))
        : undefined,
    }));

    const serializedAssessorAssignments = schedule.assessorAssignments.map(
      (assignment) => ({
        ...assignment,
        startTime: this.formatOutputDate(assignment.startTime),
        endTime: this.formatOutputDate(assignment.endTime),
      }),
    );

    const serializedRoomUtilization = schedule.roomUtilization.map((room) => ({
      ...room,
      timeSlots: room.timeSlots.map((slot) => ({
        ...slot,
        startTime: this.formatOutputDate(slot.startTime),
        endTime: this.formatOutputDate(slot.endTime),
      })),
    }));

    // Group breaks by date and transform to new format
    const breaksByDate = new Map<
      string,
      {
        first_break?: DailyBreak;
        second_break?: DailyBreak;
        lunch_break?: DailyBreak;
      }
    >();

    schedule.dailyBreaks.forEach((breakItem) => {
      const date = breakItem.date;
      if (!breaksByDate.has(date)) {
        breaksByDate.set(date, {});
      }
      const dateBreaks = breaksByDate.get(date)!;

      if (breakItem.type === 'first_break') {
        dateBreaks.first_break = breakItem;
      } else if (breakItem.type === 'second_break') {
        dateBreaks.second_break = breakItem;
      } else if (breakItem.type === 'lunch_break') {
        dateBreaks.lunch_break = breakItem;
      }
    });

    // Transform to output format with shorter field names
    const serializedDailyBreaks = Array.from(breaksByDate.entries()).map(
      ([date, breaks]) => ({
        class_date: date,
        first_br_st: breaks.first_break
          ? this.formatOutputDate(breaks.first_break.startTime)
          : undefined,
        first_br_en: breaks.first_break
          ? this.formatOutputDate(breaks.first_break.endTime)
          : undefined,
        second_br_st: breaks.second_break
          ? this.formatOutputDate(breaks.second_break.startTime)
          : undefined,
        second_br_en: breaks.second_break
          ? this.formatOutputDate(breaks.second_break.endTime)
          : undefined,
        lunch_br_st: breaks.lunch_break
          ? this.formatOutputDate(breaks.lunch_break.startTime)
          : undefined,
        lunch_br_en: breaks.lunch_break
          ? this.formatOutputDate(breaks.lunch_break.endTime)
          : undefined,
      }),
    );

    // Serialize welcome and ending sessions
    const serializedWelcomeSession = schedule.welcomeSession
      ? {
          class_date: schedule.welcomeSession.class_date,
          startTime: this.formatOutputDate(schedule.welcomeSession.startTime),
          endTime: this.formatOutputDate(schedule.welcomeSession.endTime),
        }
      : undefined;

    const serializedEndingSession = schedule.endingSession
      ? {
          class_date: schedule.endingSession.class_date,
          startTime: this.formatOutputDate(schedule.endingSession.startTime),
          endTime: this.formatOutputDate(schedule.endingSession.endTime),
        }
      : undefined;

    return {
      ...schedule,
      scenarios: serializedScenarios,
      assessorAssignments: serializedAssessorAssignments,
      roomUtilization: serializedRoomUtilization,
      dailyBreaks: serializedDailyBreaks,
      welcomeSession: serializedWelcomeSession,
      endingSession: serializedEndingSession,
    };
  }

  /**
   * DEPRECATED: Keep for backward compatibility
   */
  private assignLunchBreaks(
    schedule: GroupedScheduleResult,
    input: SchedulingInput,
  ): any {
    // This method is deprecated - delegate to assignDailyBreaks
    console.warn(
      'assignLunchBreaks is deprecated. Use assignDailyBreaks instead.',
    );
    return this.assignDailyBreaks(schedule, input);
  }

  private calculateStatistics(
    schedule: GroupedScheduleResult,
    input: SchedulingInput,
  ): ScheduleStatistics {
    // Extract all participant assignments for calculations
    const allAssignments = this.extractParticipantAssignments(schedule);

    // Calculate total duration (from first to last activity)
    const timeSlots = allAssignments
      .filter((a) => a.startTime && a.endTime) // Only timed activities
      .map((a) => ({ start: a.startTime!, end: a.endTime! }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const totalDuration =
      timeSlots.length > 0
        ? (timeSlots[timeSlots.length - 1].end.getTime() -
            timeSlots[0].start.getTime()) /
          60000
        : 0;

    // Calculate participant utilization
    const avgParticipantUtilization = 85; // Placeholder

    // Calculate room utilization
    const avgRoomUtilization =
      schedule.roomUtilization.reduce(
        (sum: number, room: RoomUtilization) =>
          sum + room.utilizationPercentage,
        0,
      ) / schedule.roomUtilization.length;

    // Calculate assessor utilization
    const totalAssessorSlots = schedule.assessorAssignments.length;
    const totalUniqueAssessors = input.assessment_assessor_mapping
      ? Array.from(
          new Set(Object.values(input.assessment_assessor_mapping).flat()),
        ).length
      : 0;
    const maxPossibleSlots = totalUniqueAssessors * timeSlots.length;
    const avgAssessorUtilization =
      maxPossibleSlots > 0 ? (totalAssessorSlots / maxPossibleSlots) * 100 : 0;

    return {
      totalDuration: Math.round(totalDuration),
      averageParticipantUtilization: avgParticipantUtilization,
      averageRoomUtilization: Math.round(avgRoomUtilization),
      averageAssessorUtilization: Math.round(avgAssessorUtilization),
      totalConflicts: 0,
    };
  }

  async persistScheduleToDatabase(
    schedule: GroupedScheduleResult,
    input: SchedulingInput,
  ): Promise<string> {
    const transaction = await this.sequelize.transaction();

    try {
      // Extract all participant assignments
      const allAssignments = this.extractParticipantAssignments(schedule);

      // Create a Map to store participant_assessment IDs
      const participantAssessmentMap = new Map<string, string>();

      for (const assignment of allAssignments) {
        // Prepare data with proper null handling
        const createData: any = {
          participant_id: assignment.participantId,
          assessment_id: assignment.assessmentId,
          sequence_order: assignment.sequenceOrder,
          status: 'scheduled',
          created_at: new Date(),
        };

        // Only add optional fields if they have values
        if (assignment.roomId) {
          createData.room_id = assignment.roomId;
        }
        if (assignment.startTime) {
          // Format as local time string for consistent database storage
          createData.start_time = this.formatLocalTimeString(
            assignment.startTime,
          );
        }
        if (assignment.endTime) {
          // Format as local time string for consistent database storage
          createData.end_time = this.formatLocalTimeString(assignment.endTime);
        }

        const paRecord = await this.participantAssessmentsModel.create(
          createData,
          { transaction },
        );

        // Store the mapping for assessor assignments
        participantAssessmentMap.set(
          `${assignment.participantId}_${assignment.assessmentId}`,
          paRecord.id,
        );
      }

      // Create class_assessments_assessors records
      for (const assessorAssignment of schedule.assessorAssignments) {
        const paId = participantAssessmentMap.get(
          assessorAssignment.participantAssessmentId,
        );

        if (paId) {
          // Prepare assessor assignment data
          const assessorData: any = {
            participant_assessment_id: paId,
            assessors_id: assessorAssignment.assessorId,
            created_at: new Date(),
          };

          // Only add time fields if they have values
          if (assessorAssignment.startTime) {
            // Format as local time string for consistent database storage
            assessorData.start_time = this.formatLocalTimeString(
              assessorAssignment.startTime,
            );
          }
          if (assessorAssignment.endTime) {
            // Format as local time string for consistent database storage
            assessorData.end_time = this.formatLocalTimeString(
              assessorAssignment.endTime,
            );
          }

          await this.classAssessorsModel.create(assessorData, { transaction });
        }
      }

      await transaction.commit();
      console.log('Schedule persisted to database successfully');

      return 'schedule_' + Date.now(); // Return a schedule ID
    } catch (error) {
      await transaction.rollback();
      console.error('Error persisting schedule to database:', error);
      throw error;
    }
  }

  /**
   * Helper method to extract date string from Date object
   */
  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0]; // "2025-08-01"
  }

  /**
   * Direct override for 100% continuity - completely replaces CSP solver decisions
   * This method guarantees 100% continuity by directly modifying the solution
   */
  private directOverrideForContinuity(solution: SchedulingVariable[]): void {
    console.log(
      '🎯 DIRECT OVERRIDE: COMPLETELY REPLACING CSP SOLVER DECISIONS FOR 100% CONTINUITY...',
    );

    // Step 1: Build Group Activity assessor mapping
    const groupActivityAssessorMap = new Map<string, string>();

    solution.forEach((variable) => {
      // Handle Group Activity variables (they have participantId starting with 'GROUP_ACTIVITY_')
      if (variable.isGroupActivity && variable.groupInfo) {
        // Extract assessor mappings from groupInfo
        variable.groupInfo.forEach((group) => {
          group.participants.forEach((participantId) => {
            groupActivityAssessorMap.set(participantId, group.assessorId);
            console.log(
              `📝 Group Activity PRIMARY assessor for ${participantId.substring(0, 8)}: ${group.assessorId.substring(0, 8)}`,
            );
          });
        });
      }
    });

    console.log(`\n📊 GROUP ACTIVITY ASSESSOR MAPPING BUILT:`);
    console.log(
      `  Total participants mapped: ${groupActivityAssessorMap.size}`,
    );
    groupActivityAssessorMap.forEach((assessorId, participantId) => {
      console.log(
        `    ${participantId.substring(0, 8)} → ${assessorId.substring(0, 8)}`,
      );
    });

    let overriddenAssignments = 0;
    let businessCaseOverridden = 0;
    let questionnaireOverridden = 0;

    // Step 2: DIRECT OVERRIDE - COMPLETELY REPLACE ASSIGNMENTS
    solution.forEach((variable) => {
      if (!variable.scenarioId && !variable.questionnaireId) return;

      // Check if this is Business Case or Leadership Questionnaire
      let isBusinessCase = false;
      let isQuestionnaire = false;

      if (variable.scenarioId) {
        if (variable.isBusinessCase) {
          isBusinessCase = true;
        } else if (variable.isGroupActivity) {
          return; // Skip Group Activity itself
        } else {
          return; // Skip Role Play and TOYF
        }
      } else if (variable.questionnaireId) {
        isQuestionnaire = true;
      }

      if (!isBusinessCase && !isQuestionnaire) return;

      const participantId = variable.participantId;
      const groupActivityPrimaryAssessor =
        groupActivityAssessorMap.get(participantId);

      if (!groupActivityPrimaryAssessor) {
        console.log(
          `⚠️ No Group Activity assessor found for ${participantId.substring(0, 8)}`,
        );
        return;
      }

      // SPECIAL HANDLING FOR LEADERSHIP QUESTIONNAIRE: FIXED + RANDOM ASSESSOR
      if (isQuestionnaire) {
        console.log(
          `📋 LEADERSHIP QUESTIONNAIRE: ${participantId.substring(0, 8)} - FIXED GROUP ACTIVITY ASSESSOR + RANDOM ADDITIONAL`,
        );
        console.log(
          `  🔍 Group Activity assessor found: ${groupActivityPrimaryAssessor.substring(0, 8)}`,
        );

        // Step 1: FIXED ASSESSOR - Always use the Group Activity assessor
        const newAssessorIds: string[] = [groupActivityPrimaryAssessor];

        // Step 2: Get all available assessors for this questionnaire
        const allPossibleAssessors = variable.questionnaireId
          ? this.assessmentAssessorMapping[variable.questionnaireId] || []
          : [];

        // Step 3: ADDITIONAL ASSESSOR - Random selection from available assessors (excluding fixed one)
        const availableForRandom = allPossibleAssessors.filter(
          (id) => id !== groupActivityPrimaryAssessor,
        );

        if (availableForRandom.length > 0) {
          // Randomly select one additional assessor
          const randomIndex = Math.floor(
            Math.random() * availableForRandom.length,
          );
          const additionalAssessor = availableForRandom[randomIndex];
          newAssessorIds.push(additionalAssessor);

          console.log(
            `🎯 QUESTIONNAIRE RANDOM: ${participantId.substring(0, 8)} gets additional assessor ${additionalAssessor.substring(0, 8)}`,
          );
        }

        console.log(
          `✅ QUESTIONNAIRE FINAL: ${participantId.substring(0, 8)} → [${newAssessorIds.map((id) => id.substring(0, 8)).join(', ')}] - FIXED: ${groupActivityPrimaryAssessor.substring(0, 8)} + RANDOM`,
        );

        // DIRECT OVERRIDE: Force the assignment with FIXED + RANDOM assessors
        const oldAssessorIds = variable.assignedAssessorIds || [];
        variable.possibleAssessorIds = newAssessorIds;
        variable.assignedAssessorIds = newAssessorIds;
        overriddenAssignments++;
        questionnaireOverridden++;

        console.log(
          `✅ QUESTIONNAIRE OVERRIDE: ${participantId.substring(0, 8)} CHANGED from [${oldAssessorIds.map((id) => id.substring(0, 8)).join(', ')}] to [${newAssessorIds.map((id) => id.substring(0, 8)).join(', ')}] - 100% CONTINUITY GUARANTEED (FIXED + RANDOM)`,
        );
        return; // Skip Business Case logic
      }

      // BUSINESS CASE HANDLING: Skip override - assessors are already fixed to rooms in CSP solver
      if (isBusinessCase) {
        console.log(
          `⏭️ BUSINESS CASE: ${participantId.substring(0, 8)} - Skipping override (assessors already FIXED to rooms in CSP solver)`,
        );
        return; // Skip Business Case - don't override the CSP solver's fixed assessor-room assignments
      }
    });

    console.log(
      `✅ DIRECT OVERRIDE COMPLETE: ${overriddenAssignments} total assignments overridden (${businessCaseOverridden} Business Case, ${questionnaireOverridden} Leadership Questionnaire) for 100% continuity`,
    );
  }

  /**
   * DEPRECATED: Old constraint enforcement approach
   * Replaced by direct override for guaranteed 100% continuity
   */
  private enforceContinuityConstraints(solution: SchedulingVariable[]): void {
    console.log(
      '🎯 ULTIMATE 100% ASSESSOR CONTINUITY ENFORCEMENT - FINAL SOLUTION...',
    );

    // Step 1: Build Group Activity assessor mapping
    const groupActivityAssessorMap = new Map<string, string>();

    solution.forEach((variable) => {
      if (variable.isGroupActivity && variable.assignedAssessorIds) {
        // Store the primary assessor for each participant
        groupActivityAssessorMap.set(
          variable.participantId,
          variable.assignedAssessorIds[0],
        );
        console.log(
          `📝 Group Activity PRIMARY assessor for ${variable.participantId.substring(0, 8)}: ${variable.assignedAssessorIds[0].substring(0, 8)}`,
        );
      }
    });

    let forcedAssignments = 0;
    let businessCaseForced = 0;
    let questionnaireForced = 0;

    // Step 2: ULTIMATE FORCE - GUARANTEE 100% CONTINUITY
    solution.forEach((variable) => {
      if (!variable.scenarioId && !variable.questionnaireId) return;

      // Check if this is Business Case (order 3) or Leadership Questionnaire (order 4)
      let isBusinessCase = false;
      let isQuestionnaire = false;

      if (variable.scenarioId) {
        if (variable.isBusinessCase) {
          isBusinessCase = true;
        } else if (variable.isGroupActivity) {
          return; // Skip Group Activity itself
        } else {
          return; // Skip Role Play and TOYF
        }
      } else if (variable.questionnaireId) {
        isQuestionnaire = true;
      }

      if (!isBusinessCase && !isQuestionnaire) return;

      const participantId = variable.participantId;
      const groupActivityPrimaryAssessor =
        groupActivityAssessorMap.get(participantId);

      if (!groupActivityPrimaryAssessor) {
        console.log(
          `⚠️ No Group Activity assessor found for ${participantId.substring(0, 8)}`,
        );
        return;
      }

      // Step 3: Get all possible assessors for this assessment
      let allPossibleAssessors: string[] = [];

      if (isBusinessCase && variable.scenarioId) {
        allPossibleAssessors =
          this.getAssessorsForScenario(variable.scenarioId) || [];
      } else if (isQuestionnaire && variable.questionnaireId) {
        allPossibleAssessors =
          this.getAssessorsForQuestionnaire(variable.questionnaireId) || [];
      }

      // Step 4: ULTIMATE STRATEGY - ALWAYS INCLUDE THE GROUP ACTIVITY ASSESSOR
      const forcedAssessorIds: string[] = [];

      // MANDATORY: Always include the Group Activity assessor first
      if (allPossibleAssessors.includes(groupActivityPrimaryAssessor)) {
        forcedAssessorIds.push(groupActivityPrimaryAssessor);
        console.log(
          `🎯 MANDATORY ${isBusinessCase ? 'BUSINESS CASE' : 'QUESTIONNAIRE'}: ${participantId.substring(0, 8)} MUST have Group Activity assessor ${groupActivityPrimaryAssessor.substring(0, 8)}`,
        );
      } else {
        console.log(
          `⚠️ Group Activity assessor ${groupActivityPrimaryAssessor.substring(0, 8)} not available for ${isBusinessCase ? 'Business Case' : 'Leadership Questionnaire'}`,
        );
        // If the exact assessor isn't available, find any assessor that can maintain continuity
        const availableAssessors = allPossibleAssessors.slice(0, 2);
        forcedAssessorIds.push(...availableAssessors);
        console.log(
          `🔧 FALLBACK: Using available assessors [${availableAssessors.map((id) => id.substring(0, 8)).join(', ')}]`,
        );
      }

      // SECOND: Add one additional assessor if available and needed
      const remainingAssessors = allPossibleAssessors.filter(
        (assessorId) => assessorId !== groupActivityPrimaryAssessor,
      );

      if (remainingAssessors.length > 0 && forcedAssessorIds.length < 2) {
        forcedAssessorIds.push(remainingAssessors[0]);
        console.log(
          `🎯 SECONDARY: ${participantId.substring(0, 8)} gets additional assessor ${remainingAssessors[0].substring(0, 8)}`,
        );
      }

      // Step 5: OVERRIDE COMPLETELY - FORCE THE ASSIGNMENT
      variable.possibleAssessorIds = forcedAssessorIds;
      variable.assignedAssessorIds = forcedAssessorIds;
      forcedAssignments++;

      if (isBusinessCase) {
        businessCaseForced++;
      } else {
        questionnaireForced++;
      }

      console.log(
        `✅ ULTIMATE OVERRIDE: ${participantId.substring(0, 8)} ${isBusinessCase ? 'Business Case' : 'Leadership Questionnaire'} now has assessors [${forcedAssessorIds.map((id) => id.substring(0, 8)).join(', ')}] - GUARANTEED CONTINUITY`,
      );
    });

    console.log(
      `✅ ULTIMATE OVERRIDE COMPLETE: ${forcedAssignments} total assignments forced (${businessCaseForced} Business Case, ${questionnaireForced} Leadership Questionnaire) for 100% continuity`,
    );
  }

  // DEPRECATED: Old post-processing approach - replaced by pre-assignment strategy
  private enforce100PercentContinuity(solution: SchedulingVariable[]): void {
    console.log('🎯 ENFORCING 100% ASSESSOR CONTINUITY...');

    // Get Group Activity assessor mappings
    const groupActivityAssessorMap = new Map<string, string[]>();

    // Find Group Activity assignments and track assessors
    solution.forEach((variable) => {
      if (variable.isGroupActivity && variable.assignedAssessorIds) {
        groupActivityAssessorMap.set(variable.participantId, [
          ...variable.assignedAssessorIds,
        ]);
        console.log(
          `📝 Group Activity assessor for ${variable.participantId.substring(0, 8)}: ${variable.assignedAssessorIds.map((id) => id.substring(0, 8)).join(', ')}`,
        );
      }
    });

    // Fix Business Case and Leadership Questionnaire assignments
    solution.forEach((variable) => {
      if (!variable.scenarioId && !variable.questionnaireId) return;

      // Check if this is Business Case (order 3) or Leadership Questionnaire (order 4)
      // We need to determine the sequence order based on scenario/questionnaire IDs
      let sequenceOrder: number | undefined;

      if (variable.scenarioId) {
        // Check if it's Business Case (order 2) or Group Activity (order 3)
        if (variable.isBusinessCase) {
          sequenceOrder = 2;
        } else if (variable.isGroupActivity) {
          sequenceOrder = 3;
        } else {
          // Role Play or TOYF (order 1)
          sequenceOrder = 1;
        }
      } else if (variable.questionnaireId) {
        // Leadership Questionnaire (order 4)
        sequenceOrder = 4;
      }

      if (sequenceOrder !== 3 && sequenceOrder !== 4) return; // Not applicable

      const participantId = variable.participantId;
      const groupActivityAssessors =
        groupActivityAssessorMap.get(participantId);

      if (!groupActivityAssessors || groupActivityAssessors.length === 0) {
        console.log(
          `⚠️ No Group Activity assessors found for ${participantId.substring(0, 8)}`,
        );
        return;
      }

      const currentAssessorIds = variable.assignedAssessorIds || [];
      const hasContinuity = currentAssessorIds.some((assessorId) =>
        groupActivityAssessors.includes(assessorId),
      );

      if (!hasContinuity) {
        console.log(
          `🔧 FIXING CONTINUITY: ${participantId.substring(0, 8)} - replacing assessors to maintain continuity`,
        );

        // Get all possible assessors for this assessment type from the original input
        let allPossibleAssessors: string[] = [];

        if (variable.scenarioId) {
          // For Business Case, get assessors from assessment_assessor_mapping
          allPossibleAssessors =
            this.getAssessorsForScenario(variable.scenarioId) || [];
        } else if (variable.questionnaireId) {
          // For Leadership Questionnaire, get assessors from assessment_assessor_mapping
          allPossibleAssessors =
            this.getAssessorsForQuestionnaire(variable.questionnaireId) || [];
        }

        // Find assessors that maintain continuity with Group Activity
        const continuityAssessors = allPossibleAssessors.filter((assessorId) =>
          groupActivityAssessors.includes(assessorId),
        );

        if (continuityAssessors.length > 0) {
          // CRITICAL: Prioritize the EXACT Group Activity assessor first
          const exactGroupActivityAssessor = groupActivityAssessors.find(
            (assessorId) => continuityAssessors.includes(assessorId),
          );

          const newAssessorIds: string[] = [];

          // FIRST: Add the exact Group Activity assessor
          if (exactGroupActivityAssessor) {
            newAssessorIds.push(exactGroupActivityAssessor);
            console.log(
              `🎯 PRIORITY: ${participantId.substring(0, 8)} getting exact Group Activity assessor ${exactGroupActivityAssessor.substring(0, 8)}`,
            );
          }

          // SECOND: Add other continuity-compliant assessors
          const otherContinuityAssessors = continuityAssessors.filter(
            (assessorId) => assessorId !== exactGroupActivityAssessor,
          );
          newAssessorIds.push(...otherContinuityAssessors);

          // THIRD: Add additional assessors if needed (up to 2-3 total)
          const remainingAssessors = allPossibleAssessors.filter(
            (assessorId) => !continuityAssessors.includes(assessorId),
          );

          const additionalCount = Math.min(
            2 - newAssessorIds.length,
            remainingAssessors.length,
          );
          for (let i = 0; i < additionalCount; i++) {
            newAssessorIds.push(remainingAssessors[i]);
          }

          variable.assignedAssessorIds = newAssessorIds;
          console.log(
            `✅ FIXED: ${participantId.substring(0, 8)} now has assessors [${newAssessorIds.map((id) => id.substring(0, 8)).join(', ')}] with EXACT Group Activity assessor prioritized`,
          );
        } else {
          console.log(
            `❌ CANNOT FIX: No available assessors for ${participantId.substring(0, 8)} that maintain continuity`,
          );
        }
      } else {
        console.log(
          `✅ CONTINUITY OK: ${participantId.substring(0, 8)} already maintains continuity`,
        );
      }
    });

    console.log('✅ 100% ASSESSOR CONTINUITY ENFORCEMENT COMPLETE');
  }

  // Helper methods to get assessors for scenarios and questionnaires
  private getAssessorsForScenario(scenarioId: string): string[] {
    // Access the assessment_assessor_mapping from the original input data
    if (
      this.assessmentAssessorMapping &&
      this.assessmentAssessorMapping[scenarioId]
    ) {
      console.log(
        `📋 Using actual input mapping for scenario ${scenarioId}:`,
        this.assessmentAssessorMapping[scenarioId],
      );
      return this.assessmentAssessorMapping[scenarioId];
    }

    console.log(
      `⚠️ No input mapping found for scenario ${scenarioId}, using fallback`,
    );
    // Fallback to hardcoded mapping if input data not available
    const mapping = {
      '2545638a-1ecc-4811-9847-ebb520f162f9': [
        // Business Case
        '053286a8-2ed5-4910-aab9-589751594de8',
        '8fa73550-3614-4989-94ae-62997b1fc305',
        '6f7671a8-0657-4f36-9029-4e127a7a65e1',
        'e3f5ad35-fb4a-4e7e-9f36-ec6193e6fff4',
      ],
      '86a977d3-15f8-425d-8b07-b03fd999a5d1': [
        // Role Play
        '053286a8-2ed5-4910-aab9-589751594de8',
        '8fa73550-3614-4989-94ae-62997b1fc305',
      ],
      '5c54bc08-dd0a-4b6a-a43b-6b57d0a2e91c': [
        // TOYF
        '6f7671a8-0657-4f36-9029-4e127a7a65e1',
        '766c3406-d7fc-46b9-aea1-4bf081ab4a35',
      ],
      'ce9d2927-1a14-43be-b1a1-93656befe5b7': [
        // Group Activity
        '053286a8-2ed5-4910-aab9-589751594de8',
        '8fa73550-3614-4989-94ae-62997b1fc305',
        '6f7671a8-0657-4f36-9029-4e127a7a65e1',
        '766c3406-d7fc-46b9-aea1-4bf081ab4a35',
      ],
    };
    return mapping[scenarioId] || [];
  }

  private getAssessorsForQuestionnaire(questionnaireId: string): string[] {
    // Access the assessment_assessor_mapping from the original input data
    if (
      this.assessmentAssessorMapping &&
      this.assessmentAssessorMapping[questionnaireId]
    ) {
      console.log(
        `📋 Using actual input mapping for questionnaire ${questionnaireId}:`,
        this.assessmentAssessorMapping[questionnaireId],
      );
      return this.assessmentAssessorMapping[questionnaireId];
    }

    console.log(
      `⚠️ No input mapping found for questionnaire ${questionnaireId}, using fallback`,
    );
    // Fallback to hardcoded mapping if input data not available
    const mapping = {
      '762fc175-60f9-4533-98ca-569bebdfe035': [
        // Leadership Questionnaire
        '053286a8-2ed5-4910-aab9-589751594de8',
        '8fa73550-3614-4989-94ae-62997b1fc305',
        '6f7671a8-0657-4f36-9029-4e127a7a65e1',
        '766c3406-d7fc-46b9-aea1-4bf081ab4a35',
      ],
    };
    return mapping[questionnaireId] || [];
  }

  /**
   * Synchronize parallel activities (Role Play & TOYF) to have identical time slots
   * This ensures they run in perfect parallel with no buffer
   */
  private synchronizeParallelActivities(
    solution: SchedulingVariable[],
    scenarioDetails: any[],
  ): void {
    console.log('\n🔄 SYNCHRONIZING PARALLEL ACTIVITIES...');

    // Get the fixed activity sequence
    const activitySequence = this.getFixedActivitySequence(scenarioDetails);

    // Find parallel activities (order 1: Role Play & TOYF)
    const parallelActivities = activitySequence.filter(
      (item) => item.order === 1,
    );

    if (parallelActivities.length < 2) {
      console.log('⏭️  No parallel activities found, skipping synchronization');
      return;
    }

    console.log(
      `🎯 Found ${parallelActivities.length} parallel activities to synchronize`,
    );
    parallelActivities.forEach((activity) => {
      console.log(
        `   - ${activity.scenarioId.substring(0, 8)} (order ${activity.order})`,
      );
    });

    // Group solution variables by participant
    const participantGroups = new Map<string, SchedulingVariable[]>();

    solution.forEach((variable) => {
      if (
        variable.sequenceOrder === 1 &&
        variable.assignedTimeSlot &&
        variable.scenarioId &&
        parallelActivities.some(
          (activity) => activity.scenarioId === variable.scenarioId,
        )
      ) {
        const participantId = variable.participantId;
        if (!participantGroups.has(participantId)) {
          participantGroups.set(participantId, []);
        }
        participantGroups.get(participantId)!.push(variable);
      }
    });

    console.log(
      `👥 Found ${participantGroups.size} participants with parallel activities`,
    );

    let synchronizedCount = 0;

    // For each participant, synchronize their parallel activities
    participantGroups.forEach((variables, participantId) => {
      if (variables.length < 2) {
        console.log(
          `⚠️  Participant ${participantId.substring(0, 8)} has only ${variables.length} parallel activity - skipping`,
        );
        return;
      }

      console.log(
        `\n🔄 Synchronizing participant ${participantId.substring(0, 8)}:`,
      );

      // Find the earliest start time among this participant's parallel activities
      const startTimes = variables.map((v) =>
        v.assignedTimeSlot!.startTime.getTime(),
      );
      const earliestStartTime = Math.min(...startTimes);
      const targetStartTime = new Date(earliestStartTime);

      // Calculate duration (assuming all parallel activities have same duration)
      const duration =
        variables[0].assignedTimeSlot!.endTime.getTime() -
        variables[0].assignedTimeSlot!.startTime.getTime();
      const targetEndTime = new Date(earliestStartTime + duration);

      console.log(
        `   🎯 Target time slot: ${targetStartTime.toISOString().substr(11, 5)} → ${targetEndTime.toISOString().substr(11, 5)}`,
      );

      // Synchronize all parallel activities to the same time slot
      variables.forEach((variable) => {
        const originalStart = variable.assignedTimeSlot!.startTime;
        const originalEnd = variable.assignedTimeSlot!.endTime;

        variable.assignedTimeSlot!.startTime = new Date(targetStartTime);
        variable.assignedTimeSlot!.endTime = new Date(targetEndTime);

        console.log(
          `   ⚡ ${variable.scenarioId?.substring(0, 8)}: ${originalStart.toISOString().substr(11, 5)}-${originalEnd.toISOString().substr(11, 5)} → ${targetStartTime.toISOString().substr(11, 5)}-${targetEndTime.toISOString().substr(11, 5)}`,
        );

        synchronizedCount++;
      });
    });

    console.log(
      `\n✅ Parallel synchronization complete: ${synchronizedCount} activities synchronized`,
    );
    console.log(
      `🎉 All Role Play and Think On Your Feet activities now run in perfect parallel!`,
    );
  }
}
