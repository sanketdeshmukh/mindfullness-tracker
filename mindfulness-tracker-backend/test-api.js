// Simple test script to verify the API is working
// Run this after starting the backend: node test-api.js

const http = require('http');

const BASE_URL = 'http://localhost:3000/api/mindfulness';

// Helper to make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Mindfulness Tracker API\n');

  try {
    // Test 1: Health check
    console.log('1️⃣  Testing health endpoint...');
    let response = await makeRequest('GET', '../health');
    console.log(`   Status: ${response.status}`);
    console.log(`   Result: ${response.data.message}\n`);

    // Test 2: Create entry
    console.log('2️⃣  Creating a mindfulness entry...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const entryData = {
      date: today.toISOString(),
      hour: 10,
      presentPercentage: 85,
      notes: 'Great focus session!'
    };

    response = await makeRequest('POST', '/entry', entryData);
    console.log(`   Status: ${response.status}`);
    console.log(`   Message: ${response.data.message}`);
    console.log(`   Entry ID: ${response.data.data._id}\n`);

    // Test 3: Create another entry for different hour
    console.log('3️⃣  Creating second entry...');
    entryData.hour = 14;
    entryData.presentPercentage = 70;
    entryData.notes = 'Afternoon meditation';

    response = await makeRequest('POST', '/entry', entryData);
    console.log(`   Status: ${response.status}`);
    console.log(`   Message: ${response.data.message}\n`);

    // Test 4: Get hourly breakdown
    console.log('4️⃣  Getting hourly breakdown for today...');
    const dateStr = today.toISOString().split('T')[0];
    response = await makeRequest('GET', `/hourly-breakdown?date=${dateStr}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Total hours: ${response.data.data.length}`);
    const filledHours = response.data.data.filter(h => h.presentPercentage !== null).length;
    console.log(`   Logged hours: ${filledHours}`);
    
    // Show logged hours
    response.data.data.forEach(h => {
      if (h.presentPercentage !== null) {
        console.log(`   - ${String(h.hour).padStart(2, '0')}:00: ${h.presentPercentage}%`);
      }
    });
    console.log('');

    // Test 5: Get daily summary
    console.log('5️⃣  Getting daily summary...');
    const startDate = new Date();
    startDate.setDate(today.getDate() - 7);
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = dateStr;

    response = await makeRequest('GET', `/daily-summary?startDate=${startStr}&endDate=${endStr}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Days in summary: ${response.data.data.length}`);
    
    response.data.data.forEach(d => {
      console.log(`   - ${d._id}: ${d.averagePresent.toFixed(1)}% (${d.entryCount} entries)`);
    });
    console.log('');

    // Test 6: Update an entry
    console.log('6️⃣  Updating an entry...');
    entryData.hour = 10;
    entryData.presentPercentage = 95; // Improved!
    entryData.notes = 'Actually had even better focus!';

    response = await makeRequest('POST', '/entry', entryData);
    console.log(`   Status: ${response.status}`);
    console.log(`   Updated percentage to: ${response.data.data.presentPercentage}%\n`);

    // Test 7: Get all entries
    console.log('7️⃣  Getting all entries (admin)...');
    response = await makeRequest('GET', '/all');
    console.log(`   Status: ${response.status}`);
    console.log(`   Total entries in database: ${response.data.data.length}\n`);

    console.log('✅ All tests passed!\n');
    console.log('💡 Tips:');
    console.log('   - Try creating entries for different hours of the day');
    console.log('   - View the dashboard to see your progress visualized');
    console.log('   - Use different dates to build a history');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n⚠️  Make sure:');
    console.log('   1. Backend is running: npm start (in backend folder)');
    console.log('   2. MongoDB is running: mongod');
    console.log('   3. .env file has correct MONGODB_URI');
  }
}

runTests();
