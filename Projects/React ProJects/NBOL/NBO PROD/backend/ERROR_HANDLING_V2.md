# Error Handling in Scheduling System V2

## HTTP Status Codes

The scheduling API now returns appropriate HTTP status codes:

### Success (201 Created)
```json
{
  "success": true,
  "message": "Schedule generated successfully",
  "schedule": [...],
  "metadata": {...}
}
```

### Error (400 Bad Request)
When scheduling fails due to invalid input or impossible constraints:
```json
{
  "success": false,
  "message": "Failed to generate schedule: [specific error]",
  "errors": ["Detailed error message"],
  "details": "Stack trace (in development mode)"
}
```

## Error Categories

### 1. Input Validation Errors (400 Bad Request)

**Missing Required Fields:**
```
Failed to generate schedule: Input validation failed: MISSING_START_DATE: Start date is required
```

**Invalid Participants:**
```
Failed to generate schedule: Input validation failed: INSUFFICIENT_PARTICIPANTS: At least 2 participants are required for Group Activity
```

**Invalid Assessor Mapping:**
```
Failed to generate schedule: Input validation failed: NO_ASSESSORS_FOR_ACTIVITY: No assessors mapped for scenario: [id]
```

**Invalid Room Mapping:**
```
Failed to generate schedule: Input validation failed: NO_ROOMS_FOR_ACTIVITY: No rooms mapped for scenario: [id]
```

**Insufficient Time:**
```
Failed to generate schedule: Input validation failed: INSUFFICIENT_TIME: Insufficient time to schedule all activities. Required: ~180 minutes, Available: ~120 minutes. Please increase the date range or daily hours.
```

### 2. Group Formation Errors (400 Bad Request)

**Insufficient Participants:**
```
Failed to generate schedule: Group formation failed: Group Activity requires at least 2 participants. Found: 1
```

**No Assessors:**
```
Failed to generate schedule: Group formation failed: Group Activity requires at least 1 assessor
```

**Invalid Group Size:**
```
Failed to generate schedule: Group formation failed: Group 1 has only 1 participants (minimum: 2)
```

### 3. Scheduling Errors (400 Bad Request)

**Parallel Activity Scheduling Failed:**
```
Failed to generate schedule: Parallel activity scheduling failed: Insufficient time slots for parallel activities. Need at least 6 slots, have 4
```

**Group Activity Scheduling Failed:**
```
Failed to generate schedule: Group Activity scheduling failed: No time slots available for Group Activity
```

**Business Case Scheduling Failed:**
```
Failed to generate schedule: Business Case scheduling failed: No assessor continuity found for participant [id]. Business Case requires Group Activity assessor.
```

**Questionnaire Scheduling Failed:**
```
Failed to generate schedule: Questionnaire scheduling failed: Assessor [id] is not mapped to Questionnaire but is required for continuity with participant [id]
```

### 4. Activity Detection Errors (400 Bad Request)

**Missing Group Activity:**
```
Failed to generate schedule: Group Activity is required but not found in scenarios. Please include a Group Activity scenario.
```

**Unknown Activity Type:**
```
Failed to generate schedule: Unable to categorize activity: [activity name]
```

## Error Response Structure

All errors follow this structure:

```typescript
{
  success: false,
  message: string,        // Human-readable error message
  errors: string[],       // Array of specific error details
  details?: string        // Stack trace (only in development)
}
```

## How to Handle Errors

### In Your Frontend/Client

```javascript
try {
  const response = await fetch('/api/schedule/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedulingInput)
  });

  if (!response.ok) {
    // Status code is not 2xx
    const errorData = await response.json();
    console.error('Scheduling failed:', errorData.message);
    
    // Display specific errors to user
    errorData.errors?.forEach(error => {
      console.error('- ', error);
    });
    
    // Show user-friendly message
    alert(`Unable to generate schedule: ${errorData.message}`);
    return;
  }

  // Success - process the schedule
  const result = await response.json();
  console.log('Schedule generated:', result.schedule);
  
} catch (error) {
  console.error('Network error:', error);
}
```

### Common Fixes for Errors

#### "INSUFFICIENT_TIME"
**Fix**: Increase date range or extend daily hours
```javascript
// Add more days
schedulingInput.end_date = '2025-11-25'; // Added one more day

// Or extend daily hours
schedulingInput.daily_start_time = '2025-11-23T06:00:00.000Z'; // Start earlier
schedulingInput.daily_end_time = '2025-11-23T18:00:00.000Z'; // End later
```

#### "NO_ASSESSORS_FOR_ACTIVITY"
**Fix**: Add assessors to the activity mapping
```javascript
schedulingInput.assessment_assessor_mapping['activity-id'] = [
  'assessor-1-id',
  'assessor-2-id'
];
```

#### "NO_ROOMS_FOR_ACTIVITY"
**Fix**: Add rooms to the room mapping
```javascript
schedulingInput.room_assessment_mapping['room-id'] = [
  'activity-1-id',
  'activity-2-id'
];
```

#### "INSUFFICIENT_PARTICIPANTS"
**Fix**: Add more participants (minimum 2 required)
```javascript
schedulingInput.participantIds = [
  'participant-1-id',
  'participant-2-id',
  // ... at least 2 participants
];
```

#### "Group formation failed: Group Activity requires at least 1 assessor"
**Fix**: Ensure Group Activity has assessors mapped
```javascript
// Find your Group Activity scenario ID
const groupActivityId = 'your-group-activity-scenario-id';

// Map assessors to it
schedulingInput.assessment_assessor_mapping[groupActivityId] = [
  'assessor-1-id',
  'assessor-2-id'
];
```

#### "No assessor continuity found"
**Fix**: Ensure Group Activity assessors are also mapped to Business Case and Questionnaire
```javascript
const groupAssessors = schedulingInput.assessment_assessor_mapping[groupActivityId];

// Map same assessors to Business Case
schedulingInput.assessment_assessor_mapping[businessCaseId] = groupAssessors;

// Map same assessors to Questionnaire
schedulingInput.assessment_assessor_mapping[questionnaireId] = groupAssessors;
```

## Testing Error Scenarios

### Test Case 1: Insufficient Time
```json
{
  "start_date": "2025-11-23",
  "end_date": "2025-11-23",
  "daily_start_time": "2025-11-23T06:30:00.000Z",
  "daily_end_time": "2025-11-23T08:00:00.000Z",
  "participantIds": ["p1", "p2", "p3", "p4", "p5", "p6"],
  ...
}
```
**Expected**: 400 Bad Request with INSUFFICIENT_TIME error

### Test Case 2: Not Enough Participants
```json
{
  "participantIds": ["p1"],
  ...
}
```
**Expected**: 400 Bad Request with INSUFFICIENT_PARTICIPANTS error

### Test Case 3: Missing Assessors
```json
{
  "assessment_assessor_mapping": {
    "scenario-1": [],
    "scenario-2": []
  },
  ...
}
```
**Expected**: 400 Bad Request with NO_ASSESSORS_FOR_ACTIVITY error

### Test Case 4: Missing Group Activity
```json
{
  "scenarioIds": [
    "role-play-id",
    "toyf-id",
    "business-case-id"
    // Missing Group Activity
  ],
  ...
}
```
**Expected**: 400 Bad Request with "Group Activity is required" error

## Debugging Tips

1. **Check the logs**: Server logs provide detailed information about what went wrong
2. **Validate input**: Ensure all required fields are provided
3. **Check mappings**: Verify assessor and room mappings are correct
4. **Verify IDs**: Ensure all IDs (participants, assessors, rooms, scenarios) exist in database
5. **Check activity names**: Scenario names must include keywords like "role play", "group activity", etc.

## Status Code Reference

| Status Code | Meaning | When |
|------------|---------|------|
| 201 | Created | Schedule generated successfully |
| 400 | Bad Request | Invalid input or impossible constraints |
| 500 | Internal Server Error | Unexpected server error |

## Important Notes

- ✅ Errors now properly return 400 status code (not 201)
- ✅ Error messages are descriptive and actionable
- ✅ Validation happens before scheduling attempts
- ✅ All errors include specific guidance for fixing

---

**Updated**: November 23, 2025
**Status**: Error handling fixed and tested ✅

