/*
   Mock Matters Data

   Deterministic seed dataset: 3 litigation matters and 12 custodian legal-hold
   records. MTR-2026-01 custodians match /overview and /document-review slugs.
*/

import { LegalHoldCustodian, MatterRecord } from '../models/matters.models';

// Matters
export const MOCK_MATTERS: readonly MatterRecord[] = [
    {
        id: 'MTR-2026-01',
        name: 'FinCorp Data Breach',
        status: 'HOLD_ACTIVE',
        leadCounsel: 'Elena Vance',
        openedAt: '2026-01-14',
        corpusSizeGb: 42.6,
        docCount: 12480,
    },
    {
        id: 'MTR-2026-02',
        name: 'Apex Antitrust Inquiry',
        status: 'ACTIVE',
        leadCounsel: 'Julian Mercer',
        openedAt: '2026-02-03',
        corpusSizeGb: 18.4,
        docCount: 5320,
    },
    {
        id: 'MTR-2026-03',
        name: 'Vendor Kickback Review',
        status: 'CLOSED',
        leadCounsel: 'Nadia Al-Mansoor',
        openedAt: '2025-11-18',
        corpusSizeGb: 9.2,
        docCount: 2840,
    },
];

// Custodians
export const MOCK_CUSTODIANS: readonly LegalHoldCustodian[] = [
    // MTR-2026-01 — FinCorp Data Breach (5 custodians: 3 ACKNOWLEDGED, 1 PENDING, 1 OVERDUE)
    {
        id: 'sarah-chen',
        matterId: 'MTR-2026-01',
        name: 'Sarah Chen',
        department: 'Information Security',
        sources: ['Email', 'Slack', 'Drive'],
        issuedAt: '2026-01-15',
        holdActive: true,
        ackStatus: 'ACKNOWLEDGED',
        noticeSnippet: 'Preserve all incident-response logs, breach triage threads and forensics exports.',
    },
    {
        id: 'marcus-webb',
        matterId: 'MTR-2026-01',
        name: 'Marcus Webb',
        department: 'Treasury Operations',
        sources: ['Email', 'Teams', 'Drive'],
        issuedAt: '2026-01-15',
        holdActive: true,
        ackStatus: 'ACKNOWLEDGED',
        noticeSnippet: 'Hold wire reconciliation workbooks, bank notifications and customer escalation memos.',
    },
    {
        id: 'priya-nair',
        matterId: 'MTR-2026-01',
        name: 'Priya Nair',
        department: 'General Counsel',
        sources: ['Email', 'Drive'],
        issuedAt: '2026-01-15',
        holdActive: true,
        ackStatus: 'ACKNOWLEDGED',
        noticeSnippet: 'Retain outside-counsel advisories, breach assessment drafts and regulator notices.',
    },
    {
        id: 'david-okafor',
        matterId: 'MTR-2026-01',
        name: 'David Okafor',
        department: 'Platform Engineering',
        sources: ['Email', 'Slack', 'Teams'],
        issuedAt: '2026-01-16',
        holdActive: true,
        ackStatus: 'PENDING',
        noticeSnippet: 'Preserve IAM rotation records, API gateway logs and deployment tickets from Jan 2026.',
    },
    {
        id: 'lena-fischer',
        matterId: 'MTR-2026-01',
        name: 'Lena Fischer',
        department: 'Client Relations',
        sources: ['Email', 'Slack'],
        issuedAt: '2026-01-16',
        holdActive: true,
        ackStatus: 'OVERDUE',
        noticeSnippet: 'Preserve enterprise client notifications, remediation offers and CRM exports.',
    },

    // MTR-2026-02 — Apex Antitrust Inquiry (4 custodians: 2 ACKNOWLEDGED, 1 PENDING, 1 OVERDUE)
    {
        id: 'alan-reyes',
        matterId: 'MTR-2026-02',
        name: 'Alan Reyes',
        department: 'Corporate Strategy',
        sources: ['Email', 'Drive', 'Teams'],
        issuedAt: '2026-02-04',
        holdActive: true,
        ackStatus: 'ACKNOWLEDGED',
        noticeSnippet: 'Preserve M&A valuation decks, competitor pricing benchmarks and board memos.',
    },
    {
        id: 'mona-sato',
        matterId: 'MTR-2026-02',
        name: 'Mona Sato',
        department: 'Commercial Sales',
        sources: ['Email', 'Slack'],
        issuedAt: '2026-02-04',
        holdActive: true,
        ackStatus: 'ACKNOWLEDGED',
        noticeSnippet: 'Retain enterprise discount approvals, RFP responses and regional territory plans.',
    },
    {
        id: 'tom-bauer',
        matterId: 'MTR-2026-02',
        name: 'Tom Bauer',
        department: 'Product Management',
        sources: ['Email', 'Slack', 'Drive'],
        issuedAt: '2026-02-05',
        holdActive: true,
        ackStatus: 'PENDING',
        noticeSnippet: 'Hold bundling roadmap notes, partner API terms and pricing committee minutes.',
    },
    {
        id: 'ivy-nakamura',
        matterId: 'MTR-2026-02',
        name: 'Ivy Nakamura',
        department: 'Channel Partnerships',
        sources: ['Email', 'Teams'],
        issuedAt: '2026-02-05',
        holdActive: true,
        ackStatus: 'OVERDUE',
        noticeSnippet: 'Preserve distributor exclusivity correspondence and quarterly rebate schedules.',
    },

    // MTR-2026-03 — Vendor Kickback Review (3 custodians: all ACKNOWLEDGED, holdActive: false)
    {
        id: 'rafael-costa',
        matterId: 'MTR-2026-03',
        name: 'Rafael Costa',
        department: 'Procurement',
        sources: ['Email', 'Drive'],
        issuedAt: '2025-11-19',
        holdActive: false,
        ackStatus: 'ACKNOWLEDGED',
        noticeSnippet: 'Matter closed — preservation hold formally released after final audit sign-off.',
    },
    {
        id: 'hana-petrova',
        matterId: 'MTR-2026-03',
        name: 'Hana Petrova',
        department: 'Accounts Payable',
        sources: ['Email', 'Teams'],
        issuedAt: '2025-11-19',
        holdActive: false,
        ackStatus: 'ACKNOWLEDGED',
        noticeSnippet: 'Matter closed — invoice approval trails archived per retention policy.',
    },
    {
        id: 'samir-aziz',
        matterId: 'MTR-2026-03',
        name: 'Samir Aziz',
        department: 'Facilities & Logistics',
        sources: ['Email', 'Slack'],
        issuedAt: '2025-11-20',
        holdActive: false,
        ackStatus: 'ACKNOWLEDGED',
        noticeSnippet: 'Matter closed — contractor bidding records cleared for standard disposition.',
    },
];
