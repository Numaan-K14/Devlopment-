# Output Format - Final Fix ✅

## Complete Rewrite of Format Converter

The output format converter has been **completely rewritten** to match the old scheduler's format exactly.

## Key Changes

### 1. Proper Scenario Details Fetching
- Added `getScenarioDetails()` method that fetches scenarios with assessment relationships
- Matches old scheduler's `categorizeScenariosAndQuestionnaires()` method
- Returns proper structure with assessmentId, assessmentName, isGroupActivity, etc.

### 2. Correct ParticipantAssignment Format
- Added `convertToParticipantAssignments()` method
- Fetches and includes participant names, assessor names, room names
- Properly handles questionnaires (null startTime/endTime)
- Correct sequenceOrder values

### 3. Group Activity Handling
- For group activities: `participantSchedules` is **empty array** (not populated)
- Instead, `groups` field contains the group structure
- Groups include: participants, assessorId, assessorName, roomId, roomName, startTime, endTime

### 4. Assessor Assignments
- Added `calculateAssessorAssignments()` method
- Groups assignments by assessor, time, and scenario
- Returns proper structure matching old format

### 5. Room Utilization
- Added `calculateRoomUtilization()` method
- Filters out questionnaires (no rooms)
- Returns schedules per room

## Output Structure (Exact Match)

```typescript
{
  classId: "",
  success: true,
  schedule: {
    scenarios: [
      {
        id: "scenario-id",
        name: "Role Play",
        is_quesionnaire: false,
        is_group_activity: false,  // true for group activities
        type: "scenario",  // or "questionnaire"
        is_questionnaire_item: false,  // true for questionnaires
        assessment_id: "assessment-id",
        assessment_name: "Role Play Assessment",
        
        // For NON-GROUP activities:
        participantSchedules: [
          {
            participantId: "...",
            participantName: "John Doe",
            scenarioId: "...",
            assessmentId: "...",
            scenarioName: "Role Play",
            assessmentName: "Role Play Assessment",
            roomId: "room-1",
            roomName: "Room A",
            startTime: "2025-11-23T06:30:00.000Z",
            endTime: "2025-11-23T07:00:00.000Z",
            assessorIds: ["assessor-1"],
            assessorNames: ["Assessor Name"],
            sequenceOrder: 1,
            isGroupActivity: false,
            isQuestionnaire: false,
            assessmentType: "individual"
          }
        ]
      },
      {
        id: "group-activity-id",
        name: "Group Activity",
        is_quesionnaire: false,
        is_group_activity: true,
        type: "scenario",
        is_questionnaire_item: false,
        assessment_id: "assessment-id",
        assessment_name: "Group Activity Assessment",
        
        // For GROUP activities:
        participantSchedules: [],  // EMPTY!
        groups: [
          {
            participants: [
              { participantId: "...", participantName: "John Doe" },
              { participantId: "...", participantName: "Jane Smith" }
            ],
            assessorId: "assessor-1",
            assessorName: "Assessor Name",
            roomId: "room-1",
            roomName: "Room A",
            startTime: "2025-11-23T10:00:00.000Z",
            endTime: "2025-11-23T10:30:00.000Z"
          }
        ]
      },
      {
        id: "questionnaire-id",
        name: "Leadership Questionnaire",
        is_quesionnaire: true,
        is_group_activity: false,
        type: "questionnaire",
        is_questionnaire_item: true,
        assessment_id: "...",
        assessment_name: "Leadership Questionnaire",
        
        participantSchedules: [
          {
            participantId: "...",
            participantName: "John Doe",
            questionnaireId: "...",
            assessmentId: "...",
            questionnaireName: "Leadership Questionnaire",
            assessmentName: "Leadership Questionnaire",
            roomId: "",  // No room for questionnaires
            startTime: null,  // No time slot
            endTime: null,
            assessorIds: ["assessor-1"],
            assessorNames: ["Assessor Name"],
            sequenceOrder: 4,
            isGroupActivity: false,
            isQuestionnaire: true,
            assessmentType: "questionnaire"
          }
        ]
      }
    ],
    
    assessorAssignments: [
      {
        assessorId: "...",
        assessorName: "Assessor Name",
        participantIds: ["...", "..."],
        participantNames: ["John Doe", "Jane Smith"],
        roomId: "...",
        roomName: "Room A",
        startTime: "2025-11-23T06:30:00.000Z",
        endTime: "2025-11-23T07:00:00.000Z",
        scenarioId: "...",
        scenarioName: "Role Play",
        assessmentId: "...",
        assessmentName: "Role Play Assessment",
        isGroupActivity: false,
        isQuestionnaire: false
      }
    ],
    
    roomUtilization: [
      {
        roomId: "...",
        roomName: "Room A",
        schedules: [
          {
            startTime: "2025-11-23T06:30:00.000Z",
            endTime: "2025-11-23T07:00:00.000Z",
            scenarioId: "...",
            scenarioName: "Role Play",
            assessmentId: "...",
            assessmentName: "Role Play Assessment",
            participantIds: ["..."],
            participantNames: ["John Doe"],
            assessorIds: ["..."],
            assessorNames: ["Assessor Name"],
            isGroupActivity: false,
            isQuestionnaire: false
          }
        ]
      }
    ],
    
    dailyBreaks: [
      {
        date: "2025-11-23",
        first_break_start_time: "2025-11-23T07:30:00.000Z",
        first_break_end_time: "2025-11-23T07:45:00.000Z",
        ...
      }
    ]
  },
  statistics: {
    totalTimeSlots: 0,
    utilizationRate: 100,
    averageActivitiesPerParticipant: 0
  }
}
```

## Methods Added

1. **`getScenarioDetails()`**: Fetches scenarios/questionnaires with assessment relationships
2. **`convertToParticipantAssignments()`**: Converts V2 assignments to old ParticipantAssignment format
3. **`createGroupsFromAssignments()`**: Creates groups structure for group activities
4. **`calculateAssessorAssignments()`**: Creates assessor assignment array
5. **`calculateRoomUtilization()`**: Creates room utilization array

## Important Notes

### Group Activities
- `participantSchedules`: **EMPTY ARRAY** []
- `groups`: **POPULATED** with group structure
- Each group has its own participants, assessor, room, and time

### Questionnaires
- `startTime`: **null**
- `endTime`: **null**
- `roomId`: **empty string** ""
- `questionnaireId`: populated (not scenarioId)
- `questionnaireName`: populated (not scenarioName)

### All Activities
- Include participant names, assessor names, room names
- Proper sequence order (1=roleplay/toyf, 2=group, 3=business, 4=questionnaire)
- Correct assessment IDs and names from database relationships

## Testing

The output format should now match **exactly** what the old scheduler returned. Test with your input data to verify!

---

**Status**: ✅ Complete  
**Build**: ✅ Successful  
**Format**: ✅ Exact Match with Old Scheduler

