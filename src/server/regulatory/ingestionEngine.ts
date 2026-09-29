import { createClient, SupabaseClient } from "@supabase/supabase-js";

// =========================================================================
// AUTHORITATIVE DOMAINS & SOURCE TYPES
// =========================================================================

export const AUTHORITATIVE_DOMAINS = [
  "maharashtra.gov.in",
  "gov.in",
  "nic.in",
  "mpcb.gov.in",
  "midcindia.org",
  "dish.maharashtra.gov.in",
  "mahafireservice.gov.in",
  "mahadiscom.in",
  "cpcb.nic.in",
  "moef.gov.in",
  "peso.gov.in",
  "eia.nic.in",
  "labour.gov.in",
  "msedcl.in"
];

export const ALLOWED_SOURCE_TYPES = [
  "Government Portal",
  "Department Portal",
  "Official Notification",
  "Act",
  "Rule",
  "Regulation",
  "Circular",
  "Government Resolution",
  "Official PDF",
  "Official Service Portal",
  "Official API",
  "Other Official Source"
];

// Department Canonical Map
export const DEPARTMENT_CANONICAL_MAP: Record<string, { id: string; name: string; authority: string }> = {
  "mpcb": { id: "DEPT-MPCB", name: "Maharashtra Pollution Control Board", authority: "Member Secretary, MPCB" },
  "pollution control": { id: "DEPT-MPCB", name: "Maharashtra Pollution Control Board", authority: "Member Secretary, MPCB" },
  "dish": { id: "DEPT-DISH", name: "Directorate of Industrial Safety and Health", authority: "Director, DISH Maharashtra" },
  "factory inspectorate": { id: "DEPT-DISH", name: "Directorate of Industrial Safety and Health", authority: "Director, DISH Maharashtra" },
  "midc": { id: "DEPT-MIDC", name: "Maharashtra Industrial Development Corporation", authority: "Chief Executive Officer, MIDC" },
  "fire": { id: "DEPT-FIRE", name: "Maharashtra Fire Services & MIDC Fire Dept", authority: "Director, Fire & Emergency Services" },
  "msedcl": { id: "DEPT-MSEDCL", name: "Maharashtra State Electricity Distribution Co.", authority: "Chief Engineer, MSEDCL" },
  "electricity": { id: "DEPT-MSEDCL", name: "Maharashtra State Electricity Distribution Co.", authority: "Chief Engineer, MSEDCL" },
  "seiaa": { id: "DEPT-SEIAA", name: "State Level Environment Impact Assessment Authority", authority: "Chairman, SEIAA Maharashtra" },
  "environment clearance": { id: "DEPT-SEIAA", name: "State Level Environment Impact Assessment Authority", authority: "Chairman, SEIAA Maharashtra" },
  "labour": { id: "DEPT-LABOUR", name: "Office of the Labour Commissioner, Maharashtra", authority: "Labour Commissioner, Maharashtra" },
  "labor": { id: "DEPT-LABOUR", name: "Office of the Labour Commissioner, Maharashtra", authority: "Labour Commissioner, Maharashtra" }
};

// =========================================================================
// TYPES & INTERFACES
// =========================================================================

export interface CandidateSource {
  id?: string;
  title: string;
  sourceType: string;
  department: string;
  officialUrl?: string;
  documentUrl?: string;
  notes?: string;
}

export interface CandidateApproval {
  id?: string;
  code: string;
  name: string;
  departmentId?: string;
  departmentName?: string;
  category: string;
  description?: string;
  authority?: string;
  applicability?: string;
  eligibility?: string;
  documents?: string[];
  applicationProcess?: string;
  officialUrl?: string;
  fee?: string | null;
  timeline?: string | null;
  renewalRequired?: boolean;
  validity?: string | null;
  legalBasis?: string;
  sourceId?: string;
  industryMappings?: {
    industryId: string;
    applicabilityType: "Mandatory" | "Conditional" | "May Apply" | "Not Applicable";
    priority?: number;
    notes?: string;
  }[];
  steps?: {
    stepNumber: number;
    stepName: string;
    description?: string;
    officialUrl?: string;
  }[];
  rules?: {
    conditionType: string;
    conditionOperator: string;
    conditionValue: any;
    outcome: string;
    priority?: number;
    explanation: string;
  }[];
}

export interface IngestionPreviewResult {
  source: {
    valid: boolean;
    source: CandidateSource;
    errors: string[];
    warnings: string[];
    isAuthoritative: boolean;
  };
  approvals: {
    candidate: CandidateApproval;
    classification: "NEW_RECORD" | "EXISTING_RECORD" | "POSSIBLE_DUPLICATE" | "CONFLICT_REQUIRES_REVIEW";
    matchedApprovalId?: string;
    confidenceScore: number;
    changedFields: string[];
    validation: {
      valid: boolean;
      errors: string[];
      warnings: string[];
    };
  }[];
  summary: {
    total: number;
    newRecords: number;
    existingUnchanged: number;
    changedRecords: number;
    duplicates: number;
    conflicts: number;
    validationErrorsCount: number;
  };
}

// =========================================================================
// NORMALIZATION HELPERS
// =========================================================================

export function normalizeWhitespace(str?: string | null): string {
  if (!str) return "";
  return str.replace(/\s+/g, " ").trim();
}

export function normalizeNameForMatching(name: string): string {
  return normalizeWhitespace(name)
    .toLowerCase()
    .replace(/licence/g, "license")
    .replace(/licensing/g, "license")
    .replace(/clearance/g, "approval")
    .replace(/permission/g, "approval")
    .replace(/certificate/g, "cert")
    .replace(/[^a-z0-9]/g, "");
}

export function calculateSimilarity(strA: string, strB: string): number {
  const normA = normalizeNameForMatching(strA);
  const normB = normalizeNameForMatching(strB);
  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0;

  // Jaccard-like bigram similarity
  const getBigrams = (s: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) {
      bigrams.add(s.slice(i, i + 2));
    }
    return bigrams;
  };

  const bgA = getBigrams(normA);
  const bgB = getBigrams(normB);
  if (bgA.size === 0 || bgB.size === 0) return 0;

  let intersection = 0;
  for (const item of bgA) {
    if (bgB.has(item)) intersection++;
  }
  return (2 * intersection) / (bgA.size + bgB.size);
}

// =========================================================================
// SOURCE VALIDATION
// =========================================================================

export function validateOfficialSource(source: CandidateSource): {
  valid: boolean;
  isAuthoritative: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!source.title || normalizeWhitespace(source.title).length < 5) {
    errors.push("Source title must be at least 5 characters.");
  }

  if (!source.sourceType || !ALLOWED_SOURCE_TYPES.includes(source.sourceType)) {
    errors.push(`Invalid source type '${source.sourceType}'. Allowed types: ${ALLOWED_SOURCE_TYPES.join(", ")}`);
  }

  if (!source.department || normalizeWhitespace(source.department).length < 2) {
    errors.push("Department is mandatory for official regulatory data source.");
  }

  let isAuthoritative = false;
  if (source.officialUrl) {
    try {
      const url = new URL(source.officialUrl);
      const host = url.hostname.toLowerCase();
      isAuthoritative = AUTHORITATIVE_DOMAINS.some(d => host === d || host.endsWith(`.${d}`));
      if (!isAuthoritative) {
        warnings.push(`Domain '${host}' is not on the primary authoritative government domains whitelist.`);
      }
    } catch {
      errors.push("Invalid official URL format.");
    }
  } else {
    warnings.push("Official source URL not supplied. Verification will require document reference.");
  }

  return {
    valid: errors.length === 0,
    isAuthoritative,
    errors,
    warnings
  };
}

// =========================================================================
// CANDIDATE APPROVAL QUALITY VALIDATION
// =========================================================================

export function validateCandidateApproval(
  approval: CandidateApproval,
  departments: any[] = []
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!approval.name || normalizeWhitespace(approval.name).length < 4) {
    errors.push("Approval name is mandatory and must be descriptive.");
  }

  if (!approval.code || normalizeWhitespace(approval.code).length < 3) {
    errors.push("Approval code is mandatory.");
  }

  // Department check
  let resolvedDeptId = approval.departmentId;
  if (!resolvedDeptId && approval.departmentName) {
    const lower = approval.departmentName.toLowerCase();
    for (const [key, val] of Object.entries(DEPARTMENT_CANONICAL_MAP)) {
      if (lower.includes(key)) {
        resolvedDeptId = val.id;
        break;
      }
    }
  }

  if (resolvedDeptId && departments.length > 0) {
    const exists = departments.some(d => d.id === resolvedDeptId);
    if (!exists) {
      warnings.push(`Department ID '${resolvedDeptId}' not present in existing departments database.`);
    }
  } else if (!resolvedDeptId && !approval.authority) {
    errors.push("Approval must have an associated department or statutory authority.");
  }

  if (!approval.category || normalizeWhitespace(approval.category).length < 3) {
    errors.push("Regulatory category is required.");
  }

  if (!approval.legalBasis || normalizeWhitespace(approval.legalBasis).length < 3) {
    warnings.push("Legal basis / statutory Act citation is not specified.");
  }

  // Check fabricated timeline or fee values
  if (approval.fee && approval.fee.toLowerCase().includes("free") && !approval.legalBasis) {
    warnings.push("Verify if 'Free' fee is officially statutory or unconfirmed.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// =========================================================================
// DUPLICATE & CONFLICT ENGINE
// =========================================================================

export function detectDuplicatesAndConflicts(
  candidate: CandidateApproval,
  existingApprovals: any[]
): {
  classification: "NEW_RECORD" | "EXISTING_RECORD" | "POSSIBLE_DUPLICATE" | "CONFLICT_REQUIRES_REVIEW";
  matchedApproval?: any;
  confidenceScore: number;
  changedFields: string[];
} {
  const normCandidateCode = normalizeWhitespace(candidate.code).toUpperCase();
  const normCandidateName = normalizeNameForMatching(candidate.name);

  // 1. Exact Code or ID Match (or prefix match e.g. MPCB-CTE matching MPCB-CTE-AIR-WATER)
  const exactCodeMatch = existingApprovals.find(a => {
    const existingCode = normalizeWhitespace(a.code).toUpperCase();
    const existingId = normalizeWhitespace(a.id).toUpperCase();
    return (
      existingCode === normCandidateCode ||
      existingId === normCandidateCode ||
      existingId === candidate.id?.toUpperCase() ||
      existingCode.startsWith(normCandidateCode) ||
      normCandidateCode.startsWith(existingCode)
    );
  });

  if (exactCodeMatch) {
    // Check if conflicting authority or department
    const candidateDept = candidate.departmentId || "";
    if (candidateDept && exactCodeMatch.department_id && candidateDept !== exactCodeMatch.department_id) {
      return {
        classification: "CONFLICT_REQUIRES_REVIEW",
        matchedApproval: exactCodeMatch,
        confidenceScore: 0.95,
        changedFields: ["department_id"]
      };
    }

    // Check for changed fields
    const changedFields: string[] = [];
    if (candidate.name && normalizeWhitespace(candidate.name) !== normalizeWhitespace(exactCodeMatch.name)) changedFields.push("name");
    if (candidate.category && candidate.category !== exactCodeMatch.category) changedFields.push("category");
    if (candidate.fee !== undefined && candidate.fee !== exactCodeMatch.fee) changedFields.push("fee");
    if (candidate.timeline !== undefined && candidate.timeline !== exactCodeMatch.timeline) changedFields.push("timeline");
    if (candidate.validity !== undefined && candidate.validity !== exactCodeMatch.validity) changedFields.push("validity");
    if (candidate.legalBasis && candidate.legalBasis !== exactCodeMatch.legal_basis) changedFields.push("legal_basis");
    if (candidate.officialUrl && candidate.officialUrl !== exactCodeMatch.official_url) changedFields.push("official_url");
    if (candidate.renewalRequired !== undefined && candidate.renewalRequired !== exactCodeMatch.renewal_required) changedFields.push("renewal_required");

    if (changedFields.length === 0) {
      return {
        classification: "EXISTING_RECORD",
        matchedApproval: exactCodeMatch,
        confidenceScore: 1.0,
        changedFields: []
      };
    } else {
      return {
        classification: "EXISTING_RECORD",
        matchedApproval: exactCodeMatch,
        confidenceScore: 1.0,
        changedFields
      };
    }
  }

  // 2. Fuzzy Name Match
  let highestScore = 0;
  let bestMatch: any = null;

  for (const existing of existingApprovals) {
    const score = calculateSimilarity(candidate.name, existing.name);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = existing;
    }
  }

  if (highestScore >= 0.70) {
    return {
      classification: "POSSIBLE_DUPLICATE",
      matchedApproval: bestMatch,
      confidenceScore: Math.round(highestScore * 100) / 100,
      changedFields: []
    };
  }

  return {
    classification: "NEW_RECORD",
    confidenceScore: 0,
    changedFields: []
  };
}

// =========================================================================
// INGESTION ENGINE SERVICE CLASS
// =========================================================================

export class RegulatoryIngestionEngine {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Preview an ingestion payload before importing
   */
  async previewIngestion(payload: {
    source: CandidateSource;
    approvals: CandidateApproval[];
  }): Promise<IngestionPreviewResult> {
    const [
      { data: existingApprovals },
      { data: departments }
    ] = await Promise.all([
      this.supabase.from("approvals").select("*"),
      this.supabase.from("departments").select("*")
    ]);

    const allExisting = existingApprovals || [];
    const allDepts = departments || [];

    const sourceValidation = validateOfficialSource(payload.source);
    const approvalResults: IngestionPreviewResult["approvals"] = [];

    let newCount = 0;
    let unchangedCount = 0;
    let changedCount = 0;
    let dupCount = 0;
    let conflictCount = 0;
    let valErrorCount = 0;

    for (const app of payload.approvals || []) {
      const val = validateCandidateApproval(app, allDepts);
      if (!val.valid) valErrorCount++;

      const dup = detectDuplicatesAndConflicts(app, allExisting);
      if (dup.classification === "NEW_RECORD") newCount++;
      else if (dup.classification === "POSSIBLE_DUPLICATE") dupCount++;
      else if (dup.classification === "CONFLICT_REQUIRES_REVIEW") conflictCount++;
      else if (dup.classification === "EXISTING_RECORD") {
        if (dup.changedFields.length > 0) changedCount++;
        else unchangedCount++;
      }

      approvalResults.push({
        candidate: app,
        classification: dup.classification,
        matchedApprovalId: dup.matchedApproval?.id,
        confidenceScore: dup.confidenceScore,
        changedFields: dup.changedFields,
        validation: val
      });
    }

    return {
      source: {
        valid: sourceValidation.valid,
        source: payload.source,
        errors: sourceValidation.errors,
        warnings: sourceValidation.warnings,
        isAuthoritative: sourceValidation.isAuthoritative
      },
      approvals: approvalResults,
      summary: {
        total: payload.approvals?.length || 0,
        newRecords: newCount,
        existingUnchanged: unchangedCount,
        changedRecords: changedCount,
        duplicates: dupCount,
        conflicts: conflictCount,
        validationErrorsCount: valErrorCount
      }
    };
  }

  /**
   * Import candidate approvals into Pending Verification state
   */
  async importIngestion(
    payload: {
      source: CandidateSource;
      approvals: CandidateApproval[];
      autoCreateSource?: boolean;
      adminUser: string;
      reason?: string;
    },
    createVersionFn: (params: any) => Promise<number>,
    logAuditFn: (params: any) => Promise<void>
  ): Promise<{
    success: boolean;
    sourceId: string;
    importedApprovals: any[];
    skippedApprovals: any[];
    auditId?: string;
  }> {
    const preview = await this.previewIngestion(payload);
    if (!preview.source.valid) {
      throw new Error(`Invalid source metadata: ${preview.source.errors.join("; ")}`);
    }

    const adminUser = payload.adminUser || "REGULATORY_ADMIN";

    // 1. Ensure or create Source in data_sources
    let sourceId = payload.source.id;
    if (!sourceId) {
      sourceId = `SRC-INGEST-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const { error: srcErr } = await this.supabase.from("data_sources").insert({
        id: sourceId,
        title: payload.source.title,
        source_type: payload.source.sourceType,
        department: payload.source.department,
        official_url: payload.source.officialUrl || null,
        document_url: payload.source.documentUrl || null,
        verification_status: "Pending Verification",
        notes: payload.source.notes || "Ingested via Official Ingestion Engine",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (srcErr) throw new Error(`Failed to create data source: ${srcErr.message}`);

      await createVersionFn({
        entityType: "data_source",
        entityId: sourceId,
        changeType: "CREATE",
        snapshot: { id: sourceId, ...payload.source },
        changedBy: adminUser,
        reason: payload.reason || "Official regulatory source ingestion"
      });

      await logAuditFn({
        action: "CREATE",
        entityType: "data_source",
        entityId: sourceId,
        newStatus: "Pending Verification",
        performedBy: adminUser,
        reason: payload.reason || "Source registered through ingestion engine"
      });
    }

    const imported: any[] = [];
    const skipped: any[] = [];

    for (const item of preview.approvals) {
      // If validation failed or has severe conflict, skip automatic ingestion
      if (!item.validation.valid || item.classification === "CONFLICT_REQUIRES_REVIEW") {
        skipped.push({ candidate: item.candidate, reason: item.validation.errors.join("; ") || "Conflict requires review" });
        continue;
      }

      if (item.classification === "NEW_RECORD" || item.classification === "POSSIBLE_DUPLICATE") {
        const appId = item.candidate.id || `APP-INGEST-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
        const record = {
          id: appId,
          name: item.candidate.name,
          code: item.candidate.code,
          department_id: item.candidate.departmentId || "DEPT-MPCB",
          category: item.candidate.category,
          description: item.candidate.description || null,
          authority: item.candidate.authority || "Competent Authority",
          applicability: item.candidate.applicability || null,
          eligibility: item.candidate.eligibility || null,
          documents: item.candidate.documents || [],
          application_process: item.candidate.applicationProcess || null,
          official_url: item.candidate.officialUrl || null,
          fee: item.candidate.fee === null || item.candidate.fee === "" ? null : item.candidate.fee,
          timeline: item.candidate.timeline === null || item.candidate.timeline === "" ? null : item.candidate.timeline,
          renewal_required: Boolean(item.candidate.renewalRequired),
          validity: item.candidate.validity || null,
          legal_basis: item.candidate.legalBasis || null,
          status: "Pending Verification",
          source_id: sourceId,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: inserted, error: insErr } = await this.supabase
          .from("approvals")
          .insert(record)
          .select()
          .single();

        if (insErr) {
          skipped.push({ candidate: item.candidate, reason: insErr.message });
          continue;
        }

        await createVersionFn({
          entityType: "approval",
          entityId: appId,
          changeType: "CREATE",
          snapshot: inserted,
          changedBy: adminUser,
          reason: payload.reason || "Ingested as new regulatory approval record"
        });

        await logAuditFn({
          action: "CREATE",
          entityType: "approval",
          entityId: appId,
          newStatus: "Pending Verification",
          performedBy: adminUser,
          reason: payload.reason || "Approval created through ingestion engine"
        });

        imported.push(inserted);
      } else if (item.classification === "EXISTING_RECORD" && item.changedFields.length > 0 && item.matchedApprovalId) {
        // Changed existing record -> update to Pending Verification and create new version
        const existing = (await this.supabase.from("approvals").select("*").eq("id", item.matchedApprovalId).single()).data;
        if (!existing) continue;

        const nextVer = (Number(existing.version) || 1) + 1;
        const updatePayload: Record<string, any> = {
          status: "Pending Verification",
          version: nextVer,
          source_id: sourceId,
          updated_at: new Date().toISOString()
        };

        if (item.candidate.fee !== undefined) updatePayload.fee = item.candidate.fee;
        if (item.candidate.timeline !== undefined) updatePayload.timeline = item.candidate.timeline;
        if (item.candidate.validity !== undefined) updatePayload.validity = item.candidate.validity;
        if (item.candidate.legalBasis !== undefined) updatePayload.legal_basis = item.candidate.legalBasis;
        if (item.candidate.officialUrl !== undefined) updatePayload.official_url = item.candidate.officialUrl;

        const { data: updated, error: updErr } = await this.supabase
          .from("approvals")
          .update(updatePayload)
          .eq("id", item.matchedApprovalId)
          .select()
          .single();

        if (updErr) {
          skipped.push({ candidate: item.candidate, reason: updErr.message });
          continue;
        }

        await createVersionFn({
          entityType: "approval",
          entityId: item.matchedApprovalId,
          changeType: "UPDATE",
          snapshot: updated,
          changedBy: adminUser,
          changedFields: item.changedFields,
          reason: payload.reason || "Ingested updated source information"
        });

        await logAuditFn({
          action: "UPDATE",
          entityType: "approval",
          entityId: item.matchedApprovalId,
          previousStatus: existing.status,
          newStatus: "Pending Verification",
          changedFields: item.changedFields,
          performedBy: adminUser,
          reason: payload.reason || "Updated existing approval with incoming source data"
        });

        imported.push(updated);
      }
    }

    return {
      success: true,
      sourceId,
      importedApprovals: imported,
      skippedApprovals: skipped
    };
  }

  /**
   * Run knowledge base quality audit
   */
  async runQualityAudit(): Promise<{
    totalSources: number;
    totalApprovals: number;
    totalRules: number;
    verifiedApprovals: number;
    pendingApprovals: number;
    rejectedApprovals: number;
    archivedApprovals: number;
    sourcesWithoutUrl: number;
    approvalsWithoutSource: number;
    approvalsWithoutLegalBasis: number;
    potentialDuplicates: any[];
  }> {
    const [
      { data: sources },
      { data: approvals },
      { data: rules }
    ] = await Promise.all([
      this.supabase.from("data_sources").select("*"),
      this.supabase.from("approvals").select("*"),
      this.supabase.from("approval_rules").select("*")
    ]);

    const allSources = sources || [];
    const allApprovals = approvals || [];
    const allRules = rules || [];

    const verified = allApprovals.filter(a => a.status === "Verified").length;
    const pending = allApprovals.filter(a => a.status === "Pending Verification").length;
    const rejected = allApprovals.filter(a => a.status === "Rejected").length;
    const archived = allApprovals.filter(a => a.status === "Archived").length;

    const noSourceUrl = allSources.filter(s => !s.official_url).length;
    const noSource = allApprovals.filter(a => !a.source_id).length;
    const noLegalBasis = allApprovals.filter(a => !a.legal_basis || a.legal_basis.trim() === "").length;

    // Detect duplicates in current database
    const potentialDuplicates: any[] = [];
    for (let i = 0; i < allApprovals.length; i++) {
      for (let j = i + 1; j < allApprovals.length; j++) {
        const score = calculateSimilarity(allApprovals[i].name, allApprovals[j].name);
        if (score >= 0.85 && allApprovals[i].id !== allApprovals[j].id) {
          potentialDuplicates.push({
            approvalA: { id: allApprovals[i].id, name: allApprovals[i].name, code: allApprovals[i].code },
            approvalB: { id: allApprovals[j].id, name: allApprovals[j].name, code: allApprovals[j].code },
            similarityScore: Math.round(score * 100) / 100
          });
        }
      }
    }

    return {
      totalSources: allSources.length,
      totalApprovals: allApprovals.length,
      totalRules: allRules.length,
      verifiedApprovals: verified,
      pendingApprovals: pending,
      rejectedApprovals: rejected,
      archivedApprovals: archived,
      sourcesWithoutUrl: noSourceUrl,
      approvalsWithoutSource: noSource,
      approvalsWithoutLegalBasis: noLegalBasis,
      potentialDuplicates
    };
  }
}
