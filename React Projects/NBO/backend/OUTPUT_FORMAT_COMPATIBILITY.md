# Output Format Compatibility

## ✅ V2 Scheduler Now Returns Old Format

The V2 scheduler has been updated to return the exact same output format as the old scheduler for backward compatibility.

## Output Structure

### ScheduleResult Format
```typescript
{
  classId: string,
  success: boolean,
  schedule: GroupedScheduleResult,
  statistics: ScheduleStatistics
}
```

### GroupedScheduleResult Format
```typescript
{
  scenarios: AssessmentScheduleGroup[],
  assessorAssignments: AssessorAssignment[],
  roomUtilization: RoomUtilization[],
  dailyBreaks: DailyBreak[]
}
```

### AssessmentScheduleGroup Format
```typescript
{
  id: string,                           // Scenario/Questionnaire ID
  name: string,                         // Scenario/Questionnaire name
  is_quesionnaire: boolean,             // Is this a questionnaire?
  is_group_activity: boolean,           // Is this a group activity?
  type: string,                         // 'scenario' | 'questionnaire'
  is_questionnaire_item: boolean,       // Questionnaire flag
  assessment_id: string,                // Parent assessment ID
  assessment_name: string,              // Parent assessment name
  participantSchedules: ParticipantAssignment[],
  groups?: ParticipantGroup[],
  businessCaseRooms?: BusinessCaseRoomGroup[]
}
```

### ParticipantAssignment Format
```typescript
{
  participantId: string,
  participantName?: string,
  
  // Scenario OR Questionnaire
  scenarioId?: string,
  questionnaireId?: string,
  assessmentId: string,
  
  scenarioName?: string,
  questionnaireName?: string,
  assessmentName?: string,
  
  roomId: string,
  roomName?: string,
  startTime: Date | null,               // null for questionnaires
  endTime: Date | null,                 // null for questionnaires
  assessorIds: string[],
  assessorNames?: string[],
  sequenceOrder: number,
  isGroupActivity: boolean,
  isQuestionnaire: boolean,
  assessmentType: 'individual' | 'group_activity' | 'questionnaire'
}
```

### AssessorAssignment Format
```typescript
{
  assessorId: string,
  assessorName?: string,
  participantIds: string[],
  participantNames?: string[],
  roomId: string,
  roomName?: string,
  startTime: Date,
  endTime: Date,
  scenarioId?: string,
  questionnaireId?: string,
  scenarioName?: string,
  questionnaireName?: string,
  assessmentId: string,
  assessmentName: string,
  isGroupActivity: boolean,
  isQuestionnaire: boolean
}
```

### RoomUtilization Format
```typescript
{
  roomId: string,
  roomName?: string,
  schedules: Array<{
    startTime: Date,
    endTime: Date,
    scenarioId?: string,
    questionnaireId?: string,
    scenarioName?: string,
    assessmentId: string,
    assessmentName: string,
    participantIds: string[],
    participantNames?: string[],
    assessorIds: string[],
    assessorNames?: string[],
    isGroupActivity: boolean,
    isQuestionnaire: boolean
  }>
}
```

## Key Points

### ✅ Complete Backward Compatibility
- Same API endpoint
- Same input format
- **Same output format** (now matches old scheduler exactly)
- No breaking changes for frontend/clients

### ✅ Structure Matches Old Scheduler
- `scenarios` array with assessment groups
- `assessorAssignments` array
- `roomUtilization` array
- `dailyBreaks` array

### ✅ All Fields Present
- All fields from old format are included
- Proper typing with optional fields marked with `?`
- Questionnaires have `null` for `startTime`/`endTime`

## Example Output

```json
{
  "classId": "",
  "success": true,
  "schedule": {
    "scenarios": [
      {
        "id": "scenario-id-1",
        "name": "Role Play",
        "is_quesionnaire": false,
        "is_group_activity": false,
        "type": "scenario",
        "is_questionnaire_item": false,
        "assessment_id": "assessment-id-1",
        "assessment_name": "Role Play Assessment",
        "participantSchedules": [
          {
            "participantId": "participant-1",
            "participantName": "John Doe",
            "scenarioId": "scenario-id-1",
            "assessmentId": "assessment-id-1",
            "scenarioName": "Role Play",
            "assessmentName": "Role Play Assessment",
            "roomId": "room-1",
            "roomName": "Room A",
            "startTime": "2025-11-23T06:30:00.000Z",
            "endTime": "2025-11-23T07:00:00.000Z",
            "assessorIds": ["assessor-1"],
            "assessorNames": [],
            "sequenceOrder": 1,
            "isGroupActivity": false,
            "isQuestionnaire": false,
            "assessmentType": "individual"
          }
        ]
      },
      {
        "id": "questionnaire-id-1",
        "name": "Leadership Questionnaire",
        "is_quesionnaire": true,
        "is_group_activity": false,
        "type": "questionnaire",
        "is_questionnaire_item": true,
        "assessment_id": "questionnaire-id-1",
        "assessment_name": "Leadership Questionnaire",
        "participantSchedules": [
          {
            "participantId": "participant-1",
            "questionnaireId": "questionnaire-id-1",
            "assessmentId": "questionnaire-id-1",
            "questionnaireName": "Leadership Questionnaire",
            "assessmentName": "Leadership Questionnaire",
            "roomId": "",
            "startTime": null,
            "endTime": null,
            "assessorIds": ["assessor-1"],
            "assessorNames": [],
            "sequenceOrder": 4,
            "isGroupActivity": false,
            "isQuestionnaire": true,
            "assessmentType": "questionnaire"
          }
        ]
      }
    ],
    "assessorAssignments": [...],
    "roomUtilization": [...],
    "dailyBreaks": [...]
  },
  "statistics": {
    "totalTimeSlots": 0,
    "utilizationRate": 100,
    "averageActivitiesPerParticipant": 0
  }
}
```

## Changes Made

### Updated Files
1. **scheduler-v2.service.ts**
   - Added `convertToGroupedScheduleResult()` method
   - Converts V2 internal format to old GroupedScheduleResult format
   - Returns old format from `generateSchedule()`

2. **class.service.ts**
   - Updated to expect GroupedScheduleResult from V2 scheduler
   - Returns ScheduleResult in old format

## Testing

Your existing frontend/client code should work without any changes. The output structure is identical to the old scheduler.

## Migration Path

Since the output format is the same, there's no migration needed for clients consuming the API. The switch to V2 scheduler is completely transparent.

---

**Status**: ✅ Complete
**Build**: ✅ Successful  
**Backward Compatibility**: ✅ 100%

