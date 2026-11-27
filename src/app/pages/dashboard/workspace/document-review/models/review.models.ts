/*
   Review Models

   Contracts for the review workspace: documents, email messages, AI findings
   with exact character offsets, legal coding and the immutable audit trail.
*/

// Types
export type SourceType = 'EMAIL' | 'PDF' | 'CHAT';
export type FindingType = 'PII' | 'PHI' | 'PRIVILEGE';
export type FindingStatus = 'PENDING' | 'CONFIRMED' | 'REVERSED';
export type Responsiveness = 'UNREVIEWED' | 'RESPONSIVE' | 'NON_RESPONSIVE' | 'FURTHER_REVIEW';
export type PrivilegeTag = 'NONE' | 'ATTORNEY_CLIENT' | 'WORK_PRODUCT';
export type SearchMode = 'semantic' | 'boolean';
export type FilterChip = 'all' | 'threads' | 'pii' | 'privileged' | 'unreviewed';
export type ReviewerRole = 'Matter Admin' | 'Lead Reviewer' | 'Compliance Auditor';

export interface MockEmailMessage {
    id: string;
    sender: string;
    recipients: string[];
    /** Canonical immutable text — never mutated. */
    body: string;
    sentAt: string;
}

export interface MockAIFinding {
    id: string;
    messageId: string;
    /** Exact char index in message.body. */
    start: number;
    /** Exact char index in message.body. */
    end: number;
    type: FindingType;
    confidence: number;
    status: FindingStatus;
    decisionReason?: string;
}

export interface DocumentCoding {
    responsiveness: Responsiveness;
    privilege: PrivilegeTag;
    notes: string;
}

export interface ReviewDocument {
    id: string;
    matterId: string;
    custodianId: string;
    custodianName: string;
    sourceType: SourceType;
    subject: string;
    receivedAt: string;
    threadCount: number;
    checksum: string;
    messages: MockEmailMessage[];
    findings: MockAIFinding[];
    coding: DocumentCoding;
}

export type ReviewAuditAction =
    | 'AI_CONFIRMED'
    | 'AI_REVERSED'
    | 'CODING_SAVED'
    | 'PRIVILEGE_CODED'
    | 'LEGAL_HOLD_ISSUED'
    | 'LEGAL_HOLD_RELEASED'
    | 'LEGAL_HOLD_REMINDER'
    | 'PROCESSING_RETRIED'
    | 'PRODUCTION_EXPORTED'
    | 'PRIVILEGE_LOG_EXPORTED';

export interface ReviewAuditEvent {
    id: string;
    timestamp: string;
    actorRole: ReviewerRole;
    action: ReviewAuditAction;
    docId: string;
    detail: string;
    hash: string;
}

export interface ReviewFilters {
    query: string;
    mode: SearchMode;
    filter: FilterChip;
    custodian: string | null;
}

export interface TextSegment {
    text: string;
    finding?: MockAIFinding;
}
