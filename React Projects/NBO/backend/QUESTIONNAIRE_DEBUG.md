# Questionnaire Not Showing - Debugging Guide

## Issue
Leadership Questionnaire is not appearing in the output's `participantSchedules` array.

## What We Know
From the previous output, the questionnaire object IS present but with empty array:
```json
{
    "id": "4ac2f91e-95ca-4346-86d4-7413d0442ba3",
    "is_quesionnaire": true,
    "is_group_activity": false,
    "type": "questionnaire",
    "is_questionnaire_item": true,
    "assessment_id": "cb2c8ee6-448b-4b53-b520-62d874a17b93",
    "assessment_name": "Leadership Questionnaire",
    "participantSchedules": []  ← EMPTY!
}
```

This means:
- ✅ Questionnaire is in scenarioDetails
- ✅ Questionnaire is being added to output
- ❌ No assignments are being created OR assignments are not being matched

## Possible Root Causes

### 1. Questionnaire Not Detected
**Check:** Is the questionnaire being detected by `detectActivities`?
- Fixed: Added `questionnaire_name` field to activity name detection
- **Log to check:** Look for "Detected X activities" in logs

### 2. Questionnaire Not Scheduled
**Check:** Is `scheduleQuestionnaire` being called?
- **Log to check:** Look for "[QScheduler] Starting questionnaire scheduling" in logs
- If not appearing: questionnaire is not being detected as 'questionnaire' category

### 3. Assessor Mapping Missing
**Check:** Are assessors mapped to the questionnaire ID?
- Input has: `"4ac2f91e...": ["8fa73550...","053286a8..."]`
- **Log to check:** Look for "[QScheduler] Questionnaire assessors mapped: [...]"
- If empty: assessor mapping not built correctly in context

### 4. Assessor Continuity Missing
**Check:** Do all participants have Group Activity assessors?
- Should be populated during Group Activity scheduling
- **Log to check:** Look for "[QScheduler] Assessor continuity map size: X"
- If 0: Group Activity didn't establish continuity

### 5. Assessor Not Mapped to Questionnaire
**Check:** Is the Group Activity assessor in the questionnaire's assessor list?
- Group Activity assessors: Beta (`053286a8...`) and Gamma (`8fa73550...`)
- Questionnaire assessors: Same two assessors
- **Log to check:** Look for "ERROR: Assessor X is not mapped to Questionnaire"
- This would cause assignments to fail for those participants

### 6. Questionnaire ID Mismatch
**Check:** Does the questionnaire ID in assignments match the questionnaire ID in scenarioDetails?
- Assignment's `activityId` should be `4ac2f91e-95ca-4346-86d4-7413d0442ba3`
- **Log to check:** Look for "Scheduled X Questionnaire assignments"

## Logging Added

### File: `scheduler-v2.service.ts`
- Line 93: Logs fetched questionnaires with their field names
- Line 105: Logs detected activities with names and categories
- Line 209: Logs number of questionnaire activities found
- Line 210: Logs questionnaire activity details before scheduling
- Line 227: Logs number of assignments created
- Line 232: Warns if no questionnaire activities found

### File: `questionnaire-scheduler.ts`
- Entry: Logs participant count and questionnaire activities
- Line 20: Logs which questionnaire is being used
- Line 24: Logs assessors mapped to questionnaire
- Line 61: Logs assessor continuity map size
- Per participant:
  - Logs processing status
  - Logs assessor from continuity
  - Logs validation errors if any
  - Logs assignment creation success
- Exit: Logs total assignments and errors

## How to Debug

1. **Run the API with the test input**
2. **Check terminal/console output for these logs:**

```
Phase 3: Detecting activities...
Fetched 4 scenarios and 1 questionnaires
Questionnaire data: [{"id":"4ac2f91e...","questionnaire_name":"...","name":"..."}]
Detected 5 activities: [..., {"id":"4ac2f91e...","name":"...","category":"questionnaire"}]
```

3. **Look for questionnaire scheduling:**
```
Found 1 questionnaire activities
Scheduling Questionnaire: [...]
[QScheduler] Starting questionnaire scheduling for 6 participants
[QScheduler] Questionnaire assessors mapped: ["8fa73550...","053286a8..."]
```

4. **Check per-participant processing:**
```
[QScheduler] Processing participant 1/6: 37a7bd46...
[QScheduler] Participant 37a7bd46... has Group Activity assessor: 053286a8...
[QScheduler] Creating questionnaire assignment...
[QScheduler] Assignment created successfully
```

5. **Check final count:**
```
[QScheduler] Total assignments created: 6
Scheduled 6 Questionnaire assignments
```

## Expected Errors and Solutions

### Error: "No questionnaire activities found"
**Cause:** Questionnaire not detected as 'questionnaire' category
**Solution:** Check if `questionnaire_name` field exists in database

### Error: "No assessors available for Questionnaire"
**Cause:** Questionnaire ID not in `assessment_assessor_mapping`
**Solution:** Verify input has correct questionnaire ID in mapping

### Error: "No assessor continuity found for participant"
**Cause:** Group Activity didn't establish assessor continuity
**Solution:** Check Group Activity scheduling logs

### Error: "Assessor X is not mapped to Questionnaire"
**Cause:** Group Activity assessor not in questionnaire's assessor list
**Solution:** Ensure same assessors are mapped to both Group Activity and Questionnaire

## Next Steps

Run the API and provide the **full console/terminal output**. The logs will tell us exactly where the issue is.

