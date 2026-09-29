import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import crypto from "crypto";
import { generateSessionToken, verifyPassword, hashPassword } from "./server";

dotenv.config();

const BASE_URL = "http://localhost:3001";
const companyAId = "BIZ-MH-SEC-A01";
const companyBId = "BIZ-MH-SEC-B02";
const companyAToken = generateSessionToken(companyAId, "secA@test.com", "COMPANY_USER");
const companyBToken = generateSessionToken(companyBId, "secB@test.com", "COMPANY_USER");
const adminToken = generateSessionToken("ADMIN-REG-SEC01", "secadmin@maharashtra.gov.in", "REGULATORY_ADMIN");
const superAdminToken = generateSessionToken("SUPER-ADMIN-01", "superadmin@maharashtra.gov.in", "SUPER_ADMIN");

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
  console.log("STARTING STEP 13: SECURITY, PERFORMANCE & HARDENING TEST SUITE (70+ TESTS)");
  console.log("========================================================================\n");

  // Seed test companies
  await supabase.from("companies").upsert([
    {
      id: companyAId,
      name: "Security Hardened Alpha Ltd",
      pan: "SECAP1234F",
      gstin: "27SECAP1234F1Z1",
      email: "secA@test.com",
      mobile: "9825204240",
      district: "Nashik",
      taluka: "Ambad",
      state: "Maharashtra",
      sector: "Engineering & Heavy Manufacturing",
      business_type: "Private Limited",
      investment_crores: 80.0,
      connected_power_kw: 1500,
      workforce: 300,
      password_hash: hashPassword("SecurePass@2026"),
      is_profile_complete: true
    },
    {
      id: companyBId,
      name: "Security Hardened Beta Corp",
      pan: "SECBP5678G",
      gstin: "27SECBP5678G1Z2",
      email: "secB@test.com",
      mobile: "9876543210",
      district: "Pune",
      taluka: "Haveli",
      state: "Maharashtra",
      sector: "Information Technology",
      business_type: "LLP",
      investment_crores: 30.0,
      connected_power_kw: 400,
      workforce: 100,
      password_hash: hashPassword("SecurePass@2026"),
      is_profile_complete: true
    }
  ]);

  // Clean old test records
  await supabase.from("applications").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("grievances").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("documents").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("invest_plans").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("notifications").delete().in("company_id", [companyAId, companyBId]);
  await supabase.from("feedback").delete().in("company_id", [companyAId, companyBId]);

  // Seed Company A resources
  const appA1Id = "APP-SEC-A01";
  await supabase.from("applications").insert({
    id: appA1Id,
    code: "MAHA-APP-SEC-A01",
    name: "Heavy Industrial Factory Clearance",
    company_id: companyAId,
    department: "Maharashtra Pollution Control Board",
    category: "Environmental",
    status: "Under Scrutiny",
    sla_days: 30,
    submitted_date: new Date().toISOString()
  });

  const docA1Id = "DOC-SEC-A01";
  await supabase.from("documents").insert({
    id: docA1Id,
    company_id: companyAId,
    name: "Factory Consent Document",
    category: "Factory License",
    status: "verified",
    file_type: "application/pdf",
    file_size: "1.0 MB",
    storage_path: `${companyAId}/vault/${docA1Id}/consent.pdf`
  });

  const grievA1Id = "GRV-SEC-A01";
  await supabase.from("grievances").insert({
    id: grievA1Id,
    company_id: companyAId,
    type: "grievance",
    business_name: "Security Hardened Alpha Ltd",
    applicant_name: "Authorized Officer",
    mobile: "9825204240",
    email: "secA@test.com",
    service_type: "Power Infrastructure",
    department: "MSEDCL",
    district: "Nashik",
    taluka: "Ambad",
    category: "Power Infrastructure",
    priority: "High",
    subject: "Substation Line Feeder Clearance Delay",
    description: "Delay in substation clearance under RTS statutory timelines.",
    status: "Submitted",
    expected_sla_days: 15
  });

  const fbA1Id = "MUS-FB-2026-SEC01";
  await supabase.from("feedback").insert({
    id: fbA1Id,
    company_id: companyAId,
    feedback_type: "Application Process",
    related_module: "Applications",
    rating: 5,
    message: "Clear single window tracking experience.",
    status: "Submitted"
  });

  const planA1Id = "MUS-INV-2026-SEC01";
  await supabase.from("invest_plans").insert({
    id: planA1Id,
    company_id: companyAId,
    project_name: "Alpha Foundry Expansion",
    industry_sector: "Engineering & Heavy Manufacturing",
    location: "Ambad MIDC, Nashik",
    investment_cr: 50.0,
    status: "active"
  });

  const notifA1Id = "22222222-3333-4444-5555-666666666666";
  await supabase.from("notifications").insert({
    id: notifA1Id,
    company_id: companyAId,
    title: "Application Received",
    message: "Your application is under scrutiny.",
    type: "APPLICATION_SUBMITTED",
    severity: "INFO",
    channel: "PORTAL",
    status: "ACTIVE",
    is_read: false
  });

  // Seed Company B application
  const appB1Id = "APP-SEC-B01";
  await supabase.from("applications").insert({
    id: appB1Id,
    code: "MAHA-APP-SEC-B01",
    name: "Software Technology Park Permission",
    company_id: companyBId,
    department: "Urban Development Department",
    category: "Building",
    status: "Approved",
    sla_days: 30,
    submitted_date: new Date().toISOString()
  });

  try {
    // --------------------------------------------------------------------
    // GROUP 1: AUTHENTICATION HARDENING & TOKEN TAMPERING (Tests 1 - 10)
    // --------------------------------------------------------------------
    console.log("--- GROUP 1: Authentication Hardening & Token Tampering ---");

    // Test 1: Empty token rejected
    try {
      await axios.get(`${BASE_URL}/api/company/profile`, { headers: { Authorization: "Bearer " } });
      assert(false, "Test 1: Empty token rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 1: Empty token rejected (401)");
    }

    // Test 2: Token without dot separator rejected
    try {
      await axios.get(`${BASE_URL}/api/company/profile`, { headers: { Authorization: "Bearer invalidtokenwithoutdot" } });
      assert(false, "Test 2: Token without dot separator rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 2: Token without dot separator rejected (401)");
    }

    // Test 3: Tampered signature rejected
    const tamperedSigToken = `${companyAToken.slice(0, -5)}abcde`;
    try {
      await axios.get(`${BASE_URL}/api/company/profile`, { headers: { Authorization: `Bearer ${tamperedSigToken}` } });
      assert(false, "Test 3: Tampered signature rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 3: Tampered signature rejected (401)");
    }

    // Test 4: Tampered payload data rejected
    const [payloadPart, sigPart] = companyAToken.split(".");
    const modifiedPayloadObj = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
    modifiedPayloadObj.companyId = companyBId; // Attacker tries to alter payload without re-signing
    const tamperedPayloadToken = `${Buffer.from(JSON.stringify(modifiedPayloadObj)).toString("base64url")}.${sigPart}`;
    try {
      await axios.get(`${BASE_URL}/api/company/profile`, { headers: { Authorization: `Bearer ${tamperedPayloadToken}` } });
      assert(false, "Test 4: Tampered payload data rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 4: Tampered payload data rejected (401)");
    }

    // Test 5: Expired token rejected
    const expiredPayload = {
      companyId: companyAId,
      email: "secA@test.com",
      role: "COMPANY_USER",
      issuedAt: Date.now() - 10 * 86400000,
      expiresAt: Date.now() - 1000 // Expired 1 second ago
    };
    const expiredData = Buffer.from(JSON.stringify(expiredPayload)).toString("base64url");
    const sessionSecret = process.env.SESSION_SECRET || "mahau-secure-jwt-session-secret-2026-industry-bridge";
    const expiredSig = crypto.createHmac("sha256", sessionSecret).update(expiredData).digest("base64url");
    const expiredToken = `${expiredData}.${expiredSig}`;
    try {
      await axios.get(`${BASE_URL}/api/company/profile`, { headers: { Authorization: `Bearer ${expiredToken}` } });
      assert(false, "Test 5: Expired token rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 5: Expired token rejected (401)");
    }

    // Test 6: Malformed base64 payload rejected
    try {
      await axios.get(`${BASE_URL}/api/company/profile`, { headers: { Authorization: `Bearer %%%notbase64%%%.fakeSig` } });
      assert(false, "Test 6: Malformed base64 payload rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 6: Malformed base64 payload rejected (401)");
    }

    // Test 7: Valid company token accepted (200)
    const validProfileRes = await axios.get(`${BASE_URL}/api/company/profile`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(validProfileRes.status === 200 && validProfileRes.data.profile?.id === companyAId, "Test 7: Valid company token accepted (200)");

    // Test 8: Custom header x-company-token compatibility
    const xHeaderRes = await axios.get(`${BASE_URL}/api/company/profile`, {
      headers: { "x-company-token": companyAToken }
    });
    assert(xHeaderRes.status === 200 && xHeaderRes.data.profile?.id === companyAId, "Test 8: x-company-token header compatibility verified");

    // Test 9: Secure password hashing verification
    const passHash = hashPassword("TestSecret@123");
    assert(passHash.includes(":") && passHash.length > 50, "Test 9: Password hash uses scrypt with random salt");

    // Test 10: Verify correct password matches and wrong password fails
    assert(verifyPassword("TestSecret@123", passHash) === true, "Test 10a: Valid password verifies successfully");
    assert(verifyPassword("WrongPassword", passHash) === false, "Test 10b: Incorrect password rejected by scrypt verification");

    // --------------------------------------------------------------------
    // GROUP 2: AUTHORIZATION & PRIVILEGE ESCALATION GATES (Tests 11 - 18)
    // --------------------------------------------------------------------
    console.log("--- GROUP 2: Authorization & Privilege Escalation Gates ---");

    // Test 11: Normal company user cannot access regulatory admin GET endpoint
    try {
      await axios.get(`${BASE_URL}/api/admin/regulatory/overview`, {
        headers: { Authorization: `Bearer ${companyAToken}` }
      });
      assert(false, "Test 11: Normal company user rejected on admin overview");
    } catch (e: any) {
      assert(e.response?.status === 403, "Test 11: Normal company user blocked on admin overview (403)");
    }

    // Test 12: Normal company user cannot trigger admin SLA monitoring job
    try {
      await axios.post(`${BASE_URL}/api/admin/sla/process`, {}, {
        headers: { Authorization: `Bearer ${companyAToken}` }
      });
      assert(false, "Test 12: Normal company user blocked on SLA process");
    } catch (e: any) {
      assert(e.response?.status === 403, "Test 12: Normal company user blocked on SLA process (403)");
    }

    // Test 13: Normal company user cannot trigger admin regulatory ingestion
    try {
      await axios.post(`${BASE_URL}/api/admin/regulatory/ingest`, {}, {
        headers: { Authorization: `Bearer ${companyAToken}` }
      });
      assert(false, "Test 13: Normal company user blocked on regulatory ingestion");
    } catch (e: any) {
      assert(e.response?.status === 403, "Test 13: Normal company user blocked on regulatory ingestion (403)");
    }

    // Test 14: Client cannot self-elevate role to REGULATORY_ADMIN without cryptographic signature
    const forgedAdminPayload = {
      companyId: companyAId,
      email: "secA@test.com",
      role: "REGULATORY_ADMIN",
      issuedAt: Date.now(),
      expiresAt: Date.now() + 86400000
    };
    const forgedAdminToken = `${Buffer.from(JSON.stringify(forgedAdminPayload)).toString("base64url")}.invalidForgedSignature`;
    try {
      await axios.get(`${BASE_URL}/api/admin/regulatory/overview`, {
        headers: { Authorization: `Bearer ${forgedAdminToken}` }
      });
      assert(false, "Test 14: Forged admin signature rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 14: Forged admin signature rejected (401)");
    }

    // Test 15: Valid REGULATORY_ADMIN token accepted on admin routes
    const adminOverviewRes = await axios.get(`${BASE_URL}/api/admin/regulatory/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminOverviewRes.status === 200 && adminOverviewRes.data.success, "Test 15: Valid REGULATORY_ADMIN token accepted (200)");

    // Test 16: SUPER_ADMIN token accepted on regulatory admin routes
    const superAdminRes = await axios.get(`${BASE_URL}/api/admin/regulatory/overview`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(superAdminRes.status === 200 && superAdminRes.data.success, "Test 16: Valid SUPER_ADMIN token accepted (200)");

    // Test 17: Request with client-supplied mismatched companyId in body blocked
    try {
      await axios.post(`${BASE_URL}/api/applications`, {
        name: "Malicious Cross-Tenant App",
        companyId: companyBId, // Company A tries to create under Company B
        department: "MPCB",
        category: "Environmental"
      }, {
        headers: { Authorization: `Bearer ${companyAToken}` }
      });
      assert(false, "Test 17: Mismatched companyId in body blocked");
    } catch (e: any) {
      assert(e.response?.status === 403, "Test 17: Mismatched companyId in body blocked (403)");
    }

    // Test 18: Request with client-supplied mismatched company_id in query blocked
    try {
      await axios.get(`${BASE_URL}/api/dashboard/summary?company_id=${companyBId}`, {
        headers: { Authorization: `Bearer ${companyAToken}` }
      });
      assert(false, "Test 18: Mismatched company_id in query blocked");
    } catch (e: any) {
      assert(e.response?.status === 403, "Test 18: Mismatched company_id in query blocked (403)");
    }

    // --------------------------------------------------------------------
    // GROUP 3: TENANT ISOLATION & IDOR PREVENTION (Tests 19 - 30)
    // --------------------------------------------------------------------
    console.log("--- GROUP 3: Tenant Isolation & IDOR Prevention ---");

    // Test 19: Cross-company application access blocked
    try {
      await axios.get(`${BASE_URL}/api/applications/${appA1Id}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 19: Cross-company application access blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 19: Cross-company application access blocked (403/404)");
    }

    // Test 20: Cross-company application update blocked
    try {
      await axios.put(`${BASE_URL}/api/applications/${appA1Id}`, { status: "approved" }, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 20: Cross-company application update blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 20: Cross-company application update blocked (403/404)");
    }

    // Test 21: Cross-company document metadata read blocked
    try {
      await axios.get(`${BASE_URL}/api/documents/${docA1Id}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 21: Cross-company document read blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 21: Cross-company document read blocked (403/404)");
    }

    // Test 22: Cross-company document signed URL generation blocked
    try {
      await axios.get(`${BASE_URL}/api/documents/${docA1Id}/download`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 22: Cross-company signed URL generation blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 22: Cross-company signed URL generation blocked (403/404)");
    }

    // Test 23: Cross-company document verification blocked
    try {
      await axios.post(`${BASE_URL}/api/documents/${docA1Id}/verify`, {}, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 23: Cross-company document verify blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 23: Cross-company document verify blocked (403/404)");
    }

    // Test 24: Cross-company document delete blocked
    try {
      await axios.delete(`${BASE_URL}/api/documents/${docA1Id}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 24: Cross-company document delete blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 24: Cross-company document delete blocked (403/404)");
    }

    // Test 25: Cross-company grievance access blocked
    try {
      await axios.get(`${BASE_URL}/api/grievances/${grievA1Id}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 25: Cross-company grievance access blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 25: Cross-company grievance access blocked (403/404)");
    }

    // Test 26: Cross-company grievance update blocked
    try {
      await axios.put(`${BASE_URL}/api/grievances/${grievA1Id}`, { description: "Malicious update" }, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 26: Cross-company grievance update blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 26: Cross-company grievance update blocked (403/404)");
    }

    // Test 27: Cross-company feedback update blocked
    try {
      await axios.put(`${BASE_URL}/api/feedback/${fbA1Id}`, { message: "Malicious feedback update" }, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 27: Cross-company feedback update blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 27: Cross-company feedback update blocked (403/404)");
    }

    // Test 28: Cross-company investment plan read blocked
    try {
      await axios.get(`${BASE_URL}/api/invest-plans/${planA1Id}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 28: Cross-company investment plan read blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 28: Cross-company investment plan read blocked (403/404)");
    }

    // Test 29: Cross-company notification read blocked
    try {
      await axios.get(`${BASE_URL}/api/notifications/${notifA1Id}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 29: Cross-company notification read blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 29: Cross-company notification read blocked (403/404)");
    }

    // Test 30: Cross-company notification delete blocked
    try {
      await axios.delete(`${BASE_URL}/api/notifications/${notifA1Id}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 30: Cross-company notification delete blocked");
    } catch (e: any) {
      assert(e.response?.status === 403 || e.response?.status === 404, "Test 30: Cross-company notification delete blocked (403/404)");
    }

    // --------------------------------------------------------------------
    // GROUP 4: FILE SECURITY & PATH TRAVERSAL DEFENSE (Tests 31 - 40)
    // --------------------------------------------------------------------
    console.log("--- GROUP 4: File Security & Path Traversal Defense ---");

    // Test 31: Empty file upload rejected
    try {
      await axios.post(`${BASE_URL}/api/documents`, {
        name: "Empty File Test",
        fileData: ""
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 31: Empty file upload rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 31: Empty file upload rejected (400)");
    }

    // Test 32: Unsupported file extension (.exe) rejected
    try {
      await axios.post(`${BASE_URL}/api/documents`, {
        name: "Executable Payload",
        fileName: "malicious_script.exe",
        fileData: "TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAA"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 32: .exe upload rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 32: Unsupported file extension (.exe) rejected (400)");
    }

    // Test 33: Unsupported script file (.sh) rejected
    try {
      await axios.post(`${BASE_URL}/api/documents`, {
        name: "Shell Script",
        fileName: "exploit.sh",
        fileData: "IyEvYmluL2Jhc2gKZWNobyAnZXhwbG9pdCcK"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 33: .sh upload rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 33: Unsupported script (.sh) rejected (400)");
    }

    // Test 34: Path traversal in filename sanitized
    const validPdfBuffer = Buffer.from("%PDF-1.4 sample content for security test");
    const traversalUploadRes = await axios.post(`${BASE_URL}/api/documents`, {
      name: "Path Traversal Test Doc",
      fileName: "../../../../etc/passwd.pdf",
      fileData: validPdfBuffer.toString("base64"),
      fileType: "application/pdf"
    }, { headers: { Authorization: `Bearer ${companyAToken}` } });
    assert(traversalUploadRes.status === 201 && !traversalUploadRes.data.document.storagePath?.includes(".."), "Test 34: Path traversal in filename sanitized safely");

    // Test 35: Storage path strictly includes authenticated companyId
    assert(traversalUploadRes.data.document.storagePath?.startsWith(`${companyAId}/`), "Test 35: Storage path strictly scoped under company directory");

    // Test 36: Uploading document attached to another company's application rejected
    try {
      await axios.post(`${BASE_URL}/api/documents`, {
        name: "Attaching to Company B App",
        applicationId: appB1Id, // Belongs to Company B
        fileName: "invoice.pdf",
        fileData: validPdfBuffer.toString("base64"),
        fileType: "application/pdf"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 36: Attaching document to cross-company application rejected");
    } catch (e: any) {
      assert(e.response?.status === 403, "Test 36: Attaching document to cross-company application blocked (403)");
    }

    // Test 37: Valid PDF file upload succeeds
    const validPdfRes = await axios.post(`${BASE_URL}/api/documents`, {
      name: "Statutory Certificate 2026",
      fileName: "certificate.pdf",
      fileData: validPdfBuffer.toString("base64"),
      fileType: "application/pdf"
    }, { headers: { Authorization: `Bearer ${companyAToken}` } });
    assert(validPdfRes.status === 201 && validPdfRes.data.document?.status === "pending", "Test 37: Valid PDF file upload succeeds (201)");

    // Test 38: Valid PNG file upload succeeds
    const validPngBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    const validPngRes = await axios.post(`${BASE_URL}/api/documents`, {
      name: "Factory Site Map",
      fileName: "site_map.png",
      fileData: validPngBuffer.toString("base64"),
      fileType: "image/png"
    }, { headers: { Authorization: `Bearer ${companyAToken}` } });
    assert(validPngRes.status === 201 && validPngRes.data.document?.name === "Factory Site Map", "Test 38: Valid PNG file upload succeeds (201)");

    // Test 39: Valid JPEG file upload succeeds
    const validJpgBuffer = Buffer.from("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=", "base64");
    const validJpgRes = await axios.post(`${BASE_URL}/api/documents`, {
      name: "Factory Photo",
      fileName: "photo.jpg",
      fileData: validJpgBuffer.toString("base64"),
      fileType: "image/jpeg"
    }, { headers: { Authorization: `Bearer ${companyAToken}` } });
    assert(validJpgRes.status === 201 && validJpgRes.data.document?.name === "Factory Photo", "Test 39: Valid JPEG file upload succeeds (201)");

    // Test 40: Signed URL generation generates valid expiring access
    const signedUrlRes = await axios.get(`${BASE_URL}/api/documents/${docA1Id}/download`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(signedUrlRes.status === 200 && signedUrlRes.data.documentId === docA1Id, "Test 40: Short-lived signed download access generated for owner");

    // --------------------------------------------------------------------
    // GROUP 5: INPUT VALIDATION & ABUSE PROTECTION (Tests 41 - 50)
    // --------------------------------------------------------------------
    console.log("--- GROUP 5: Input Validation & Abuse Protection ---");

    // Test 41: Empty subject in grievance rejected
    try {
      await axios.post(`${BASE_URL}/api/grievances`, {
        subject: "",
        description: "Some description",
        category: "Application Delay",
        mobile: "9825204240",
        email: "secA@test.com"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 41: Empty subject in grievance rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 41: Empty subject in grievance rejected (400)");
    }

    // Test 42: Empty description in grievance rejected
    try {
      await axios.post(`${BASE_URL}/api/grievances`, {
        subject: "Valid Subject",
        description: "",
        category: "Application Delay",
        mobile: "9825204240",
        email: "secA@test.com"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 42: Empty description in grievance rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 42: Empty description in grievance rejected (400)");
    }

    // Test 43: Invalid grievance category rejected
    try {
      await axios.post(`${BASE_URL}/api/grievances`, {
        subject: "Valid Subject",
        description: "Valid Description",
        category: "Illegal Injected Category",
        mobile: "9825204240",
        email: "secA@test.com"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 43: Invalid grievance category rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 43: Invalid grievance category rejected (400)");
    }

    // Test 44: Invalid mobile number rejected
    try {
      await axios.post(`${BASE_URL}/api/grievances`, {
        subject: "Valid Subject",
        description: "Valid Description",
        category: "Application Delay",
        mobile: "12345", // Too short
        email: "secA@test.com"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 44: Invalid mobile number rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 44: Invalid mobile number rejected (400)");
    }

    // Test 45: Invalid email format in grievance rejected
    try {
      await axios.post(`${BASE_URL}/api/grievances`, {
        subject: "Valid Subject",
        description: "Valid Description",
        category: "Application Delay",
        mobile: "9825204240",
        email: "not-an-email"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 45: Invalid email format rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 45: Invalid email format rejected (400)");
    }

    // Test 46: Invalid feedback rating (e.g. 10 out of 5) rejected
    try {
      await axios.post(`${BASE_URL}/api/feedback`, {
        feedbackType: "Application Process",
        relatedModule: "Applications",
        rating: 10,
        message: "Great service"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 46: Out-of-bounds feedback rating rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 46: Out-of-bounds feedback rating rejected (400)");
    }

    // Test 47: Invalid feedback module rejected
    try {
      await axios.post(`${BASE_URL}/api/feedback`, {
        feedbackType: "Application Process",
        relatedModule: "IllegalModule",
        rating: 5,
        message: "Great service"
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 47: Invalid feedback module rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 47: Invalid feedback module rejected (400)");
    }

    // Test 48: Missing project name in investment plan rejected
    try {
      await axios.post(`${BASE_URL}/api/invest-plans`, {
        projectName: "",
        industrySector: "Engineering",
        location: "Nashik",
        investmentCr: 10.0
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 48: Missing project name in investment plan rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 48: Missing project name in investment plan rejected (400)");
    }

    // Test 49: Negative investment value in investment plan rejected
    try {
      await axios.post(`${BASE_URL}/api/invest-plans`, {
        projectName: "Valid Project",
        industrySector: "Engineering",
        location: "Nashik",
        investmentCr: -50.0
      }, { headers: { Authorization: `Bearer ${companyAToken}` } });
      assert(false, "Test 49: Negative investment value rejected");
    } catch (e: any) {
      assert(e.response?.status === 400, "Test 49: Negative investment value rejected (400)");
    }

    // Test 50: Non-numeric pagination limit handled safely
    const paginatedAppsRes = await axios.get(`${BASE_URL}/api/applications?page=abc&limit=xyz`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(paginatedAppsRes.status === 200, "Test 50: Non-numeric pagination parameters safely defaulted");

    // --------------------------------------------------------------------
    // GROUP 6: SECURITY HEADERS & SAFE ERROR HANDLING (Tests 51 - 60)
    // --------------------------------------------------------------------
    console.log("--- GROUP 6: Security Headers & Safe Error Handling ---");

    const headerProbe = await axios.get(`${BASE_URL}/api/health`);

    // Test 51: X-Content-Type-Options is nosniff
    assert(headerProbe.headers["x-content-type-options"] === "nosniff", "Test 51: X-Content-Type-Options: nosniff header verified");

    // Test 52: X-Frame-Options is DENY
    assert(headerProbe.headers["x-frame-options"] === "DENY", "Test 52: X-Frame-Options: DENY header verified");

    // Test 53: X-XSS-Protection header present
    assert(headerProbe.headers["x-xss-protection"]?.includes("1"), "Test 53: X-XSS-Protection header verified");

    // Test 54: Referrer-Policy header present
    assert(headerProbe.headers["referrer-policy"] === "strict-origin-when-cross-origin", "Test 54: Referrer-Policy: strict-origin-when-cross-origin verified");

    // Test 55: X-Powered-By header removed
    assert(!headerProbe.headers["x-powered-by"], "Test 55: X-Powered-By header securely removed");

    // Test 56: Unmatched API route returns clean JSON 404
    try {
      await axios.get(`${BASE_URL}/api/non-existent-route-404`);
      assert(false, "Test 56: Unmatched API route returns 404");
    } catch (e: any) {
      assert(e.response?.status === 404 && e.response?.data?.error === "API endpoint not found.", "Test 56: Unmatched API route returns clean JSON 404");
    }

    // Test 57: Error response does NOT leak stack traces
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, { email: "invalid@test.com", password: "" });
    } catch (e: any) {
      const errStr = JSON.stringify(e.response?.data);
      assert(!errStr.includes("at Object.") && !errStr.includes("node_modules"), "Test 57: Error response does NOT leak server stack traces");
    }

    // Test 58: Error response does NOT leak session secret or internal keys
    try {
      await axios.get(`${BASE_URL}/api/documents/non-existent-id`, { headers: { Authorization: `Bearer ${companyAToken}` } });
    } catch (e: any) {
      const errStr = JSON.stringify(e.response?.data);
      assert(!errStr.includes(sessionSecret), "Test 58: Error response does NOT leak SESSION_SECRET");
    }

    // Test 59: Rate Limiting Enforcement Trigger (using test header)
    let rateLimitHit = false;
    for (let i = 0; i < 25; i++) {
      try {
        await axios.post(`${BASE_URL}/api/auth/login`, {
          email: "rate_test@test.com",
          password: "password123"
        }, {
          headers: { "x-test-rate-limit": "true" }
        });
      } catch (e: any) {
        if (e.response?.status === 429) {
          rateLimitHit = true;
          break;
        }
      }
    }
    assert(rateLimitHit, "Test 59: Rate limiting triggers HTTP 429 Too Many Requests upon burst threshold");

    // Test 60: Health check does NOT expose Supabase service role key
    const healthDataStr = JSON.stringify(headerProbe.data);
    assert(!healthDataStr.includes("service_role") && !healthDataStr.includes("secret"), "Test 60: Health check endpoint does NOT expose internal service keys");

    // --------------------------------------------------------------------
    // GROUP 7: ZERO PII IN PUBLIC AND AGGREGATE ENDPOINTS (Tests 61 - 70)
    // --------------------------------------------------------------------
    console.log("--- GROUP 7: Zero PII in Public & Aggregate Endpoints ---");

    // Test 61: Public summary endpoint response sanitized
    const pubSummary = await axios.get(`${BASE_URL}/api/public-dashboard/summary`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const pubSummaryStr = JSON.stringify(pubSummary.data);
    assert(!pubSummaryStr.includes("SECAP1234F") && !pubSummaryStr.includes("SECBP5678G"), "Test 61: Public summary has ZERO PAN numbers");

    // Test 62: Public summary has ZERO GSTIN numbers
    assert(!pubSummaryStr.includes("27SECAP1234F1Z1") && !pubSummaryStr.includes("27SECBP5678G1Z2"), "Test 62: Public summary has ZERO GSTIN numbers");

    // Test 63: Public summary has ZERO company names
    assert(!pubSummaryStr.includes("Security Hardened Alpha Ltd"), "Test 63: Public summary has ZERO enterprise names");

    // Test 64: Public summary has ZERO email addresses
    assert(!pubSummaryStr.includes("secA@test.com"), "Test 64: Public summary has ZERO email addresses");

    // Test 65: Public departments endpoint has ZERO PII
    const pubDepts = await axios.get(`${BASE_URL}/api/public-dashboard/departments`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const pubDeptsStr = JSON.stringify(pubDepts.data);
    assert(!pubDeptsStr.includes("secA@test.com") && !pubDeptsStr.includes("SECAP1234F"), "Test 65: Public departments endpoint has ZERO PII");

    // Test 66: Public districts endpoint has ZERO PII
    const pubDists = await axios.get(`${BASE_URL}/api/public-dashboard/districts`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const pubDistsStr = JSON.stringify(pubDists.data);
    assert(!pubDistsStr.includes("Security Hardened Alpha") && !pubDistsStr.includes("9825204240"), "Test 66: Public districts endpoint has ZERO PII");

    // Test 67: Public sectors endpoint has ZERO PII
    const pubSectors = await axios.get(`${BASE_URL}/api/public-dashboard/sectors`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    const pubSectorsStr = JSON.stringify(pubSectors.data);
    assert(!pubSectorsStr.includes("Security Hardened") && !pubSectorsStr.includes("secA@test.com"), "Test 67: Public sectors endpoint has ZERO PII");

    // Test 68: Public CSV export has ZERO enterprise names or contact numbers
    const pubExportCsv = await axios.get(`${BASE_URL}/api/public-dashboard/export?type=departments&format=csv`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(!pubExportCsv.data.includes("Security Hardened") && !pubExportCsv.data.includes("9825204240"), "Test 68: Public export CSV contains ZERO enterprise PII");

    // Test 69: Analytics endpoints require valid authentication
    try {
      await axios.get(`${BASE_URL}/api/analytics/departments`);
      assert(false, "Test 69: Unauthenticated analytics access rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 69: Unauthenticated analytics access rejected (401)");
    }

    // Test 70: Dashboard endpoints require valid authentication
    try {
      await axios.get(`${BASE_URL}/api/dashboard/summary`);
      assert(false, "Test 70: Unauthenticated dashboard access rejected");
    } catch (e: any) {
      assert(e.response?.status === 401, "Test 70: Unauthenticated dashboard access rejected (401)");
    }

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
  console.log(`STEP 13 TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED (TOTAL: ${testsPassed + testsFailed})`);
  console.log("========================================================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
