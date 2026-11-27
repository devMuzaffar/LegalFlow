/*
   Productions Models

   Data contracts for Bates-numbered production export batches and the
   withheld privilege log schedule.
*/

// Types
export type ProductionStatus = 'READY' | 'DELIVERED' | 'DRAFT';
export type ExportFormat = 'PDF + Loadfile (DAT/OPT)' | 'Native + Metadata' | 'TIFF + Text';
export type PrivilegeType = 'Attorney-Client' | 'Work Product';
export type ProductionStatTone = 'sky' | 'amber' | 'rose' | 'emerald';

export interface ProductionBatch {
    id: string;
    matterId: string;
    name: string;
    batesStart: string;
    batesEnd: string;
    format: ExportFormat;
    docCount: number;
    redactedCount: number;
    withheldPrivileged: number;
    status: ProductionStatus;
    createdAt: string;
}

export interface PrivilegeLogEntry {
    docId: string;
    batesControl: string;
    date: string;
    custodian: string;
    privilegeType: PrivilegeType;
    basis: string;
}
