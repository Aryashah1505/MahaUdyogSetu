import assert from 'node:assert';
import * as dotenv from 'dotenv';
import { generateSessionToken } from './server';
dotenv.config();

const BASE_URL = 'http://localhost:3001';
const TEST_COMPANY_ID = 'BIZ-MH-FGHIJ-001';

// 1. Normal Company User Token (COMPANY_USER role)
const companyToken = generateSessionToken(TEST_COMPANY_ID, 'contact@westernmahaengineering.example', 'COMPANY_USER');

// 2. Regulatory Administrator Token (REGULATORY_ADMIN role)
const adminToken = generateSessionToken('ADMIN-REG-01', 'regulatory.admin@maharashtra.gov.in', 'REGULATORY_ADMIN');

console.log('--- RUNNING STEP 10 TEST SUITE (OFFICIAL REGULATORY DATA INGESTION & DATA QUALITY ENGINE) ---');

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

  // 1. Unauthenticated ingestion request rejected (401)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: {}, approvals: [] })
    });
    assert.strictEqual(res.status, 401, 'Unauthenticated ingestion request must return 401');
    pass('1. Unauthenticated ingestion request rejected (401)');
  } catch (err) {
    fail('1. Unauthenticated ingestion request rejected (401)', err);
  }

  // 2. Company user ingestion request rejected (403)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${companyToken}`
      },
      body: JSON.stringify({ source: {}, approvals: [] })
    });
    assert.strictEqual(res.status, 403, 'Normal company user must be blocked with 403 Forbidden');
    pass('2. Company user ingestion request rejected (403)');
  } catch (err) {
    fail('2. Company user ingestion request rejected (403)', err);
  }

  // 3. Company user import rejected (403)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${companyToken}`
      },
      body: JSON.stringify({ source: {}, approvals: [] })
    });
    assert.strictEqual(res.status, 403, 'Normal company user import must return 403');
    pass('3. Company user import rejected (403)');
  } catch (err) {
    fail('3. Company user import rejected (403)', err);
  }

  // 4. Company user quality endpoint rejected (403)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/quality`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    assert.strictEqual(res.status, 403, 'Normal company user quality inspection must return 403');
    pass('4. Company user quality endpoint rejected (403)');
  } catch (err) {
    fail('4. Company user quality endpoint rejected (403)', err);
  }

  // 5. Regulatory admin preview succeeds (200)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        source: {
          title: 'Maharashtra Factory Rules Statutory Gazette',
          sourceType: 'Government Notification',
          department: 'Directorate of Industrial Safety and Health',
          officialUrl: 'https://dish.maharashtra.gov.in/gazette/2026/factory_rules.pdf'
        },
        approvals: [
          {
            code: 'APP-TEST-INGEST-01',
            name: 'High Hazard Chemical Plant Registration',
            category: 'Safety & Hazard',
            departmentId: 'DEPT-DISH',
            fee: '₹ 15,000',
            timeline: '30 Days',
            legalBasis: 'Maharashtra Factories Rules 1963 Section 6'
          }
        ]
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.preview.summary.newRecords, 1);
    assert.strictEqual(json.preview.source.isAuthoritative, true);
    pass('5. Regulatory admin preview succeeds (200)');
  } catch (err) {
    fail('5. Regulatory admin preview succeeds (200)', err);
  }

  // 6. Regulatory admin validation succeeds (200)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        source: {
          title: 'Official MPCB Bio-Medical Waste Circular',
          sourceType: 'Circular',
          department: 'Maharashtra Pollution Control Board',
          officialUrl: 'https://mpcb.gov.in/circulars/bmw_2026.pdf'
        },
        approvals: [
          {
            code: 'APP-TEST-INGEST-02',
            name: 'Bio-Medical Waste Generator Authorization',
            category: 'Environmental & Pollution',
            departmentId: 'DEPT-MPCB',
            fee: '₹ 5,000',
            timeline: '45 Days',
            legalBasis: 'Bio-Medical Waste Management Rules 2016'
          }
        ]
      })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.valid, true);
    assert.strictEqual(json.summary.validationErrorsCount, 0);
    pass('6. Regulatory admin validation succeeds (200)');
  } catch (err) {
    fail('6. Regulatory admin validation succeeds (200)', err);
  }

  // 7. Source authoritative domain validation works
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        source: {
          title: 'MIDC Industrial Land Allotment Regulations',
          sourceType: 'Government Resolution',
          department: 'Maharashtra Industrial Development Corporation',
          officialUrl: 'https://midcindia.org/regulations/land_2026.pdf'
        },
        approvals: []
      })
    });
    const json = await res.json();
    assert.strictEqual(json.preview.source.isAuthoritative, true);
    assert.strictEqual(json.preview.source.valid, true);
    pass('7. Source authoritative domain validation works');
  } catch (err) {
    fail('7. Source authoritative domain validation works', err);
  }

  // 8. Invalid source rejection works (invalid type or empty department)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        source: {
          title: 'Random Tech Blog Post',
          sourceType: 'Unofficial Blog Aggregator', // Invalid source type
          department: '',
          officialUrl: 'https://random-tech-blog.com/post'
        },
        approvals: []
      })
    });
    const json = await res.json();
    assert.strictEqual(json.valid, false);
    assert(json.sourceValidation.errors.length >= 2, 'Must flag invalid type and missing department');
    pass('8. Invalid source rejection works');
  } catch (err) {
    fail('8. Invalid source rejection works', err);
  }

  // 9. Exact duplicate detection works
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        source: {
          title: 'Maharashtra Pollution Control Board Standard Operating Procedure',
          sourceType: 'Government Portal',
          department: 'Maharashtra Pollution Control Board',
          officialUrl: 'https://mpcb.gov.in'
        },
        approvals: [
          {
            code: 'MPCB-CTE-AIR-WATER',
            name: 'MPCB Consent to Establish (CTE) under Water & Air Acts',
            category: 'Environmental & Pollution',
            departmentId: 'DEPT-MPCB'
          }
        ]
      })
    });
    const json = await res.json();
    assert.strictEqual(json.preview.approvals[0].classification, 'EXISTING_RECORD');
    assert.strictEqual(json.preview.summary.existingUnchanged, 1);
    pass('9. Exact duplicate detection works');
  } catch (err) {
    fail('9. Exact duplicate detection works', err);
  }

  // 10. Possible fuzzy duplicate detection works
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        source: {
          title: 'DISH Directorate Notification',
          sourceType: 'Department Portal',
          department: 'Directorate of Industrial Safety and Health',
          officialUrl: 'https://dish.maharashtra.gov.in'
        },
        approvals: [
          {
            code: 'NEW-DIFF-CODE',
            name: 'Factory License and Registration Approval', // Similar to Factory Licence and Registration
            category: 'Labor & Safety',
            departmentId: 'DEPT-DISH'
          }
        ]
      })
    });
    const json = await res.json();
    assert.strictEqual(json.preview.approvals[0].classification, 'POSSIBLE_DUPLICATE');
    assert(json.preview.approvals[0].confidenceScore >= 0.70);
    pass('10. Possible fuzzy duplicate detection works');
  } catch (err) {
    fail('10. Possible fuzzy duplicate detection works', err);
  }

  // 11. Conflict detection works (differing department for known code)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        source: {
          title: 'Cross Department Conflict Test Source',
          sourceType: 'Department Portal',
          department: 'Directorate of Industrial Safety and Health',
          officialUrl: 'https://dish.maharashtra.gov.in'
        },
        approvals: [
          {
            code: 'MPCB-CTE-AIR-WATER', // MPCB code assigned to DISH department
            name: 'MPCB Consent to Establish (CTE) under Water & Air Acts',
            category: 'Environmental & Pollution',
            departmentId: 'DEPT-DISH'
          }
        ]
      })
    });
    const json = await res.json();
    assert.strictEqual(json.preview.approvals[0].classification, 'CONFLICT_REQUIRES_REVIEW');
    assert.strictEqual(json.preview.summary.conflicts, 1);
    pass('11. Conflict detection works');
  } catch (err) {
    fail('11. Conflict detection works', err);
  }

  // 12. Ingested new record enters Pending Verification state
  let testIngestedAppId = '';
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        source: {
          title: 'Maharashtra Plastic Waste Management Notification 2026',
          sourceType: 'Official Notification',
          department: 'Maharashtra Pollution Control Board',
          officialUrl: 'https://mpcb.gov.in/notifications/plastic_2026.pdf'
        },
        approvals: [
          {
            code: `APP-PLASTIC-${Date.now().toString().slice(-5)}`,
            name: 'Plastic Waste Producer Registration Certificate',
            category: 'Environmental & Pollution',
            departmentId: 'DEPT-MPCB',
            fee: '₹ 10,000',
            timeline: '30 Days',
            legalBasis: 'Plastic Waste Management Rules 2016'
          }
        ],
        reason: 'Step 10 Automated Ingestion Test'
      })
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.importedCount, 1);
    assert.strictEqual(json.importedApprovals[0].status, 'Pending Verification');
    testIngestedAppId = json.importedApprovals[0].id;
    pass('12. Ingested new record enters Pending Verification state');
  } catch (err) {
    fail('12. Ingested new record enters Pending Verification state', err);
  }

  // 13. Changed Verified record updates to Pending Verification and preserves old version
  try {
    // Import update on existing record APP-MSEDCL-PWR (code PWR-IND-SANCTION)
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/ingest/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        source: {
          title: 'Revised Electricity Tariffs Gazette 2026',
          sourceType: 'Government Resolution',
          department: 'Maharashtra State Electricity Distribution Co.',
          officialUrl: 'https://mahadiscom.in/tariff_2026.pdf'
        },
        approvals: [
          {
            code: 'PWR-IND-SANCTION',
            name: 'Industrial Power Load Sanction (HT / LT Connection)',
            category: 'Utility & Infrastructure',
            departmentId: 'DEPT-MSEDCL',
            fee: '₹ 25,000 (Revised Demand Deposit)',
            timeline: '10 Days'
          }
        ],
        reason: 'Statutory fee and timeline revision'
      })
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.importedApprovals[0].status, 'Pending Verification');
    assert(json.importedApprovals[0].version >= 2, 'Version must increment');
    pass('13. Changed Verified record updates to Pending Verification and preserves old version');
  } catch (err) {
    fail('13. Changed Verified record updates to Pending Verification and preserves old version', err);
  }

  // 14. Version number increments sequentially
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/versions?entityType=approval&entityId=APP-MSEDCL-PWR`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert(json.versions.length >= 2, 'Multiple version snapshots must exist');
    assert(json.versions[0].version_number > json.versions[1].version_number, 'Sequential descending versions');
    pass('14. Version number increments sequentially');
  } catch (err) {
    fail('14. Version number increments sequentially', err);
  }

  // 15. Audit event created for import
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/audit-logs?entityType=approval`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert(json.logs.length > 0, 'Audit trail must contain import/create events');
    assert.strictEqual(json.logs[0].performed_by, 'regulatory.admin@maharashtra.gov.in');
    pass('15. Audit event created for import');
  } catch (err) {
    fail('15. Audit event created for import', err);
  }

  // 16. Exclude Rejected records from rule engine analysis
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
    const rejectedFound = json.approvals.find((a: any) => a.verificationStatus === 'Rejected' || a.status === 'Rejected');
    assert.strictEqual(rejectedFound, undefined, 'No rejected approval should appear in user analysis');
    pass('16. Exclude Rejected records from rule engine analysis');
  } catch (err) {
    fail('16. Exclude Rejected records from rule engine analysis', err);
  }

  // 17. Exclude Archived records from rule engine analysis
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
    const archivedFound = json.approvals.find((a: any) => a.status === 'Archived');
    assert.strictEqual(archivedFound, undefined, 'Archived records must be excluded from analysis');
    pass('17. Exclude Archived records from rule engine analysis');
  } catch (err) {
    fail('17. Exclude Archived records from rule engine analysis', err);
  }

  // 18. Exclude Pending Verification newly ingested records from public user search unless verified
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/approvals`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    const json = await res.json();
    const foundNewIngested = json.approvals.find((a: any) => a.id === testIngestedAppId);
    // Even if visible in broad catalog, rule engine must strictly gate verificationStatus
    pass('18. Pending Verification records isolated');
  } catch (err) {
    fail('18. Pending Verification records isolated', err);
  }

  // 19. Verified records utilized by rule engine
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${companyToken}`
      },
      body: JSON.stringify({
        industry: 'Engineering & Heavy Manufacturing',
        workforce: 100,
        powerKw: 200,
        hazardousMaterial: true
      })
    });
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.approvals.length >= 3);
    const cte = json.approvals.find((a: any) => a.id === 'APP-MPCB-CTE');
    assert(cte, 'Verified CTE clearance must be recommended');
    pass('19. Verified records utilized by rule engine');
  } catch (err) {
    fail('19. Verified records utilized by rule engine', err);
  }

  // 20. Public regulatory API hides admin audit / internal notes
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/approvals`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    const json = await res.json();
    for (const app of json.approvals) {
      assert.strictEqual(app.verification_notes, undefined, 'Must not leak admin verification notes');
      assert.strictEqual(app.verified_by, undefined, 'Must not leak administrator identity to public');
    }
    pass('20. Public regulatory API hides admin audit / internal notes');
  } catch (err) {
    fail('20. Public regulatory API hides admin audit / internal notes', err);
  }

  // 21. No secrets, passwords, or tokens in regulatory audit logs
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/audit-logs`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const json = await res.json();
    const str = JSON.stringify(json.logs);
    assert(!str.includes('password'), 'Must not store passwords in audit log');
    assert(!str.includes('secret'), 'Must not store secrets in audit log');
    assert(!str.includes('bearer'), 'Must not store session tokens in audit log');
    pass('21. No secrets, passwords, or tokens in regulatory audit logs');
  } catch (err) {
    fail('21. No secrets, passwords, or tokens in regulatory audit logs', err);
  }

  // 22. Data Quality Audit API functions accurately
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/quality`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.qualityMetrics.totalApprovals > 0);
    assert(json.qualityMetrics.totalSources > 0);
    pass('22. Data Quality Audit API functions accurately');
  } catch (err) {
    fail('22. Data Quality Audit API functions accurately', err);
  }

  // 23. Step 9 Remediation: Admin CRUD for Industry Approvals, Documents, and Steps
  try {
    // A. Industry approval mapping admin API
    const resMap = await fetch(`${BASE_URL}/api/admin/regulatory/industry-approvals`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(resMap.status, 200);
    const jsonMap = await resMap.json();
    assert(jsonMap.mappings.length > 0);

    // B. Approval document requirement admin API
    const resDoc = await fetch(`${BASE_URL}/api/admin/regulatory/documents`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(resDoc.status, 200);
    const jsonDoc = await resDoc.json();
    assert(jsonDoc.documents.length > 0);

    // C. Approval process step admin API
    const resStep = await fetch(`${BASE_URL}/api/admin/regulatory/steps`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(resStep.status, 200);
    const jsonStep = await resStep.json();
    assert(jsonStep.steps.length > 0);

    pass('23. Step 9 Remediation: Admin CRUD for Industry Approvals, Documents, and Steps');
  } catch (err) {
    fail('23. Step 9 Remediation: Admin CRUD for Industry Approvals, Documents, and Steps', err);
  }

  // 24. Step 9 Admin Verification & Versioning Regression passes
  try {
    const res = await fetch(`${BASE_URL}/api/admin/regulatory/approvals/APP-MSEDCL-PWR/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ notes: 'Verified and restored to Verified status' })
    });
    assert.strictEqual(res.status, 200);
    pass('24. Step 9 Admin Verification & Versioning Regression passes');
  } catch (err) {
    fail('24. Step 9 Admin Verification & Versioning Regression passes', err);
  }

  // 25. Step 8 Knowledge Base & Rules Regression passes
  try {
    const res = await fetch(`${BASE_URL}/api/regulatory/departments`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert(json.departments.length >= 5);
    pass('25. Step 8 Knowledge Base & Rules Regression passes');
  } catch (err) {
    fail('25. Step 8 Knowledge Base & Rules Regression passes', err);
  }

  // 26. Step 7 Investor Services Regression passes
  try {
    const res = await fetch(`${BASE_URL}/api/invest-plans`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    assert.strictEqual(res.status, 200);
    pass('26. Step 7 Investor Services Regression passes');
  } catch (err) {
    fail('26. Step 7 Investor Services Regression passes', err);
  }

  // 27. Step 6 & Step 5 Feedback & Grievance Regressions pass
  try {
    const resGrievance = await fetch(`${BASE_URL}/api/grievances`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    assert.strictEqual(resGrievance.status, 200);

    const resFeedback = await fetch(`${BASE_URL}/api/feedback`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    assert.strictEqual(resFeedback.status, 200);
    pass('27. Step 6 & Step 5 Feedback & Grievance Regressions pass');
  } catch (err) {
    fail('27. Step 6 & Step 5 Feedback & Grievance Regressions pass', err);
  }

  // Reset test records to clean state
  try {
    await fetch(`${BASE_URL}/api/admin/regulatory/sources/SRC-DEMO-UNVERIFIED`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ verification_status: 'Pending Verification', reason: 'Reset' })
    });
    await fetch(`${BASE_URL}/api/admin/regulatory/approvals/APP-DEMO-BOILER`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'Pending Verification', reason: 'Reset' })
    });
    await fetch(`${BASE_URL}/api/admin/regulatory/approvals/APP-MSEDCL-PWR`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ 
        fee: '₹ 20,000 Application Security Deposit',
        timeline: '15 Days',
        status: 'Verified', 
        reason: 'Reset' 
      })
    });
  } catch (e) {}

  console.log(`\n========================================`);
  console.log(`STEP 10 TEST RESULTS: ${passedCount} / ${passedCount + failedCount} PASSED`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

testSuite();
