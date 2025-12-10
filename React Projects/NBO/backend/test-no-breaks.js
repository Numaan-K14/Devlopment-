const axios = require('axios');
const fs = require('fs');

async function testNoBreaksAPI() {
  console.log('🚀 TESTING NO-BREAKS AUTO-SCHEDULE API');
  console.log('=====================================\n');

  try {
    const inputData = JSON.parse(
      fs.readFileSync('./converted-utc-input.json', 'utf8'),
    );

    console.log('📋 INPUT CONFIGURATION:');
    console.log(
      '✅ Individual activity duration:',
      inputData.duration_of_each_activity,
      'minutes',
    );
    console.log(
      '✅ Group activity duration:',
      inputData.group_activity_duration,
      'minutes',
    );
    console.log(
      '❌ No automatic breaks between activities (back-to-back scheduling)',
    );
    console.log(
      '✅ Only scheduled breaks:',
      inputData.daily_breaks?.length || 0,
      'daily break configurations',
    );
    console.log(
      '🔄 Fixed assessment order: Role Play → TOYF → Business Case → Group Activity → Leadership Questionnaire\n',
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

      // Analyze time slots to verify no automatic breaks
      if (response.data.data.schedule.scenarios?.length > 0) {
        console.log('\n⏰ ANALYZING TIME SLOT GAPS:');

        response.data.data.schedule.scenarios.forEach((scenario) => {
          if (scenario.participantSchedules?.length > 0) {
            console.log(`\n📋 ${scenario.name}:`);

            // Sort by start time
            const sortedSchedules = scenario.participantSchedules
              .filter((s) => s.startTime && s.endTime)
              .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

            if (sortedSchedules.length > 1) {
              for (let i = 0; i < sortedSchedules.length - 1; i++) {
                const currentEnd = new Date(sortedSchedules[i].endTime);
                const nextStart = new Date(sortedSchedules[i + 1].startTime);
                const gap = (nextStart - currentEnd) / (60 * 1000); // Gap in minutes

                console.log(
                  `   ${sortedSchedules[i].participantName}: ${currentEnd.toLocaleTimeString()} → ${nextStart.toLocaleTimeString()}`,
                );
                console.log(
                  `   Gap: ${gap} minutes ${gap === 0 ? '✅ Back-to-back' : gap > 0 ? '⚠️ Has gap' : '❌ Overlap!'}`,
                );
              }
            } else {
              console.log('   Single participant - no gaps to analyze');
            }
          }
        });

        // Check group activity durations
        console.log('\n⏰ GROUP ACTIVITY DURATIONS:');
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
            console.log(
              `   Expected: ${inputData.group_activity_duration} minutes`,
            );
            console.log(
              `   Status: ${duration === inputData.group_activity_duration ? '✅ CORRECT' : '❌ INCORRECT'}`,
            );
          }
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
      console.error('⚠️ Error:', error.message);
    }
  }
}

testNoBreaksAPI();
