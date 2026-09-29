import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as dotenv from 'dotenv';
import { generateSessionToken } from './server';
dotenv.config();

const BASE_URL = 'http://localhost:3001';
const TEST_COMPANY_ID = 'BIZ-MH-FGHIJ-001';
const OTHER_COMPANY_ID = 'BIZ-MH-OTHER-999';

// 1. Normal Company User Token (COMPANY_USER role)
const companyToken = generateSessionToken(TEST_COMPANY_ID, 'contact@westernmahaengineering.example', 'COMPANY_USER');

// 2. Regulatory Administrator Token (REGULATORY_ADMIN role)
const adminToken = generateSessionToken('ADMIN-REG-01', 'regulatory.admin@maharashtra.gov.in', 'REGULATORY_ADMIN');

console.log('--- RUNNING STEP 9 TEST SUITE (REGULATORY DATA MANAGEMENT + VERIFICATION WORKFLOW) ---');

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

  // 1. Unauthenticated admin endpoint rejected (401)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/sources`);
    assert.strictEqual(res.status, 401, 'Unauthenticated admin request must return 401');
    pass('1. Unauthenticated admin endpoint rejected');
  } catch (err) {
    fail('1. Unauthenticated admin endpoint rejected', err);
  }

  // 2. Normal company user cannot access admin GET where restricted (403)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/sources`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    assert.strictEqual(res.status, 403, 'Company user accessing admin endpoint must receive 403');
    pass('2. Normal company user cannot access admin GET');
  } catch (err) {
    fail('2. Normal company user cannot access admin GET', err);
  }

  // 3. Normal company user cannot modify regulatory records (403)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/sources/SRC-MPCB-PORTAL`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${companyToken}`
      },
      body: JSON.stringify({ title: 'Tampered Source Title' })
    });
    assert.strictEqual(res.status, 403, 'Company user attempting modification must receive 403');
    pass('3. Normal company user cannot modify regulatory records');
  } catch (err) {
    fail('3. Normal company user cannot modify regulatory records', err);
  }

  // 4. Authorized regulatory admin can read records (200)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/sources`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200, 'Admin should read sources');
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.sources.length >= 5);
    pass('4. Authorized regulatory admin can read records');
  } catch (err) {
    fail('4. Authorized regulatory admin can read records', err);
  }

  // 5. Authorized regulatory admin can update a source (200)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/sources/SRC-DEMO-UNVERIFIED`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        notes: 'Updated via admin workflow during review',
        reason: 'Periodic audit check'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.source.notes, 'Updated via admin workflow during review');
    pass('5. Authorized regulatory admin can update a source');
  } catch (err) {
    fail('5. Authorized regulatory admin can update a source', err);
  }

  // 6. Source verification works (POST /api/admin/regulatory/sources/:id/verify)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/sources/SRC-DEMO-UNVERIFIED/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        notes: 'Verified against Maharashtra Government Gazette notification',
        reason: 'Confirmed publication in official gazette'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.source.verification_status, 'Verified');
    assert(json.source.verified_by.includes('regulatory.admin'), 'Must store administrator ID in verified_by');
    assert(json.source.last_verified_at, 'Must update last_verified_at timestamp');
    pass('6. Source verification works');
  } catch (err) {
    fail('6. Source verification works', err);
  }

  // 7. Source rejection works (POST /api/admin/regulatory/sources/:id/reject)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/sources/SRC-DEMO-UNVERIFIED/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        notes: 'Incomplete gazette citations provided',
        reason: 'Missing statutory annexures'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.source.verification_status, 'Rejected');
    pass('7. Source rejection works');
  } catch (err) {
    fail('7. Source rejection works', err);
  }

  // 8. Approval verification works (POST /api/admin/regulatory/approvals/:id/verify)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/approvals/APP-DEMO-BOILER/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        notes: 'Boiler Act scrutiny checklist confirmed by Joint Director',
        reason: 'Approved after verification'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.approval.status, 'Verified');
    assert(json.approval.version >= 2, 'Version should increment');
    pass('8. Approval verification works');
  } catch (err) {
    fail('8. Approval verification works', err);
  }

  // 9. Approval archive works (POST /api/admin/regulatory/approvals/:id/archive)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/approvals/APP-DEMO-BOILER/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ reason: 'Superseded by 2026 unified rules' })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.approval.status, 'Archived');
    pass('9. Approval archive works');
  } catch (err) {
    fail('9. Approval archive works', err);
  }

  // 10. Rule verification works (POST /api/admin/regulatory/rules/:id/verify)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/rules/RULE-DEMO-BOILER/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        notes: 'Rule condition verified against Indian Boilers Act',
        reason: 'Confirmed by legal committee'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.rule.status, 'Verified');
    assert(json.rule.version >= 2, 'Version should increment');
    pass('10. Rule verification works');
  } catch (err) {
    fail('10. Rule verification works', err);
  }

  // 11. Unverified / Rejected rules are excluded from analysis
  try {
    // Reject RULE-DEMO-BOILER
    await fetch(`${BASE_URL}/api/admin/regulatory/rules/RULE-DEMO-BOILER/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ reason: 'Rule draft rejected for corrections' })
    });

    // Run analysis with hasBoiler: true
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${companyToken}`
      },
      body: JSON.stringify({
        industry: 'Engineering & Heavy Manufacturing',
        hasBoiler: true
      })
    });
    const json = await res.json();
    // Because APP-DEMO-BOILER was archived in test 9 and rule rejected in test 11, it must NOT appear
    const boilerApp = json.approvals.find((a: any) => a.id === 'APP-DEMO-BOILER');
    assert.strictEqual(boilerApp, undefined, 'Archived / Rejected approval must not appear in analysis');
    pass('11. Unverified / Rejected rules are excluded from analysis');
  } catch (err) {
    fail('11. Unverified / Rejected rules are excluded from analysis', err);
  }

  // 12. Archived approvals are excluded from analysis
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${companyToken}`
      },
      body: JSON.stringify({ industry: 'Engineering & Heavy Manufacturing' })
    });
    const json = await res.json();
    const archivedApp = json.approvals.find((a: any) => a.id === 'APP-DEMO-BOILER');
    assert.strictEqual(archivedApp, undefined, 'Archived approval must not appear');
    pass('12. Archived approvals are excluded from analysis');
  } catch (err) {
    fail('12. Archived approvals are excluded from analysis', err);
  }

  // 13. Rejected approvals are excluded from analysis & public endpoint
  try {
    // Restore and reject APP-DEMO-BOILER
    await fetch(`${BASE_URL}/api/admin/regulatory/approvals/APP-DEMO-BOILER/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ reason: 'Testing rejection exclusion' })
    });

    const res = await fetch(`${BASE_URL}/api/regulatory/approvals`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    const json = await res.json();
    const foundRejected = json.approvals.find((a: any) => a.id === 'APP-DEMO-BOILER');
    assert.strictEqual(foundRejected, undefined, 'Rejected approval should be hidden from company users');
    pass('13. Rejected approvals are excluded from analysis');
  } catch (err) {
    fail('13. Rejected approvals are excluded from analysis', err);
  }

  // 14. Version history created after update (GET /api/admin/regulatory/versions)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/versions?entityType=approval&entityId=APP-DEMO-BOILER`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.versions.length >= 2, 'Should contain version snapshots for APP-DEMO-BOILER');
    pass('14. Version history created after update');
  } catch (err) {
    fail('14. Version history created after update', err);
  }

  // 15. Audit record created after verification (GET /api/admin/regulatory/audit-logs)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/audit-logs?entityType=approval&entityId=APP-DEMO-BOILER`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.logs.length >= 2, 'Should contain audit events');
    const verifyLog = json.logs.find((l: any) => l.action === 'VERIFY');
    assert(verifyLog, 'Must have recorded VERIFY action in audit trail');
    pass('15. Audit record created after verification');
  } catch (err) {
    fail('15. Audit record created after verification', err);
  }

  // 16. Previous version remains retrievable
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/approvals/APP-DEMO-BOILER`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const json = await res.json();
    assert(json.versions && json.versions.length >= 2, 'Admin detail must include historical version chain');
    const v1 = json.versions.find((v: any) => v.version_number === 1 || v.version_number === 2);
    assert(v1, 'Previous version must be retained intact in snapshots');
    pass('16. Previous version remains retrievable');
  } catch (err) {
    fail('16. Previous version remains retrievable', err);
  }

  // 17. Step 5 Grievance Regression
  try {
    const res = await fetch(`${BASE_URL}/api/grievances`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    pass('17. Step 5 grievance regression passes');
  } catch (err) {
    fail('17. Step 5 grievance regression passes', err);
  }

  // 18. Step 6 Feedback Regression
  try {
    const res = await fetch(`${BASE_URL}/api/feedback`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    pass('18. Step 6 feedback regression passes');
  } catch (err) {
    fail('18. Step 6 feedback regression passes', err);
  }

  // 19. Step 7 Investment-Plan Regression
  try {
    const res = await fetch(`${BASE_URL}/api/invest-plans`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    pass('19. Step 7 investment-plan regression passes');
  } catch (err) {
    fail('19. Step 7 investment-plan regression passes', err);
  }

  // 20. Step 8 Regulatory Analysis Regression
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${companyToken}`
      },
      body: JSON.stringify({
        industry: 'Engineering & Heavy Manufacturing',
        workforce: 75,
        district: 'Nashik'
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.approvals.length >= 4);
    pass('20. Step 8 regulatory analysis regression passes');
  } catch (err) {
    fail('20. Step 8 regulatory analysis regression passes', err);
  }

  // Cleanup/Restore test entities to Pending Verification so test_step8 passes idempotently
  try {
    const res1 = await fetch(`${BASE_URL}/api/admin/regulatory/sources/SRC-DEMO-UNVERIFIED`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ verification_status: 'Pending Verification', reason: 'Restoring initial test state' })
    });
    const res2 = await fetch(`${BASE_URL}/api/admin/regulatory/approvals/APP-DEMO-BOILER`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'Pending Verification', reason: 'Restoring initial test state' })
    });
    const res3 = await fetch(`${BASE_URL}/api/admin/regulatory/rules/RULE-DEMO-BOILER`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'Verified', reason: 'Restoring initial test state' })
    });
  } catch (e) {
    console.error('Failed cleanup:', e);
  }

  console.log(`\n========================================`);
  console.log(`STEP 9 TEST RESULTS: ${passedCount} / ${passedCount + failedCount} PASSED`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

testSuite();
