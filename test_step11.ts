import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { generateSessionToken } from "./server";

dotenv.config();

const BASE_URL = "http://localhost:3001";
const companyAId = "BIZ-MH-TESTA-001";
const companyBId = "BIZ-MH-TESTB-002";
const companyAToken = generateSessionToken(companyAId, "userA@test.com", "COMPANY_USER");
const companyBToken = generateSessionToken(companyBId, "userB@test.com", "COMPANY_USER");
const adminToken = generateSessionToken("ADMIN-REG-01", "admin@maharashtra.gov.in", "REGULATORY_ADMIN");

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
  console.log("STARTING STEP 11: NOTIFICATIONS, SLA & ESCALATION TEST SUITE");
  console.log("================================================================\n");

  // Ensure test companies exist in database
  await supabase.from("companies").upsert([
    {
      id: companyAId,
      name: "Alpha Test Industries Pvt Ltd",
      pan: "ABCDE1234F",
      gstin: "27ABCDE1234F1Z5",
      email: "userA@test.com",
      mobile: "9825204240",
      district: "Nashik",
      taluka: "Ambad",
      state: "Maharashtra"
    },
    {
      id: companyBId,
      name: "Beta Test Corp LLP",
      pan: "XYZAB5678C",
      gstin: "27XYZAB5678C1Z8",
      email: "userB@test.com",
      mobile: "9876543210",
      district: "Pune",
      taluka: "Haveli",
      state: "Maharashtra"
    }
  ]);

  let createdNotificationId: string | null = null;
  let testAppId: string | null = null;

  try {
    // -------------------------------------------------------------
    // GROUP 1: AUTHENTICATION & SECURITY GATES (Tests 1 - 6)
    // -------------------------------------------------------------
    console.log("--- GROUP 1: Authentication & Tenant Security Gates ---");

    // Test 1: Unauthenticated request to /api/notifications rejected
    try {
      await axios.get(`${BASE_URL}/api/notifications`);
      assert(false, "Test 1: Unauthenticated request to /api/notifications rejected");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 1: Unauthenticated request to /api/notifications rejected (401)");
    }

    // Test 2: Unauthenticated request to /api/notifications/unread-count rejected
    try {
      await axios.get(`${BASE_URL}/api/notifications/unread-count`);
      assert(false, "Test 2: Unauthenticated request to /api/notifications/unread-count rejected");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 2: Unauthenticated request to /api/notifications/unread-count rejected (401)");
    }

    // Test 3: Unauthenticated request to /api/notifications/preferences rejected
    try {
      await axios.get(`${BASE_URL}/api/notifications/preferences`);
      assert(false, "Test 3: Unauthenticated request to /api/notifications/preferences rejected");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 3: Unauthenticated request to /api/notifications/preferences rejected (401)");
    }

    // Test 4: Unauthenticated request to /api/sla/applications rejected
    try {
      await axios.get(`${BASE_URL}/api/sla/applications`);
      assert(false, "Test 4: Unauthenticated request to /api/sla/applications rejected");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 4: Unauthenticated request to /api/sla/applications rejected (401)");
    }

    // Test 5: Unauthenticated request to /api/sla/grievances rejected
    try {
      await axios.get(`${BASE_URL}/api/sla/grievances`);
      assert(false, "Test 5: Unauthenticated request to /api/sla/grievances rejected");
    } catch (err: any) {
      assert(err.response?.status === 401, "Test 5: Unauthenticated request to /api/sla/grievances rejected (401)");
    }

    // Test 6: Normal company user cannot trigger admin SLA monitoring engine (403)
    try {
      await axios.post(
        `${BASE_URL}/api/admin/sla/process`,
        {},
        { headers: { Authorization: `Bearer ${companyAToken}` } }
      );
      assert(false, "Test 6: Normal company user cannot trigger admin SLA monitoring engine");
    } catch (err: any) {
      assert(err.response?.status === 403, "Test 6: Normal company user cannot trigger admin SLA process (403)");
    }

    // -------------------------------------------------------------
    // GROUP 2: NOTIFICATION PREFERENCES MANAGEMENT (Tests 7 - 12)
    // -------------------------------------------------------------
    console.log("\n--- GROUP 2: Notification Preferences Management ---");

    // Test 7: Get default preferences for Company A
    const prefRes = await axios.get(`${BASE_URL}/api/notifications/preferences`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(prefRes.status === 200 && prefRes.data.success, "Test 7: Fetch notification preferences returns 200");
    assert(prefRes.data.preferences?.portal_notifications === true, "Test 8: Default portal_notifications is true");
    assert(prefRes.data.preferences?.sla_alerts === true, "Test 9: Default sla_alerts is true");

    // Test 10: Update notification preferences for Company A
    const updatePrefRes = await axios.put(
      `${BASE_URL}/api/notifications/preferences`,
      { sms_notifications: false, document_expiry_alerts: false },
      { headers: { Authorization: `Bearer ${companyAToken}` } }
    );
    assert(updatePrefRes.status === 200 && updatePrefRes.data.preferences?.sms_notifications === false, "Test 10: Update sms_notifications to false");
    assert(updatePrefRes.data.preferences?.document_expiry_alerts === false, "Test 11: Update document_expiry_alerts to false");

    // Test 12: Re-enable preferences
    const restorePrefRes = await axios.put(
      `${BASE_URL}/api/notifications/preferences`,
      { sms_notifications: true, document_expiry_alerts: true },
      { headers: { Authorization: `Bearer ${companyAToken}` } }
    );
    assert(restorePrefRes.data.preferences?.sms_notifications === true, "Test 12: Restore preferences to default");

    // -------------------------------------------------------------
    // GROUP 3: APPLICATION STATUS TRIGGER & NOTIFICATION CREATION (Tests 13 - 18)
    // -------------------------------------------------------------
    console.log("\n--- GROUP 3: Application Event Triggers & Notification Life Cycle ---");

    // First ensure company A exists or register it
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        companyId: companyAId,
        companyName: "Test Company A Industries",
        email: "userA@test.com",
        pan: "ABCDE1234F"
      });
    } catch {
      // Ignored if already registered
    }

    // Test 13: Create application for Company A
    const newAppRes = await axios.post(
      `${BASE_URL}/api/applications`,
      {
        name: "Consent to Establish - Factory Expansion",
        department: "Maharashtra Pollution Control Board (MPCB)",
        category: "Environmental",
        slaDays: 21,
        status: "under_scrutiny",
        feeAmount: 15000
      },
      { headers: { Authorization: `Bearer ${companyAToken}` } }
    );
    assert(newAppRes.status === 201 && newAppRes.data.success, "Test 13: Create test application for Company A");
    testAppId = newAppRes.data.application?.id;

    // Test 14: Update application status (should trigger notification)
    const updateAppRes = await axios.put(
      `${BASE_URL}/api/applications/${testAppId}`,
      { status: "approved" },
      { headers: { Authorization: `Bearer ${companyAToken}` } }
    );
    assert(updateAppRes.status === 200 && updateAppRes.data.success, "Test 14: Update application status to 'approved'");

    // Test 15: List notifications for Company A
    const notifsRes = await axios.get(`${BASE_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(notifsRes.status === 200 && notifsRes.data.success, "Test 15: List notifications for Company A");
    assert(Array.isArray(notifsRes.data.notifications), "Test 16: Notifications returned as array");
    assert(notifsRes.data.notifications.length > 0, "Test 17: Notification created automatically from status update");

    const appNotif = notifsRes.data.notifications[0];
    createdNotificationId = appNotif?.id;
    assert(appNotif?.company_id === companyAId, "Test 18: Notification has correct company_id");

    // -------------------------------------------------------------
    // GROUP 4: NOTIFICATION INTERACTION & MARK AS READ (Tests 19 - 25)
    // -------------------------------------------------------------
    console.log("\n--- GROUP 4: Notification Reading, Pagination & Deletion ---");

    // Test 19: Get unread count
    const unreadRes = await axios.get(`${BASE_URL}/api/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(unreadRes.status === 200 && typeof unreadRes.data.unreadCount === "number", "Test 19: Get unread count returns number");
    assert(unreadRes.data.unreadCount >= 1, "Test 20: Unread count is at least 1");

    // Test 21: Get single notification by ID
    const singleNotifRes = await axios.get(`${BASE_URL}/api/notifications/${createdNotificationId}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(singleNotifRes.status === 200 && singleNotifRes.data.notification?.id === createdNotificationId, "Test 21: Get single notification by ID");
    assert(Array.isArray(singleNotifRes.data.notification?.deliveries), "Test 22: Deliveries audit trail returned in single notification view");

    // Test 23: Mark single notification as read
    const markReadRes = await axios.put(
      `${BASE_URL}/api/notifications/${createdNotificationId}/read`,
      {},
      { headers: { Authorization: `Bearer ${companyAToken}` } }
    );
    assert(markReadRes.status === 200 && markReadRes.data.notification?.is_read === true, "Test 23: Mark single notification as read");

    // Test 24: Mark all notifications as read
    const markAllRes = await axios.put(
      `${BASE_URL}/api/notifications/read-all`,
      {},
      { headers: { Authorization: `Bearer ${companyAToken}` } }
    );
    assert(markAllRes.status === 200 && markAllRes.data.success, "Test 24: Mark all notifications as read");

    // Test 25: Verify unread count is now 0
    const unreadRes2 = await axios.get(`${BASE_URL}/api/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(unreadRes2.data.unreadCount === 0, "Test 25: Unread count is 0 after mark-all-read");

    // -------------------------------------------------------------
    // GROUP 5: TENANT ISOLATION GATES (Tests 26 - 31)
    // -------------------------------------------------------------
    console.log("\n--- GROUP 5: Tenant Isolation Gates ---");

    // Test 26: Company B cannot view Company A's notification
    try {
      await axios.get(`${BASE_URL}/api/notifications/${createdNotificationId}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 26: Company B cannot view Company A's notification");
    } catch (err: any) {
      assert(err.response?.status === 404 || err.response?.status === 403, "Test 26: Cross-tenant notification read blocked (404/403)");
    }

    // Test 27: Company B cannot mark Company A's notification as read
    try {
      await axios.put(
        `${BASE_URL}/api/notifications/${createdNotificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${companyBToken}` } }
      );
      assert(false, "Test 27: Company B cannot mark Company A's notification as read");
    } catch (err: any) {
      assert(err.response?.status === 404 || err.response?.status === 403, "Test 27: Cross-tenant mark-as-read blocked (404/403)");
    }

    // Test 28: Company B cannot delete Company A's notification
    try {
      await axios.delete(`${BASE_URL}/api/notifications/${createdNotificationId}`, {
        headers: { Authorization: `Bearer ${companyBToken}` }
      });
      assert(false, "Test 28: Company B cannot delete Company A's notification");
    } catch (err: any) {
      assert(err.response?.status === 404 || err.response?.status === 403, "Test 28: Cross-tenant notification delete blocked (404/403)");
    }

    // Test 29: Company B's notifications list does NOT include Company A notifications
    const bNotifsRes = await axios.get(`${BASE_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${companyBToken}` }
    });
    const leakFound = bNotifsRes.data.notifications.some((n: any) => n.id === createdNotificationId);
    assert(!leakFound, "Test 29: Company B notification list has zero Company A notifications");

    // Test 30: Company B cannot access Company A SLA summary
    const bSlaRes = await axios.get(`${BASE_URL}/api/sla/summary`, {
      headers: { Authorization: `Bearer ${companyBToken}` }
    });
    assert(bSlaRes.data.companyId === companyBId, "Test 30: SLA summary strictly scoped to authenticated Company B");

    // Test 31: Company A deleting its own notification succeeds
    const deleteRes = await axios.delete(`${BASE_URL}/api/notifications/${createdNotificationId}`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(deleteRes.status === 200 && deleteRes.data.success, "Test 31: Company A deleting its own notification succeeds");

    // -------------------------------------------------------------
    // GROUP 6: SLA MONITORING & SERVER CALCULATION (Tests 32 - 40)
    // -------------------------------------------------------------
    console.log("\n--- GROUP 6: SLA Monitoring & Calculations ---");

    // Test 32: Query /api/sla/applications
    const slaAppsRes = await axios.get(`${BASE_URL}/api/sla/applications`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(slaAppsRes.status === 200 && slaAppsRes.data.success, "Test 32: Get /api/sla/applications returns 200");
    assert(typeof slaAppsRes.data.summary?.total === "number", "Test 33: Applications SLA summary total is number");
    assert(typeof slaAppsRes.data.summary?.breached === "number", "Test 34: Applications SLA summary breached count is number");

    // Test 35: Query /api/sla/grievances
    const slaGrievRes = await axios.get(`${BASE_URL}/api/sla/grievances`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(slaGrievRes.status === 200 && slaGrievRes.data.success, "Test 35: Get /api/sla/grievances returns 200");
    assert(typeof slaGrievRes.data.summary?.total === "number", "Test 36: Grievances SLA summary total is number");

    // Test 37: Query /api/sla/summary
    const slaSummaryRes = await axios.get(`${BASE_URL}/api/sla/summary`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(slaSummaryRes.status === 200 && slaSummaryRes.data.success, "Test 37: Get /api/sla/summary returns 200");
    assert(slaSummaryRes.data.summary?.applications !== undefined, "Test 38: SLA summary contains applications breakdown");
    assert(slaSummaryRes.data.summary?.grievances !== undefined, "Test 39: SLA summary contains grievances breakdown");
    assert(Array.isArray(slaSummaryRes.data.summary?.escalations), "Test 40: SLA summary contains escalations array");

    // -------------------------------------------------------------
    // GROUP 7: ADMIN SLA MONITORING JOB & ESCALATION ENGINE (Tests 41 - 46)
    // -------------------------------------------------------------
    console.log("\n--- GROUP 7: Administrative SLA Monitoring Job Execution ---");

    // Test 41: Regulatory Admin triggers SLA monitoring process
    const adminSlaRes = await axios.post(
      `${BASE_URL}/api/admin/sla/process`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(adminSlaRes.status === 200 && adminSlaRes.data.success, "Test 41: Admin triggers SLA monitoring job successfully");
    assert(typeof adminSlaRes.data.applicationsChecked === "number", "Test 42: Admin response includes applicationsChecked count");
    assert(typeof adminSlaRes.data.grievancesChecked === "number", "Test 43: Admin response includes grievancesChecked count");
    assert(typeof adminSlaRes.data.escalationsTriggered === "number", "Test 44: Admin response includes escalationsTriggered count");

    // Test 45: Running SLA monitoring twice does not create duplicate escalations (idempotency)
    const adminSlaRes2 = await axios.post(
      `${BASE_URL}/api/admin/sla/process`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(adminSlaRes2.status === 200 && adminSlaRes2.data.escalationsTriggered === 0, "Test 45: Consecutive SLA monitoring execution is idempotent (0 new duplicate escalations)");
    assert(adminSlaRes2.data.notificationsCreated === 0, "Test 46: Zero duplicate notifications created on second run");

    // -------------------------------------------------------------
    // GROUP 8: FILTERING & PAGINATION OF NOTIFICATIONS (Tests 47 - 52)
    // -------------------------------------------------------------
    console.log("\n--- GROUP 8: Filtering & Pagination of Notifications ---");

    // Test 47: Filter by is_read=false
    const filterUnreadRes = await axios.get(`${BASE_URL}/api/notifications?is_read=false`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(filterUnreadRes.status === 200 && filterUnreadRes.data.success, "Test 47: Filter notifications with is_read=false succeeds");

    // Test 48: Filter by is_read=true
    const filterReadRes = await axios.get(`${BASE_URL}/api/notifications?is_read=true`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(filterReadRes.status === 200 && filterReadRes.data.success, "Test 48: Filter notifications with is_read=true succeeds");

    // Test 49: Pagination limit=5
    const paginatedRes = await axios.get(`${BASE_URL}/api/notifications?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${companyAToken}` }
    });
    assert(paginatedRes.data.pagination?.limit === 5, "Test 49: Pagination limit respected");
    assert(paginatedRes.data.pagination?.page === 1, "Test 50: Pagination page number correct");

    // Test 51: Non-existent notification returns 404
    try {
      await axios.get(`${BASE_URL}/api/notifications/00000000-0000-0000-0000-000000000000`, {
        headers: { Authorization: `Bearer ${companyAToken}` }
      });
      assert(false, "Test 51: Non-existent notification returns 404");
    } catch (err: any) {
      assert(err.response?.status === 404, "Test 51: Non-existent notification returns 404");
    }

    // Test 52: Notification deletion of non-existent ID returns 404
    try {
      await axios.delete(`${BASE_URL}/api/notifications/00000000-0000-0000-0000-000000000000`, {
        headers: { Authorization: `Bearer ${companyAToken}` }
      });
      assert(false, "Test 52: Deleting non-existent notification returns 404");
    } catch (err: any) {
      assert(err.response?.status === 404, "Test 52: Deleting non-existent notification returns 404");
    }

  } catch (error: any) {
    console.error("Unexpected test failure:", error.message, error.response?.data);
  }

  console.log("\n================================================================");
  console.log(`STEP 11 TESTS FINISHED: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("================================================================");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
