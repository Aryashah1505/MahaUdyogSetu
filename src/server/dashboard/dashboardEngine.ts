import { SupabaseClient } from "@supabase/supabase-js";
import { SlaAndNotificationEngine } from "../notifications/slaEngine";

export interface CompanyDashboardSummary {
  companyProfile: {
    id: string;
    name: string;
    isProfileComplete: boolean;
    completionPercentage: number;
    sector: string;
    district: string;
    taluka: string;
  };
  applications: {
    total: number;
    active: number;
    approved: number;
    rejected: number;
    pending: number;
    requiringAction: number;
    overdue: number;
    dueSoon: number;
  };
  grievances: {
    total: number;
    open: number;
    resolved: number;
    rejected: number;
    queriesCount: number;
  };
  documents: {
    total: number;
    verified: number;
    pendingVerification: number;
    rejected: number;
    expired: number;
  };
  notifications: {
    unreadCount: number;
    recent: any[];
  };
  investments: {
    totalPlans: number;
    activePlans: number;
    totalProposedInvestmentCr: number;
  };
  recentActivity: Array<{
    id: string;
    type: "application" | "grievance" | "document" | "notification" | "investment";
    title: string;
    status: string;
    timestamp: string;
    referenceCode?: string;
  }>;
  generatedAt: string;
}

export interface AnalyticsFilter {
  from?: string;
  to?: string;
  year?: string | number;
  month?: string;
  department?: string;
  district?: string;
  sector?: string;
  category?: string;
  status?: string;
}

export class DashboardAndAnalyticsEngine {
  private supabase: SupabaseClient;
  private slaEngine: SlaAndNotificationEngine;

  constructor(supabaseClient: SupabaseClient, slaEngine?: SlaAndNotificationEngine) {
    this.supabase = supabaseClient;
    this.slaEngine = slaEngine || new SlaAndNotificationEngine(supabaseClient);
  }

  /**
   * 1. Get authenticated tenant-isolated Company Dashboard summary
   */
  public async getCompanyDashboardSummary(companyId: string): Promise<CompanyDashboardSummary> {
    const [
      companyRes,
      appsRes,
      grievRes,
      docsRes,
      notifsRes,
      unreadNotifRes,
      investRes
    ] = await Promise.all([
      this.supabase.from("companies").select("*").eq("id", companyId).maybeSingle(),
      this.supabase.from("applications").select("*").eq("company_id", companyId),
      this.supabase.from("grievances").select("*").eq("company_id", companyId),
      this.supabase.from("documents").select("*").eq("company_id", companyId),
      this.supabase.from("notifications").select("*").eq("company_id", companyId).order("created_at", { ascending: false }).limit(5),
      this.supabase.from("notifications").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("is_read", false),
      this.supabase.from("invest_plans").select("*").eq("company_id", companyId)
    ]);

    const company = companyRes.data || {
      id: companyId,
      name: "Enterprise",
      is_profile_complete: false,
      sector: "Manufacturing",
      district: "Maharashtra",
      taluka: ""
    };

    // Calculate profile completion percentage based on core required fields
    const profileFields = [
      company.name,
      company.business_type,
      company.pan,
      company.gstin,
      company.mobile,
      company.email,
      company.district,
      company.sector,
      company.investment_crores,
      company.connected_power_kw,
      company.workforce
    ];
    const filledFields = profileFields.filter(f => f !== null && f !== undefined && String(f).trim() !== "").length;
    const completionPercentage = Math.round((filledFields / profileFields.length) * 100);

    // Calculate Application Metrics
    const applications = appsRes.data || [];
    let activeApps = 0;
    let approvedApps = 0;
    let rejectedApps = 0;
    let pendingApps = 0;
    let requiringActionApps = 0;
    let overdueApps = 0;
    let dueSoonApps = 0;

    applications.forEach((app: any) => {
      const st = (app.status || "").toLowerCase().trim();
      const start = app.submitted_date || app.applied_date || app.created_at;
      const sla = this.slaEngine.calculateSlaStatus(start, app.sla_days, app.status);

      if (st === "approved") approvedApps++;
      else if (st === "rejected") rejectedApps++;
      else {
        activeApps++;
        pendingApps++;
        if (sla.isBreached) overdueApps++;
        else if (sla.isWarning || sla.isDueToday) dueSoonApps++;
      }

      // Check if queries require action or documents missing
      if (Array.isArray(app.queries) && app.queries.some((q: any) => q.status === "pending" || q.status === "open")) {
        requiringActionApps++;
      }
    });

    // Calculate Grievance Metrics
    const grievances = grievRes.data || [];
    let openGriev = 0;
    let resolvedGriev = 0;
    let rejectedGriev = 0;
    let queriesCount = 0;

    grievances.forEach((g: any) => {
      const st = (g.status || "").toLowerCase().trim();
      const type = (g.type || "").toLowerCase().trim();
      if (type === "query") queriesCount++;
      if (st === "resolved" || st === "closed") resolvedGriev++;
      else if (st === "rejected") rejectedGriev++;
      else openGriev++;
    });

    // Calculate Document Metrics
    const documents = docsRes.data || [];
    let verifiedDocs = 0;
    let pendingDocs = 0;
    let rejectedDocs = 0;
    let expiredDocs = 0;

    const now = Date.now();
    documents.forEach((d: any) => {
      const st = (d.verification_status || d.status || "").toLowerCase().trim();
      if (st === "verified") verifiedDocs++;
      else if (st === "rejected") rejectedDocs++;
      else pendingDocs++;

      if (d.expiry_date) {
        const expTime = new Date(d.expiry_date).getTime();
        if (!isNaN(expTime) && expTime < now) expiredDocs++;
      }
    });

    // Calculate Investment Metrics
    const investPlans = investRes.data || [];
    let activePlans = 0;
    let totalProposedInvestmentCr = 0;

    investPlans.forEach((p: any) => {
      const st = (p.status || "").toLowerCase().trim();
      if (st !== "archived" && st !== "discarded") activePlans++;
      totalProposedInvestmentCr += Number(p.investment_cr) || 0;
    });

    // Aggregate Recent Activity
    const activityItems: any[] = [];
    applications.slice(0, 4).forEach((a: any) => {
      activityItems.push({
        id: a.id,
        type: "application",
        title: a.name || a.code,
        status: a.status,
        timestamp: a.updated_at || a.created_at || new Date().toISOString(),
        referenceCode: a.code || a.id
      });
    });
    grievances.slice(0, 3).forEach((g: any) => {
      activityItems.push({
        id: g.id,
        type: "grievance",
        title: g.subject || "Grievance Ticket",
        status: g.status,
        timestamp: g.updated_at || g.created_at || new Date().toISOString(),
        referenceCode: g.reference_number || g.id
      });
    });
    documents.slice(0, 3).forEach((d: any) => {
      activityItems.push({
        id: d.id,
        type: "document",
        title: d.title || d.document_type || "Uploaded Document",
        status: d.verification_status || "Pending",
        timestamp: d.updated_at || d.created_at || new Date().toISOString()
      });
    });

    // Sort combined activity descending
    activityItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      companyProfile: {
        id: company.id,
        name: company.name || "Registered Enterprise",
        isProfileComplete: Boolean(company.is_profile_complete) || completionPercentage >= 85,
        completionPercentage,
        sector: company.sector || "Manufacturing",
        district: company.district || "Maharashtra",
        taluka: company.taluka || ""
      },
      applications: {
        total: applications.length,
        active: activeApps,
        approved: approvedApps,
        rejected: rejectedApps,
        pending: pendingApps,
        requiringAction: requiringActionApps,
        overdue: overdueApps,
        dueSoon: dueSoonApps
      },
      grievances: {
        total: grievances.length,
        open: openGriev,
        resolved: resolvedGriev,
        rejected: rejectedGriev,
        queriesCount
      },
      documents: {
        total: documents.length,
        verified: verifiedDocs,
        pendingVerification: pendingDocs,
        rejected: rejectedDocs,
        expired: expiredDocs
      },
      notifications: {
        unreadCount: unreadNotifRes.count || 0,
        recent: notifsRes.data || []
      },
      investments: {
        totalPlans: investPlans.length,
        activePlans,
        totalProposedInvestmentCr
      },
      recentActivity: activityItems.slice(0, 10),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * 2. Public / Aggregate Dashboard Summary (Zero PII, fully anonymized)
   */
  public async getPublicDashboardSummary(filter: AnalyticsFilter = {}): Promise<any> {
    const [
      appsRes,
      grievRes,
      companiesRes,
      investRes,
      deptsRes
    ] = await Promise.all([
      this.supabase.from("applications").select("id, status, department, category, sla_days, submitted_date, applied_date, approval_date, created_at"),
      this.supabase.from("grievances").select("id, status, category, priority, sla_days, created_at, resolved_at"),
      this.supabase.from("companies").select("id, district, sector, investment_crores, created_at"),
      this.supabase.from("invest_plans").select("id, investment_cr, industry_sector, location, created_at"),
      this.supabase.from("departments").select("id, name, code")
    ]);

    let apps = appsRes.data || [];
    let grievs = grievRes.data || [];
    let companies = companiesRes.data || [];
    let investPlans = investRes.data || [];

    // Apply date filters if requested
    if (filter.year) {
      const yr = String(filter.year);
      apps = apps.filter(a => (a.created_at || "").startsWith(yr) || (a.submitted_date || "").startsWith(yr));
      grievs = grievs.filter(g => (g.created_at || "").startsWith(yr));
      companies = companies.filter(c => (c.created_at || "").startsWith(yr));
      investPlans = investPlans.filter(p => (p.created_at || "").startsWith(yr));
    }
    if (filter.month && filter.month !== "ALL") {
      const monthMap: Record<string, string> = {
        january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
        july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
        jan: "01", feb: "02", mar: "03", apr: "04", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
      };
      const monthNum = monthMap[filter.month.toLowerCase()];
      if (monthNum) {
        apps = apps.filter(a => {
          const dt = a.created_at || a.submitted_date || "";
          return dt.length >= 7 && dt.substring(5, 7) === monthNum;
        });
        grievs = grievs.filter(g => (g.created_at || "").substring(5, 7) === monthNum);
      }
    }
    if (filter.department && filter.department !== "ALL") {
      const deptLower = filter.department.toLowerCase();
      apps = apps.filter(a => (a.department || "").toLowerCase().includes(deptLower));
    }

    // Applications aggregate metrics
    const totalApps = apps.length;
    let approved = 0;
    let rejected = 0;
    let pending = 0;
    let totalProcessingDays = 0;
    let processedCount = 0;
    let slaCompliantCount = 0;

    apps.forEach((a: any) => {
      const st = (a.status || "").toLowerCase().trim();
      const start = a.submitted_date || a.applied_date || a.created_at;
      const sla = this.slaEngine.calculateSlaStatus(start, a.sla_days, a.status);

      if (st === "approved") {
        approved++;
        if (a.approval_date && start) {
          const diffDays = Math.max(0, Math.floor((new Date(a.approval_date).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)));
          totalProcessingDays += diffDays;
          processedCount++;
          if (diffDays <= (Number(a.sla_days) || 21)) slaCompliantCount++;
        } else {
          slaCompliantCount++;
        }
      } else if (st === "rejected") {
        rejected++;
      } else {
        pending++;
        if (!sla.isBreached) slaCompliantCount++;
      }
    });

    const approvalPercentage = totalApps > 0 ? Math.round((approved / totalApps) * 10000) / 100 : 0;
    const rejectionPercentage = totalApps > 0 ? Math.round((rejected / totalApps) * 10000) / 100 : 0;
    const pendingPercentage = totalApps > 0 ? Math.round((pending / totalApps) * 10000) / 100 : 0;
    const avgProcessingDays = processedCount > 0 ? Math.round((totalProcessingDays / processedCount) * 10) / 10 : 0;
    const slaCompliancePercentage = totalApps > 0 ? Math.round((slaCompliantCount / totalApps) * 10000) / 100 : 100;

    // Grievances aggregate metrics
    const totalGrievances = grievs.length;
    let resolvedGrievances = 0;
    grievs.forEach((g: any) => {
      const st = (g.status || "").toLowerCase().trim();
      if (st === "resolved" || st === "closed") resolvedGrievances++;
    });
    const grievanceResolutionRate = totalGrievances > 0 ? Math.round((resolvedGrievances / totalGrievances) * 10000) / 100 : 0;

    // Investment aggregate metrics
    const totalProposedInvestmentCr = investPlans.reduce((sum, p) => sum + (Number(p.investment_cr) || 0), 0);

    return {
      overview: {
        totalApplications: totalApps,
        approvedApplications: approved,
        rejectedApplications: rejected,
        pendingApplications: pending,
        approvalPercentage,
        rejectionPercentage,
        pendingPercentage,
        avgProcessingDays,
        slaCompliancePercentage,
        overduePercentage: Math.max(0, Math.round((100 - slaCompliancePercentage) * 100) / 100),
        registeredEnterprises: companies.length,
        totalGrievances,
        resolvedGrievances,
        grievanceResolutionRate,
        totalInvestmentPlans: investPlans.length,
        totalProposedInvestmentCr
      },
      departmentsCount: deptsRes.data?.length || 0,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * 3. Department Analytics Aggregation (Zero PII)
   */
  public async getDepartmentAnalytics(): Promise<any[]> {
    const [appsRes, deptsRes] = await Promise.all([
      this.supabase.from("applications").select("id, department, status, sla_days, submitted_date, applied_date, approval_date, created_at"),
      this.supabase.from("departments").select("id, name, code")
    ]);

    const apps = appsRes.data || [];
    const depts = deptsRes.data || [];

    const deptMap = new Map<string, any>();

    // Seed official departments
    depts.forEach((d: any) => {
      deptMap.set(d.name, {
        id: d.id,
        name: d.name,
        code: d.code,
        totalApplications: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        totalDays: 0,
        processedCount: 0,
        slaCompliantCount: 0
      });
    });

    apps.forEach((a: any) => {
      const deptName = a.department || "Other";
      if (!deptMap.has(deptName)) {
        deptMap.set(deptName, {
          id: `DEPT-${deptName.substring(0, 4).toUpperCase()}`,
          name: deptName,
          code: deptName.substring(0, 6).toUpperCase(),
          totalApplications: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          totalDays: 0,
          processedCount: 0,
          slaCompliantCount: 0
        });
      }

      const d = deptMap.get(deptName)!;
      d.totalApplications++;
      const st = (a.status || "").toLowerCase().trim();
      const start = a.submitted_date || a.applied_date || a.created_at;

      if (st === "approved") {
        d.approved++;
        if (a.approval_date && start) {
          const diff = Math.max(0, Math.floor((new Date(a.approval_date).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)));
          d.totalDays += diff;
          d.processedCount++;
          if (diff <= (Number(a.sla_days) || 21)) d.slaCompliantCount++;
        } else {
          d.slaCompliantCount++;
        }
      } else if (st === "rejected") {
        d.rejected++;
      } else {
        d.pending++;
        const sla = this.slaEngine.calculateSlaStatus(start, a.sla_days, a.status);
        if (!sla.isBreached) d.slaCompliantCount++;
      }
    });

    return Array.from(deptMap.values()).map(d => ({
      id: d.id,
      name: d.name,
      code: d.code,
      applicationsCount: d.totalApplications,
      approvedCount: d.approved,
      rejectedCount: d.rejected,
      pendingCount: d.pending,
      avgProcessingDays: d.processedCount > 0 ? Math.round((d.totalDays / d.processedCount) * 10) / 10 : 0,
      slaComplianceRate: d.totalApplications > 0 ? Math.round((d.slaCompliantCount / d.totalApplications) * 10000) / 100 : 100
    }));
  }

  /**
   * 4. District Analytics Aggregation (Zero PII)
   */
  public async getDistrictAnalytics(): Promise<any[]> {
    const [companiesRes, appsRes] = await Promise.all([
      this.supabase.from("companies").select("id, district, sector, investment_crores"),
      this.supabase.from("applications").select("id, company_id, status")
    ]);

    const companies = companiesRes.data || [];
    const apps = appsRes.data || [];

    // Map company to district
    const compToDist = new Map<string, string>();
    companies.forEach((c: any) => {
      compToDist.set(c.id, c.district || "Maharashtra");
    });

    const districtMap = new Map<string, any>();

    companies.forEach((c: any) => {
      const dist = c.district || "Maharashtra";
      if (!districtMap.has(dist)) {
        districtMap.set(dist, {
          district: dist,
          unitsCount: 0,
          applicationsCount: 0,
          approvedCount: 0,
          pendingCount: 0,
          proposedInvestmentCr: 0,
          sectors: new Set<string>()
        });
      }
      const item = districtMap.get(dist)!;
      item.unitsCount++;
      item.proposedInvestmentCr += Number(c.investment_crores) || 0;
      if (c.sector) item.sectors.add(c.sector);
    });

    apps.forEach((a: any) => {
      const dist = compToDist.get(a.company_id) || "Maharashtra";
      if (!districtMap.has(dist)) {
        districtMap.set(dist, {
          district: dist,
          unitsCount: 0,
          applicationsCount: 0,
          approvedCount: 0,
          pendingCount: 0,
          proposedInvestmentCr: 0,
          sectors: new Set<string>()
        });
      }
      const item = districtMap.get(dist)!;
      item.applicationsCount++;
      const st = (a.status || "").toLowerCase().trim();
      if (st === "approved") item.approvedCount++;
      else if (st !== "rejected") item.pendingCount++;
    });

    return Array.from(districtMap.values()).map(d => ({
      district: d.district,
      unitsCount: d.unitsCount,
      applicationsCount: d.applicationsCount,
      approvedCount: d.approvedCount,
      pendingCount: d.pendingCount,
      proposedInvestmentCr: Math.round(d.proposedInvestmentCr * 100) / 100,
      topSectors: Array.from(d.sectors as Set<string>)
    }));
  }

  /**
   * 5. Sector Analytics Aggregation (Zero PII)
   */
  public async getSectorAnalytics(): Promise<any[]> {
    const [companiesRes, appsRes, investRes] = await Promise.all([
      this.supabase.from("companies").select("id, sector, investment_crores"),
      this.supabase.from("applications").select("id, company_id, status"),
      this.supabase.from("invest_plans").select("id, industry_sector, investment_cr")
    ]);

    const companies = companiesRes.data || [];
    const apps = appsRes.data || [];
    const investPlans = investRes.data || [];

    const compToSector = new Map<string, string>();
    companies.forEach((c: any) => {
      compToSector.set(c.id, c.sector || "General Manufacturing");
    });

    const sectorMap = new Map<string, any>();

    const getSectorRecord = (secName: string) => {
      const clean = secName || "General Manufacturing";
      if (!sectorMap.has(clean)) {
        sectorMap.set(clean, {
          sector: clean,
          enterprisesCount: 0,
          applicationsCount: 0,
          approvedCount: 0,
          pendingCount: 0,
          proposedInvestmentCr: 0
        });
      }
      return sectorMap.get(clean)!;
    };

    companies.forEach((c: any) => {
      const s = getSectorRecord(c.sector);
      s.enterprisesCount++;
      s.proposedInvestmentCr += Number(c.investment_crores) || 0;
    });

    apps.forEach((a: any) => {
      const sec = compToSector.get(a.company_id) || "General Manufacturing";
      const s = getSectorRecord(sec);
      s.applicationsCount++;
      const st = (a.status || "").toLowerCase().trim();
      if (st === "approved") s.approvedCount++;
      else if (st !== "rejected") s.pendingCount++;
    });

    investPlans.forEach((p: any) => {
      const s = getSectorRecord(p.industry_sector);
      s.proposedInvestmentCr += Number(p.investment_cr) || 0;
    });

    const totalApps = apps.length || 1;

    return Array.from(sectorMap.values()).map(s => ({
      sector: s.sector,
      enterprisesCount: s.enterprisesCount,
      applicationsCount: s.applicationsCount,
      approvedCount: s.approvedCount,
      pendingCount: s.pendingCount,
      proposedInvestmentCr: Math.round(s.proposedInvestmentCr * 100) / 100,
      sharePercent: Math.round((s.applicationsCount / totalApps) * 10000) / 100
    }));
  }

  /**
   * 6. Grievance Analytics Aggregation (Zero PII)
   */
  public async getGrievanceAnalytics(): Promise<any> {
    const { data: grievances } = await this.supabase.from("grievances").select("id, category, priority, status, sla_days, created_at, resolved_at");
    const list = grievances || [];

    const categoryMap: Record<string, number> = {};
    const priorityMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};

    let totalResolvedDays = 0;
    let resolvedCount = 0;

    list.forEach((g: any) => {
      const cat = g.category || "General / Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;

      const prio = g.priority || "Medium";
      priorityMap[prio] = (priorityMap[prio] || 0) + 1;

      const st = g.status || "submitted";
      statusMap[st] = (statusMap[st] || 0) + 1;

      if ((st === "resolved" || st === "closed") && g.resolved_at && g.created_at) {
        const days = Math.max(0, Math.floor((new Date(g.resolved_at).getTime() - new Date(g.created_at).getTime()) / (1000 * 60 * 60 * 24)));
        totalResolvedDays += days;
        resolvedCount++;
      }
    });

    return {
      totalGrievances: list.length,
      categories: categoryMap,
      priorities: priorityMap,
      statuses: statusMap,
      avgResolutionDays: resolvedCount > 0 ? Math.round((totalResolvedDays / resolvedCount) * 10) / 10 : 0,
      resolutionRate: list.length > 0 ? Math.round(((statusMap["resolved"] || 0) + (statusMap["closed"] || 0)) / list.length * 10000) / 100 : 0
    };
  }

  /**
   * 7. Generate CSV Data String for Export
   */
  public generateCsv(headers: string[], rows: any[][]): string {
    const escapeVal = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headerLine = headers.map(escapeVal).join(",");
    const bodyLines = rows.map(r => r.map(escapeVal).join(","));
    return [headerLine, ...bodyLines].join("\n");
  }
}
