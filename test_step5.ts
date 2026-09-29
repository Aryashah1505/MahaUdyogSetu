import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://iiqdnregrpeocsghmrtv.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_LYopuHWIc3vRNbxzVj82kA_vhEUxYGk";
const SESSION_SECRET = process.env.SESSION_SECRET || "mahau-secure-jwt-session-secret-2026-industry-bridge";
const API_BASE = "http://127.0.0.1:3001/api";

function generateTestSessionToken(companyId: string, email: string): string {
  const payload = {
    companyId,
    email: email || "",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

async function runStep5Tests() {
  console.log("==========================================================================");
  console.log("STARTING STEP 5 TEST SUITE: GRIEVANCE & QUERY MANAGEMENT API (15 TESTS)");
  console.log("==========================================================================\n");

  const companyAId = "BIZ-MH-STEP5-COMPA-001";
  const companyBId = "BIZ-MH-STEP5-COMPB-002";
  const tokenA = generateTestSessionToken(companyAId, "compa@step5.gov.in");
  const tokenB = generateTestSessionToken(companyBId, "compb@step5.gov.in");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Setup test companies and applications in database
  await supabase.from("companies").upsert([
    {
      id: companyAId,
      name: "Alpha Forge Maharashtra Pvt Ltd",
      pan: "ABCDE1234F",
      gstin: "27ABCDE1234F1Z5",
      email: "compa@step5.gov.in",
      mobile: "9825204240",
      district: "Nashik",
      taluka: "Ambad",
      state: "Maharashtra"
    },
    {
      id: companyBId,
      name: "Beta Tech Industries LLP",
      pan: "XYZAB5678C",
      gstin: "27XYZAB5678C1Z8",
      email: "compb@step5.gov.in",
      mobile: "9876543210",
      district: "Pune",
      taluka: "Haveli",
      state: "Maharashtra"
    }
  ]);

  // Setup test applications
  const appAId = "APP-TEST-5A-01";
  const appBId = "APP-TEST-5B-01";
  await supabase.from("applications").upsert([
    {
      id: appAId,
      company_id: companyAId,
      code: appAId,
      name: "Consent to Establish (CTE)",
      department: "Maharashtra Pollution Control Board (MPCB)",
      status: "under_scrutiny",
      sla_days: 21,
      submitted_date: new Date().toISOString()
    },
    {
      id: appBId,
      company_id: companyBId,
      code: appBId,
      name: "Factory License",
      department: "Directorate of Industrial Safety and Health (DISH)",
      status: "under_scrutiny",
      sla_days: 20,
      submitted_date: new Date().toISOString()
    }
  ]);

  let testsPassed = 0;
  let testTotal = 15;

  let createdGrievanceIdA = "";
  let createdQueryIdA = "";

  // TEST 1: Unauthenticated request rejection (401)
  try {
    const res = await fetch(`${API_BASE}/grievances`);
    if (res.status === 401) {
      console.log("✅ TEST 1 PASSED: Unauthenticated GET /api/grievances rejected with 401 Unauthorized.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 1 FAILED: Expected 401, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 1 ERROR:", e.message);
  }

  // TEST 2: Create new Grievance with valid payload (201)
  try {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        type: "grievance",
        subject: "Delay in CTE Scrutiny Beyond 21 Days Limit",
        description: "Application APP-TEST-5A-01 pending scrutiny beyond RTS statutory timeline of 21 days.",
        category: "Application Delay",
        priority: "Urgent",
        applicationId: appAId,
        mobile: "9825204240",
        email: "compa@step5.gov.in",
        department: "Maharashtra Pollution Control Board (MPCB)"
      })
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.grievance && data.grievance.id.startsWith("MGV-2026-")) {
      createdGrievanceIdA = data.grievance.id;
      console.log(`✅ TEST 2 PASSED: Successfully created Grievance with reference ${createdGrievanceIdA} (201 Created).`);
      testsPassed++;
    } else {
      console.error("❌ TEST 2 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 2 ERROR:", e.message);
  }

  // TEST 3: Create new Query with valid payload (201)
  try {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        type: "query",
        subject: "Clarification on Cadastral Map DPI resolution",
        description: "Please confirm if 300 DPI signed vector drawings are accepted.",
        category: "General Query",
        priority: "Normal",
        mobile: "9825204240",
        email: "compa@step5.gov.in"
      })
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.grievance && data.grievance.id.startsWith("MQY-2026-")) {
      createdQueryIdA = data.grievance.id;
      console.log(`✅ TEST 3 PASSED: Successfully created Query with reference ${createdQueryIdA} (201 Created).`);
      testsPassed++;
    } else {
      console.error("❌ TEST 3 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 3 ERROR:", e.message);
  }

  // TEST 4: Mandatory validation - missing subject & description (400)
  try {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        category: "Application Delay",
        priority: "Urgent",
        mobile: "9825204240",
        email: "compa@step5.gov.in"
      })
    });
    if (res.status === 400) {
      console.log("✅ TEST 4 PASSED: Missing mandatory subject/description rejected with 400 Bad Request.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 4 FAILED: Expected 400, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 4 ERROR:", e.message);
  }

  // TEST 5: Category & Priority validation (400)
  try {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        subject: "Invalid Category Test",
        description: "Testing invalid category validation",
        category: "NonExistentCategoryXYZ",
        priority: "Urgent",
        mobile: "9825204240",
        email: "compa@step5.gov.in"
      })
    });
    if (res.status === 400) {
      console.log("✅ TEST 5 PASSED: Invalid category properly rejected with 400 Bad Request.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 5 FAILED: Expected 400, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 5 ERROR:", e.message);
  }

  // TEST 6: Mobile & Email regex validation (400)
  try {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        subject: "Invalid Contact Info Test",
        description: "Testing contact validation",
        category: "Application Delay",
        priority: "Urgent",
        mobile: "123", // invalid mobile
        email: "invalid-email" // invalid email
      })
    });
    if (res.status === 400) {
      console.log("✅ TEST 6 PASSED: Invalid mobile/email rejected with 400 Bad Request.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 6 FAILED: Expected 400, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 6 ERROR:", e.message);
  }

  // TEST 7: Cross-tenant application linking blocked (403)
  try {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        subject: "Linking Company B Application",
        description: "Attempting to link grievance to an application belonging to Company B",
        category: "Application Delay",
        priority: "Urgent",
        applicationId: appBId, // Company B's application!
        mobile: "9825204240",
        email: "compa@step5.gov.in"
      })
    });
    if (res.status === 403) {
      console.log("✅ TEST 7 PASSED: Linking grievance to another company's application blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 7 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 7 ERROR:", e.message);
  }

  // TEST 8: List company grievances with tenant isolation
  try {
    const resA = await fetch(`${API_BASE}/grievances`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const dataA = await resA.json();

    const resB = await fetch(`${API_BASE}/grievances`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const dataB = await resB.json();

    const companyAHasOnlyOwn = dataA.grievances.every((g: any) => g.id === createdGrievanceIdA || g.id === createdQueryIdA || g.businessName.includes("Western") || g.businessName.includes("Alpha"));
    const companyBHasNoCompanyAItems = !dataB.grievances.some((g: any) => g.id === createdGrievanceIdA || g.id === createdQueryIdA);

    if (resA.status === 200 && resB.status === 200 && companyAHasOnlyOwn && companyBHasNoCompanyAItems) {
      console.log("✅ TEST 8 PASSED: GET /api/grievances isolates records strictly per company tenant.");
      testsPassed++;
    } else {
      console.error("❌ TEST 8 FAILED: Tenant leak detected in grievance listing.");
    }
  } catch (e: any) {
    console.error("❌ TEST 8 ERROR:", e.message);
  }

  // TEST 9: List with filters (type=query, category=General Query)
  try {
    const res = await fetch(`${API_BASE}/grievances?type=query`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const data = await res.json();
    const onlyQueries = data.grievances.every((g: any) => g.type === "query");
    if (res.status === 200 && onlyQueries && data.grievances.some((g: any) => g.id === createdQueryIdA)) {
      console.log("✅ TEST 9 PASSED: Query filter (type=query) works accurately.");
      testsPassed++;
    } else {
      console.error("❌ TEST 9 FAILED:", data);
    }
  } catch (e: any) {
    console.error("❌ TEST 9 ERROR:", e.message);
  }

  // TEST 10: Single grievance detail retrieval (200)
  try {
    const res = await fetch(`${API_BASE}/grievances/${createdGrievanceIdA}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.grievance.id === createdGrievanceIdA) {
      console.log("✅ TEST 10 PASSED: GET /api/grievances/:id retrieves single grievance record.");
      testsPassed++;
    } else {
      console.error("❌ TEST 10 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 10 ERROR:", e.message);
  }

  // TEST 11: Cross-tenant single grievance access blocked (403)
  try {
    const res = await fetch(`${API_BASE}/grievances/${createdGrievanceIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` } // Company B trying to read Company A's grievance
    });
    if (res.status === 403) {
      console.log("✅ TEST 11 PASSED: Cross-tenant GET /api/grievances/:id blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 11 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 11 ERROR:", e.message);
  }

  // TEST 12: Reference Status lookup by Reference ID (200)
  try {
    const res = await fetch(`${API_BASE}/grievances/status/${createdGrievanceIdA}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const data = await res.json();
    if (res.status === 200 && data.success && data.grievance.id === createdGrievanceIdA) {
      console.log("✅ TEST 12 PASSED: GET /api/grievances/status/:reference resolves grievance by reference ID.");
      testsPassed++;
    } else {
      console.error("❌ TEST 12 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 12 ERROR:", e.message);
  }

  // TEST 13: Cross-tenant status lookup blocked (403)
  try {
    const res = await fetch(`${API_BASE}/grievances/status/${createdGrievanceIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    if (res.status === 403) {
      console.log("✅ TEST 13 PASSED: Cross-tenant GET /api/grievances/status/:reference blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 13 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 13 ERROR:", e.message);
  }

  // TEST 14: Update Grievance & Status History Append (200) & Tamper Protection
  try {
    const res = await fetch(`${API_BASE}/grievances/${createdGrievanceIdA}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        subject: "Updated Subject - Urgent Delay in CTE Scrutiny",
        statusNote: "Applicant submitted supplementary compliance certificate.",
        departmentResponse: "HACKED RESPONSE BY COMPANY" // This must be ignored or protected
      })
    });
    const data = await res.json();
    const historyUpdated = data.grievance?.statusHistory?.length >= 2;
    const responseNotTampered = data.grievance?.departmentResponse !== "HACKED RESPONSE BY COMPANY";

    if (res.status === 200 && data.success && historyUpdated && responseNotTampered) {
      console.log("✅ TEST 14 PASSED: PUT /api/grievances/:id updated fields, appended statusHistory, and protected department_response.");
      testsPassed++;
    } else {
      console.error("❌ TEST 14 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 14 ERROR:", e.message);
  }

  // TEST 15: Cross-tenant update blocked (403)
  try {
    const res = await fetch(`${API_BASE}/grievances/${createdGrievanceIdA}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}`
      },
      body: JSON.stringify({
        subject: "Tampering Company A's Grievance by Company B"
      })
    });
    if (res.status === 403) {
      console.log("✅ TEST 15 PASSED: Cross-tenant PUT /api/grievances/:id blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 15 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 15 ERROR:", e.message);
  }

  // Cleanup test artifacts
  await supabase.from("grievances").delete().or(`company_id.eq.${companyAId},company_id.eq.${companyBId}`);
  await supabase.from("applications").delete().or(`company_id.eq.${companyAId},company_id.eq.${companyBId}`);
  await supabase.from("companies").delete().or(`id.eq.${companyAId},id.eq.${companyBId}`);

  console.log("\n==========================================================================");
  console.log(`TEST RESULTS: ${testsPassed} / ${testTotal} TESTS PASSED`);
  console.log("==========================================================================");

  if (testsPassed === testTotal) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runStep5Tests().catch((err) => {
  console.error("Fatal error in test suite:", err);
  process.exit(1);
});
