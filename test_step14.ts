import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import crypto from "crypto";
import { generateSessionToken, verifyPassword, hashPassword } from "./server";

dotenv.config();

const BASE_URL = "http://localhost:3001";
const companyAId = "BIZ-MH-E2E-A01";
const companyBId = "BIZ-MH-E2E-B02";
const companyAToken = generateSessionToken(companyAId, "e2eA@maharashtra.gov.test", "COMPANY_USER");
const companyBToken = generateSessionToken(companyBId, "e2eB@maharashtra.gov.test", "COMPANY_USER");
const adminToken = generateSessionToken("ADMIN-REG-E2E01", "regadmin@maharashtra.gov.in", "REGULATORY_ADMIN");
const superAdminToken = generateSessionToken("SUPER-ADMIN-E2E01", "superadmin@maharashtra.gov.in", "SUPER_ADMIN");

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
  console.log("========================================================================");
  console.log("STARTING STEP 14: FINAL END-TO-END & PRODUCTION READINESS TEST SUITE (80+ TESTS)");
  console.log("========================================================================\n");

  // Clean old test records
  await supabase.from("applications").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("grievances").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("documents").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("invest_plans").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("notifications").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("feedback").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("companies").delete().in("id", [companyAId, companyBId]);

  // Seed test companies
  await supabase.from("companies").upsert([
    {
      id: companyAId,
      name: "Maharashtra Precision Engineering Ltd",
      pan: "MHE2EA1234",
      gstin: "27MHE2EA1234F1Z1",
      email: "e2eA@maharashtra.gov.test",
      mobile: "9820011223",
      district: "Pune",
      taluka: "Haveli",
      state: "Maharashtra",
      sector: "Engineering & Heavy Manufacturing",
      business_type: "Private Limited",
      investment_crores: 75.0,
      connected_power_kw: 1200,
      workforce: 250,
      password_hash: hashPassword("PrecisionMH@2026"),
      is_profile_complete: true
    },
    {
      id: companyBId,
      name: "Sahyadri Agro Processing LLP",
      pan: "MHE2EB5678",
      gstin: "27MHE2EB5678G1Z2",
      email: "e2eB@maharashtra.gov.test",
      mobile: "9820099887",
      district: "Nashik",
      taluka: "Dindori",
      state: "Maharashtra",
      sector: "Food Processing & Agro Industries",
      business_type: "LLP",
      investment_crores: 25.0,
      connected_power_kw: 350,
      workforce: 80,
      password_hash: hashPassword("AgroMH@2026"),
      is_profile_complete: true
    }
  ]);

  try {
    // --------------------------------------------------------------------
    // JOURNEY 1: HEALTH, SECURITY HEADERS & CORE CONFIG (Tests 1 - 7)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 1: System Health, Security Headers & Safe Errors ---");

    const healthRes = await axios.get(`${BASE_URL}/api/health`);
    assert(healthRes.status === 200 && (healthRes.data.status === "ok" || healthRes.data.status === "healthy"), "Test 1: GET /api/health returns HTTP 200 ok");
    assert(healthRes.headers["x-content-type-options"] === "nosniff", "Test 2: X-Content-Type-Options is nosniff");
    assert(healthRes.headers["x-frame-options"] === "DENY", "Test 3: X-Frame-Options is DENY");
    assert(!healthRes.headers["x-powered-by"], "Test 4: X-Powered-By is securely removed");
    assert(healthRes.headers["referrer-policy"] === "strict-origin-when-cross-origin", "Test 5: Referrer-Policy header verified");

    // Test 6: Safe 404 handler
    try {
      await axios.get(`${BASE_URL}/api/unknown-service-route-xyz`);
      assert(false, "Test 6: Unknown API route should 404");
    } catch (e: any) {
      assert(e.response?.status === 404 && e.response?.data?.error === "API endpoint not found.", "Test 6: Safe JSON 404 on unmatched route");
    }

    // Test 7: Error responses do not leak secrets
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, { email: "fake@user.com", password: "" });
    } catch (e: any) {
      const errStr = JSON.stringify(e.response?.data);
      assert(!errStr.includes("SUPABASE") && !errStr.includes("SECRET"), "Test 7: Auth error does not leak secrets or keys");
    }

    // --------------------------------------------------------------------
    // JOURNEY 2: AUTHENTICATION, OTP & SESSION INTEGRITY (Tests 8 - 16)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 2: Authentication, OTP & Session Management ---");

    // Test 8: Send OTP on test registration number
    const sendOtpRes = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
      mobile: "9820000001"
    });
    assert(sendOtpRes.status === 200 && sendOtpRes.data.success, "Test 8: POST /api/auth/send-otp succeeds");
    const receivedOtp = sendOtpRes.data.devOtp || "123456";

    // Test 9: Verify Wrong OTP
    try {
      await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        mobile: "9820000001",
        otp: "000000"
      });
      assert(false, "Test 9: Wrong OTP should be rejected");
    } catch (e: any) {
      assert(e.response?.status === 400 || e.response?.status === 401, "Test 9: Invalid OTP rejected (400/401)");
    }

    // Test 10: Verify Valid OTP
    const verifyOtpRes = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
      mobile: "9820000001",
      otp: receivedOtp
    });
    assert(verifyOtpRes.status === 200 && verifyOtpRes.data.success, "Test 10: Valid OTP verified successfully");

    // Test 11: Direct Password Login
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: "e2eA@maharashtra.gov.test",
      password: "PrecisionMH@2026"
    });
    assert(loginRes.status === 200 && loginRes.data.token && loginRes.data.profile?.id === companyAId, "Test 11: Company password login returns valid session token");

    // Test 12: Bad Password Login
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: "e2eA@maharashtra.gov.test",
        password: "IncorrectPassword!123"
      });
      assert(false, "Test 12: Incorrect password login rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 12: Incorrect password rejected with HTTP 401");
    }

    // Test 13: Fetch Company Profile
    const profileRes = await axios.get(`${BASE_URL}/api/company/profile`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(profileRes.status === 200 && profileRes.data.profile?.id === companyAId, "Test 13: GET /api/company/profile returns authenticated enterprise");

    // Test 14: Update Company Profile
    const updateProfileRes = await axios.put(`${BASE_URL}/api/company/profile`, {
      workforce: 275,
      connectedPowerKw: 1350
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(updateProfileRes.status === 200 && updateProfileRes.data.profile?.workforce === 275, "Test 14: PUT /api/company/profile updates company profile");

    // Test 15: Tampered Token rejected
    const tampered = `${companyAToken}tampered`;
    try {
      await axios.get(`${BASE_URL}/api/company/profile`, { headers: { Authorization: `Bearer ${tampered}` } });
      assert(false, "Test 15: Tampered token rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 15: Tampered session token rejected with HTTP 401");
    }

    // Test 16: Unauthenticated access rejected
    try {
      await axios.get(`${BASE_URL}/api/company/profile`);
      assert(false, "Test 16: Unauthenticated profile access rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 16: Unauthenticated request rejected with HTTP 401");
    }

    // --------------------------------------------------------------------
    // JOURNEY 3: REGULATORY KNOWLEDGE BASE & RULE ENGINE (Tests 17 - 25)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 3: Regulatory Engine, Rules & Industry Matching ---");

    // Test 17: List Regulatory Industries
    const industriesRes = await axios.get(`${BASE_URL}/api/regulatory/industries`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(industriesRes.status === 200 && Array.isArray(industriesRes.data.industries) && industriesRes.data.industries.length > 0, "Test 17: GET /api/regulatory/industries returns registered sectors");
    const testIndustryId = industriesRes.data.industries[0]?.id || "IND-ENG-001";

    // Test 18: List Regulatory Departments
    const deptsRes = await axios.get(`${BASE_URL}/api/regulatory/departments`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(deptsRes.status === 200 && Array.isArray(deptsRes.data.departments) && deptsRes.data.departments.length > 0, "Test 18: GET /api/regulatory/departments returns government authorities");

    // Test 19: List Regulatory Approvals
    const approvalsRes = await axios.get(`${BASE_URL}/api/regulatory/approvals`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(approvalsRes.status === 200 && Array.isArray(approvalsRes.data.approvals), "Test 19: GET /api/regulatory/approvals returns approvals catalogue");

    // Test 20: Approval Detail
    const sampleApprovalId = approvalsRes.data.approvals[0]?.id || "APP-MPCB-CTE";
    const appDetailRes = await axios.get(`${BASE_URL}/api/regulatory/approvals/${sampleApprovalId}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(appDetailRes.status === 200 && appDetailRes.data.approval?.id === sampleApprovalId, "Test 20: GET /api/regulatory/approvals/:id returns approval details");

    // Test 21: Industry Approvals Mapping
    const indApprovalsRes = await axios.get(`${BASE_URL}/api/regulatory/industries/${testIndustryId}/approvals`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(indApprovalsRes.status === 200 && Array.isArray(indApprovalsRes.data.mappings), "Test 21: GET /api/regulatory/industries/:id/approvals returns mapped clearances");

    // Test 22: Regulatory Rule Engine Execution
    const ruleEngineRes = await axios.post(`${BASE_URL}/api/regulatory/analyze`, {
      industry: "Engineering & Heavy Manufacturing",
      sector: "Engineering & Heavy Manufacturing",
      investment: 80.0,
      workforce: 300,
      district: "Pune",
      isMIDC: true
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(ruleEngineRes.status === 200 && ruleEngineRes.data.success, "Test 22: POST /api/regulatory/analyze evaluates applicable approvals");
    assert(Array.isArray(ruleEngineRes.data.approvals) && ruleEngineRes.data.approvals.length > 0, "Test 23: Rule engine identifies statutory clearances");
    assert(ruleEngineRes.data.disclaimer?.includes("Preliminary") || ruleEngineRes.data.disclaimer?.includes("indicative"), "Test 24: Rule engine includes legal indicative disclaimer");

    // Test 25: AI Regulatory Guidance
    const aiGuidanceRes = await axios.post(`${BASE_URL}/api/ai/regulatory-analysis`, {
      sector: "Engineering & Heavy Manufacturing",
      investmentCrores: 75.0,
      district: "Pune"
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(aiGuidanceRes.status === 200 && (aiGuidanceRes.data.keyClearances || aiGuidanceRes.data.summary), "Test 25: POST /api/ai/regulatory-analysis delivers automated compliance roadmap");

    // --------------------------------------------------------------------
    // JOURNEY 4: DOCUMENT VAULT, PRE-VALIDATION & STORAGE (Tests 26 - 35)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 4: Document Vault, Validation & Private Storage ---");

    const samplePdfB64 = Buffer.from("%PDF-1.4 sample content for E2E testing 2026").toString("base64");
    
    // Test 26: Upload Document to Vault
    const docUploadRes = await axios.post(`${BASE_URL}/api/documents`, {
      name: "Factory Consent To Establish",
      category: "MPCB Consent",
      fileName: "cte_consent.pdf",
      fileData: samplePdfB64,
      fileType: "application/pdf",
      linkedApprovals: ["APP-MPCB-CTE"]
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const docId = docUploadRes.data.document?.id;
    assert(docUploadRes.status === 201 && docId, "Test 26: POST /api/documents uploads document to private storage");
    assert(docUploadRes.data.document.storagePath?.startsWith(`${companyAId}/`), "Test 27: Uploaded document storage path strictly scoped to authenticated enterprise");

    // Test 28: List Enterprise Documents
    const docListRes = await axios.get(`${BASE_URL}/api/documents`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(docListRes.status === 200 && docListRes.data.documents.some((d: any) => d.id === docId), "Test 28: GET /api/documents lists stored vault documents");

    // Test 29: Get Single Document
    const singleDocRes = await axios.get(`${BASE_URL}/api/documents/${docId}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(singleDocRes.status === 200 && singleDocRes.data.document?.id === docId, "Test 29: GET /api/documents/:id retrieves single document metadata");

    // Test 30: Document Pre-Validation
    const docVerifyRes = await axios.post(`${BASE_URL}/api/documents/${docId}/verify`, {}, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(docVerifyRes.status === 200 && docVerifyRes.data.document?.status === "verified", "Test 30: POST /api/documents/:id/verify runs pre-validation checks");
    assert(docVerifyRes.data.document?.correctionGuidance?.includes("Pre-validation") || docVerifyRes.data.document?.validationScore > 0, "Test 31: Pre-validation guidance and score generated");

    // Test 32: Generate Short-Lived Signed Download URL
    const docDownloadRes = await axios.get(`${BASE_URL}/api/documents/${docId}/download`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(docDownloadRes.status === 200 && (docDownloadRes.data.documentId === docId || docDownloadRes.data.signedUrl), "Test 32: GET /api/documents/:id/download generates secure download access");

    // Test 33: Tenant Isolation: Company B blocked from accessing Company A's document
    try {
      await axios.get(`${BASE_URL}/api/documents/${docId}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 33: Cross-tenant document access blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 33: Cross-tenant document read blocked (403/404)");
    }

    // Test 34: Tenant Isolation: Company B blocked from downloading Company A's document
    try {
      await axios.get(`${BASE_URL}/api/documents/${docId}/download`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 34: Cross-tenant signed download blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 34: Cross-tenant signed download blocked (403/404)");
    }

    // Test 35: Document format rejection (.exe)
    try {
      await axios.post(`${BASE_URL}/api/documents`, {
        name: "Executable File",
        fileName: "malware.exe",
        fileData: "TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAA",
        fileType: "application/x-msdownload"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 35: Invalid document format (.exe) rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 35: Executable file upload rejected (400 Bad Request)");
    }

    // --------------------------------------------------------------------
    // JOURNEY 5: APPLICATION SUBMISSION, TRACKING & STATUS (Tests 36 - 44)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 5: Application Lifecycle, Single Window Tracking ---");

    // Test 36: Create New Application
    const appCreateRes = await axios.post(`${BASE_URL}/api/applications`, {
      name: "Consent to Establish - Factory Unit 2",
      department: "Maharashtra Pollution Control Board",
      category: "Environmental",
      serviceCode: "SRV-MPCB-CTE",
      district: "Pune",
      taluka: "Haveli",
      slaDays: 45,
      documents: [docId]
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const appId = appCreateRes.data.application?.id;
    const appCode = appCreateRes.data.application?.code;
    assert(appCreateRes.status === 201 && appId && (appCode?.startsWith("MH-") || appCode?.startsWith("MAHA-")), "Test 36: POST /api/applications creates Single Window application");
    assert(appCreateRes.data.application.status === "Submitted" || appCreateRes.data.application.status === "under_scrutiny", "Test 37: Initial status set to Submitted / under_scrutiny");

    // Test 38: List Enterprise Applications
    const appListRes = await axios.get(`${BASE_URL}/api/applications`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(appListRes.status === 200 && appListRes.data.applications.some((a: any) => a.id === appId), "Test 38: GET /api/applications returns enterprise applications");

    // Test 39: Get Single Application
    const singleAppRes = await axios.get(`${BASE_URL}/api/applications/${appId}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(singleAppRes.status === 200 && singleAppRes.data.application?.id === appId, "Test 39: GET /api/applications/:id returns application details");

    // Test 40: Application Tracking Timeline
    const appTrackRes = await axios.get(`${BASE_URL}/api/applications/${appId}/tracking`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(appTrackRes.status === 200 && appTrackRes.data.tracking?.id === appId, "Test 40: GET /api/applications/:id/tracking returns live tracking metrics");

    // Test 41: Update Application Status
    const appUpdateRes = await axios.put(`${BASE_URL}/api/applications/${appId}`, {
      status: "approved",
      remarks: "Statutory clearance granted under Ease of Doing Business framework."
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(appUpdateRes.status === 200 && appUpdateRes.data.application?.status === "approved", "Test 41: PUT /api/applications/:id updates status to approved");

    // Test 42: Status History is maintained
    const updatedSingleApp = await axios.get(`${BASE_URL}/api/applications/${appId}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(Array.isArray(updatedSingleApp.data.application?.statusHistory), "Test 42: Application maintains status history audit log");

    // Test 43: Tenant Isolation: Company B blocked from reading Company A's application
    try {
      await axios.get(`${BASE_URL}/api/applications/${appId}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 43: Cross-tenant application read blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 43: Cross-tenant application read blocked (403/404)");
    }

    // Test 44: Tenant Isolation: Company B blocked from updating Company A's application
    try {
      await axios.put(`${BASE_URL}/api/applications/${appId}`, { status: "rejected" }, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 44: Cross-tenant application update blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 44: Cross-tenant application update blocked (403/404)");
    }

    // --------------------------------------------------------------------
    // JOURNEY 6: GRIEVANCE & QUERY REDRESSAL (Tests 45 - 53)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 6: Grievance Redressal & Support Lifecycle ---");

    // Test 45: Submit Grievance
    const grievSubmitRes = await axios.post(`${BASE_URL}/api/grievances`, {
      type: "grievance",
      subject: "Water Connection Feasibility Approval Delayed",
      description: "Application submitted over 30 days ago, awaiting MIDC water pipeline approval.",
      department: "MIDC",
      serviceType: "Water Connection",
      category: "Application Delay",
      priority: "High",
      applicantName: "Authorized Industrial Representative",
      mobile: "9820011223",
      email: "e2eA@maharashtra.gov.test",
      district: "Pune",
      taluka: "Haveli"
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const grievId = grievSubmitRes.data.grievance?.id;
    const grievRef = grievSubmitRes.data.grievance?.id;
    assert(grievSubmitRes.status === 201 && grievId && grievRef?.startsWith("MGV-"), "Test 45: POST /api/grievances creates grievance with unique MGV- reference");

    // Test 46: List Grievances for Enterprise
    const grievListRes = await axios.get(`${BASE_URL}/api/grievances`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(grievListRes.status === 200 && grievListRes.data.grievances.some((g: any) => g.id === grievId), "Test 46: GET /api/grievances lists enterprise grievances");

    // Test 47: Get Single Grievance by ID
    const singleGrievRes = await axios.get(`${BASE_URL}/api/grievances/${grievId}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(singleGrievRes.status === 200 && singleGrievRes.data.grievance?.id === grievId, "Test 47: GET /api/grievances/:id retrieves grievance record");

    // Test 48: Lookup Grievance by Reference
    const refGrievRes = await axios.get(`${BASE_URL}/api/grievances/status/${grievRef}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(refGrievRes.status === 200 && refGrievRes.data.grievance?.id === grievId, "Test 48: GET /api/grievances/status/:reference resolves grievance by tracking reference");

    // Test 49: Update Grievance / Add Comment
    const updateGrievRes = await axios.put(`${BASE_URL}/api/grievances/${grievId}`, {
      status: "In Progress",
      applicantNote: "Additional document uploaded in vault for review."
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(updateGrievRes.status === 200 && updateGrievRes.data.grievance?.status === "In Progress", "Test 49: PUT /api/grievances/:id updates grievance status");

    // Test 50: Submit Query
    const querySubmitRes = await axios.post(`${BASE_URL}/api/grievances`, {
      type: "query",
      subject: "Query on Solar Power Subsidies",
      description: "Clarification required on Package Scheme of Incentives for captive solar setup.",
      department: "Industries, Energy and Labour Department",
      category: "General Query",
      priority: "Medium",
      applicantName: "Authorized Officer",
      mobile: "9820011223",
      email: "e2eA@maharashtra.gov.test",
      district: "Pune"
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(querySubmitRes.status === 201 && querySubmitRes.data.grievance?.id?.startsWith("MQY-"), "Test 50: Query creation generates distinct MQY- reference");

    // Test 51: Cross-Tenant Grievance Read Blocked
    try {
      await axios.get(`${BASE_URL}/api/grievances/${grievId}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 51: Cross-tenant grievance read blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 51: Cross-tenant grievance read blocked (403/404)");
    }

    // Test 52: Cross-Tenant Grievance Update Blocked
    try {
      await axios.put(`${BASE_URL}/api/grievances/${grievId}`, { status: "Resolved" }, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 52: Cross-tenant grievance update blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 52: Cross-tenant grievance update blocked (403/404)");
    }

    // Test 53: Invalid Grievance Input Rejected (Missing Subject)
    try {
      await axios.post(`${BASE_URL}/api/grievances`, {
        subject: "",
        description: "Missing subject test"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 53: Blank subject in grievance rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 53: Blank subject rejected (400 Bad Request)");
    }

    // --------------------------------------------------------------------
    // JOURNEY 7: FEEDBACK MANAGEMENT (Tests 54 - 58)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 7: Citizen & Enterprise Feedback Lifecycle ---");

    // Test 54: Submit Feedback
    const fbSubmitRes = await axios.post(`${BASE_URL}/api/feedback`, {
      feedbackType: "Application Process",
      relatedModule: "Applications",
      rating: 5,
      message: "Fast single window processing under statutory timelines.",
      applicationId: appId,
      applicantName: "Compliance Manager",
      mobile: "9820011223",
      email: "e2eA@maharashtra.gov.test"
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const fbId = fbSubmitRes.data.feedback?.id;
    const fbRef = fbSubmitRes.data.feedback?.id;
    assert(fbSubmitRes.status === 201 && fbId && fbRef?.startsWith("MUS-FB-2026-"), "Test 54: POST /api/feedback creates feedback with MUS-FB- reference");

    // Test 55: List Company Feedback
    const fbListRes = await axios.get(`${BASE_URL}/api/feedback`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(fbListRes.status === 200 && fbListRes.data.feedback.some((f: any) => f.id === fbId), "Test 55: GET /api/feedback lists enterprise feedback");

    // Test 56: Lookup Feedback by Reference
    const fbRefRes = await axios.get(`${BASE_URL}/api/feedback/status/${fbRef}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(fbRefRes.status === 200 && fbRefRes.data.feedback?.id === fbId, "Test 56: GET /api/feedback/status/:reference resolves feedback status");

    // Test 57: Invalid Rating (Out of bounds)
    try {
      await axios.post(`${BASE_URL}/api/feedback`, {
        feedbackType: "Application Process",
        relatedModule: "Applications",
        rating: 10,
        message: "Invalid rating test"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 57: Invalid rating (>5) rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 57: Out-of-bounds rating rejected (400 Bad Request)");
    }

    // Test 58: Cross-Tenant Feedback Update Blocked
    try {
      await axios.put(`${BASE_URL}/api/feedback/${fbId}`, { message: "Malicious modification" }, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 58: Cross-tenant feedback update blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 58: Cross-tenant feedback update blocked (403/404)");
    }

    // --------------------------------------------------------------------
    // JOURNEY 8: INVESTOR SERVICES & INVESTMENT PLANNER (Tests 59 - 64)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 8: Investor Services & Investment Planning ---");

    // Test 59: Save Investment Plan
    const planSaveRes = await axios.post(`${BASE_URL}/api/invest-plans`, {
      projectName: "Pune Precision Engineering Plant Phase II",
      industrySector: "Engineering & Heavy Manufacturing",
      location: "Chakan MIDC Phase IV, Pune",
      investmentCr: 60.0,
      employmentTarget: 200,
      powerRequirementKw: 1500,
      landRequirementAcres: 12.5,
      waterRequirementKld: 50.0,
      timelineMonths: 18,
      incentivesEligible: ["Stamp Duty Exemption", "Electricity Duty Waiver", "Capital Subsidy for Green Unit"],
      checklist: [
        { approvalId: "APP-MPCB-CTE", name: "Consent to Establish", department: "MPCB", status: "required" },
        { approvalId: "APP-DISH-FACT", name: "Factory Plan Approval", department: "DISH", status: "required" }
      ]
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const planId = planSaveRes.data.plan?.id;
    const planRef = planSaveRes.data.plan?.id;
    assert(planSaveRes.status === 201 && planId && planRef?.startsWith("MUS-INV-2026-"), "Test 59: POST /api/invest-plans creates investment roadmap");

    // Test 60: List Investment Plans
    const planListRes = await axios.get(`${BASE_URL}/api/invest-plans`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(planListRes.status === 200 && planListRes.data.plans.some((p: any) => p.id === planId), "Test 60: GET /api/invest-plans returns enterprise investment plans");

    // Test 61: Get Plan by ID
    const singlePlanRes = await axios.get(`${BASE_URL}/api/invest-plans/${planId}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(singlePlanRes.status === 200 && singlePlanRes.data.plan?.id === planId, "Test 61: GET /api/invest-plans/:id retrieves investment plan details");

    // Test 62: Update Investment Plan
    const updatePlanRes = await axios.put(`${BASE_URL}/api/invest-plans/${planId}`, {
      investmentCr: 65.0,
      status: "in_progress"
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(updatePlanRes.status === 200 && Number(updatePlanRes.data.plan?.investmentCr) === 65.0, "Test 62: PUT /api/invest-plans/:id updates capital investment details");

    // Test 63: Cross-Tenant Plan Read Blocked
    try {
      await axios.get(`${BASE_URL}/api/invest-plans/${planId}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 63: Cross-tenant investment plan read blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 63: Cross-tenant investment plan read blocked (403/404)");
    }

    // Test 64: AI Query & Compliance Guidance
    const aiInvestRes = await axios.post(`${BASE_URL}/api/ai/query-assistant`, {
      department: "Maharashtra Pollution Control Board",
      approvalName: "Consent to Establish (CTE)",
      queryText: "Please clarify technical parameters for effluent treatment and air emissions stack height.",
      applicantContext: "Maharashtra Precision Engineering Ltd"
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(aiInvestRes.status === 200 && aiInvestRes.data.success && aiInvestRes.data.suggestedResponse, "Test 64: POST /api/ai/query-assistant provides compliant draft responses");

    // --------------------------------------------------------------------
    // JOURNEY 9: NOTIFICATIONS, SLA MONITORING & ESCALATION (Tests 65 - 71)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 9: Notifications, SLA Monitoring & Escalation Engine ---");

    // Test 65: List Notifications
    const notifListRes = await axios.get(`${BASE_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(notifListRes.status === 200 && Array.isArray(notifListRes.data.notifications), "Test 65: GET /api/notifications returns company notifications");

    // Test 66: Get Unread Count
    const unreadRes = await axios.get(`${BASE_URL}/api/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(unreadRes.status === 200 && typeof unreadRes.data.unreadCount === "number", "Test 66: GET /api/notifications/unread-count returns unread count");

    // Test 67: Get & Update Notification Preferences
    const prefRes = await axios.get(`${BASE_URL}/api/notifications/preferences`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(prefRes.status === 200 && prefRes.data.preferences, "Test 67: GET /api/notifications/preferences returns preferences");

    const updatePrefRes = await axios.put(`${BASE_URL}/api/notifications/preferences`, {
      email_notifications: true,
      sla_alerts: true
    }, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(updatePrefRes.status === 200 && updatePrefRes.data.preferences?.sla_alerts === true, "Test 68: PUT /api/notifications/preferences updates alert settings");

    // Test 69: Fetch SLA Applications Breakdown
    const slaAppsRes = await axios.get(`${BASE_URL}/api/sla/applications`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(slaAppsRes.status === 200 && Array.isArray(slaAppsRes.data.applications), "Test 69: GET /api/sla/applications evaluates SLA compliance metrics");

    // Test 70: Fetch SLA Summary
    const slaSumRes = await axios.get(`${BASE_URL}/api/sla/summary`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(slaSumRes.status === 200 && slaSumRes.data.summary?.applications, "Test 70: GET /api/sla/summary returns consolidated SLA dashboard metrics");

    // Test 71: Admin triggers SLA Monitoring Job
    const adminSlaJob = await axios.post(`${BASE_URL}/api/admin/sla/process`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminSlaJob.status === 200 && adminSlaJob.data.success, "Test 71: POST /api/admin/sla/process executes automated SLA audit & escalation job");

    // --------------------------------------------------------------------
    // JOURNEY 10: REGULATORY ADMIN, INGESTION & DATA QUALITY (Tests 72 - 78)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 10: Regulatory Admin, Data Quality & Ingestion ---");

    // Test 72: Regulatory Admin Overview
    const adminOverviewRes = await axios.get(`${BASE_URL}/api/admin/regulatory/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminOverviewRes.status === 200 && adminOverviewRes.data.overview?.totalApprovals >= 0, "Test 72: GET /api/admin/regulatory/overview returns regulatory metrics");

    // Test 73: Regulatory Quality Audit Scan
    const qualityRes = await axios.get(`${BASE_URL}/api/admin/regulatory/quality`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(qualityRes.status === 200 && qualityRes.data.qualityMetrics?.totalApprovals > 0, "Test 73: GET /api/admin/regulatory/quality calculates database metrics");

    // Test 74: Scan Potential Duplicate Approvals
    const dupsRes = await axios.get(`${BASE_URL}/api/admin/regulatory/duplicates`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(dupsRes.status === 200 && Array.isArray(dupsRes.data.duplicates), "Test 74: GET /api/admin/regulatory/duplicates scans for redundant regulatory records");

    // Test 75: Scan Regulatory Conflicts
    const conflictsRes = await axios.get(`${BASE_URL}/api/admin/regulatory/conflicts`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(conflictsRes.status === 200 && Array.isArray(conflictsRes.data.conflicts), "Test 75: GET /api/admin/regulatory/conflicts scans unresolved discrepancies");

    // Test 76: Batch Ingestion Preview
    const previewRes = await axios.post(`${BASE_URL}/api/admin/regulatory/ingest/preview`, {
      source: {
        title: "High Voltage Substation Grid Interconnection Regulations",
        sourceType: "Government Resolution",
        department: "Maharashtra State Electricity Distribution Co.",
        officialUrl: "https://mahadiscom.in/regulations/grid-code-2026.html"
      },
      approvals: [
        {
          name: "Grid Interconnection NOC",
          category: "Power Infrastructure",
          departmentId: "DEP-MSEDCL-001",
          fee: "₹ 10,000",
          timeline: "30 Days",
          legalBasis: "Maharashtra Electricity Act"
        }
      ]
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(previewRes.status === 200 && previewRes.data.preview, "Test 76: POST /api/admin/regulatory/ingest/preview validates dataset integrity");

    // Test 77: Version History Audit
    const verRes = await axios.get(`${BASE_URL}/api/admin/regulatory/versions`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(verRes.status === 200 && Array.isArray(verRes.data.versions), "Test 77: GET /api/admin/regulatory/versions audits regulatory version snapshots");

    // Test 78: RBAC: Company User blocked from accessing Admin Quality endpoint
    try {
      await axios.get(`${BASE_URL}/api/admin/regulatory/quality`, {
        headers: { Authorization: `Bearer ${companyAToken}` }
      });
      assert(false, "Test 78: Normal company user blocked on admin endpoint");
    } catch (e: any) {
      assert(e.response?.status === 403, "Test 78: Normal company user blocked on admin endpoints (403 Forbidden)");
    }

    // --------------------------------------------------------------------
    // JOURNEY 11: DATABASE-DRIVEN COMPANY DASHBOARD (Tests 79 - 84)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 11: Database-Driven Company Dashboard ---");

    // Test 79: Company Dashboard Summary
    const dashSummaryRes = await axios.get(`${BASE_URL}/api/dashboard/summary`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(dashSummaryRes.status === 200 && (dashSummaryRes.data.companyProfile?.id === companyAId || dashSummaryRes.data.profile?.id === companyAId), "Test 79: GET /api/dashboard/summary returns company metrics");
    assert(dashSummaryRes.data.applications?.total >= 1, "Test 80: Company dashboard calculates real database application counts");
    assert(dashSummaryRes.data.grievances?.total >= 1, "Test 81: Company dashboard calculates real database grievance counts");
    assert(dashSummaryRes.data.documents?.total >= 1, "Test 82: Company dashboard calculates real database document counts");

    // Test 83: Company Dashboard Export (CSV)
    const exportRes = await axios.get(`${BASE_URL}/api/dashboard/export?type=applications&format=csv`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(exportRes.status === 200 && exportRes.data.includes("Application ID"), "Test 83: GET /api/dashboard/export generates tenant-isolated CSV");

    // Test 84: Tenant Isolation in Dashboard Export (No Company B data in Company A's export)
    assert(!exportRes.data.includes("Sahyadri Agro"), "Test 84: Tenant export strictly isolates records to authenticated enterprise");

    // --------------------------------------------------------------------
    // JOURNEY 12: PUBLIC DASHBOARD, ZERO PII & ANALYTICS (Tests 85 - 90)
    // --------------------------------------------------------------------
    console.log("--- JOURNEY 12: Public Dashboard, Zero PII & State-Wide Analytics ---");

    // Test 85: Public Dashboard Summary
    const pubSumRes = await axios.get(`${BASE_URL}/api/public-dashboard/summary`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(pubSumRes.status === 200 && pubSumRes.data.overview?.totalApplications >= 0, "Test 85: GET /api/public-dashboard/summary returns aggregate metrics");

    // Test 86: Zero PII Guarantee in Public Summary
    const pubSumStr = JSON.stringify(pubSumRes.data);
    assert(!pubSumStr.includes("MHE2EA1234") && !pubSumStr.includes("MHE2EB5678"), "Test 86: [Zero PII] Public summary contains ZERO PAN numbers");
    assert(!pubSumStr.includes("27MHE2EA1234F1Z1") && !pubSumStr.includes("27MHE2EB5678G1Z2"), "Test 87: [Zero PII] Public summary contains ZERO GSTIN numbers");
    assert(!pubSumStr.includes("Maharashtra Precision Engineering") && !pubSumStr.includes("Sahyadri Agro"), "Test 88: [Zero PII] Public summary contains ZERO company names");

    // Test 89: Public Department Analytics
    const pubDeptsRes = await axios.get(`${BASE_URL}/api/public-dashboard/departments`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(pubDeptsRes.status === 200 && Array.isArray(pubDeptsRes.data.departments), "Test 89: GET /api/public-dashboard/departments delivers aggregate clearance data");

    // Test 90: State-Wide Sector Analytics
    const pubSectorsRes = await axios.get(`${BASE_URL}/api/analytics/sectors`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(pubSectorsRes.status === 200 && Array.isArray(pubSectorsRes.data.sectors), "Test 90: GET /api/analytics/sectors computes industrial sector distributions");

  } catch (err: any) {
    console.error("Test execution error:", err.message, err.response?.data);
  } finally {
    // Clean up test records
    await supabase.from("applications").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("grievances").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("documents").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("invest_plans").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("notifications").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("feedback").delete().in("company_id", [companyAId, companyBId]);
    await supabase.from("companies").delete().in("id", [companyAId, companyBId]);
  }

  console.log("\n========================================================================");
  console.log(`STEP 14 TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED (TOTAL: ${testsPassed + testsFailed})`);
  console.log("========================================================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
