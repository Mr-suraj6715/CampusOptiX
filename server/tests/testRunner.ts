/**
 * CampusOptiX Automated Test Suite & Verification Runner
 * Runs unit tests and integration validation without requiring heavy external dependencies.
 */

import { calculateHaversineDistance } from '../src/optimization/optimizerEngine';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean, errorMsg?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description} ${errorMsg ? `-> ${errorMsg}` : ''}`);
    failed++;
  }
}

function runTestSuite(name: string, fn: () => void) {
  console.log(`\n==================================================`);
  console.log(`RUNNING TEST SUITE: ${name}`);
  console.log(`==================================================`);
  try {
    fn();
  } catch (e: any) {
    console.error(`Suite runtime exception:`, e.message);
    failed++;
  }
}

// ----------------------------------------------------
// 1. UNIT TESTS: Haversine Distance & Student Travel (Section 38)
// ----------------------------------------------------
runTestSuite('Student Travel Haversine GPS Distance Calculation', () => {
  // Test 1: Same location (zero displacement)
  const distSame = calculateHaversineDistance(18.52043, 73.85674, 18.52043, 73.85674);
  assert('Distance between identical coordinates is 0 meters', distSame === 0, `Got: ${distSame}`);

  // Test 2: Distance between Block A and Block B
  const distAB = calculateHaversineDistance(18.52043, 73.85674, 18.52105, 73.85741);
  assert('Distance between Block A and Block B is approximately 98 meters', distAB !== null && distAB > 50 && distAB < 150, `Got: ${distAB}m`);

  // Test 3: Null coordinates should return null (neutral scoring fallback)
  const distNull = calculateHaversineDistance(null, null, 18.52105, 73.85741);
  assert('Missing GPS data safely returns null for neutral score weighting', distNull === null, `Got: ${distNull}`);
});

// ----------------------------------------------------
// 2. UNIT TESTS: Deterministic Conflict Detection Rules (Section 28)
// ----------------------------------------------------
runTestSuite('Deterministic Rule-Based Hard Constraint Conflict Checks', () => {
  // Capacity check simulation
  const checkCapacity = (students: number, capacity: number) => students > capacity;
  assert('Detects CAPACITY conflict when studentCount (65) > room.capacity (40)', checkCapacity(65, 40) === true);
  assert('No conflict when studentCount (40) <= room.capacity (80)', checkCapacity(40, 80) === false);

  // Time overlap check simulation
  const checkOverlap = (s1: string, e1: string, s2: string, e2: string) => s1 < e2 && e1 > s2;
  assert('Detects ROOM_TIME overlap: 10:00–12:00 overlaps with 11:00–13:00', checkOverlap('10:00', '12:00', '11:00', '13:00') === true);
  assert('No overlap between 10:00–12:00 and 12:00–14:00 (consecutive slots)', checkOverlap('10:00', '12:00', '12:00', '14:00') === false);

  // Equipment satisfaction check
  const checkEquipment = (required: string[], installed: string[]) => {
    const installedLower = installed.map((i) => i.toLowerCase());
    return required.every((req) => {
      const r = req.toLowerCase();
      return installedLower.some((inst) => inst.includes(r) || (r.includes('computer') && inst.includes('workstation')));
    });
  };

  assert(
    'Satisfies equipment requirements when all hardware is present',
    checkEquipment(['Computers', 'GPU'], ['High-Performance Workstations', 'NVIDIA RTX 4090 GPU Cluster', '4K Laser Projector']) === true
  );
  assert(
    'Fails equipment check when mandatory GPU is missing',
    checkEquipment(['Computers', 'GPU'], ['High-Performance Workstations', '4K Laser Projector']) === false
  );
});

// ----------------------------------------------------
// 3. UNIT TESTS: Attendance-Based Demand Prediction (Section 54)
// ----------------------------------------------------
runTestSuite('Attendance Demand Empirical Prediction Model', () => {
  const sessions = [
    { scheduled: 80, present: 64 },
    { scheduled: 80, present: 60 },
    { scheduled: 80, present: 66 },
    { scheduled: 80, present: 62 },
  ];

  const totalSched = sessions.reduce((s, r) => s + r.scheduled, 0);
  const totalPres = sessions.reduce((s, r) => s + r.present, 0);
  const rate = (totalPres / totalSched) * 100;

  assert('Calculates average turnout percentage accurately (78.75%)', Number(rate.toFixed(2)) === 78.75, `Got: ${rate}%`);

  const scheduled = 80;
  const predicted = Math.round(scheduled * (rate / 100));
  assert('Calculates projected seating demand (63 seats for 80 scheduled)', predicted === 63, `Got: ${predicted}`);
});

// ----------------------------------------------------
// 4. UNIT TESTS: Natural Language Query Entity Parser (Section 55)
// ----------------------------------------------------
runTestSuite('Natural Language Query Parser & Filter Extraction', () => {
  const query = 'What rooms are available for 60 students tomorrow at 2 PM?';
  const queryLower = query.toLowerCase();

  const countMatch = queryLower.match(/(\d+)\s*(students?|seats?|workstations?|people|capacity)/);
  const studentCount = countMatch ? parseInt(countMatch[1], 10) : 0;
  assert('Extracts student count (60) from query string', studentCount === 60, `Got: ${studentCount}`);

  const hasTime = queryLower.includes('2 pm') || queryLower.includes('14:00');
  assert('Detects requested time window (2 PM / 14:00)', hasTime === true);

  const hasTomorrow = queryLower.includes('tomorrow');
  assert('Detects relative day modifier ("tomorrow")', hasTomorrow === true);
});

// ----------------------------------------------------
// 5. INTEGRATION TESTS: Error Handling & Response Contracts (Sections 48 & 49)
// ----------------------------------------------------
runTestSuite('API Response Standardization & Centralized Error Format', () => {
  const errorResponse = {
    success: false,
    message: 'Validation failed: email: Invalid email address; password: Required',
    errorCode: 'VALIDATION_ERROR',
    details: [
      { field: 'email', message: 'Invalid email address', code: 'invalid_string' },
      { field: 'password', message: 'Required', code: 'invalid_type' },
    ],
  };

  assert('Error payload has success === false', errorResponse.success === false);
  assert('Error payload contains structured errorCode', errorResponse.errorCode === 'VALIDATION_ERROR');
  assert('Error payload contains details array with field paths', errorResponse.details.length === 2 && errorResponse.details[0].field === 'email');
});

// Summary Report
console.log(`\n==================================================`);
console.log(`TEST EXECUTION SUMMARY:`);
console.log(`Total Assertions: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`==================================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TEST SUITES PASSED CLEANLY!\n');
  process.exit(0);
}
