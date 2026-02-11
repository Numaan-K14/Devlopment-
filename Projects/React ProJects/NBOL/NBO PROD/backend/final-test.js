const axios = require('axios');
const fs = require('fs');

async function testUpdatedAPI() {
  console.log('🚀 TESTING UPDATED AUTO-SCHEDULE API');
  console.log('====================================\n');

  try {
    // Read the updated input (removed break_between_activities and activity_sequence)
    const inputData = JSON.parse(
      fs.readFileSync('./converted-utc-input.json', 'utf8'),
    );

    console.log('📋 INPUT SUMMARY:');
    console.log('✓ Participants:', inputData.participantIds?.length || 0);
    console.log('✓ Scenarios:', inputData.scenarioIds?.length || 0);
    console.log('✓ Questionnaires:', inputData.questionnaireIds?.length || 0);
    console.log('✓ Daily breaks:', inputData.daily_breaks?.length || 0);
    console.log(
      '✓ Group activity duration:',
      inputData.group_activity_duration || 'MISSING',
    );
    console.log(
      '✓ Individual activity duration:',
      inputData.duration_of_each_activity || 'MISSING',
    );
    console.log(
      '❌ break_between_activities: REMOVED (no automatic breaks between activities)',
    );
    console.log('❌ activity_sequence: REMOVED (using fixed order)');
    console.log(
      '🔄 Fixed order: Role Play → TOYF → Business Case → Group Activity → Leadership Questionnaire\n',
    );

    console.log('🚀 Calling API...');
    const startTime = Date.now();

    const response = await axios.post(
      'http://localhost:3000/api/class/bd0feff2-4966-486c-9de3-e06b1e1a713e/76acfa8d-2ada-4e38-83ae-acdd3eda69fa/auto-schedule',
      inputData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      },
    );

    const endTime = Date.now();

    console.log(`✅ API completed in ${endTime - startTime}ms`);
    console.log('📊 Response Status:', response.status);
    console.log('📈 Success:', response.data?.data?.success || false);

    if (response.data?.data?.success) {
      console.log('\n🎉 SCHEDULE GENERATED SUCCESSFULLY!');
      console.log(
        '📋 Scenarios:',
        response.data.data.schedule.scenarios?.length || 0,
      );
      console.log(
        '👥 Assessor assignments:',
        response.data.data.schedule.assessorAssignments?.length || 0,
      );
      console.log(
        '🏠 Room utilization:',
        response.data.data.schedule.roomUtilization?.length || 0,
      );

      // Check if group activities have correct duration
      if (response.data.data.schedule.scenarios?.length > 0) {
        console.log('\n⏰ CHECKING GROUP ACTIVITY DURATIONS:');
        response.data.data.schedule.scenarios.forEach((scenario) => {
          if (
            scenario.name?.toLowerCase().includes('group') &&
            scenario.groups?.length > 0
          ) {
            const group = scenario.groups[0];
            const startTime = new Date(group.startTime);
            const endTime = new Date(group.endTime);
            const duration = (endTime - startTime) / (60 * 1000);

            console.log(`📊 ${scenario.name}:`);
            console.log(`   Duration: ${duration} minutes`);
            console.log(`   Expected: 90 minutes`);
            console.log(
              `   Status: ${duration === 90 ? '✅ CORRECT' : '❌ INCORRECT'}`,
            );
          }
        });
      }

      // Show activity order
      if (response.data.data.schedule.scenarios?.length > 0) {
        console.log('\n📅 ACTIVITY ORDER CHECK:');
        const sortedScenarios = response.data.data.schedule.scenarios
          .filter((s) => s.participantSchedules?.length > 0)
          .sort((a, b) => {
            const aTime = new Date(a.participantSchedules[0].startTime);
            const bTime = new Date(b.participantSchedules[0].startTime);
            return aTime - bTime;
          });

        sortedScenarios.forEach((scenario, index) => {
          const startTime = new Date(
            scenario.participantSchedules[0].startTime,
          );
          console.log(
            `${index + 1}. ${scenario.name} - ${startTime.toLocaleString()}`,
          );
        });
      }
    } else {
      console.log('\n❌ SCHEDULE GENERATION FAILED');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('\n💥 API CALL FAILED:');

    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server not running on http://localhost:3000');
      console.error('💡 Start server with: npm run start:dev');
    } else if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error(
        '📄 Response:',
        JSON.stringify(error.response.data, null, 2),
      );
    } else {
      console.error('⚠️  Error:', error.message);
    }
  }
}

testUpdatedAPI();
