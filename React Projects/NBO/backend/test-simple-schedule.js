const axios = require('axios');

const testPayload = {
  start_date: '2025-11-13',
  end_date: '2025-11-14',
  facility_id: '8602e3f1-fd6a-44e8-8855-dd4ba45b5b04',
  participantIds: [
    '222fe610-ac07-4767-8bad-e6df0cd75757',
    'd11a0c6a-3003-4813-a192-4411cae25636',
  ],
  scenarioIds: [
    '86a977d3-15f8-425d-8b07-b03fd999a5d1',
    '2545638a-1ecc-4811-9847-ebb520f162f9',
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
  ],
  daily_start_time: '2025-11-13T03:30:00.000Z',
  daily_end_time: '2025-11-13T13:30:00.000Z',
  assessment_assessor_mapping: {
    '86a977d3-15f8-425d-8b07-b03fd999a5d1': [
      '053286a8-2ed5-4910-aab9-589751594de8',
      '8fa73550-3614-4989-94ae-62997b1fc305',
    ],
    '2545638a-1ecc-4811-9847-ebb520f162f9': [
      '053286a8-2ed5-4910-aab9-589751594de8',
      '8fa73550-3614-4989-94ae-62997b1fc305',
    ],
    '762fc175-60f9-4533-98ca-569bebdfe035': [
      '053286a8-2ed5-4910-aab9-589751594de8',
      '8fa73550-3614-4989-94ae-62997b1fc305',
    ],
  },
  room_assessment_mapping: {
    '36c6ba23-f84f-4b22-baa6-30c53f48bd29': [
      '86a977d3-15f8-425d-8b07-b03fd999a5d1',
      '2545638a-1ecc-4811-9847-ebb520f162f9',
    ],
  },
  project_id: '90eaac82-d570-4abc-9ca3-89a7b26bb91d',
};

async function testSimpleSchedule() {
  try {
    console.log('🧪 Testing Simple Schedule...\n');

    const response = await axios.post(
      'http://localhost:3000/class/test-client/test-cohort/auto-schedule',
      testPayload,
    );

    console.log('✅ Schedule generated successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
  }
}

testSimpleSchedule();


