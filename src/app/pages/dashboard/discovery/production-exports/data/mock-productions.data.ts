/*
   Mock Productions Data

   Deterministic seed dataset for MTR-2026-01: three Bates-numbered export
   batches (2,500 produced, 144 redacted, 74 withheld) and five privilege log
   entries tied to review documents.
*/

import { PrivilegeLogEntry, ProductionBatch } from '../models/productions.models';

// Production Batches
export const MOCK_PRODUCTION_BATCHES: readonly ProductionBatch[] = [
    {
        id: 'PROD-001',
        matterId: 'MTR-2026-01',
        name: 'Initial Regulator Rolling Set',
        batesStart: 'FIN-000001',
        batesEnd: 'FIN-001420',
        format: 'PDF + Loadfile (DAT/OPT)',
        docCount: 1420,
        redactedCount: 84,
        withheldPrivileged: 38,
        status: 'DELIVERED',
        createdAt: '2026-01-28',
    },
    {
        id: 'PROD-002',
        matterId: 'MTR-2026-01',
        name: 'Supplemental Wire & Compliance Set',
        batesStart: 'FIN-001421',
        batesEnd: 'FIN-002190',
        format: 'Native + Metadata',
        docCount: 770,
        redactedCount: 41,
        withheldPrivileged: 22,
        status: 'READY',
        createdAt: '2026-02-09',
    },
    {
        id: 'PROD-003',
        matterId: 'MTR-2026-01',
        name: 'Executive Custodians — Pending QC',
        batesStart: 'FIN-002191',
        batesEnd: 'Pending',
        format: 'TIFF + Text',
        docCount: 310,
        redactedCount: 19,
        withheldPrivileged: 14,
        status: 'DRAFT',
        createdAt: '2026-02-18',
    },
];

// Privilege Log
export const MOCK_PRIVILEGE_LOG: readonly PrivilegeLogEntry[] = [
    {
        docId: 'DOC-44871',
        batesControl: 'FIN-PRIV-001',
        date: '2026-02-11',
        custodian: 'Sarah Chen',
        privilegeType: 'Attorney-Client',
        basis: 'Confidential legal advice from outside counsel on Q3 wire reconciliation discrepancies.',
    },
    {
        docId: 'DOC-44862',
        batesControl: 'FIN-PRIV-002',
        date: '2026-02-11',
        custodian: 'Marcus Webb',
        privilegeType: 'Work Product',
        basis: 'Breach notification timeline prepared at the direction of General Counsel for regulatory defense.',
    },
    {
        docId: 'DOC-44790',
        batesControl: 'FIN-PRIV-003',
        date: '2026-02-10',
        custodian: 'Priya Nair',
        privilegeType: 'Attorney-Client',
        basis: 'Internal counsel preservation directive and legal hold scope instructions.',
    },
    {
        docId: 'DOC-44902',
        batesControl: 'FIN-PRIV-004',
        date: '2026-02-12',
        custodian: 'Priya Nair',
        privilegeType: 'Work Product',
        basis: 'Privileged incident-response strategy draft created in anticipation of litigation.',
    },
    {
        docId: 'DOC-44712',
        batesControl: 'FIN-PRIV-005',
        date: '2026-02-10',
        custodian: 'David Okafor',
        privilegeType: 'Attorney-Client',
        basis: 'Counsel-requested vendor IAM audit memorandum conveying legal risk assessment.',
    },
];
