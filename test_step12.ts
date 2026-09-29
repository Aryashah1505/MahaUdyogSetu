import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { generateSessionToken } from "./server";

dotenv.config();

const BASE_URL = "http://localhost:3001";
const companyAId = "BIZ-MH-DASH-A01";
const companyBId = "BIZ-MH-DASH-B02";
const companyAToken = generateSessionToken(companyAId, "dashA@test.com", "COMPANY_USER");
const companyBToken = generateSessionToken(companyBId, "dashB@test.com", "COMPANY_USER");

const supabase = createClient(
  process.env.SUPABASE_URL || "https://iiqdnregrpeocsghmrtv.supabase.co",
  process.env.SUPABASE_ANON_KEY || "sb_publishable_LYopuHWIc3vRNbxzVj82kA_vhEUxYGk"
);

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: any) {
  if (condition) {
    testsPassed++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    testsFailed++;
    console.error(`  ✗ [FAIL] ${testName}`, detail || "");
  }
}

async function runTests() {
  console.log("================================================================");
  console.log("STARTING STEP 12: DASHBOARD & ANALYTICS TEST SUITE (65+ TESTS)");
  console.log("================================================================\n");

  // 1. Seed test companies
  await supabase.from("companies").upsert([
    {
      id: companyAId,
      name: "Alpha Dashboard Enterprises Ltd",
      pan: "DAPLA1234E",
      gstin: "27DAPLA1234E1Z1",
      email: "dashA@test.com",
      mobile: "9825204240",
      district: "Nashik",
      taluka: "Ambad",
      state: "Maharashtra",
      sector: "Automobile & Auto Ancillary",
      business_type: "Private Limited",
      investment_crores: 75.5,
      connected_power_kw: 1200,
      workforce: 250,
      is_profile_complete: true
    },
    {
      id: companyBId,
      name: "Beta Dashboard Solutions LLP",
      pan: "DBETA5678F",
      gstin: "27DBETA5678F1Z2",
      email: "dashB@test.com",
      mobile: "9876543210",
      district: "Pune",
      taluka: "Haveli",
      state: "Maharashtra",
      sector: "Information Technology",
      business_type: "LLP",
      investment_crores: 25.0,
      connected_power_kw: 300,
      workforce: 80,
      is_profile_complete: true
    }
  ]);

  // Clean old test records
  await supabase.from("applications").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("grievances").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("documents").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("invest_plans").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("notifications").delete().in("company_id", [companyAId, companyBId]);

  // Seed company A records
  const appA1Id = "APP-TEST-DASH-A01";
  const appA2Id = "APP-TEST-DASH-A02";
  await supabase.from("applications").insert([
    {
      id: appA1Id,
      code: "MAHA-APP-A01",
      name: "Factory Consent to Operate (Red Category)",
      company_id: companyAId,
      department: "Maharashtra Pollution Control Board",
      category: "Environmental",
      status: "In Review",
      sla_days: 30,
      submitted_date: new Date().toISOString()
    },
    {
      id: appA2Id,
      code: "MAHA-APP-A02",
      name: "Industrial Power Load Release (1200 kW)",
      company_id: companyAId,
      department: "MSEDCL",
      category: "Power",
      status: "Approved",
      sla_days: 15,
      submitted_date: new Date(Date.now() - 10 * 86400000).toISOString(),
      approval_date: new Date().toISOString()
    }
  ]);

  const grievA1Id = "GRV-TEST-DASH-A01";
  const grievInsertRes = await supabase.from("grievances").insert({
    id: grievA1Id,
    company_id: companyAId,
    type: "grievance",
    business_name: "Alpha Dashboard Enterprises Ltd",
    applicant_name: "Authorized Signatory",
    mobile: "9825204240",
    email: "dashA@test.com",
    service_type: "Power Infrastructure Facilitation",
    department: "MSEDCL",
    district: "Nashik",
    taluka: "Ambad",
    category: "Power Infrastructure",
    priority: "High",
    subject: "Delay in factory power connection sanction",
    description: "Detailed description of delay in electrical load sanction for factory.",
    status: "Submitted",
    expected_sla_days: 15
  });
  if (grievInsertRes.error) console.error("Grievance seed error:", grievInsertRes.error);

  const docA1Id = "DOC-TEST-DASH-A01";
  await supabase.from("documents").insert({
    id: docA1Id,
    company_id: companyAId,
    name: "Factory License",
    category: "Factory License",
    status: "verified",
    file_type: "application/pdf",
    file_size: "1.2 MB",
    storage_path: "/uploads/factory_license.pdf"
  });

  const planA1Id = "INV-TEST-DASH-A01";
  await supabase.from("invest_plans").insert({
    id: planA1Id,
    company_id: companyAId,
    project_name: "Phase 2 Auto Component Expansion",
    industry_sector: "Automobile & Auto Ancillary",
    location: "Ambad MIDC, Nashik",
    investment_cr: 45.0,
    status: "active"
  });

  const notifA1Id = "11111111-2222-3333-4444-555555555555";
  const notifInsertRes = await supabase.from("notifications").insert({
    id: notifA1Id,
    company_id: companyAId,
    title: "Application Status Update",
    message: "Your Power application has been approved.",
    type: "APPLICATION_APPROVED",
    severity: "INFO",
    channel: "PORTAL",
    status: "ACTIVE",
    is_read: false
  });
  if (notifInsertRes.error) console.error("Notification seed error:", notifInsertRes.error);

  // Seed company B record
  const appB1Id = "APP-TEST-DASH-B01";
  await supabase.from("applications").insert({
    id: appB1Id,
    code: "MAHA-APP-B01",
    name: "IT Park Municipal Building Permission",
    company_id: companyBId,
    department: "Urban Development Department",
    category: "Building",
    status: "Approved",
    sla_days: 30,
    submitted_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    approval_date: new Date().toISOString()
  });

  try {
    // -------------------------------------------------------------
    // GROUP 1: AUTHENTICATION & ACCESS CONTROL (Tests 1 - 8)
    // -------------------------------------------------------------
    console.log("--- GROUP 1: Authentication & Access Control ---");

    // Test 1: Unauthenticated request to /api/dashboard/summary rejected
    try {
      await axios.get(`${BASE_URL}/api/dashboard/summary`);
      assert(false, "Test 1: /api/dashboard/summary rejects unauthenticated (401)");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 1: /api/dashboard/summary rejects unauthenticated (401)");
    }

    // Test 2: Unauthenticated request to /api/dashboard/applications rejected
    try {
      await axios.get(`${BASE_URL}/api/dashboard/applications`);
      assert(false, "Test 2: /api/dashboard/applications rejects unauthenticated (401)");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 2: /api/dashboard/applications rejects unauthenticated (401)");
    }

    // Test 3: Unauthenticated request to /api/dashboard/grievances rejected
    try {
      await axios.get(`${BASE_URL}/api/dashboard/grievances`);
      assert(false, "Test 3: /api/dashboard/grievances rejects unauthenticated (401)");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 3: /api/dashboard/grievances rejects unauthenticated (401)");
    }

    // Test 4: Unauthenticated request to /api/dashboard/documents rejected
    try {
      await axios.get(`${BASE_URL}/api/dashboard/documents`);
      assert(false, "Test 4: /api/dashboard/documents rejects unauthenticated (401)");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 4: /api/dashboard/documents rejects unauthenticated (401)");
    }

    // Test 5: Unauthenticated request to /api/dashboard/notifications rejected
    try {
      await axios.get(`${BASE_URL}/api/dashboard/notifications`);
      assert(false, "Test 5: /api/dashboard/notifications rejects unauthenticated (401)");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 5: /api/dashboard/notifications rejects unauthenticated (401)");
    }

    // Test 6: Unauthenticated request to /api/dashboard/investments rejected
    try {
      await axios.get(`${BASE_URL}/api/dashboard/investments`);
      assert(false, "Test 6: /api/dashboard/investments rejects unauthenticated (401)");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 6: /api/dashboard/investments rejects unauthenticated (401)");
    }

    // Test 7: Unauthenticated request to /api/analytics/departments rejected
    try {
      await axios.get(`${BASE_URL}/api/analytics/departments`);
      assert(false, "Test 7: /api/analytics/departments rejects unauthenticated (401)");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 7: /api/analytics/departments rejects unauthenticated (401)");
    }

    // Test 8: Unauthenticated request to /api/public-dashboard/summary rejected
    try {
      await axios.get(`${BASE_URL}/api/public-dashboard/summary`);
      assert(false, "Test 8: /api/public-dashboard/summary rejects unauthenticated (401)");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 8: /api/public-dashboard/summary rejects unauthenticated (401)");
    }

    // -------------------------------------------------------------
    // GROUP 2: COMPANY DASHBOARD SUMMARY & PROFILE (Tests 9 - 18)
    // -------------------------------------------------------------
    console.log("--- GROUP 2: Company Dashboard Summary & Profile Calculation ---");

    const sumResA = await axios.get(`${BASE_URL}/api/dashboard/summary`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });

    // Test 9: Summary endpoint returns 200 OK
    assert(sumResA.status === 200, "Test 9: GET /api/dashboard/summary returns 200 OK");

    // Test 10: Summary contains companyProfile structure
    assert(sumResA.data.companyProfile && sumResA.data.companyProfile.id === companyAId, "Test 10: Summary contains tenant companyProfile id");

    // Test 11: Company Profile name is correct
    assert(sumResA.data.companyProfile.name === "Alpha Dashboard Enterprises Ltd", "Test 11: Profile name matches database record");

    // Test 12: Profile completion percentage calculated properly
    assert(typeof sumResA.data.companyProfile.completionPercentage === "number" && sumResA.data.companyProfile.completionPercentage >= 80, "Test 12: Profile completion percentage is calculated (>= 80%)");

    // Test 13: Applications metrics calculated accurately for Company A
    assert(sumResA.data.applications.total === 2 && sumResA.data.applications.approved === 1 && sumResA.data.applications.active === 1, "Test 13: Applications metrics accurate (2 total, 1 approved, 1 active)");

    // Test 14: Grievances metrics calculated accurately for Company A
    assert(sumResA.data.grievances.total === 1 && sumResA.data.grievances.open === 1, "Test 14: Grievances metrics accurate (1 total, 1 open)");

    // Test 15: Documents metrics calculated accurately for Company A
    assert(sumResA.data.documents.total === 1 && sumResA.data.documents.verified === 1, "Test 15: Documents metrics accurate (1 total, 1 verified)");

    // Test 16: Notifications unread count calculated accurately
    assert(sumResA.data.notifications.unreadCount >= 1, "Test 16: Unread notifications count accurate (>= 1)");

    // Test 17: Investments metrics calculated accurately
    assert(sumResA.data.investments.totalPlans === 1 && sumResA.data.investments.totalProposedInvestmentCr === 45, "Test 17: Investments metrics accurate (1 plan, 45 Cr)");

    // Test 18: Recent activity feed contains entries
    assert(Array.isArray(sumResA.data.recentActivity) && sumResA.data.recentActivity.length > 0, "Test 18: Recent activity feed is populated");

    // -------------------------------------------------------------
    // GROUP 3: TENANT ISOLATION (Tests 19 - 25)
    // -------------------------------------------------------------
    console.log("--- GROUP 3: Tenant Isolation & Company Separation ---");

    const sumResB = await axios.get(`${BASE_URL}/api/dashboard/summary`, {
      headers: { Authorization: `Bearer ${companyBToken}` }
    });

    // Test 19: Company B receives only Company B profile
    assert(sumResB.data.companyProfile.id === companyBId, "Test 19: Company B receives Company B profile id");

    // Test 20: Company B has 1 application (not Company A's 2)
    assert(sumResB.data.applications.total === 1, "Test 20: Company B has exactly 1 application");

    // Test 21: Company B has 0 grievances
    assert(sumResB.data.grievances.total === 0, "Test 21: Company B has 0 grievances");

    // Test 22: Company B has 0 documents
    assert(sumResB.data.documents.total === 0, "Test 22: Company B has 0 documents");

    // Test 23: Company B has 0 investment plans
    assert(sumResB.data.investments.totalPlans === 0, "Test 23: Company B has 0 investment plans");

    // Test 24: Applications list endpoint returns only Company A records for Company A
    const appsResA = await axios.get(`${BASE_URL}/api/dashboard/applications`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const allCompanyAApps = appsResA.data.applications.every((a: any) => a.company_id === companyAId);
    assert(allCompanyAApps && appsResA.data.applications.length === 2, "Test 24: /api/dashboard/applications strictly tenant-isolated for Company A");

    // Test 25: Applications list endpoint returns only Company B records for Company B
    const appsResB = await axios.get(`${BASE_URL}/api/dashboard/applications`, {
      headers: { Authorization: `Bearer ${companyBToken}` }
    });
    const allCompanyBApps = appsResB.data.applications.every((a: any) => a.company_id === companyBId);
    assert(allCompanyBApps && appsResB.data.applications.length === 1, "Test 25: /api/dashboard/applications strictly tenant-isolated for Company B");

    // -------------------------------------------------------------
    // GROUP 4: FILTERING ON COMPANY DASHBOARD LISTS (Tests 26 - 33)
    // -------------------------------------------------------------
    console.log("--- GROUP 4: Filtering & Search on Company Dashboard Lists ---");

    // Test 26: Filter applications by status=Approved
    const appFilterApproved = await axios.get(`${BASE_URL}/api/dashboard/applications?status=Approved`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(appFilterApproved.data.count === 1 && appFilterApproved.data.applications[0].id === appA2Id, "Test 26: Filter applications by status=Approved returns 1 item");

    // Test 27: Filter applications by department
    const appFilterDept = await axios.get(`${BASE_URL}/api/dashboard/applications?department=Pollution`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(appFilterDept.data.count === 1 && appFilterDept.data.applications[0].id === appA1Id, "Test 27: Filter applications by department (ilike Pollution)");

    // Test 28: Search applications query matching name
    const appSearch = await axios.get(`${BASE_URL}/api/dashboard/applications?search=Consent`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(appSearch.data.count === 1 && appSearch.data.applications[0].name.includes("Consent"), "Test 28: Search applications query matching keyword");

    // Test 29: Filter grievances by category
    const grievFilterCat = await axios.get(`${BASE_URL}/api/dashboard/grievances?category=Power Infrastructure`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(grievFilterCat.data.count === 1, "Test 29: Filter grievances by category");

    // Test 30: Filter grievances by non-matching priority returns 0
    const grievFilterPrio = await axios.get(`${BASE_URL}/api/dashboard/grievances?priority=Low`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(grievFilterPrio.data.count === 0, "Test 30: Filter grievances by non-matching priority returns 0");

    // Test 31: Filter documents by status=verified
    const docFilter = await axios.get(`${BASE_URL}/api/dashboard/documents?status=verified`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(docFilter.data.count === 1, "Test 31: Filter documents by status=verified");

    // Test 32: Filter notifications by unread=true
    const notifFilter = await axios.get(`${BASE_URL}/api/dashboard/notifications?unread=true`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(notifFilter.data.count >= 1, "Test 32: Filter notifications by unread=true");

    // Test 33: Applications include computed slaStatus object
    assert(appsResA.data.applications[0].slaStatus && typeof appsResA.data.applications[0].slaStatus.daysRemaining === "number", "Test 33: Applications include computed slaStatus object");

    // -------------------------------------------------------------
    // GROUP 5: COMPANY SLA & INVESTMENTS (Tests 34 - 39)
    // -------------------------------------------------------------
    console.log("--- GROUP 5: Company SLA & Investments ---");

    // Test 34: GET /api/dashboard/sla returns summary
    const slaRes = await axios.get(`${BASE_URL}/api/dashboard/sla`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(slaRes.status === 200 && slaRes.data.companyId === companyAId, "Test 34: GET /api/dashboard/sla returns 200 OK with companyId");

    // Test 35: SLA summary has applications breakdown
    assert(slaRes.data.applications && typeof slaRes.data.applications.total === "number", "Test 35: SLA summary has applications breakdown");

    // Test 36: SLA summary has grievances breakdown
    assert(slaRes.data.grievances && typeof slaRes.data.grievances.total === "number", "Test 36: SLA summary has grievances breakdown");

    // Test 37: GET /api/dashboard/investments returns plans
    const investRes = await axios.get(`${BASE_URL}/api/dashboard/investments`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(investRes.status === 200 && investRes.data.totalPlans === 1, "Test 37: GET /api/dashboard/investments returns 200 OK with 1 plan");

    // Test 38: Investments has totalProposedInvestmentCr
    assert(investRes.data.totalProposedInvestmentCr === 45, "Test 38: Total proposed investment is 45 Cr");

    // Test 39: Investments plans list is present
    assert(Array.isArray(investRes.data.plans) && ((investRes.data.plans[0].project_name || investRes.data.plans[0].title || "").includes("Phase 2")), "Test 39: Investments plans array contains correct record");

    // -------------------------------------------------------------
    // GROUP 6: COMPANY DASHBOARD CSV EXPORTS (Tests 40 - 45)
    // -------------------------------------------------------------
    console.log("--- GROUP 6: Company Dashboard CSV / Data Exports ---");

    // Test 40: Export applications CSV returns text/csv header
    const exportAppsCsv = await axios.get(`${BASE_URL}/api/dashboard/export?type=applications&format=csv`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(exportAppsCsv.status === 200 && String(exportAppsCsv.headers["content-type"]).includes("text/csv"), "Test 40: /api/dashboard/export?type=applications returns text/csv");

    // Test 41: Export applications CSV contains headers and company A application code
    assert(exportAppsCsv.data.includes("Application ID") && exportAppsCsv.data.includes("MAHA-APP-A01"), "Test 41: Exported CSV contains headers and Application codes");

    // Test 42: Export applications CSV does NOT leak company B records
    assert(!exportAppsCsv.data.includes("MAHA-APP-B01"), "Test 42: Exported CSV does NOT leak Company B records (strict isolation)");

    // Test 43: Export grievances CSV returns valid CSV
    const exportGrievCsv = await axios.get(`${BASE_URL}/api/dashboard/export?type=grievances&format=csv`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(exportGrievCsv.status === 200 && exportGrievCsv.data.includes("Grievance ID") && exportGrievCsv.data.includes(grievA1Id), "Test 43: Exported grievances CSV contains headers and data");

    // Test 44: Export in JSON format
    const exportJson = await axios.get(`${BASE_URL}/api/dashboard/export?type=applications&format=json`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(exportJson.status === 200 && Array.isArray(exportJson.data.applications), "Test 44: /api/dashboard/export?format=json returns valid JSON");

    // Test 45: Export invalid type returns 400 Bad Request
    try {
      await axios.get(`${BASE_URL}/api/dashboard/export?type=invalid_type`, {
        headers: { Authorization: `Bearer ${companyAToken}` }
      });
      assert(false, "Test 45: Export invalid type returns 400 Bad Request");
    } catch (err: any) {
      assert(err.response?.status === 400, "Test 45: Export invalid type returns 400 Bad Request (400)");
    }

    // -------------------------------------------------------------
    // GROUP 7: ANALYTICS ENDPOINTS (Tests 46 - 54)
    // -------------------------------------------------------------
    console.log("--- GROUP 7: Authenticated Analytics Endpoints ---");

    // Test 46: GET /api/analytics/departments returns department list
    const deptAnalytics = await axios.get(`${BASE_URL}/api/analytics/departments`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(deptAnalytics.status === 200 && Array.isArray(deptAnalytics.data.departments), "Test 46: GET /api/analytics/departments returns 200 OK and list");

    // Test 47: Department analytics contains SLA compliance rate
    assert(deptAnalytics.data.departments.every((d: any) => typeof d.slaComplianceRate === "number"), "Test 47: Department analytics has slaComplianceRate number on all items");

    // Test 48: GET /api/analytics/districts returns district aggregations
    const distAnalytics = await axios.get(`${BASE_URL}/api/analytics/districts`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(distAnalytics.status === 200 && Array.isArray(distAnalytics.data.districts), "Test 48: GET /api/analytics/districts returns 200 OK and list");

    // Test 49: District analytics includes unitsCount and proposedInvestmentCr
    assert(distAnalytics.data.districts.some((d: any) => d.district === "Nashik" && d.unitsCount >= 1), "Test 49: District analytics correctly aggregates Nashik district");

    // Test 50: GET /api/analytics/sectors returns sector aggregations
    const secAnalytics = await axios.get(`${BASE_URL}/api/analytics/sectors`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(secAnalytics.status === 200 && Array.isArray(secAnalytics.data.sectors), "Test 50: GET /api/analytics/sectors returns 200 OK and list");

    // Test 51: Sector analytics includes sharePercent
    assert(secAnalytics.data.sectors.some((s: any) => typeof s.sharePercent === "number"), "Test 51: Sector analytics includes sharePercent");

    // Test 52: GET /api/analytics/sla returns SLA summary
    const slaAnalytics = await axios.get(`${BASE_URL}/api/analytics/sla`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(slaAnalytics.status === 200 && slaAnalytics.data.overall && typeof slaAnalytics.data.overall.slaCompliancePercentage === "number", "Test 52: GET /api/analytics/sla returns overall compliance");

    // Test 53: GET /api/analytics/grievances returns grievance categories breakdown
    const grievAnalytics = await axios.get(`${BASE_URL}/api/analytics/grievances`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(grievAnalytics.status === 200 && typeof grievAnalytics.data.totalGrievances === "number" && grievAnalytics.data.categories, "Test 53: GET /api/analytics/grievances returns categories breakdown");

    // Test 54: GET /api/analytics/investment returns enterprise and pipeline investment
    const investAnalytics = await axios.get(`${BASE_URL}/api/analytics/investment`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(investAnalytics.status === 200 && typeof investAnalytics.data.totalEnterpriseInvestmentCr === "number", "Test 54: GET /api/analytics/investment returns totalEnterpriseInvestmentCr");

    // -------------------------------------------------------------
    // GROUP 8: PUBLIC DASHBOARD & ZERO PII VERIFICATION (Tests 55 - 67)
    // -------------------------------------------------------------
    console.log("--- GROUP 8: Public Dashboard & Zero PII Protection ---");

    // Test 55: GET /api/public-dashboard/summary returns overview
    const pubSummary = await axios.get(`${BASE_URL}/api/public-dashboard/summary`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(pubSummary.status === 200 && pubSummary.data.overview && typeof pubSummary.data.overview.totalApplications === "number", "Test 55: GET /api/public-dashboard/summary returns overview object");

    // Test 56: Public overview calculates approvalPercentage
    assert(typeof pubSummary.data.overview.approvalPercentage === "number", "Test 56: Public overview includes approvalPercentage");

    // Test 57: Public overview calculates registeredEnterprises
    assert(typeof pubSummary.data.overview.registeredEnterprises === "number" && pubSummary.data.overview.registeredEnterprises >= 2, "Test 57: Public overview includes registeredEnterprises count");

    // Test 58: Strict Zero PII Verification: No PAN in public summary response
    const pubSummaryStr = JSON.stringify(pubSummary.data);
    assert(!pubSummaryStr.includes("DAPLA1234E") && !pubSummaryStr.includes("DBETA5678F"), "Test 58: [ZERO PII] Public summary contains ZERO enterprise PAN numbers");

    // Test 59: Strict Zero PII Verification: No GSTIN in public summary response
    assert(!pubSummaryStr.includes("27DAPLA1234E1Z1") && !pubSummaryStr.includes("27DBETA5678F1Z2"), "Test 59: [ZERO PII] Public summary contains ZERO GSTIN numbers");

    // Test 60: Strict Zero PII Verification: No email in public summary response
    assert(!pubSummaryStr.includes("dashA@test.com") && !pubSummaryStr.includes("dashB@test.com"), "Test 60: [ZERO PII] Public summary contains ZERO email addresses");

    // Test 61: Strict Zero PII Verification: No mobile number in public summary response
    assert(!pubSummaryStr.includes("9825204240") && !pubSummaryStr.includes("9876543210"), "Test 61: [ZERO PII] Public summary contains ZERO mobile numbers");

    // Test 62: GET /api/public-dashboard/departments returns department list
    const pubDepts = await axios.get(`${BASE_URL}/api/public-dashboard/departments`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(pubDepts.status === 200 && Array.isArray(pubDepts.data.departments), "Test 62: GET /api/public-dashboard/departments returns departments array");

    // Test 63: GET /api/public-dashboard/districts returns district list
    const pubDists = await axios.get(`${BASE_URL}/api/public-dashboard/districts`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(pubDists.status === 200 && Array.isArray(pubDists.data.districts), "Test 63: GET /api/public-dashboard/districts returns districts array");

    // Test 64: GET /api/public-dashboard/export?type=departments returns CSV
    const pubExportCsv = await axios.get(`${BASE_URL}/api/public-dashboard/export?type=departments&format=csv`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(pubExportCsv.status === 200 && pubExportCsv.data.includes("Department Name") && String(pubExportCsv.headers["content-type"]).includes("text/csv"), "Test 64: Public export returns CSV with department headers");

    // Test 65: Public export CSV contains ZERO PII
    assert(!pubExportCsv.data.includes("Alpha Dashboard Enterprises") && !pubExportCsv.data.includes("dashA@test.com"), "Test 65: [ZERO PII] Public CSV export contains ZERO company names or emails");

    // Test 66: Filter public dashboard by department
    const pubFilteredDept = await axios.get(`${BASE_URL}/api/public-dashboard/summary?department=Pollution`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(pubFilteredDept.status === 200 && typeof pubFilteredDept.data.overview.totalApplications === "number", "Test 66: Public dashboard summary supports department filtering");

    // Test 67: Filter public dashboard by year
    const pubFilteredYear = await axios.get(`${BASE_URL}/api/public-dashboard/summary?year=2026`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(pubFilteredYear.status === 200 && typeof pubFilteredYear.data.overview.totalApplications === "number", "Test 67: Public dashboard summary supports year filtering");

  } catch (err: any) {
    console.error("Test execution error:", err.message, err.response?.data);
  } finally {
    // Clean up test data
    await supabase.from("applications").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("grievances").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("documents").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("invest_plans").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("notifications").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("companies").delete().in("id", [companyAId, companyBId]);
  }

  console.log("\n================================================================");
  console.log(`STEP 12 TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED (TOTAL: ${testsPassed + testsFailed})`);
  console.log("================================================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
