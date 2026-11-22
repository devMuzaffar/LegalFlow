// ─────────────────────────────────────────────────────────────────────────────
// Types + seed data for the ECA Overview.
// Numbers are internally consistent: custodian docs sum to reviewReady and the
// custodian PII / privilege sums match the AI risk flag totals.
// ─────────────────────────────────────────────────────────────────────────────

export type AuditAction = 'AI_DECISION_REVERSED' | 'PRIVILEGE_CODED' | 'LEGAL_HOLD_ISSUED';

export interface PipelineStep {
    label: string;
    progress: number; // 0-100
    /** One-line stat shown on hover. */
    detail: string;
}

export interface FileType {
    label: string;
    pct: number;
}

export interface Custodian {
    id: string;
    name: string;
    totalDocs: number;
    piiCount: number;
    privilegeCount: number;
    reviewed: number;
}

export interface AuditEntry {
    id: string;
    action: AuditAction;
    actorRole: string;
    docId: string;
    minutesAgo: number;
    sha256: string;
}

export interface Matter {
    id: string;
    name: string;
    legalHold: boolean;
    uploaded: number;
    reviewReady: number;
    coded: number;
    pending: number;
    privilegeFlags: number;
    piiFlags: number;
    humanReversed: number;
    vaultGb: number;
    aiTokens: number;
    perDocFee: number;
    fileTypes: readonly FileType[];
    pipeline: readonly PipelineStep[];
    custodians: readonly Custodian[];
    audit: readonly AuditEntry[];
}

const FINCORP: Matter = {
    id: 'MTR-2026-01',
    name: 'FinCorp Data Breach',
    legalHold: true,
    uploaded: 12480,
    reviewReady: 7610,
    coded: 4870,
    pending: 2740,
    privilegeFlags: 142,
    piiFlags: 318,
    humanReversed: 19,
    vaultGb: 42.6,
    aiTokens: 1_412_000,
    perDocFee: 0,
    fileTypes: [
        { label: 'Email', pct: 68 },
        { label: 'PDF', pct: 22 },
        { label: 'Chat', pct: 10 },
    ],
    pipeline: [
        { label: 'Container Extract', progress: 100, detail: '12,480 containers unpacked' },
        { label: 'SHA-256 Dedup', progress: 100, detail: '4,870 duplicates removed (39%)' },
        { label: 'OCR & Text', progress: 100, detail: '7,610 documents text-extracted' },
        { label: 'Email Threading', progress: 100, detail: '5,182 emails grouped into 1,204 threads' },
        { label: 'AI Pre-Scan', progress: 92, detail: '7,000 of 7,610 scanned' },
    ],
    custodians: [
        { id: 'c-1024', name: 'Sarah Chen', totalDocs: 2140, piiCount: 92, privilegeCount: 41, reviewed: 1802 },
        { id: 'c-1025', name: 'Marcus Webb', totalDocs: 1865, piiCount: 71, privilegeCount: 28, reviewed: 1210 },
        { id: 'c-1026', name: 'Priya Nair', totalDocs: 1540, piiCount: 64, privilegeCount: 33, reviewed: 987 },
        { id: 'c-1027', name: 'David Okafor', totalDocs: 1205, piiCount: 58, privilegeCount: 22, reviewed: 640 },
        { id: 'c-1028', name: 'Lena Fischer', totalDocs: 860, piiCount: 33, privilegeCount: 18, reviewed: 231 },
    ],
    audit: [
        {
            id: 'a-1',
            action: 'AI_DECISION_REVERSED',
            actorRole: 'Lead Reviewer',
            docId: 'DOC-44871',
            minutesAgo: 12,
            sha256: 'a3f9c2e14b7d08f5c6a1e9b3d4720f8c5ea6b1d9047c2f38a5b6e1c09d4f7a2b',
        },
        {
            id: 'a-2',
            action: 'PRIVILEGE_CODED',
            actorRole: 'Lead Reviewer',
            docId: 'DOC-44862',
            minutesAgo: 34,
            sha256: '7c1d8b4e2f9a03c65d7e1b8a4c2f90d3e6b5a17c8d4f2e09b3a6c1d57f8e2b4a',
        },
        {
            id: 'a-3',
            action: 'LEGAL_HOLD_ISSUED',
            actorRole: 'Matter Admin',
            docId: 'DOC-44790',
            minutesAgo: 72,
            sha256: 'e92b7d1a5c3f84e06b2d9a7c1e5f3b8d0a4c6e2f95b1d7c3a8e6f0b2c4d9a7e1',
        },
        {
            id: 'a-4',
            action: 'AI_DECISION_REVERSED',
            actorRole: 'Compliance Auditor',
            docId: 'DOC-44712',
            minutesAgo: 125,
            sha256: '4b8e2c6a1d9f37b05e3c7a9d2f6b4e8c0a1d5f7b9e3c6a2d8f0b4e6c1a7d9f3b',
        },
        {
            id: 'a-5',
            action: 'PRIVILEGE_CODED',
            actorRole: 'Lead Reviewer',
            docId: 'DOC-44688',
            minutesAgo: 200,
            sha256: 'c1a7f3e9b5d28c04a6e2b8d4f0c9a3e7b1d5f9c2a8e4b6d0f3a7c1e5b9d2f6a8',
        },
    ],
};

const HALCYON: Matter = {
    id: 'MTR-2026-02',
    name: 'Halcyon IP Dispute',
    legalHold: true,
    uploaded: 3240,
    reviewReady: 2180,
    coded: 1320,
    pending: 860,
    privilegeFlags: 38,
    piiFlags: 74,
    humanReversed: 6,
    vaultGb: 11.2,
    aiTokens: 412_000,
    perDocFee: 0,
    fileTypes: [
        { label: 'Email', pct: 54 },
        { label: 'PDF', pct: 31 },
        { label: 'Chat', pct: 15 },
    ],
    pipeline: [
        { label: 'Container Extract', progress: 100, detail: '3,240 containers unpacked' },
        { label: 'SHA-256 Dedup', progress: 100, detail: '1,060 duplicates removed (33%)' },
        { label: 'OCR & Text', progress: 100, detail: '2,180 documents text-extracted' },
        { label: 'Email Threading', progress: 100, detail: '1,450 emails grouped into 402 threads' },
        { label: 'AI Pre-Scan', progress: 64, detail: '1,395 of 2,180 scanned' },
    ],
    custodians: [
        { id: 'c-2011', name: 'Alan Reyes', totalDocs: 980, piiCount: 34, privilegeCount: 18, reviewed: 620 },
        { id: 'c-2012', name: 'Mona Sato', totalDocs: 760, piiCount: 24, privilegeCount: 12, reviewed: 480 },
        { id: 'c-2013', name: 'Tom Bauer', totalDocs: 440, piiCount: 16, privilegeCount: 8, reviewed: 220 },
    ],
    audit: [
        {
            id: 'b-1',
            action: 'PRIVILEGE_CODED',
            actorRole: 'Lead Reviewer',
            docId: 'DOC-11842',
            minutesAgo: 25,
            sha256: 'd4a8e2b6c1f70d35a9e7b3d1f5c8a2e6b0d4f8a1c5e9b3d7f0a4c8e2b6d1f5a9',
        },
        {
            id: 'b-2',
            action: 'LEGAL_HOLD_ISSUED',
            actorRole: 'Matter Admin',
            docId: 'DOC-11810',
            minutesAgo: 90,
            sha256: '2f6b0d4a8c1e5f9b3d7a0c4e8b2d6f1a5c9e3b7d0a4f8c2e6b1d5f9a3c7e0b4d',
        },
    ],
};

/** Matters available in the demo workspace. */
export const MATTERS: readonly Matter[] = [FINCORP, HALCYON];

/** Fallback matter so lookups are always defined. */
export const FALLBACK_MATTER: Matter = FINCORP;
