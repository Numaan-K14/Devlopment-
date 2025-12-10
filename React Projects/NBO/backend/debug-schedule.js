const axios = require('axios');
const fs = require('fs');

async function debugAutoSchedule() {
  console.log('🔍 DEBUGGING AUTO-SCHEDULE API\n');

  try {
    // Read the converted UTC input
    const inputData = JSON.parse(
      fs.readFileSync('./converted-utc-input.json', 'utf8'),
    );

    console.log('📋 INPUT VALIDATION:');
    console.log('✓ Participants:', inputData.participantIds?.length || 0);
    console.log('✓ Scenarios:', inputData.scenarioIds?.length || 0);
    console.log('✓ Questionnaires:', inputData.questionnaireIds?.length || 0);
    console.log('✓ Daily breaks:', inputData.daily_breaks?.length || 0);
    console.log('✓ Daily start time:', inputData.daily_start_time || 'MISSING');
    console.log('✓ Daily end time:', inputData.daily_end_time || 'MISSING');
    console.log(
      '✓ Group activity duration:',
      inputData.group_activity_duration || 'MISSING',
    );
    console.log(
      '✓ Individual activity duration:',
      inputData.duration_of_each_activity || 'MISSING',
    );

    // Validate UTC datetime strings
    console.log('\n⏰ TIME VALIDATION:');
    try {
      const startDate = new Date(inputData.daily_start_time);
      const endDate = new Date(inputData.daily_end_time);
      console.log('✓ Start time parsed:', startDate.toISOString());
      console.log('✓ End time parsed:', endDate.toISOString());
      console.log(
        '✓ Time difference:',
        (endDate - startDate) / (1000 * 60),
        'minutes',
      );
    } catch (e) {
      console.log('❌ Time parsing error:', e.message);
    }

    // Validate break times
    console.log('\n🕐 BREAK TIME VALIDATION:');
    inputData.daily_breaks?.forEach((breakConfig, index) => {
      console.log(`Day ${index + 1} (${breakConfig.date}):`);
      try {
        const firstStart = new Date(breakConfig.first_break_start_time);
        const lunchStart = new Date(breakConfig.lunch_break_start_time);
        console.log(`  ✓ First break: ${firstStart.toISOString()}`);
        console.log(`  ✓ Lunch break: ${lunchStart.toISOString()}`);
      } catch (e) {
        console.log(`  ❌ Break parsing error: ${e.message}`);
      }
    });

    console.log('\n🚀 CALLING API...');
    const startTime = Date.now();

    const response = await axios.post(
      'http://localhost:3000/api/class/bd0feff2-4966-486c-9de3-e06b1e1a713e/76acfa8d-2ada-4e38-83ae-acdd3eda69fa/auto-schedule',
      inputData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 second timeout
      },
    );

    const endTime = Date.now();

    console.log(`✅ API completed in ${endTime - startTime}ms`);
    console.log('📊 Response Status:', response.status);
    console.log('📈 Success:', response.data?.data?.success || false);

    if (response.data?.data?.success) {
      console.log('🎉 SCHEDULE GENERATED SUCCESSFULLY!');
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

      // Show first few scheduled items as examples
      if (response.data.data.schedule.scenarios?.length > 0) {
        console.log('\n📅 SAMPLE SCHEDULED ACTIVITIES:');
        response.data.data.schedule.scenarios
          .slice(0, 3)
          .forEach((scenario, index) => {
            console.log(`${index + 1}. ${scenario.name}`);
            if (scenario.participantSchedules?.length > 0) {
              const firstActivity = scenario.participantSchedules[0];
              console.log(
                `   Time: ${firstActivity.startTime} - ${firstActivity.endTime}`,
              );
              console.log(`   Participant: ${firstActivity.participantName}`);
            }
          });
      }
    } else {
      console.log('❌ SCHEDULE GENERATION FAILED');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('\n💥 API CALL FAILED:');

    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server not running on http://localhost:3000');
      console.error('💡 Make sure to start the server with: npm run start:dev');
    } else if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error(
        '📄 Response:',
        JSON.stringify(error.response.data, null, 2),
      );
    } else if (error.request) {
      console.error('🌐 Network error - no response received');
      console.error('💡 Check if server is running and accessible');
    } else {
      console.error('⚠️  Error:', error.message);
    }
  }
}

console.log('🔧 Auto-Schedule API Debugger');
console.log('================================\n');
debugAutoSchedule();

