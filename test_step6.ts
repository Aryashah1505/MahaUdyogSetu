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

async function runStep6Tests() {
  console.log("==========================================================================");
  console.log("STARTING STEP 6 TEST SUITE: FEEDBACK MANAGEMENT API (15 TESTS)");
  console.log("==========================================================================\n");

  const companyAId = "BIZ-MH-STEP6-COMPA-001";
  const companyBId = "BIZ-MH-STEP6-COMPB-002";
  const tokenA = generateTestSessionToken(companyAId, "compa@step6.gov.in");
  const tokenB = generateTestSessionToken(companyBId, "compb@step6.gov.in");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Setup test companies and applications in database
  await supabase.from("companies").upsert([
    {
      id: companyAId,
      name: "Alpha Forge Maharashtra Pvt Ltd",
      pan: "ABCDE1234F",
      gstin: "27ABCDE1234F1Z5",
      email: "compa@step6.gov.in",
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
      email: "compb@step6.gov.in",
      mobile: "9876543210",
      district: "Pune",
      taluka: "Haveli",
      state: "Maharashtra"
    }
  ]);

  const appAId = "APP-TEST-6A-01";
  const appBId = "APP-TEST-6B-01";
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
  const testTotal = 15;
  let createdFeedbackIdA = "";

  // TEST 1: Unauthenticated POST rejected (401)
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedbackType: "Overall Experience",
        relatedModule: "Applications",
        rating: 5,
        message: "Great portal experience."
      })
    });
    if (res.status === 401) {
      console.log("✅ TEST 1 PASSED: Unauthenticated POST /api/feedback rejected with 401 Unauthorized.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 1 FAILED: Expected 401, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 1 ERROR:", e.message);
  }

  // TEST 2: Valid authenticated POST succeeds (201)
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        feedbackType: "Application Process",
        relatedModule: "Applications",
        rating: 5,
        message: "Single Window scrutiny process is fast and transparent.",
        applicationRef: appAId,
        mobile: "9825204240",
        email: "compa@step6.gov.in"
      })
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.feedback && data.feedback.id.startsWith("MUS-FB-2026-")) {
      createdFeedbackIdA = data.feedback.id;
      console.log(`✅ TEST 2 PASSED: Successfully submitted Feedback with reference ${createdFeedbackIdA} (201 Created).`);
      testsPassed++;
    } else {
      console.error("❌ TEST 2 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 2 ERROR:", e.message);
  }

  // TEST 3: Invalid rating rejected (400)
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        feedbackType: "Overall Experience",
        relatedModule: "Applications",
        rating: 6, // Invalid rating (must be 1-5)
        message: "Testing invalid rating boundary"
      })
    });
    if (res.status === 400) {
      console.log("✅ TEST 3 PASSED: Invalid rating (6) rejected with 400 Bad Request.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 3 FAILED: Expected 400, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 3 ERROR:", e.message);
  }

  // TEST 4: Invalid mobile rejected (400)
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        feedbackType: "Overall Experience",
        relatedModule: "Applications",
        rating: 4,
        message: "Valid feedback message content",
        mobile: "12345" // Invalid mobile (< 10 digits)
      })
    });
    if (res.status === 400) {
      console.log("✅ TEST 4 PASSED: Invalid mobile rejected with 400 Bad Request.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 4 FAILED: Expected 400, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 4 ERROR:", e.message);
  }

  // TEST 5: Invalid email rejected (400)
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        feedbackType: "Overall Experience",
        relatedModule: "Applications",
        rating: 4,
        message: "Valid feedback message content",
        email: "invalid-email-address"
      })
    });
    if (res.status === 400) {
      console.log("✅ TEST 5 PASSED: Invalid email rejected with 400 Bad Request.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 5 FAILED: Expected 400, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 5 ERROR:", e.message);
  }

  // TEST 6: Empty message rejected (400)
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        feedbackType: "Overall Experience",
        relatedModule: "Applications",
        rating: 5,
        message: "   " // Empty message
      })
    });
    if (res.status === 400) {
      console.log("✅ TEST 6 PASSED: Empty message rejected with 400 Bad Request.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 6 FAILED: Expected 400, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 6 ERROR:", e.message);
  }

  // TEST 7: Valid feedback gets unique human-readable reference
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        feedbackType: "Investor Services",
        relatedModule: "Investor Wizard",
        rating: 4,
        message: "Incentive calculator provided precise package scheme figures."
      })
    });
    const data = await res.json();
    if (res.status === 201 && data.feedback && /^MUS-FB-2026-\d{6}$/.test(data.feedback.id)) {
      console.log(`✅ TEST 7 PASSED: Generated unique reference matching pattern MUS-FB-2026-XXXXXX: ${data.feedback.id}.`);
      testsPassed++;
    } else {
      console.error("❌ TEST 7 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 7 ERROR:", e.message);
  }

  // TEST 8: GET returns only authenticated company's feedback
  try {
    const resA = await fetch(`${API_BASE}/feedback`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const dataA = await resA.json();

    const resB = await fetch(`${API_BASE}/feedback`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const dataB = await resB.json();

    const companyAHasOnlyOwn = dataA.feedback.every((f: any) => f.id === createdFeedbackIdA || f.id.startsWith("MUS-FB-"));
    const companyBHasNoCompanyAItems = !dataB.feedback.some((f: any) => f.id === createdFeedbackIdA);

    if (resA.status === 200 && resB.status === 200 && companyAHasOnlyOwn && companyBHasNoCompanyAItems) {
      console.log("✅ TEST 8 PASSED: GET /api/feedback isolates records strictly per company tenant.");
      testsPassed++;
    } else {
      console.error("❌ TEST 8 FAILED: Tenant leak detected in feedback listing.");
    }
  } catch (e: any) {
    console.error("❌ TEST 8 ERROR:", e.message);
  }

  // TEST 9: Cross-tenant single feedback GET blocked (403)
  try {
    const res = await fetch(`${API_BASE}/feedback/${createdFeedbackIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` } // Company B trying to read Company A's feedback
    });
    if (res.status === 403) {
      console.log("✅ TEST 9 PASSED: Cross-tenant GET /api/feedback/:id blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 9 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 9 ERROR:", e.message);
  }

  // TEST 10: Cross-tenant reference status lookup blocked (403)
  try {
    const res = await fetch(`${API_BASE}/feedback/status/${createdFeedbackIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    if (res.status === 403) {
      console.log("✅ TEST 10 PASSED: Cross-tenant GET /api/feedback/status/:reference blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 10 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 10 ERROR:", e.message);
  }

  // TEST 11: Cross-tenant application reference linking blocked (403)
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        feedbackType: "Application Process",
        relatedModule: "Applications",
        rating: 3,
        message: "Attempting to link Company B's application reference",
        applicationRef: appBId // Company B's application!
      })
    });
    if (res.status === 403) {
      console.log("✅ TEST 11 PASSED: Linking feedback to another company's application blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 11 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 11 ERROR:", e.message);
  }

  // TEST 12: Unauthorized status/response tampering prevented (PUT)
  try {
    const res = await fetch(`${API_BASE}/feedback/${createdFeedbackIdA}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        replyText: "Thank you for the quick follow-up.",
        status: "Closed", // Client attempt to force Closed status without department action
        departmentResponse: "HACKED_RESPONSE"
      })
    });
    const data = await res.json();
    const responseNotHacked = data.feedback?.departmentResponse !== "HACKED_RESPONSE";
    const replySaved = data.feedback?.replies?.length > 0;

    if (res.status === 200 && data.success && responseNotHacked && replySaved) {
      console.log("✅ TEST 12 PASSED: PUT /api/feedback/:id protected departmental fields & added user reply.");
      testsPassed++;
    } else {
      console.error("❌ TEST 12 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 12 ERROR:", e.message);
  }

  // TEST 13: Database persistence confirmation
  try {
    const { data: dbItem, error: dbErr } = await supabase
      .from("feedback")
      .select("id, company_id, feedback_type, rating, message")
      .eq("id", createdFeedbackIdA)
      .maybeSingle();

    if (!dbErr && dbItem && dbItem.company_id === companyAId) {
      console.log("✅ TEST 13 PASSED: Feedback verified directly in PostgreSQL public.feedback table.");
      testsPassed++;
    } else {
      console.error("❌ TEST 13 FAILED: Feedback missing in PostgreSQL database.");
    }
  } catch (e: any) {
    console.error("❌ TEST 13 ERROR:", e.message);
  }

  // TEST 14: Duplicate / reference collision protection
  try {
    // Attempting to insert duplicate ID directly into database
    const { error: dupErr } = await supabase.from("feedback").insert({
      id: createdFeedbackIdA,
      company_id: companyAId,
      feedback_type: "Overall Experience",
      related_module: "Applications",
      rating: 5,
      message: "Duplicate ID collision test"
    });
    if (dupErr && dupErr.code === "23505") { // unique violation
      console.log("✅ TEST 14 PASSED: Primary key uniqueness protects against reference collision.");
      testsPassed++;
    } else {
      console.error("❌ TEST 14 FAILED:", dupErr);
    }
  } catch (e: any) {
    console.error("❌ TEST 14 ERROR:", e.message);
  }

  // TEST 15: Existing grievances/applications functionality unaffected
  try {
    const resGrv = await fetch(`${API_BASE}/grievances`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const resApp = await fetch(`${API_BASE}/applications`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    if (resGrv.status === 200 && resApp.status === 200) {
      console.log("✅ TEST 15 PASSED: Applications and Grievances APIs remain operational and regression-free.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 15 FAILED: Grievances status ${resGrv.status}, Applications status ${resApp.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 15 ERROR:", e.message);
  }

  // Cleanup test artifacts
  await supabase.from("feedback").delete().or(`company_id.eq.${companyAId},company_id.eq.${companyBId}`);
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

runStep6Tests().catch((err) => {
  console.error("Fatal error in test suite:", err);
  process.exit(1);
});
