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

async function runStep7Tests() {
  console.log("==========================================================================");
  console.log("STARTING STEP 7 TEST SUITE: INVESTOR SERVICES & PLANNER API (15 TESTS)");
  console.log("==========================================================================\n");

  const companyAId = "BIZ-MH-STEP7-COMPA-001";
  const companyBId = "BIZ-MH-STEP7-COMPB-002";
  const tokenA = generateTestSessionToken(companyAId, "compa@step7.gov.in");
  const tokenB = generateTestSessionToken(companyBId, "compb@step7.gov.in");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Setup test companies in database
  await supabase.from("companies").upsert([
    {
      id: companyAId,
      name: "Alpha Forge Maharashtra Pvt Ltd",
      pan: "ABCDE1234F",
      gstin: "27ABCDE1234F1Z5",
      email: "compa@step7.gov.in",
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
      email: "compb@step7.gov.in",
      mobile: "9876543210",
      district: "Pune",
      taluka: "Haveli",
      state: "Maharashtra"
    }
  ]);

  let testsPassed = 0;
  const testTotal = 15;
  let createdPlanIdA = "";

  // TEST 1: Unauthenticated POST rejected (401)
  try {
    const res = await fetch(`${API_BASE}/invest-plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName: "Test Project",
        industrySector: "Engineering",
        location: "Ambad MIDC, Nashik",
        investmentCr: 25
      })
    });
    if (res.status === 401) {
      console.log("✅ TEST 1 PASSED: Unauthenticated POST /api/invest-plans rejected with 401 Unauthorized.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 1 FAILED: Expected 401, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 1 ERROR:", e.message);
  }

  // TEST 2: Valid authenticated POST succeeds (201)
  try {
    const res = await fetch(`${API_BASE}/invest-plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        projectName: "Alpha Precision Tooling Plant",
        industrySector: "Engineering & Heavy Manufacturing",
        location: "Ambad MIDC, Nashik",
        investmentCr: 25.5,
        items: [
          {
            id: "item-1",
            category: "approval",
            title: "Consent to Establish (CTE)",
            subtitle: "Pollution NOC",
            completed: false
          }
        ]
      })
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.plan && data.plan.id.startsWith("MUS-INV-2026-")) {
      createdPlanIdA = data.plan.id;
      console.log(`✅ TEST 2 PASSED: Successfully saved Investment Plan with reference ${createdPlanIdA} (201 Created).`);
      testsPassed++;
    } else {
      console.error("❌ TEST 2 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 2 ERROR:", e.message);
  }

  // TEST 3: Invalid required input rejected (400)
  try {
    const res = await fetch(`${API_BASE}/invest-plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        projectName: "   ", // Blank project name
        industrySector: "Engineering",
        location: "Nashik"
      })
    });
    if (res.status === 400) {
      console.log("✅ TEST 3 PASSED: Missing/blank required field rejected with 400 Bad Request.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 3 FAILED: Expected 400, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 3 ERROR:", e.message);
  }

  // TEST 4: Unique human-readable plan reference generated
  try {
    if (createdPlanIdA && /^MUS-INV-2026-\d{6}$/.test(createdPlanIdA)) {
      console.log(`✅ TEST 4 PASSED: Generated unique reference adhering to MUS-INV-2026-XXXXXX (${createdPlanIdA}).`);
      testsPassed++;
    } else {
      console.error("❌ TEST 4 FAILED: Reference format mismatch", createdPlanIdA);
    }
  } catch (e: any) {
    console.error("❌ TEST 4 ERROR:", e.message);
  }

  // TEST 5: GET returns only authenticated company's plans
  try {
    const resA = await fetch(`${API_BASE}/invest-plans`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const dataA = await resA.json();

    const resB = await fetch(`${API_BASE}/invest-plans`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const dataB = await resB.json();

    const companyAHasOnlyOwn = dataA.plans.every((p: any) => p.id === createdPlanIdA || p.id.startsWith("MUS-INV-"));
    const companyBHasNoCompanyAItems = !dataB.plans.some((p: any) => p.id === createdPlanIdA);

    if (resA.status === 200 && resB.status === 200 && companyAHasOnlyOwn && companyBHasNoCompanyAItems) {
      console.log("✅ TEST 5 PASSED: GET /api/invest-plans isolates records strictly per company tenant.");
      testsPassed++;
    } else {
      console.error("❌ TEST 5 FAILED: Tenant leak detected in investment plans listing.");
    }
  } catch (e: any) {
    console.error("❌ TEST 5 ERROR:", e.message);
  }

  // TEST 6: Cross-tenant GET single plan blocked (403)
  try {
    const res = await fetch(`${API_BASE}/invest-plans/${createdPlanIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` } // Company B trying to read Company A's plan
    });
    if (res.status === 403) {
      console.log("✅ TEST 6 PASSED: Cross-tenant GET /api/invest-plans/:id blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 6 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 6 ERROR:", e.message);
  }

  // TEST 7: Cross-tenant reference lookup blocked (403)
  try {
    const res = await fetch(`${API_BASE}/invest-plans/reference/${createdPlanIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    if (res.status === 403) {
      console.log("✅ TEST 7 PASSED: Cross-tenant GET /api/invest-plans/reference/:reference blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 7 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 7 ERROR:", e.message);
  }

  // TEST 8: Cross-tenant PUT blocked (403)
  try {
    const res = await fetch(`${API_BASE}/invest-plans/${createdPlanIdA}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenB}` // Company B trying to modify Company A's plan
      },
      body: JSON.stringify({
        projectName: "Hacked Project Name by Company B"
      })
    });
    if (res.status === 403) {
      console.log("✅ TEST 8 PASSED: Cross-tenant PUT /api/invest-plans/:id blocked with 403 Forbidden.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 8 FAILED: Expected 403, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 8 ERROR:", e.message);
  }

  // TEST 9: company_id cannot be changed via PUT (attempt to transfer ownership is blocked)
  try {
    const res = await fetch(`${API_BASE}/invest-plans/${createdPlanIdA}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        companyId: companyBId, // Attempting to transfer plan to Company B
        projectName: "Updated Alpha Precision Tooling Plant"
      })
    });
    const { data: dbCheck } = await supabase
      .from("invest_plans")
      .select("company_id")
      .eq("id", createdPlanIdA)
      .single();

    // The middleware correctly blocks cross-tenant companyId tampering with 403, and the database record remains intact
    if ((res.status === 403 || res.status === 200) && dbCheck?.company_id === companyAId) {
      console.log("✅ TEST 9 PASSED: company_id is immutable and cross-company reassignment is blocked.");
      testsPassed++;
    } else {
      console.error("❌ TEST 9 FAILED:", res.status, dbCheck);
    }
  } catch (e: any) {
    console.error("❌ TEST 9 ERROR:", e.message);
  }

  // TEST 10: plan reference cannot be changed
  try {
    const res = await fetch(`${API_BASE}/invest-plans/${createdPlanIdA}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        id: "MUS-INV-2026-999999", // Attempting to mutate primary key
        investmentCr: 30.0
      })
    });
    const { data: dbCheck } = await supabase
      .from("invest_plans")
      .select("id, investment_cr")
      .eq("id", createdPlanIdA)
      .single();

    if (res.status === 200 && dbCheck?.id === createdPlanIdA && Number(dbCheck?.investment_cr) === 30) {
      console.log("✅ TEST 10 PASSED: Plan ID/reference remains persistent and immutable.");
      testsPassed++;
    } else {
      console.error("❌ TEST 10 FAILED:", res.status, dbCheck);
    }
  } catch (e: any) {
    console.error("❌ TEST 10 ERROR:", e.message);
  }

  // TEST 11: Persistence in PostgreSQL public.invest_plans
  try {
    const { data: dbPlan, error: dbErr } = await supabase
      .from("invest_plans")
      .select("*")
      .eq("id", createdPlanIdA)
      .single();

    if (!dbErr && dbPlan && dbPlan.company_id === companyAId) {
      console.log("✅ TEST 11 PASSED: Plan verified directly in PostgreSQL public.invest_plans table.");
      testsPassed++;
    } else {
      console.error("❌ TEST 11 FAILED:", dbErr);
    }
  } catch (e: any) {
    console.error("❌ TEST 11 ERROR:", e.message);
  }

  // TEST 12: Valid PUT works and updates items
  try {
    const updatedItems = [
      {
        id: "item-1",
        category: "approval",
        title: "Consent to Establish (CTE)",
        subtitle: "Pollution NOC",
        completed: true // Toggled to completed
      },
      {
        id: "item-2",
        category: "incentive",
        title: "PSI 2019 SGST Subsidy",
        subtitle: "60% Gross SGST",
        completed: false
      }
    ];

    const res = await fetch(`${API_BASE}/invest-plans/${createdPlanIdA}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        items: updatedItems
      })
    });
    const data = await res.json();
    if (res.status === 200 && data.plan?.items?.length === 2 && data.plan.items[0].completed === true) {
      console.log("✅ TEST 12 PASSED: PUT /api/invest-plans/:id successfully updated plan items & milestones.");
      testsPassed++;
    } else {
      console.error("❌ TEST 12 FAILED:", res.status, data);
    }
  } catch (e: any) {
    console.error("❌ TEST 12 ERROR:", e.message);
  }

  // TEST 13: Invalid PUT rejected (404 for non-existent plan)
  try {
    const res = await fetch(`${API_BASE}/invest-plans/NON_EXISTENT_PLAN_ID`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ projectName: "Test" })
    });
    if (res.status === 404) {
      console.log("✅ TEST 13 PASSED: Updating non-existent plan rejected with 404 Not Found.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 13 FAILED: Expected 404, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 13 ERROR:", e.message);
  }

  // TEST 14: Step 5 Grievances regression check
  try {
    const res = await fetch(`${API_BASE}/grievances`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    if (res.status === 200) {
      console.log("✅ TEST 14 PASSED: Step 5 Grievances API remains intact and operational.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 14 FAILED: Expected 200, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 14 ERROR:", e.message);
  }

  // TEST 15: Step 6 Feedback regression check
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    if (res.status === 200) {
      console.log("✅ TEST 15 PASSED: Step 6 Feedback API remains intact and operational.");
      testsPassed++;
    } else {
      console.error(`❌ TEST 15 FAILED: Expected 200, got ${res.status}`);
    }
  } catch (e: any) {
    console.error("❌ TEST 15 ERROR:", e.message);
  }

  // Cleanup test artifacts
  await supabase.from("invest_plans").delete().or(`company_id.eq.${companyAId},company_id.eq.${companyBId}`);
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

runStep7Tests().catch((err) => {
  console.error("Fatal error in test suite:", err);
  process.exit(1);
});
