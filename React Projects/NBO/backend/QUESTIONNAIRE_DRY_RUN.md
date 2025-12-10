# Questionnaire Scheduling - Dry Run

## Input
- `questionnaireIds`: `["4ac2f91e-95ca-4346-86d4-7413d0442ba3"]`
- 6 participants
- Group Activity assessors:
  - Group 1 (AP4, AP6, AP5): Beta (`053286a8...`)
  - Group 2 (AP3, AP2, AP1): Gamma (`8fa73550...`)

## Step-by-Step Trace

### Phase 3: Detect Activities
1. **fetchQuestionnaires()** called with `["4ac2f91e-95ca-4346-86d4-7413d0442ba3"]`
   - Should fetch 1 questionnaire from database
   - **CHECK LOG:** `Fetched X scenarios and Y questionnaires`
   - **Expected:** `Fetched 4 scenarios and 1 questionnaires`

2. **detectActivities()** called with all activities (scenarios + questionnaires)
   - For questionnaire, should use `questionnaire_name` field
   - Should categorize as 'questionnaire' based on name
   - **CHECK LOG:** `Detected X activities: [...]`
   - **Expected:** Should include `{ id: "4ac2f91e...", name: "...", category: "questionnaire" }`

### Phase 5: Schedule Questionnaire
1. **getActivitiesByCategory('questionnaire')** called
   - **CHECK LOG:** `Found X questionnaire activities`
   - **Expected:** `Found 1 questionnaire activities`

2. **scheduleQuestionnaire()** called
   - **CHECK LOG:** `[QScheduler] Starting questionnaire scheduling for 6 participants`
   - **CHECK LOG:** `[QScheduler] Questionnaire activities: [...]`
   - **CHECK LOG:** `[QScheduler] Using questionnaire: 4ac2f91e... - ...`

3. **For each participant:**
   - Get continuity from Group Activity
   - **CHECK LOG:** `[QScheduler] Processing participant X/6: ...`
   - **CHECK LOG:** `[QScheduler] Participant ... assigned assessor: ... (from Group Activity)`
   - **CHECK LOG:** `[QScheduler] Assignment created successfully`
   
   Expected per participant:
   - AP4 → Beta
   - AP6 → Beta  
   - AP5 → Beta
   - AP3 → Gamma
   - AP2 → Gamma
   - AP1 → Gamma

4. **Final check:**
   - **CHECK LOG:** `[QScheduler] Total assignments created: 6`
   - **CHECK LOG:** `Scheduled 6 Questionnaire assignments`

### Phase 6: Convert to Output
1. **convertToParticipantAssignments()** called
   - For each questionnaire assignment:
     - `scenarioId`: undefined
     - `questionnaireId`: `"4ac2f91e..."`
     - `startTime`: null
     - `endTime`: null
     - `isQuestionnaire`: true

2. **Group by scenario ID**
   - Questionnaires grouped by `questionnaireId`
   - **Expected:** `scenarioGroups` has entry for `"4ac2f91e..."`

3. **Create assessment groups**
   - For questionnaire in scenarioDetails:
     - Get `scenarioGroups.get("4ac2f91e...")`
     - Should have 6 assignments
     - `participantSchedules`: should be populated (not empty)

## Potential Issues

### Issue 1: Questionnaire not fetched
**Symptom:** `Fetched 4 scenarios and 0 questionnaires`
**Cause:** `questionnaireIds` empty or database query failing
**Solution:** Check if input has `questionnaireIds` array

### Issue 2: Questionnaire not detected
**Symptom:** `Found 0 questionnaire activities`
**Cause:** 
- `questionnaire_name` field is null/empty in database
- Name doesn't match 'questionnaire' pattern

**Solution:** Check database for `questionnaire_name` value

### Issue 3: Continuity map empty
**Symptom:** `[QScheduler] Assessor continuity map size: 0`
**Cause:** Group Activity didn't establish continuity
**Solution:** Check Group Activity scheduling logs

### Issue 4: Assignments created but not in output
**Symptom:** 
- `[QScheduler] Total assignments created: 6`
- BUT output has empty `participantSchedules`

**Cause:** 
- Assignments not being grouped correctly
- `questionnaireId` field not matching
- Assignments filtered out somewhere

**Solution:** Add logging in `convertToParticipantAssignments` to see if questionnaire assignments are being converted

## Debugging Steps

1. **Check API logs** for these specific messages (in order):
   ```
   Phase 3: Detecting activities...
   Fetched X scenarios and Y questionnaires
   Questionnaire data: [...]
   Detected X activities: [...]
   ```

2. **Check for questionnaire scheduling**:
   ```
   Found X questionnaire activities
   Scheduling Questionnaire: [...]
   [QScheduler] Starting questionnaire scheduling for 6 participants
   ```

3. **Check assignment creation**:
   ```
   [QScheduler] Processing participant 1/6: ...
   [QScheduler] Assignment created successfully
   ...
   [QScheduler] Total assignments created: 6
   Scheduled 6 Questionnaire assignments
   ```

4. **If assignments created but output empty:**
   - Issue is in conversion/grouping
   - Add logging in `convertToParticipantAssignments` at line 477-505
   - Check if `isQuestionnaire` is being set correctly

## Required User Action

**Please provide the FULL console/terminal output** from running the API.

Look specifically for these sections:
- Phase 3 output (detecting activities)
- Phase 5 output (scheduling questionnaire)
- Phase 6 output (converting to output format)

The logs will tell us exactly where it's failing!

