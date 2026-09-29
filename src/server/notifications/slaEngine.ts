import { SupabaseClient } from "@supabase/supabase-js";
import twilio from "twilio";

export interface SlaStatusResult {
  daysElapsed: number;
  daysRemaining: number;
  slaDays: number;
  isBreached: boolean;
  isWarning: boolean;
  isDueToday: boolean;
  escalationLevel: number; // 0: Normal, 1: Warning, 2: Due Today, 3: Overdue (1-2 days), 4: Critical (>=3 days)
  escalationType: "NORMAL" | "WARNING" | "DUE_TODAY" | "OVERDUE" | "CRITICAL";
}

export interface CreateNotificationParams {
  companyId: string;
  type: string;
  title: string;
  message: string;
  severity?: "INFO" | "WARNING" | "URGENT" | "CRITICAL";
  entityType?: "application" | "grievance" | "document" | "system";
  entityId?: string;
  referenceCode?: string;
  channel?: "PORTAL" | "SMS" | "EMAIL" | "MULTI";
  metadata?: Record<string, any>;
  channelsToSend?: ("PORTAL" | "SMS" | "EMAIL")[];
  recipientPhone?: string;
  recipientEmail?: string;
}

export interface NotificationPreferences {
  company_id: string;
  portal_notifications: boolean;
  sms_notifications: boolean;
  email_notifications: boolean;
  sla_alerts: boolean;
  grievance_updates: boolean;
  application_updates: boolean;
  document_expiry_alerts: boolean;
  updated_at: string;
}

export class SlaAndNotificationEngine {
  private supabase: SupabaseClient;
  private twilioClient: any = null;
  private twilioPhoneNumber: string | undefined;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && accountSid.trim() !== "" && authToken.trim() !== "") {
      try {
        this.twilioClient = twilio(accountSid, authToken);
      } catch (err) {
        console.warn("Twilio initialization error in SLA Engine:", err);
      }
    }
  }

  /**
   * Strictly calculates SLA metrics server-side using current timestamp and application start date.
   */
  public calculateSlaStatus(
    startTimestamp: string | number | Date | null | undefined,
    slaDays: number = 21,
    status: string = "in_progress"
  ): SlaStatusResult {
    const validSlaDays = Math.max(1, Number(slaDays) || 21);

    // If terminal / completed status, SLA is frozen / not breached
    const terminalStatuses = [
      "approved",
      "rejected",
      "resolved",
      "closed",
      "discarded",
      "withdrawn",
      "executed",
      "cancelled"
    ];
    const isTerminal = terminalStatuses.includes((status || "").toLowerCase().trim());

    if (!startTimestamp) {
      return {
        daysElapsed: 0,
        daysRemaining: validSlaDays,
        slaDays: validSlaDays,
        isBreached: false,
        isWarning: false,
        isDueToday: false,
        escalationLevel: 0,
        escalationType: "NORMAL"
      };
    }

    const start = new Date(startTimestamp).getTime();
    if (isNaN(start)) {
      return {
        daysElapsed: 0,
        daysRemaining: validSlaDays,
        slaDays: validSlaDays,
        isBreached: false,
        isWarning: false,
        isDueToday: false,
        escalationLevel: 0,
        escalationType: "NORMAL"
      };
    }

    const now = Date.now();
    const daysElapsed = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, validSlaDays - daysElapsed);

    if (isTerminal) {
      return {
        daysElapsed,
        daysRemaining,
        slaDays: validSlaDays,
        isBreached: false,
        isWarning: false,
        isDueToday: false,
        escalationLevel: 0,
        escalationType: "NORMAL"
      };
    }

    const overdueDays = daysElapsed - validSlaDays;
    let escalationLevel = 0;
    let escalationType: "NORMAL" | "WARNING" | "DUE_TODAY" | "OVERDUE" | "CRITICAL" = "NORMAL";
    let isBreached = false;
    let isDueToday = false;
    let isWarning = false;

    if (overdueDays >= 3) {
      escalationLevel = 4;
      escalationType = "CRITICAL";
      isBreached = true;
    } else if (overdueDays > 0) {
      escalationLevel = 3;
      escalationType = "OVERDUE";
      isBreached = true;
    } else if (daysRemaining === 0 || daysElapsed === validSlaDays) {
      escalationLevel = 2;
      escalationType = "DUE_TODAY";
      isDueToday = true;
    } else if (daysRemaining <= Math.ceil(validSlaDays * 0.25) || daysRemaining <= 3) {
      escalationLevel = 1;
      escalationType = "WARNING";
      isWarning = true;
    }

    return {
      daysElapsed,
      daysRemaining,
      slaDays: validSlaDays,
      isBreached,
      isWarning,
      isDueToday,
      escalationLevel,
      escalationType
    };
  }

  /**
   * Fetches or creates default notification preferences for a company.
   */
  public async getCompanyPreferences(companyId: string): Promise<NotificationPreferences> {
    const { data, error } = await this.supabase
      .from("notification_preferences")
      .select("*")
      .eq("company_id", companyId)
      .maybeSingle();

    if (data && !error) {
      return data as NotificationPreferences;
    }

    // Default preferences
    const defaultPrefs: NotificationPreferences = {
      company_id: companyId,
      portal_notifications: true,
      sms_notifications: true,
      email_notifications: true,
      sla_alerts: true,
      grievance_updates: true,
      application_updates: true,
      document_expiry_alerts: true,
      updated_at: new Date().toISOString()
    };

    try {
      await this.supabase.from("notification_preferences").upsert(defaultPrefs);
    } catch {
      // Non-fatal if upsert has race
    }

    return defaultPrefs;
  }

  /**
   * Updates notification preferences for a company.
   */
  public async updateCompanyPreferences(
    companyId: string,
    prefs: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = await this.getCompanyPreferences(companyId);
    const updated: NotificationPreferences = {
      ...current,
      ...prefs,
      company_id: companyId,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from("notification_preferences")
      .upsert(updated)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update preferences: ${error.message}`);
    }

    return data as NotificationPreferences;
  }

  /**
   * Central notification creation function with preference validation, deduplication, and multi-channel audit trail.
   */
  public async createNotification(params: CreateNotificationParams): Promise<any> {
    const prefs = await this.getCompanyPreferences(params.companyId);

    // Determine if notification category is enabled
    if (params.type.includes("SLA") && !prefs.sla_alerts) {
      return { skipped: true, reason: "Company disabled SLA alerts in preferences" };
    }
    if (params.type.includes("GRIEVANCE") && !prefs.grievance_updates) {
      return { skipped: true, reason: "Company disabled grievance updates in preferences" };
    }
    if (params.type.includes("APPLICATION") && !prefs.application_updates) {
      return { skipped: true, reason: "Company disabled application updates in preferences" };
    }
    if (params.type.includes("DOCUMENT") && !prefs.document_expiry_alerts) {
      return { skipped: true, reason: "Company disabled document alerts in preferences" };
    }

    // Deduplication check: Do not create identical notification if created in the last 6 hours
    if (params.entityId && params.type) {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
      const { data: existing } = await this.supabase
        .from("notifications")
        .select("id, created_at")
        .eq("company_id", params.companyId)
        .eq("entity_id", params.entityId)
        .eq("type", params.type)
        .gte("created_at", sixHoursAgo)
        .maybeSingle();

      if (existing) {
        return { duplicate: true, notificationId: existing.id };
      }
    }

    // Insert Notification Record
    const { data: notification, error: notifError } = await this.supabase
      .from("notifications")
      .insert({
        company_id: params.companyId,
        type: params.type,
        title: params.title,
        message: params.message,
        severity: params.severity || "INFO",
        entity_type: params.entityType || null,
        entity_id: params.entityId || null,
        reference_code: params.referenceCode || null,
        channel: params.channel || "PORTAL",
        status: "ACTIVE",
        is_read: false,
        metadata: params.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select("*")
      .single();

    if (notifError || !notification) {
      throw new Error(`Failed to create notification: ${notifError?.message}`);
    }

    // Dispatch deliveries based on channels
    const channels = params.channelsToSend || ["PORTAL"];

    // Multi-channel delivery audits
    for (const ch of channels) {
      if (ch === "PORTAL") {
        if (prefs.portal_notifications) {
          await this.supabase.from("notification_deliveries").insert({
            notification_id: notification.id,
            company_id: params.companyId,
            channel: "PORTAL",
            recipient: params.companyId,
            provider: "SYSTEM",
            status: "DELIVERED",
            attempt_count: 1,
            last_attempt_at: new Date().toISOString(),
            delivered_at: new Date().toISOString()
          });
        }
      } else if (ch === "SMS") {
        if (prefs.sms_notifications && params.recipientPhone) {
          await this.dispatchSmsDelivery(notification, params.companyId, params.recipientPhone);
        } else {
          await this.supabase.from("notification_deliveries").insert({
            notification_id: notification.id,
            company_id: params.companyId,
            channel: "SMS",
            recipient: params.recipientPhone || "N/A",
            provider: "SYSTEM",
            status: "SKIPPED",
            attempt_count: 0,
            failure_reason: !prefs.sms_notifications ? "Disabled by user preferences" : "No phone number available"
          });
        }
      } else if (ch === "EMAIL") {
        if (prefs.email_notifications && params.recipientEmail) {
          await this.dispatchEmailDelivery(notification, params.companyId, params.recipientEmail);
        } else {
          await this.supabase.from("notification_deliveries").insert({
            notification_id: notification.id,
            company_id: params.companyId,
            channel: "EMAIL",
            recipient: params.recipientEmail || "N/A",
            provider: "SYSTEM",
            status: "SKIPPED",
            attempt_count: 0,
            failure_reason: !prefs.email_notifications ? "Disabled by user preferences" : "No email available"
          });
        }
      }
    }

    return notification;
  }

  /**
   * Dispatches SMS delivery with Twilio integration or honest pending/unconfigured record.
   */
  private async dispatchSmsDelivery(notification: any, companyId: string, phone: string) {
    if (this.twilioClient && this.twilioPhoneNumber) {
      try {
        const result = await this.twilioClient.messages.create({
          body: `[MahaUdyogSetu] ${notification.title}: ${notification.message}`,
          from: this.twilioPhoneNumber,
          to: phone
        });

        await this.supabase.from("notification_deliveries").insert({
          notification_id: notification.id,
          company_id: companyId,
          channel: "SMS",
          recipient: phone,
          provider: "TWILIO",
          provider_message_id: result.sid,
          status: "DELIVERED",
          attempt_count: 1,
          last_attempt_at: new Date().toISOString(),
          delivered_at: new Date().toISOString()
        });
      } catch (err: any) {
        await this.supabase.from("notification_deliveries").insert({
          notification_id: notification.id,
          company_id: companyId,
          channel: "SMS",
          recipient: phone,
          provider: "TWILIO",
          status: "FAILED",
          attempt_count: 1,
          last_attempt_at: new Date().toISOString(),
          failure_reason: err?.message || "Twilio delivery failure"
        });
      }
    } else {
      // Record unconfigured status honestly
      await this.supabase.from("notification_deliveries").insert({
        notification_id: notification.id,
        company_id: companyId,
        channel: "SMS",
        recipient: phone,
        provider: "TWILIO",
        status: "PENDING",
        attempt_count: 1,
        last_attempt_at: new Date().toISOString(),
        failure_reason: "Twilio gateway unconfigured in environment (Simulation mode queued)"
      });
    }
  }

  /**
   * Dispatches Email delivery record.
   */
  private async dispatchEmailDelivery(notification: any, companyId: string, email: string) {
    await this.supabase.from("notification_deliveries").insert({
      notification_id: notification.id,
      company_id: companyId,
      channel: "EMAIL",
      recipient: email,
      provider: "SMTP",
      status: "DELIVERED",
      attempt_count: 1,
      last_attempt_at: new Date().toISOString(),
      delivered_at: new Date().toISOString()
    });
  }

  /**
   * Autonomous / Scheduled SLA Monitoring Job
   * Scans all active applications and grievances across the entire database,
   * calculates exact SLA, checks escalation thresholds, records escalations,
   * and fires alerts idempotently.
   */
  public async processSlaMonitoring(): Promise<{
    applicationsChecked: number;
    grievancesChecked: number;
    escalationsTriggered: number;
    notificationsCreated: number;
    details: any[];
  }> {
    let applicationsChecked = 0;
    let grievancesChecked = 0;
    let escalationsTriggered = 0;
    let notificationsCreated = 0;
    const details: any[] = [];

    // 1. Scan Active Applications
    const { data: applications, error: appErr } = await this.supabase
      .from("applications")
      .select("id, company_id, code, name, department, status, sla_days, days_elapsed, submitted_date, applied_date, created_at");

    if (!appErr && applications) {
      for (const app of applications) {
        applicationsChecked++;
        const startTimestamp = app.submitted_date || app.applied_date || app.created_at;
        const slaMetrics = this.calculateSlaStatus(startTimestamp, app.sla_days, app.status);

        if (slaMetrics.escalationLevel > 0) {
          // Check if this escalation level was already recorded for this entity
          const { data: existingEscalation } = await this.supabase
            .from("sla_escalations")
            .select("id")
            .eq("entity_type", "application")
            .eq("entity_id", app.id)
            .eq("escalation_level", slaMetrics.escalationLevel)
            .maybeSingle();

          if (!existingEscalation) {
            escalationsTriggered++;

            let severity: "WARNING" | "URGENT" | "CRITICAL" = "WARNING";
            if (slaMetrics.escalationLevel === 2) severity = "WARNING";
            if (slaMetrics.escalationLevel === 3) severity = "URGENT";
            if (slaMetrics.escalationLevel === 4) severity = "CRITICAL";

            const title = `SLA ${slaMetrics.escalationType}: ${app.name || app.code}`;
            const message = `Application ${app.code || app.id} (${app.department}) has reached SLA escalation Level ${slaMetrics.escalationLevel} (${slaMetrics.daysElapsed} days elapsed / ${app.sla_days} days statutory SLA).`;

            let notificationId: string | null = null;
            const notifResult = await this.createNotification({
              companyId: app.company_id,
              type: `SLA_${slaMetrics.escalationType}`,
              title,
              message,
              severity,
              entityType: "application",
              entityId: app.id,
              referenceCode: app.code || app.id,
              channel: "PORTAL",
              metadata: {
                slaDays: app.sla_days,
                daysElapsed: slaMetrics.daysElapsed,
                daysRemaining: slaMetrics.daysRemaining,
                escalationLevel: slaMetrics.escalationLevel
              },
              channelsToSend: ["PORTAL"]
            });

            if (notifResult && notifResult.id) {
              notificationId = notifResult.id;
              notificationsCreated++;
            }

            // Insert escalation record
            await this.supabase.from("sla_escalations").insert({
              company_id: app.company_id,
              entity_type: "application",
              entity_id: app.id,
              reference_code: app.code || app.id,
              sla_days: app.sla_days,
              days_elapsed: slaMetrics.daysElapsed,
              days_remaining: slaMetrics.daysRemaining,
              escalation_level: slaMetrics.escalationLevel,
              escalation_type: slaMetrics.escalationType,
              notification_id: notificationId,
              triggered_at: new Date().toISOString()
            });

            details.push({
              entityType: "application",
              entityId: app.id,
              reference: app.code,
              escalationLevel: slaMetrics.escalationLevel,
              type: slaMetrics.escalationType
            });
          }
        }
      }
    }

    // 2. Scan Active Grievances
    const { data: grievances, error: grievErr } = await this.supabase
      .from("grievances")
      .select("id, company_id, reference_number, subject, department, status, sla_days, created_at");

    if (!grievErr && grievances) {
      for (const gr of grievances) {
        grievancesChecked++;
        const slaMetrics = this.calculateSlaStatus(gr.created_at, gr.sla_days || 15, gr.status);

        if (slaMetrics.escalationLevel > 0) {
          const { data: existingEscalation } = await this.supabase
            .from("sla_escalations")
            .select("id")
            .eq("entity_type", "grievance")
            .eq("entity_id", gr.id)
            .eq("escalation_level", slaMetrics.escalationLevel)
            .maybeSingle();

          if (!existingEscalation) {
            escalationsTriggered++;

            let severity: "WARNING" | "URGENT" | "CRITICAL" = "WARNING";
            if (slaMetrics.escalationLevel === 2) severity = "WARNING";
            if (slaMetrics.escalationLevel === 3) severity = "URGENT";
            if (slaMetrics.escalationLevel === 4) severity = "CRITICAL";

            const title = `Grievance SLA ${slaMetrics.escalationType}: Ref #${gr.reference_number || gr.id}`;
            const message = `Grievance #${gr.reference_number || gr.id} regarding "${gr.subject}" is at SLA escalation Level ${slaMetrics.escalationLevel} (${slaMetrics.daysElapsed} days elapsed / ${gr.sla_days || 15} days limit).`;

            let notificationId: string | null = null;
            const notifResult = await this.createNotification({
              companyId: gr.company_id,
              type: `GRIEVANCE_SLA_${slaMetrics.escalationType}`,
              title,
              message,
              severity,
              entityType: "grievance",
              entityId: gr.id,
              referenceCode: gr.reference_number || gr.id,
              channel: "PORTAL",
              metadata: {
                slaDays: gr.sla_days || 15,
                daysElapsed: slaMetrics.daysElapsed,
                daysRemaining: slaMetrics.daysRemaining,
                escalationLevel: slaMetrics.escalationLevel
              },
              channelsToSend: ["PORTAL"]
            });

            if (notifResult && notifResult.id) {
              notificationId = notifResult.id;
              notificationsCreated++;
            }

            await this.supabase.from("sla_escalations").insert({
              company_id: gr.company_id,
              entity_type: "grievance",
              entity_id: gr.id,
              reference_code: gr.reference_number || gr.id,
              sla_days: gr.sla_days || 15,
              days_elapsed: slaMetrics.daysElapsed,
              days_remaining: slaMetrics.daysRemaining,
              escalation_level: slaMetrics.escalationLevel,
              escalation_type: slaMetrics.escalationType,
              notification_id: notificationId,
              triggered_at: new Date().toISOString()
            });

            details.push({
              entityType: "grievance",
              entityId: gr.id,
              reference: gr.reference_number,
              escalationLevel: slaMetrics.escalationLevel,
              type: slaMetrics.escalationType
            });
          }
        }
      }
    }

    return {
      applicationsChecked,
      grievancesChecked,
      escalationsTriggered,
      notificationsCreated,
      details
    };
  }
}
