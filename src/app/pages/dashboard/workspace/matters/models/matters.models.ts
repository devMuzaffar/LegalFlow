/*
   Matters Models

   Data contracts for litigation matters, custodian legal-hold preservation
   records and status filters.
*/

// Types
export type MatterStatus = 'HOLD_ACTIVE' | 'ACTIVE' | 'CLOSED';
export type HoldAckStatus = 'ACKNOWLEDGED' | 'PENDING' | 'OVERDUE';
export type PreservationSource = 'Email' | 'Slack' | 'Drive' | 'Teams';
export type AckFilter = 'ALL' | HoldAckStatus;
export type StatTone = 'sky' | 'emerald' | 'amber' | 'rose';

export interface MatterRecord {
    id: string;
    name: string;
    status: MatterStatus;
    leadCounsel: string;
    openedAt: string;
    corpusSizeGb: number;
    docCount: number;
}

export interface LegalHoldCustodian {
    id: string;
    matterId: string;
    name: string;
    department: string;
    sources: PreservationSource[];
    issuedAt: string;
    holdActive: boolean;
    ackStatus: HoldAckStatus;
    noticeSnippet: string;
    lastRemindedAt?: string;
}
