// Removed DailyTimeWindow - simplified for consistent daily schedules

// NEW: Daily break configuration interface
export interface DailyBreakConfiguration {
  date: string; // "2025-08-01" - Date in YYYY-MM-DD format
  first_break_start_time: string; // UTC datetime string: "2025-08-01T10:30:00.000Z"
  first_break_end_time: string; // UTC datetime string: "2025-08-01T10:45:00.000Z"
  second_break_start_time: string; // UTC datetime string: "2025-08-01T15:00:00.000Z"
  second_break_end_time: string; // UTC datetime string: "2025-08-01T15:15:00.000Z"
  lunch_break_start_time: string; // UTC datetime string: "2025-08-01T12:30:00.000Z"
  lunch_break_end_time: string; // UTC datetime string: "2025-08-01T13:30:00.000Z"
}

export interface SchedulingInput {
  start_date: Date | string; // Date only: "2025-08-01" or Date object (will be converted to local timezone)
  end_date: Date | string; // Date only: "2025-08-02" or Date object (will be converted to local timezone)
  facility_id: string;
  project_id?: string; // Optional project ID
  participantIds: string[];

  // NEW: Scenario-based scheduling
  scenarioIds: string[]; // Array of scenario IDs to schedule (instead of assessmentIds)
  questionnaireIds?: string[]; // Array of questionnaire IDs for leadership assessments

  duration_of_each_activity: number; // minutes (for individual activities)
  group_activity_duration: number; // minutes (for group activities - all groups run simultaneously)

  // NEW: Multi-day support - all days use same daily schedule
  daily_start_time?: string; // Accepts HH:mm (e.g., "09:00") or UTC datetime string
  daily_end_time?: string; // Accepts HH:mm (e.g., "18:00") or UTC datetime string

  // NEW: Configurable break durations (in minutes)
  short_break_duration?: number; // Duration of short breaks (first and second) in minutes (default: 15)
  // Note: Lunch break duration is fixed at 60 minutes

  // Derived automatically: daily break plan per day (no longer supplied by client)
  daily_breaks?: DailyBreakConfiguration[];

  // NOTE: Group size now determined by number of available assessors for the group activity

  // OPTIONAL: Assessor assignment mapping
  assessment_assessor_mapping?: {
    [assessmentId: string]: string[];
  }; // Optional mapping of scenario/questionnaire IDs to assessor IDs - if not provided, all available assessors will be used

  // REQUIRED: Room assignment mapping (scenarios only, questionnaires don't use rooms)
  room_assessment_mapping: {
    [roomId: string]: string[]; // Array of scenario IDs that can use this room
  };

  // NEW: Business Case multi-room configuration
  business_case_rooms?: string[]; // Array of room IDs specifically for Business Case (if not provided, uses room_assessment_mapping)

  // NEW: Fixed room-assessor mapping for Business Case
  business_case_room_assessors?: {
    [roomId: string]: string[]; // Array of specific assessor IDs for each Business Case room
  };

  // REMOVED: activity_sequence (now uses fixed order: Role Play → TOYF → Business Case → Group Activity → Leadership Questionnaire)
}

// NEW: Activity sequence configuration
export interface ActivitySequenceItem {
  scenarioId: string; // Scenario or questionnaire ID
  order: number; // Sequence order (1 = first, 2 = second, etc.)
  isBusinessCase?: boolean; // NEW: Flag to identify Business Case for special multi-room handling
}

export interface TimeSlot {
  id: string;
  startTime: Date; // UTC Date object - will be serialized as UTC string in API responses
  endTime: Date; // UTC Date object - will be serialized as UTC string in API responses
  duration: number; // minutes
  dayIndex?: number; // NEW: Index of the day in daily_time_windows array (for multi-day scheduling)
  date?: Date | string; // NEW: The specific date this slot belongs to (UTC timezone)
}

export interface SchedulingVariable {
  id: string;
  participantId: string;

  // NEW: Scenario-based scheduling
  scenarioId?: string; // For regular scenarios
  questionnaireId?: string; // For leadership questionnaires
  assessmentId: string; // Keep for reference to parent assessment

  possibleTimeSlots: TimeSlot[];
  possibleRoomIds: string[];
  possibleAssessorIds: string[];
  assignedTimeSlot?: TimeSlot;
  assignedRoomId?: string;
  assignedAssessorIds?: string[];
  priority: number;

  // NEW: Type identification
  isQuestionnaire: boolean; // Whether this is a leadership questionnaire
  isGroupActivity: boolean; // Whether this is a group activity
  isBusinessCase?: boolean; // NEW: Whether this is a Business Case (special multi-room group activity)

  // NEW: Sequence information
  sequenceOrder?: number; // Order in activity sequence (1 = first, 2 = second, etc.)

  // NEW: Group information for group activities
  groupInfo?: { participants: string[]; assessorId: string }[]; // For group activities: breakdown of participants and assessors per group
  groupActivityDuration?: number; // For group activities: custom duration in minutes

  // NEW: Business Case multi-room information
  businessCaseRooms?: string[]; // For Business Case: array of room IDs to use
}

export interface AvailabilityMatrix {
  assessors: Map<string, Map<string, boolean>>; // assessorId -> timeSlotId -> available
  rooms: Map<string, Map<string, boolean>>; // roomId -> timeSlotId -> available
  participants: Map<string, Map<string, boolean>>; // participantId -> timeSlotId -> available
  timeSlots: TimeSlot[];
}

export interface ScheduleResult {
  classId?: string;
  success: boolean;
  schedule: GroupedScheduleResult | any; // Allow any for backward compatibility
  conflicts?: ConflictReport[];
  statistics?: ScheduleStatistics;
  message?: string;
  warnings?: string[];
  errors?: string[];
  metadata?: any;
}

export interface ParticipantAssignment {
  participantId: string;
  participantName?: string; // NEW: participant name

  // NEW: Scenario-based scheduling
  scenarioId?: string; // For regular scenarios
  questionnaireId?: string; // For leadership questionnaires
  assessmentId: string; // Parent assessment reference

  scenarioName?: string; // NEW: scenario name
  questionnaireName?: string; // NEW: questionnaire name
  assessmentName?: string; // NEW: assessment name

  roomId: string;
  roomName?: string; // NEW: room name
  startTime: Date | null; // Local timezone Date object, null for questionnaires
  endTime: Date | null; // Local timezone Date object, null for questionnaires
  assessorIds: string[];
  assessorNames?: string[]; // NEW: assessor names
  sequenceOrder: number;
  isGroupActivity: boolean; // flag for group activities
  isQuestionnaire: boolean; // flag for leadership questionnaires
  assessmentType: 'individual' | 'group_activity' | 'questionnaire'; // explicit type
}

export interface AssessorAssignment {
  assessorId: string;
  participantAssessmentId: string;
  startTime: Date | null; // null for questionnaires
  endTime: Date | null; // null for questionnaires
}

export interface RoomUtilization {
  roomId: string;
  utilizationPercentage: number;
  timeSlots: {
    startTime: Date | null;
    endTime: Date | null;
    participantId: string;
    assessmentId: string;
  }[];
}

// DEPRECATED: LunchBreak - replaced by DailyBreak
export interface LunchBreak {
  participantId: string;
  startTime: Date;
  endTime: Date;
  groupId: string;
}

// NEW: Daily break tracking (replaces LunchBreak)
export interface DailyBreak {
  type: 'first_break' | 'second_break' | 'lunch_break';
  participantId?: string; // Optional - breaks are shared across all participants
  date: string; // Date this break applies to (YYYY-MM-DD)
  startTime: Date;
  endTime: Date;
  groupId?: string; // Optional break grouping
}

export interface ConflictReport {
  type: 'assessor' | 'room' | 'participant';
  conflictingIds: string[];
  timeSlot: TimeSlot;
  description: string;
}

export interface ScheduleStatistics {
  totalDuration: number; // minutes
  averageParticipantUtilization: number;
  averageRoomUtilization: number;
  averageAssessorUtilization: number;
  totalConflicts: number;
}

export interface ParticipantGroup {
  groupId: string; // Group identifier (e.g., "group_1", "group_2")
  participantIds: string[]; // Participants in this group
  startTime: Date;
  endTime: Date;
  roomId: string;
  roomName: string;
  assessorId: string; // Single assessor assigned to this group
  assessorName: string; // Single assessor name
  participants: ParticipantAssignment[]; // Detailed participant info
}

// NEW: Business Case room group for multi-room distribution
export interface BusinessCaseRoomGroup {
  roomId: string;
  roomName?: string;
  participantIds: string[];
  assessorIds: string[];
  assessorNames?: string[];
  startTime: Date | null;
  endTime: Date | null;
}

export interface AssessmentScheduleGroup {
  id: string; // Scenario ID
  name: string; // Scenario name
  is_quesionnaire: boolean; // Questionnaire flag
  is_group_activity: boolean; // Group activity flag
  type: string; // Type: 'scenario', 'questionnaire', etc.
  is_questionnaire_item: boolean; // Questionnaire item flag
  assessment_id: string; // Parent assessment ID
  assessment_name: string; // Parent assessment name
  participantSchedules: ParticipantAssignment[]; // For individual activities
  groups?: ParticipantGroup[]; // For group activities - NEW
  businessCaseRooms?: BusinessCaseRoomGroup[]; // For Business Case multi-room activities - NEW
}

export interface GroupedScheduleResult {
  scenarios: AssessmentScheduleGroup[]; // Changed from assessmentGroups to scenarios
  assessorAssignments: AssessorAssignment[];
  roomUtilization: RoomUtilization[];
  dailyBreaks: DailyBreak[]; // NEW: Replace lunchBreaks with dailyBreaks
  welcomeSession?: {
    // NEW: Welcome session (15 min before class start)
    class_date: string; // Date in YYYY-MM-DD format
    startTime: Date | null;
    endTime: Date | null;
  };
  endingSession?: {
    // NEW: Ending session (after group activity)
    class_date: string; // Date in YYYY-MM-DD format
    startTime: Date | null;
    endTime: Date | null;
  };
}

export interface SchedulingResult {
  classId: string;
  success: boolean;
  schedule: GroupedScheduleResult;
  statistics: ScheduleStatistics;
}
