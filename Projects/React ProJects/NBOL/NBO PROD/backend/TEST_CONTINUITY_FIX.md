# Quick Testing Guide - Assessor Continuity Fix

## What Was Fixed

The scheduler now ensures Group Activity is processed **before** Business Case during initialization, so Business Case can use Group Activity assessor data for continuity-aware room assignments.

---

## How to Test

### Step 1: Restart the Backend

Make sure the new code is running:

```bash
cd backend
npm run build
npm run start:dev
```

### Step 2: Run Your Test Input

Use the same input JSON you provided:

```bash
POST /api/schedule
```

With your input data (10 participants, 4 assessors, Role Play → TOYF → Business Case → Group Activity).

### Step 3: Check Console Logs

Look for these key log messages in the backend console:

#### ✅ Processing Order Should Show Group Activity BEFORE Business Case:

```
📋 Scenario Processing Order (after sorting):
  1. RolePlay Scenerio 1 (Individual Activity)
  2. TOYF 6 (Individual Activity)
  3. Group Activity Scenerio 1 (Group Activity)     ← Should be at position 3
  4. Business Case Scenerio 4 (Business Case)       ← Should be at position 4
  5. frfrfdr (Questionnaire)
  6. Oct7 questionnaire (Questionnaire)
```

**If Business Case comes before Group Activity, the fix didn't apply!**

#### ✅ Group Activity Mapping Should Be Populated:

```
🔍 Using Group Activity continuity map...
  Found 10 Group Activity assessor mappings         ← Should be 10 (number of participants)
  6b1dc1df → Group Activity assessor: 053286a8      ← Each participant mapped
  5244a75a → Group Activity assessor: 053286a8
  5f821fad → Group Activity assessor: 053286a8
  a2304f3c → Group Activity assessor: 8fa73550
  232b72db → Group Activity assessor: 8fa73550
  9186010c → Group Activity assessor: 8fa73550
  76884920 → Group Activity assessor: 766c3406
  ed4be426 → Group Activity assessor: 766c3406
  67fe979a → Group Activity assessor: e3f5ad35
  48d7b77e → Group Activity assessor: e3f5ad35
```

**If it says "No Group Activity continuity map provided", the mapping extraction failed!**

#### ✅ All Participants Should Show Continuity Maintained:

```
📋 Using CONTINUITY-AWARE participant distribution:
  ✅ 6b1dc1df → Room 36c6ba23 (has Group Activity assessor 053286a8)
  ✅ 5244a75a → Room 36c6ba23 (has Group Activity assessor 053286a8)
  ✅ 5f821fad → Room 36c6ba23 (has Group Activity assessor 053286a8)
  ✅ a2304f3c → Room c6b209ef (has Group Activity assessor 8fa73550)
  ✅ 232b72db → Room c6b209ef (has Group Activity assessor 8fa73550)
  ✅ 9186010c → Room c6b209ef (has Group Activity assessor 8fa73550)
  ✅ 76884920 → Room 1b652909 (has Group Activity assessor 766c3406)
  ✅ ed4be426 → Room 1b652909 (has Group Activity assessor 766c3406)
  ✅ 67fe979a → Room 1b652909 (has Group Activity assessor e3f5ad35)
  ✅ 48d7b77e → Room 1b652909 (has Group Activity assessor e3f5ad35)
```

**All should show ✅, not ⚠️ warnings about fallback distribution!**

#### ✅ Room Verification Should Show All Continuity Maintained:

```
   Room 36c6ba23: 3 participants, 2 FIXED assessors
     Participants: [6b1dc1df, 5244a75a, 5f821fad]
     FIXED Assessors: [053286a8, 8fa73550]
       ✅ 6b1dc1df continuity maintained
       ✅ 5244a75a continuity maintained
       ✅ 5f821fad continuity maintained

   Room c6b209ef: 3 participants, 2 FIXED assessors
     Participants: [a2304f3c, 232b72db, 9186010c]
     FIXED Assessors: [8fa73550, 766c3406]
       ✅ a2304f3c continuity maintained
       ✅ 232b72db continuity maintained
       ✅ 9186010c continuity maintained

   Room 1b652909: 4 participants, 2 FIXED assessors
     Participants: [76884920, ed4be426, 67fe979a, 48d7b77e]
     FIXED Assessors: [766c3406, e3f5ad35]
       ✅ 76884920 continuity maintained
       ✅ ed4be426 continuity maintained
       ✅ 67fe979a continuity maintained
       ✅ 48d7b77e continuity maintained
```

**All should show ✅, not ❌ continuity BROKEN!**

### Step 4: Verify Output JSON

Check the Business Case schedule in the response. **Every participant** must have their Group Activity assessor present.

#### Example for P8 (5f821fad):

P8 was in **Group 1** with assessor **Beta** (053286a8):

```json
{
  "participantId": "5f821fad-456e-4f6a-affa-e21cb79bf3ee",
  "participantName": "p8",
  "scenarioId": "67ef768b-ce12-4619-be05-35c80d819617",
  "scenarioName": "Business Case Scenerio 4",
  "assessorIds": [
    "053286a8-2ed5-4910-aab9-589751594de8",  // ✅ Beta MUST be here!
    "8fa73550-3614-4989-94ae-62997b1fc305"
  ],
  "assessorNames": [
    "Beta",  // ✅ Beta MUST be here!
    "Gamma"
  ]
}
```

#### Example for P5 (9186010c):

P5 was in **Group 2** with assessor **Gamma** (8fa73550):

```json
{
  "participantId": "9186010c-b4cb-40fa-ba8d-1c0e3f135235",
  "participantName": "p5",
  "scenarioId": "67ef768b-ce12-4619-be05-35c80d819617",
  "scenarioName": "Business Case Scenerio 4",
  "assessorIds": [
    "8fa73550-3614-4989-94ae-62997b1fc305",  // ✅ Gamma MUST be here!
    "766c3406-d7fc-46b9-aea1-4bf081ab4a35"
  ],
  "assessorNames": [
    "Gamma",  // ✅ Gamma MUST be here!
    "Delta"
  ]
}
```

---

## Quick Verification Checklist

Use this checklist to verify the fix:

### Console Logs:
- [ ] Group Activity processed **before** Business Case in sorting log
- [ ] "Found 10 Group Activity assessor mappings" (or your participant count)
- [ ] All participants show ✅ for continuity in distribution log
- [ ] All participants show ✅ in room verification log
- [ ] **NO** ⚠️ warnings about "fallback distribution"
- [ ] **NO** ❌ "continuity BROKEN" messages

### Output JSON - Business Case:
- [ ] P10 has **Beta** in assessorIds ✅
- [ ] P9 has **Beta** in assessorIds ✅
- [ ] P8 has **Beta** in assessorIds ✅
- [ ] P7 has **Gamma** in assessorIds ✅
- [ ] P6 has **Gamma** in assessorIds ✅
- [ ] P5 has **Gamma** in assessorIds ✅
- [ ] P4 has **Delta** in assessorIds ✅
- [ ] P3 has **Delta** in assessorIds ✅
- [ ] P2 has **Justin** in assessorIds ✅
- [ ] P1 has **Justin** in assessorIds ✅

### Output JSON - Leadership Questionnaires:
- [ ] All participants have their Group Activity assessor ✅

---

## Expected Results

### Before Fix (INCORRECT):

**Business Case Continuity Violations:**
- P10, P9, P8 → Missing **Beta** ❌
- P5 → Missing **Gamma** ❌
- P2, P1 → Missing **Justin** ❌

**60% failure rate!**

### After Fix (CORRECT):

**Business Case Continuity:**
- All 10 participants have their Group Activity assessor ✅

**100% success rate!** 🎉

---

## Troubleshooting

### Problem: Business Case still before Group Activity in logs

**Cause:** Code not restarted or build not completed.

**Solution:**
```bash
cd backend
npm run build
npm run start:dev
```

### Problem: "No Group Activity continuity map provided"

**Cause:** Group Activity variables not created yet when Business Case runs.

**Solution:** Check that the sorting logic is working. Look for the sorting log at the start of initialization.

### Problem: Some participants show ⚠️ warnings

**Cause:** Group Activity assessor not assigned to any Business Case room.

**Solution:** Check your `assessment_assessor_mapping` and ensure all Group Activity assessors are also assigned to Business Case.

Example:
```json
{
  "assessment_assessor_mapping": {
    "67ef768b-ce12-4619-be05-35c80d819617": [  // Business Case
      "053286a8-2ed5-4910-aab9-589751594de8",  // Beta ✅
      "8fa73550-3614-4989-94ae-62997b1fc305",  // Gamma ✅
      "766c3406-d7fc-46b9-aea1-4bf081ab4a35",  // Delta ✅
      "e3f5ad35-fb4a-4e7e-9f36-ec6193e6fff4"   // Justin ✅
    ]
  }
}
```

### Problem: ❌ "continuity BROKEN" in room verification

**Cause:** Room-assessor distribution doesn't align with participant-assessor needs.

**Solution:** This shouldn't happen with the new continuity-aware distribution. If you see this, check:
1. Is the Group Activity mapping being extracted correctly?
2. Are room-assessor assignments compatible with participant-assessor needs?
3. Check console logs for the distribution logic step-by-step.

---

## Success Criteria

The fix is working if:

1. ✅ **Console logs show**: Group Activity processed before Business Case
2. ✅ **Console logs show**: All participants have continuity maintained
3. ✅ **Output JSON shows**: All participants have their Group Activity assessor in Business Case
4. ✅ **No warnings or errors** in console logs

---

## Next Steps

Once you confirm the fix is working:

1. **Test with different inputs**: Try different numbers of participants, assessors, and room configurations
2. **Test edge cases**: What happens with 1 participant? 100 participants? Uneven assessor distribution?
3. **Performance test**: Check that the sorting doesn't significantly impact performance (it shouldn't)
4. **Document the requirement**: Update API documentation to clarify that Business Case requires Group Activity data

---

## Questions?

If you encounter any issues or the fix doesn't work as expected, check:

1. **Backend restart**: Did you restart the backend after the code change?
2. **Input data**: Is your input JSON structure correct?
3. **Console logs**: What do the detailed logs show?
4. **Configuration**: Are assessors properly mapped to assessments and rooms?

Provide the console logs and output JSON for debugging assistance.

