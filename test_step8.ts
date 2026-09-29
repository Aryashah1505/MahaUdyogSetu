import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as dotenv from 'dotenv';
import { generateSessionToken } from './server';
dotenv.config();

const BASE_URL = 'http://localhost:3001';
const TEST_COMPANY_ID = 'BIZ-MH-FGHIJ-001';
const OTHER_COMPANY_ID = 'BIZ-MH-OTHER-999';

const validToken = generateSessionToken(TEST_COMPANY_ID, 'contact@westernmahaengineering.example');
const otherToken = generateSessionToken(OTHER_COMPANY_ID, 'contact@other.example');

console.log('--- RUNNING STEP 8 TEST SUITE (REGULATORY KNOWLEDGE BASE + RULE ENGINE) ---');

async function testSuite() {
  let passedCount = 0;
  let failedCount = 0;

  function pass(name: string) {
    passedCount++;
    console.log(`✓ [PASS] Test ${passedCount}: ${name}`);
  }

  function fail(name: string, error: any) {
    failedCount++;
    console.error(`✗ [FAIL] ${name}:`, error);
  }

  // 1. Unauthenticated regulatory analysis rejected (401)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industry: 'Engineering & Heavy Manufacturing' })
    });
    assert.strictEqual(res.status, 401, 'Unauthenticated request should return 401');
    pass('1. Unauthenticated regulatory analysis rejected');
  } catch (err) {
    fail('1. Unauthenticated regulatory analysis rejected', err);
  }

  // 2. Authenticated analysis succeeds (200)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`
      },
      body: JSON.stringify({
        industry: 'Engineering & Heavy Manufacturing',
        district: 'Nashik',
        workforce: 75,
        investment: 18.5,
        isMIDC: true
      })
    });
    assert.strictEqual(res.status, 200, 'Authenticated request should return 200');
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.preliminary, true);
    assert(json.disclaimer.includes('Preliminary Guidance'), 'Must contain statutory disclaimer');
    assert(Array.isArray(json.approvals), 'Must return approvals array');
    pass('2. Authenticated analysis succeeds');
  } catch (err) {
    fail('2. Authenticated analysis succeeds', err);
  }

  // 3. Industries endpoint works (GET /api/regulatory/industries)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/industries`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.industries.length >= 5, 'Should list seeded industries');
    pass('3. Industries endpoint works');
  } catch (err) {
    fail('3. Industries endpoint works', err);
  }

  // 4. Departments endpoint works (GET /api/regulatory/departments)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/departments`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.departments.length >= 5, 'Should list seeded departments');
    pass('4. Departments endpoint works');
  } catch (err) {
    fail('4. Departments endpoint works', err);
  }

  // 5. Approvals endpoint works (GET /api/regulatory/approvals)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/approvals`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.approvals.length >= 8, 'Should list seeded approvals');
    pass('5. Approvals endpoint works');
  } catch (err) {
    fail('5. Approvals endpoint works', err);
  }

  // 6. Approval detail endpoint works (GET /api/regulatory/approvals/:id)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/approvals/APP-MPCB-CTE`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.approval.id, 'APP-MPCB-CTE');
    assert(Array.isArray(json.approval.documentsList), 'Should have documents list');
    assert(Array.isArray(json.approval.stepsList), 'Should have steps list');
    pass('6. Approval detail endpoint works');
  } catch (err) {
    fail('6. Approval detail endpoint works', err);
  }

  // 7. Industry approval mapping works (GET /api/regulatory/industries/:id/approvals)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/industries/IND-ENG/approvals`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.mappings.length >= 3, 'Should list mapped approvals for engineering');
    pass('7. Industry approval mapping works');
  } catch (err) {
    fail('7. Industry approval mapping works', err);
  }

  // 8. Mandatory applicability rule works (workforce >= 10 triggers Factories Act DISH mandatory)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`
      },
      body: JSON.stringify({
        industry: 'Engineering & Heavy Manufacturing',
        workforce: 50
      })
    });
    const json = await res.json();
    const dishApp = json.approvals.find((a: any) => a.id === 'APP-DISH-FACT');
    assert(dishApp, 'DISH approval must be present');
    assert.strictEqual(dishApp.applicability, 'Mandatory', 'Workforce 50 should make Factory Act Mandatory');
    assert(dishApp.reason.includes('Factories Act'), 'Reason should cite Factories Act');
    pass('8. Mandatory applicability rule works');
  } catch (err) {
    fail('8. Mandatory applicability rule works', err);
  }

  // 9. Conditional applicability rule works (Chemical/Pharma triggers Prior Environmental Clearance EC)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`
      },
      body: JSON.stringify({
        industry: 'Chemicals & Petrochemicals',
        hazardousMaterial: true
      })
    });
    const json = await res.json();
    const ecApp = json.approvals.find((a: any) => a.id === 'APP-SEIAA-EC');
    assert(ecApp, 'SEIAA EC must be present');
    assert.strictEqual(ecApp.applicability, 'Mandatory');
    assert(ecApp.reason.includes('5(f)'), 'Should cite Item 5(f)');
    pass('9. Conditional applicability rule works');
  } catch (err) {
    fail('9. Conditional applicability rule works', err);
  }

  // 10. May-Apply rule works (Commercial / non-factory offices trigger Shops & Establishments Act)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`
      },
      body: JSON.stringify({
        industry: 'Engineering & Heavy Manufacturing',
        workforce: 50
      })
    });
    const json = await res.json();
    const shopsApp = json.approvals.find((a: any) => a.id === 'APP-LAB-SHOPS');
    assert(shopsApp, 'Shops Act approval should be evaluated');
    assert.strictEqual(shopsApp.applicability, 'May Apply');
    pass('10. May-Apply rule works');
  } catch (err) {
    fail('10. May-Apply rule works', err);
  }

  // 11. Unverified data is not falsely marked verified
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/approvals/APP-DEMO-BOILER`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    const json = await res.json();
    assert.strictEqual(json.approval.status, 'Pending Verification');
    assert.strictEqual(json.approval.data_sources.verification_status, 'Pending Verification');
    pass('11. Unverified data is not falsely marked verified');
  } catch (err) {
    fail('11. Unverified data is not falsely marked verified', err);
  }

  // 12. Source traceability exists (every approval has source information attached)
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`
      },
      body: JSON.stringify({ industry: 'Engineering & Heavy Manufacturing' })
    });
    const json = await res.json();
    json.approvals.forEach((app: any) => {
      assert(app.source, `Approval ${app.name} must have source traceability`);
      assert(app.source.title, `Approval ${app.name} source must have a title`);
      assert(app.source.verificationStatus, `Approval ${app.name} source must have verification status`);
    });
    pass('12. Source traceability exists');
  } catch (err) {
    fail('12. Source traceability exists', err);
  }

  // 13. No fabricated fee/timeline values appear
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/approvals/APP-DEMO-BOILER`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    const json = await res.json();
    assert(json.approval.fee === null || json.approval.fee === 'Not specified in source');
    assert(json.approval.timeline === null || json.approval.timeline === 'Not specified in source');
    pass('13. No fabricated fee/timeline values appear');
  } catch (err) {
    fail('13. No fabricated fee/timeline values appear', err);
  }

  // 14. Step 5 Grievance Regression
  try {
    const res = await fetch(`${BASE_URL}/api/grievances`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    pass('14. Step 5 grievance regression passes');
  } catch (err) {
    fail('14. Step 5 grievance regression passes', err);
  }

  // 15. Step 6 Feedback Regression
  try {
    const res = await fetch(`${BASE_URL}/api/feedback`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    pass('15. Step 6 feedback regression passes');
  } catch (err) {
    fail('15. Step 6 feedback regression passes', err);
  }

  // 16. Step 7 Investment-Plan Regression
  try {
    const res = await fetch(`${BASE_URL}/api/invest-plans`, {
      headers: { 'Authorization': `Bearer ${validToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    pass('16. Step 7 investment-plan regression passes');
  } catch (err) {
    fail('16. Step 7 investment-plan regression passes', err);
  }

  console.log(`\n========================================`);
  console.log(`STEP 8 TEST RESULTS: ${passedCount} / ${passedCount + failedCount} PASSED`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

testSuite();
