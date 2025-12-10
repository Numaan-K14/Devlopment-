# Scheduling System V2 - Testing Guide

## Quick Start

The new V2 scheduler is now integrated and ready to test. The system uses the same API endpoint but with a completely rewritten backend.

## Testing the Schedule

### Option 1: Use Your Existing Input Data

You can test immediately with the input data you previously provided:

```json
{
  "start_date": "2025-11-23",
  "end_date": "2025-11-24",
  "facility_id": "6929fa9e-e883-439c-a088-84810b8d2aaa",
  "participantIds": [
    "37a7bd46-c204-4bd6-acfb-2360859f5e27",
    "a2048491-2bb5-4fb9-b4a0-242f80c43db4",
    "629d7647-217b-45a7-bc91-0c565a680550",
    "02670e55-3208-4f4f-8e65-62164872df54",
    "835f3e99-3b93-4a5f-8c6a-170e8d23c66f",
    "4627e224-b271-40da-bf96-3e63a18f97fc"
  ],
  "scenarioIds": [
    "23dd5320-1779-45f1-93ec-670f3611d71d",
    "e0520edc-ffdd-437b-a0a3-2dd63f501815",
    "00bfc2a5-d61a-43c8-a6e5-68227c3cb2bf",
    "680580d2-be55-46a8-b7c1-84590464857b"
  ],
  "questionnaireIds": [
    "4ac2f91e-95ca-4346-86d4-7413d0442ba3"
  ],
  "duration_of_each_activity": 30,
  "group_activity_duration": 30,
  "daily_breaks": [
    {
      "date": "2025-11-23",
      "first_break_start_time": "2025-11-23T07:30:00.000Z",
      "first_break_end_time": "2025-11-23T07:45:00.000Z",
      "second_break_start_time": "2025-11-23T12:45:00.000Z",
      "second_break_end_time": "2025-11-23T13:00:00.000Z",
      "lunch_break_start_time": "2025-11-23T09:30:00.000Z",
      "lunch_break_end_time": "2025-11-23T10:00:00.000Z"
    },
    {
      "date": "2025-11-24",
      "first_break_start_time": "2025-11-24T07:30:00.000Z",
      "first_break_end_time": "2025-11-24T07:45:00.000Z",
      "second_break_start_time": "2025-11-24T12:45:00.000Z",
      "second_break_end_time": "2025-11-24T13:00:00.000Z",
      "lunch_break_start_time": "2025-11-24T09:30:00.000Z",
      "lunch_break_end_time": "2025-11-24T10:00:00.000Z"
    }
  ],
  "daily_start_time": "2025-11-23T06:30:00.000Z",
  "daily_end_time": "2025-11-23T16:30:00.000Z",
  "assessment_assessor_mapping": {
    "23dd5320-1779-45f1-93ec-670f3611d71d": [
      "8fa73550-3614-4989-94ae-62997b1fc305",
      "053286a8-2ed5-4910-aab9-589751594de8"
    ],
    "e0520edc-ffdd-437b-a0a3-2dd63f501815": [
      "1723908d-e17c-4ad6-8a52-1fd4972cac00",
      "766c3406-d7fc-46b9-aea1-4bf081ab4a35"
    ],
    "00bfc2a5-d61a-43c8-a6e5-68227c3cb2bf": [
      "8fa73550-3614-4989-94ae-62997b1fc305",
      "053286a8-2ed5-4910-aab9-589751594de8",
      "1723908d-e17c-4ad6-8a52-1fd4972cac00",
      "766c3406-d7fc-46b9-aea1-4bf081ab4a35"
    ],
    "680580d2-be55-46a8-b7c1-84590464857b": [
      "8fa73550-3614-4989-94ae-62997b1fc305",
      "053286a8-2ed5-4910-aab9-589751594de8"
    ],
    "4ac2f91e-95ca-4346-86d4-7413d0442ba3": [
      "8fa73550-3614-4989-94ae-62997b1fc305",
      "053286a8-2ed5-4910-aab9-589751594de8"
    ]
  },
  "room_assessment_mapping": {
    "67d08764-4bb1-453e-a76a-9bc45b70b2ce": [
      "23dd5320-1779-45f1-93ec-670f3611d71d",
      "00bfc2a5-d61a-43c8-a6e5-68227c3cb2bf"
    ],
    "72a883e0-11a9-4fd4-bf49-b297c6cd5e35": [
      "e0520edc-ffdd-437b-a0a3-2dd63f501815",
      "00bfc2a5-d61a-43c8-a6e5-68227c3cb2bf",
      "680580d2-be55-46a8-b7c1-84590464857b"
    ],
    "73857a33-fe38-4105-a210-90f57b2cc32a": [
      "00bfc2a5-d61a-43c8-a6e5-68227c3cb2bf"
    ]
  },
  "project_id": "73233e29-5b08-4782-9e4a-9b0fa5e8b0a3"
}
```

### Option 2: Start the Server and Test

```bash
cd backend
npm run start:dev
```

Then use your API client (Postman, curl, etc.) to call the schedule generation endpoint.

## What to Verify

### 1. Activity Sequence Order ✅
Each participant should have activities in this order:
1. Role Play (in parallel with TOYF)
2. Think On Your Feet (in parallel with Role Play)
3. Group Activity
4. Business Case
5. Leadership Questionnaire

### 2. Parallel Activities ✅
- Role Play and TOYF should happen at DIFFERENT times for EACH participant
- Cross-scheduling pattern:
  - P1: RolePlay at T1, TOYF at T6
  - P2: RolePlay at T2, TOYF at T5
  - P3: RolePlay at T3, TOYF at T4
  - (and so on...)

### 3. Group Activity ✅
- ALL participants should have the SAME start time for Group Activity
- All participants should be in the SAME room
- Each participant should have a groupId
- Groups should have 2+ participants each
- Each group should have exactly ONE assessor

### 4. Assessor Continuity ✅
For each participant:
- Group Activity assessor
- Business Case assessor (SAME as Group Activity)
- Questionnaire assessor (SAME as Group Activity)

### 5. No Conflicts ✅
- No participant in two places at once
- No assessor with two participants at once
- No room double-booked at same time
- No activities during breaks

### 6. Break Avoidance ✅
- No activities overlap with:
  - First break (07:30-07:45)
  - Lunch break (09:30-10:00)
  - Second break (12:45-13:00)

## Sample Expected Output Structure

```json
{
  "success": true,
  "message": "Schedule generated successfully",
  "schedule": [
    {
      "participantId": "...",
      "participantName": "John Doe",
      "activities": [
        {
          "activityId": "...",
          "activityName": "Role Play",
          "activityType": "Role Play",
          "startTime": "2025-11-23T06:30:00.000Z",
          "endTime": "2025-11-23T07:00:00.000Z",
          "roomId": "...",
          "roomName": "Room A",
          "assessorId": "...",
          "assessorName": "Assessor 1",
          "date": "2025-11-23"
        },
        {
          "activityName": "Think On Your Feet",
          "startTime": "2025-11-23T10:00:00.000Z",
          "endTime": "2025-11-23T10:30:00.000Z",
          ...
        },
        {
          "activityName": "Group Activity",
          "startTime": "2025-11-23T10:30:00.000Z",
          "endTime": "2025-11-23T11:00:00.000Z",
          "groupId": "group_xxx",
          ...
        },
        {
          "activityName": "Business Case",
          "startTime": "2025-11-23T11:00:00.000Z",
          "endTime": "2025-11-23T11:30:00.000Z",
          "assessorId": "..." // SAME as Group Activity
          ...
        },
        {
          "activityName": "Leadership Questionnaire",
          "assessorId": "..." // SAME as Group Activity
          // Note: No startTime/endTime (can be done anytime)
          ...
        }
      ]
    }
  ],
  "metadata": {
    "totalParticipants": 6,
    "totalActivities": 30,
    "dateRange": {
      "start": "2025-11-23",
      "end": "2025-11-24"
    }
  }
}
```

## Common Issues and Solutions

### Issue: "Input validation failed"
**Solution**: Check that all required fields are provided and mappings are correct.

### Issue: "Group formation failed"
**Solution**: Ensure at least 2 participants and at least 1 assessor mapped to Group Activity.

### Issue: "Insufficient time slots"
**Solution**: Increase the date range or daily hours, or reduce the number of activities.

### Issue: "No assessor continuity"
**Solution**: Ensure all assessors mapped to Group Activity are also mapped to Business Case and Questionnaire.

## Validation Checklist

After receiving the schedule, verify:

- [ ] All participants have all required activities
- [ ] Activity sequence is correct for each participant
- [ ] Role Play and TOYF use cross-scheduling pattern
- [ ] Group Activity: all participants same time, same room
- [ ] Group Activity: each group has 2+ participants
- [ ] Business Case assessor matches Group Activity assessor
- [ ] Questionnaire assessor matches Group Activity assessor
- [ ] No time conflicts (participant, assessor, room)
- [ ] No activities during break times
- [ ] All activities within daily start/end times
- [ ] All activities on valid dates (between start_date and end_date)

## Logging

The system provides detailed logging. Check the console output for:
- `Starting schedule generation (V2)...`
- `Phase 1: Validating input...`
- `Phase 2: Building scheduling context...`
- `Phase 3: Detecting activities...`
- `Phase 4: Forming groups...`
- `Phase 5: Scheduling activities...`
- `Phase 6: Converting to output format...`
- `Schedule generation completed successfully`

## Error Messages

If scheduling fails, you'll receive clear error messages with actionable feedback:

```json
{
  "success": false,
  "message": "Failed to generate schedule: [error details]",
  "errors": ["Specific error message with guidance"]
}
```

## Need Help?

If you encounter issues:
1. Check the logs for detailed error messages
2. Verify input data matches the expected format
3. Ensure all database entities (participants, assessors, rooms, scenarios) exist
4. Check that scenario names include keywords: "role play", "think on your feet", "group activity", "business case", "leadership questionnaire"

## Success Criteria

A successful test should produce:
- ✅ No compilation errors
- ✅ No runtime errors
- ✅ Complete schedule for all participants
- ✅ All constraints satisfied
- ✅ All requirements met

---

**Ready to test!** 🚀 Just start the server and call the API endpoint with your input data.

