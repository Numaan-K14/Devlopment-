const axios = require('axios');

const testPayload = {
  start_date: '2025-11-13',
  end_date: '2025-11-14',
  facility_id: '8602e3f1-fd6a-44e8-8855-dd4ba45b5b04',
  participantIds: [
    '222fe610-ac07-4767-8bad-e6df0cd75757',
    'd11a0c6a-3003-4813-a192-4411cae25636',
    'a3071068-0d8a-4493-be0f-d3b910c19ae5',
    '154757c6-e795-47ab-ad90-baa7573050c7',
    '3fc0b32c-147d-48df-9cb6-d07038f0d681',
    '6903a97e-4ff0-432d-acc0-fe3de97ebe15',
    '28296eea-2393-4d01-b50c-b8bb6b68a8b8',
    '1688db20-c5f0-4ea1-9417-b8d38f2602b8',
    'b022d5ae-9b6e-43de-b8c3-ea413293c7a3',
    '24a96545-3d4c-4cd1-be37-ca85178665d0',
  ],
  scenarioIds: [
    '86a977d3-15f8-425d-8b07-b03fd999a5d1',
    '5c54bc08-dd0a-4b6a-a43b-6b57d0a2e91c',
    '2545638a-1ecc-4811-9847-ebb520f162f9',
    'ce9d2927-1a14-43be-b1a1-93656befe5b7',
  ],
  questionnaireIds: ['762fc175-60f9-4533-98ca-569bebdfe035'],
  duration_of_each_activity: 30,
  group_activity_duration: 60,
  daily_breaks: [
    {
      date: '2025-11-13',
      first_break_start_time: '2025-11-13T05:30:00.000Z',
      first_break_end_time: '2025-11-13T06:00:00.000Z',
      second_break_start_time: '2025-11-13T10:30:00.000Z',
      second_break_end_time: '2025-11-13T11:00:00.000Z',
      lunch_break_start_time: '2025-11-13T07:30:00.000Z',
      lunch_break_end_time: '2025-11-13T08:00:00.000Z',
    },
    {
      date: '2025-11-14',
      first_break_start_time: '2025-11-14T05:30:00.000Z',
      first_break_end_time: '2025-11-14T06:00:00.000Z',
      second_break_start_time: '2025-11-14T10:30:00.000Z',
      second_break_end_time: '2025-11-14T11:00:00.000Z',
      lunch_break_start_time: '2025-11-14T07:30:00.000Z',
      lunch_break_end_time: '2025-11-14T08:00:00.000Z',
    },
  ],
  daily_start_time: '2025-11-13T03:30:00.000Z',
  daily_end_time: '2025-11-13T13:30:00.000Z',
  assessment_assessor_mapping: {
    '86a977d3-15f8-425d-8b07-b03fd999a5d1': [
      '053286a8-2ed5-4910-aab9-589751594de8',
      '8fa73550-3614-4989-94ae-62997b1fc305',
    ],
    '5c54bc08-dd0a-4b6a-a43b-6b57d0a2e91c': [
      '6f7671a8-0657-4f36-9029-4e127a7a65e1',
      '766c3406-d7fc-46b9-aea1-4bf081ab4a35',
    ],
    '2545638a-1ecc-4811-9847-ebb520f162f9': [
      '053286a8-2ed5-4910-aab9-589751594de8',
      '8fa73550-3614-4989-94ae-62997b1fc305',
      '6f7671a8-0657-4f36-9029-4e127a7a65e1',
      'e3f5ad35-fb4a-4e7e-9f36-ec6193e6fff4',
    ],
    'ce9d2927-1a14-43be-b1a1-93656befe5b7': [
      '053286a8-2ed5-4910-aab9-589751594de8',
      '8fa73550-3614-4989-94ae-62997b1fc305',
      '6f7671a8-0657-4f36-9029-4e127a7a65e1',
      '766c3406-d7fc-46b9-aea1-4bf081ab4a35',
    ],
    '762fc175-60f9-4533-98ca-569bebdfe035': [
      '053286a8-2ed5-4910-aab9-589751594de8',
      '8fa73550-3614-4989-94ae-62997b1fc305',
      '6f7671a8-0657-4f36-9029-4e127a7a65e1',
      '766c3406-d7fc-46b9-aea1-4bf081ab4a35',
    ],
  },
  room_assessment_mapping: {
    '36c6ba23-f84f-4b22-baa6-30c53f48bd29': [
      '86a977d3-15f8-425d-8b07-b03fd999a5d1',
      '2545638a-1ecc-4811-9847-ebb520f162f9',
    ],
    'c6b209ef-f534-4c9d-a86c-01e1fc9f9bfc': [
      '5c54bc08-dd0a-4b6a-a43b-6b57d0a2e91c',
      '2545638a-1ecc-4811-9847-ebb520f162f9',
    ],
    '1b652909-d233-462f-941d-d500e446bb77': [
      'ce9d2927-1a14-43be-b1a1-93656befe5b7',
    ],
  },
  project_id: '90eaac82-d570-4abc-9ca3-89a7b26bb91d',
};

async function testContinuity() {
  try {
    console.log('🧪 Testing Assessor Continuity...\n');

    const response = await axios.post(
      'http://localhost:5000/api/class/test-client/test-cohort/auto-schedule',
      testPayload,
    );

    if (response.data.success) {
      const schedule = response.data.data.schedule;

      // Analyze Group Activity assessor assignments
      console.log('📊 GROUP ACTIVITY ASSESSOR ASSIGNMENTS:');
      const groupActivityAssessorMap = new Map();

      schedule.scenarios.forEach((scenario) => {
        if (scenario.is_group_activity && scenario.groups) {
          scenario.groups.forEach((group) => {
            group.participants.forEach((participant) => {
              const assessorId = participant.assessorIds[0];
              groupActivityAssessorMap.set(
                participant.participantId,
                assessorId,
              );
              console.log(
                `  ${participant.participantName} (${participant.participantId.substring(0, 8)}) → ${participant.assessorNames[0]} (${assessorId.substring(0, 8)})`,
              );
            });
          });
        }
      });

      console.log('\n📋 LEADERSHIP QUESTIONNAIRE CONTINUITY ANALYSIS:');
      let questionnaireContinuitySuccess = 0;
      let questionnaireTotal = 0;

      schedule.scenarios.forEach((scenario) => {
        if (scenario.is_quesionnaire && scenario.participantSchedules) {
          scenario.participantSchedules.forEach((schedule) => {
            questionnaireTotal++;
            const groupActivityAssessor = groupActivityAssessorMap.get(
              schedule.participantId,
            );
            const hasContinuity = schedule.assessorIds.includes(
              groupActivityAssessor,
            );

            if (hasContinuity) {
              questionnaireContinuitySuccess++;
              console.log(
                `  ✅ ${schedule.participantName} (${schedule.participantId.substring(0, 8)}): ${schedule.assessorNames.join(', ')} - CONTINUITY MAINTAINED`,
              );
            } else {
              console.log(
                `  ❌ ${schedule.participantName} (${schedule.participantId.substring(0, 8)}): Expected ${groupActivityAssessor.substring(0, 8)}, got [${schedule.assessorIds.map((id) => id.substring(0, 8)).join(', ')}] - CONTINUITY VIOLATED`,
              );
            }
          });
        }
      });

      console.log('\n🏢 BUSINESS CASE CONTINUITY ANALYSIS:');
      let businessCaseContinuitySuccess = 0;
      let businessCaseTotal = 0;

      schedule.scenarios.forEach((scenario) => {
        if (
          scenario.assessment_name === 'Business Case' &&
          scenario.participantSchedules
        ) {
          scenario.participantSchedules.forEach((schedule) => {
            businessCaseTotal++;
            const groupActivityAssessor = groupActivityAssessorMap.get(
              schedule.participantId,
            );
            const hasContinuity = schedule.assessorIds.includes(
              groupActivityAssessor,
            );

            if (hasContinuity) {
              businessCaseContinuitySuccess++;
              console.log(
                `  ✅ ${schedule.participantName} (${schedule.participantId.substring(0, 8)}): ${schedule.assessorNames.join(', ')} - CONTINUITY MAINTAINED`,
              );
            } else {
              console.log(
                `  ❌ ${schedule.participantName} (${schedule.participantId.substring(0, 8)}): Expected ${groupActivityAssessor.substring(0, 8)}, got [${schedule.assessorIds.map((id) => id.substring(0, 8)).join(', ')}] - CONTINUITY VIOLATED`,
              );
            }
          });
        }
      });

      // Final Results
      const questionnaireContinuityRate =
        questionnaireTotal > 0
          ? (
              (questionnaireContinuitySuccess / questionnaireTotal) *
              100
            ).toFixed(1)
          : '0';
      const businessCaseContinuityRate =
        businessCaseTotal > 0
          ? ((businessCaseContinuitySuccess / businessCaseTotal) * 100).toFixed(
              1,
            )
          : '0';

      console.log('\n📈 FINAL CONTINUITY RESULTS:');
      console.log(
        `  Leadership Questionnaire: ${questionnaireContinuitySuccess}/${questionnaireTotal} (${questionnaireContinuityRate}%)`,
      );
      console.log(
        `  Business Case: ${businessCaseContinuitySuccess}/${businessCaseTotal} (${businessCaseContinuityRate}%)`,
      );

      if (
        questionnaireContinuityRate === '100.0' &&
        businessCaseContinuityRate === '100.0'
      ) {
        console.log(
          '\n🎉 SUCCESS: 100% CONTINUITY ACHIEVED FOR BOTH ACTIVITIES!',
        );
      } else {
        console.log('\n⚠️  CONTINUITY ISSUES DETECTED - NEEDS FIXING');
      }
    } else {
      console.log('❌ Scheduling failed:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
  }
}

testContinuity();
