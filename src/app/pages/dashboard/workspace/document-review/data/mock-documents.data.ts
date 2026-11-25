/*
   Mock Documents

   Twenty curated documents for matter MTR-2026-01 spread across the five
   Overview custodians. Findings carry exact character offsets resolved from
   their phrases, so every highlight is guaranteed to slice cleanly.
*/

import {
    DocumentCoding,
    FindingType,
    MockAIFinding,
    MockEmailMessage,
    Responsiveness,
    ReviewDocument,
    SourceType,
} from '../models/review.models';
import { mockSha256, offsetsOf } from '../utils/text-segments';

// Types
interface FindingSeed {
    phrase: string;
    type: FindingType;
    confidence: number;
}

interface MessageSeed {
    sender: string;
    recipients: string[];
    sentAt: string;
    body: string;
    findings: FindingSeed[];
}

interface DocumentSeed {
    id: string;
    custodianId: string;
    custodianName: string;
    sourceType: SourceType;
    subject: string;
    receivedAt: string;
    messages: MessageSeed[];
}

// Constants
const MATTER_ID = 'MTR-2026-01';

const DEFAULT_CODING: DocumentCoding = {
    responsiveness: 'UNREVIEWED',
    privilege: 'NONE',
    notes: '',
};

const SEEDS: readonly DocumentSeed[] = [
    // ── Email threads ──────────────────────────────────────────────────────────
    {
        id: 'DOC-44871',
        custodianId: 'c-1024',
        custodianName: 'Sarah Chen',
        sourceType: 'EMAIL',
        subject: 'RE: Wire transfer reconciliation Q3',
        receivedAt: '2026-02-11T09:14:00Z',
        messages: [
            {
                sender: 'Sarah Chen',
                recipients: ['Rachel Ivers', 'Compliance'],
                sentAt: '2026-02-11T09:14:00Z',
                body: 'Hi Rachel,\n\nAttaching the Q3 reconciliation. The wire to account 4881-2290-771 was flagged by compliance.\n\nBest,\nSarah',
                findings: [{ phrase: 'account 4881-2290-771', type: 'PII', confidence: 96 }],
            },
            {
                sender: 'Rachel Ivers',
                recipients: ['Sarah Chen'],
                sentAt: '2026-02-11T10:02:00Z',
                body: "Sarah,\n\nThanks. I'm seeking legal counsel on whether this needs to be disclosed under the breach notice.\n\nRachel",
                findings: [{ phrase: 'seeking legal counsel', type: 'PRIVILEGE', confidence: 91 }],
            },
            {
                sender: 'Sarah Chen',
                recipients: ['Rachel Ivers'],
                sentAt: '2026-02-11T10:40:00Z',
                body: 'Understood. Holding all related records until counsel responds.\n\nSarah',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-44862',
        custodianId: 'c-1025',
        custodianName: 'Marcus Webb',
        sourceType: 'EMAIL',
        subject: 'RE: Breach notification timeline',
        receivedAt: '2026-02-11T11:20:00Z',
        messages: [
            {
                sender: 'Marcus Webb',
                recipients: ['Priya Nair', 'Lena Fischer'],
                sentAt: '2026-02-11T11:20:00Z',
                body: 'Team,\n\nClaim reference CL-88213 came in from the affected customer. Medical leave documentation is attached separately.\n\nMarcus',
                findings: [{ phrase: 'CL-88213', type: 'PHI', confidence: 88 }],
            },
            {
                sender: 'Priya Nair',
                recipients: ['Marcus Webb'],
                sentAt: '2026-02-11T12:05:00Z',
                body: "Marcus,\n\nThe customer's personal email is dana.reyes@mailbox.com — please keep it out of the shared folder.\n\nPriya",
                findings: [{ phrase: 'dana.reyes@mailbox.com', type: 'PII', confidence: 94 }],
            },
            {
                sender: 'Marcus Webb',
                recipients: ['Priya Nair'],
                sentAt: '2026-02-11T12:30:00Z',
                body: 'Noted. Redacting before distribution.\n\nMarcus',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-44790',
        custodianId: 'c-1026',
        custodianName: 'Priya Nair',
        sourceType: 'EMAIL',
        subject: 'FW: Legal hold notice — FinCorp',
        receivedAt: '2026-02-10T08:45:00Z',
        messages: [
            {
                sender: 'Priya Nair',
                recipients: ['Matter Team'],
                sentAt: '2026-02-10T08:45:00Z',
                body: 'All,\n\nPlease preserve every record related to the FinCorp matter effective immediately.\n\nPriya',
                findings: [],
            },
            {
                sender: 'Marcus Webb',
                recipients: ['Priya Nair'],
                sentAt: '2026-02-10T09:10:00Z',
                body: 'Priya,\n\nConfirming receipt. This message is a privileged draft prepared at the direction of counsel.\n\nMarcus',
                findings: [{ phrase: 'privileged draft', type: 'PRIVILEGE', confidence: 97 }],
            },
        ],
    },
    {
        id: 'DOC-44712',
        custodianId: 'c-1027',
        custodianName: 'David Okafor',
        sourceType: 'EMAIL',
        subject: 'RE: Vendor access review',
        receivedAt: '2026-02-10T14:12:00Z',
        messages: [
            {
                sender: 'David Okafor',
                recipients: ['Lena Fischer'],
                sentAt: '2026-02-10T14:12:00Z',
                body: 'Hi,\n\nVendor onboarding record lists SSN 402-11-8890 for the primary contact.\n\nDavid',
                findings: [{ phrase: 'SSN 402-11-8890', type: 'PII', confidence: 95 }],
            },
            {
                sender: 'Lena Fischer',
                recipients: ['David Okafor'],
                sentAt: '2026-02-10T14:48:00Z',
                body: 'David,\n\nThat field should never leave HR systems. Please escalate.\n\nLena',
                findings: [],
            },
            {
                sender: 'David Okafor',
                recipients: ['Lena Fischer', 'Compliance'],
                sentAt: '2026-02-10T15:20:00Z',
                body: 'Escalated to compliance this morning.\n\nDavid',
                findings: [],
            },
            {
                sender: 'Lena Fischer',
                recipients: ['David Okafor'],
                sentAt: '2026-02-10T15:35:00Z',
                body: 'Thanks both.\n\nLena',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-44688',
        custodianId: 'c-1028',
        custodianName: 'Lena Fischer',
        sourceType: 'EMAIL',
        subject: 'RE: Customer complaint escalation',
        receivedAt: '2026-02-09T16:02:00Z',
        messages: [
            {
                sender: 'Lena Fischer',
                recipients: ['Sarah Chen'],
                sentAt: '2026-02-09T16:02:00Z',
                body: 'Team,\n\nCustomer left phone 415-555-0142 on the complaint form.\n\nLena',
                findings: [{ phrase: 'phone 415-555-0142', type: 'PII', confidence: 93 }],
            },
            {
                sender: 'Lena Fischer',
                recipients: ['Sarah Chen'],
                sentAt: '2026-02-09T16:15:00Z',
                body: 'Also noted chronic migraine treatment in the free-text field.\n\nLena',
                findings: [{ phrase: 'chronic migraine treatment', type: 'PHI', confidence: 89 }],
            },
            {
                sender: 'Sarah Chen',
                recipients: ['Lena Fischer'],
                sentAt: '2026-02-09T17:00:00Z',
                body: 'Escalating with the redaction preview on.\n\nSarah',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-44601',
        custodianId: 'c-1024',
        custodianName: 'Sarah Chen',
        sourceType: 'EMAIL',
        subject: 'RE: Incident bridge notes',
        receivedAt: '2026-02-08T07:30:00Z',
        messages: [
            {
                sender: 'Sarah Chen',
                recipients: ['Priya Nair'],
                sentAt: '2026-02-08T07:30:00Z',
                body: 'Bridge notes captured. Collection was performed at the direction of counsel.\n\nSarah',
                findings: [{ phrase: 'at the direction of counsel', type: 'PRIVILEGE', confidence: 92 }],
            },
            {
                sender: 'Priya Nair',
                recipients: ['Sarah Chen'],
                sentAt: '2026-02-08T08:05:00Z',
                body: 'Saved to the privileged folder.\n\nPriya',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-44544',
        custodianId: 'c-1025',
        custodianName: 'Marcus Webb',
        sourceType: 'EMAIL',
        subject: 'RE: Data retention exceptions',
        receivedAt: '2026-02-07T13:44:00Z',
        messages: [
            {
                sender: 'Marcus Webb',
                recipients: ['David Okafor'],
                sentAt: '2026-02-07T13:44:00Z',
                body: 'Exceptions list for Q3 is attached.\n\nMarcus',
                findings: [],
            },
            {
                sender: 'David Okafor',
                recipients: ['Marcus Webb'],
                sentAt: '2026-02-07T14:10:00Z',
                body: 'Received, filing under retention policy.\n\nDavid',
                findings: [],
            },
            {
                sender: 'Marcus Webb',
                recipients: ['David Okafor'],
                sentAt: '2026-02-07T14:12:00Z',
                body: 'Thanks.\n\nMarcus',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-44902',
        custodianId: 'c-1026',
        custodianName: 'Priya Nair',
        sourceType: 'EMAIL',
        subject: 'RE: Privileged draft — response strategy',
        receivedAt: '2026-02-12T09:05:00Z',
        messages: [
            {
                sender: 'Priya Nair',
                recipients: ['Sarah Chen'],
                sentAt: '2026-02-12T09:05:00Z',
                body: 'This memo is attorney work product. Do not forward.\n\nPriya',
                findings: [{ phrase: 'attorney work product', type: 'PRIVILEGE', confidence: 98 }],
            },
            {
                sender: 'Sarah Chen',
                recipients: ['Priya Nair'],
                sentAt: '2026-02-12T09:22:00Z',
                body: 'Understood, restricted access set.\n\nSarah',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-44955',
        custodianId: 'c-1027',
        custodianName: 'David Okafor',
        sourceType: 'EMAIL',
        subject: 'RE: Contractor onboarding docs',
        receivedAt: '2026-02-12T11:35:00Z',
        messages: [
            {
                sender: 'David Okafor',
                recipients: ['Lena Fischer'],
                sentAt: '2026-02-12T11:35:00Z',
                body: 'Contractor packet includes passport number P7712043.\n\nDavid',
                findings: [{ phrase: 'passport number P7712043', type: 'PII', confidence: 91 }],
            },
            {
                sender: 'Lena Fischer',
                recipients: ['David Okafor'],
                sentAt: '2026-02-12T12:00:00Z',
                body: 'Please move that to the secure vault.\n\nLena',
                findings: [],
            },
            {
                sender: 'David Okafor',
                recipients: ['Lena Fischer'],
                sentAt: '2026-02-12T12:20:00Z',
                body: 'Moved.\n\nDavid',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-45010',
        custodianId: 'c-1028',
        custodianName: 'Lena Fischer',
        sourceType: 'EMAIL',
        subject: 'RE: Claim adjustment codes',
        receivedAt: '2026-02-13T08:20:00Z',
        messages: [
            {
                sender: 'Lena Fischer',
                recipients: ['Marcus Webb'],
                sentAt: '2026-02-13T08:20:00Z',
                body: 'Adjustment sheet references diagnosis code F41.1 for two claimants.\n\nLena',
                findings: [{ phrase: 'diagnosis code F41.1', type: 'PHI', confidence: 86 }],
            },
            {
                sender: 'Marcus Webb',
                recipients: ['Lena Fischer'],
                sentAt: '2026-02-13T08:55:00Z',
                body: 'Handling as PHI, redaction preview enabled.\n\nMarcus',
                findings: [],
            },
        ],
    },

    // ── PDFs ───────────────────────────────────────────────────────────────────
    {
        id: 'DOC-45077',
        custodianId: 'c-1024',
        custodianName: 'Sarah Chen',
        sourceType: 'PDF',
        subject: 'Vendor SOC 2 attestation',
        receivedAt: '2026-02-06T10:00:00Z',
        messages: [
            {
                sender: 'Vendor Assurance',
                recipients: ['Sarah Chen'],
                sentAt: '2026-02-06T10:00:00Z',
                body: 'SOC 2 Type II attestation for the vendor, covering the period January to December. No exceptions noted in the opinion letter.',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-45120',
        custodianId: 'c-1025',
        custodianName: 'Marcus Webb',
        sourceType: 'PDF',
        subject: 'Medical leave claim summary',
        receivedAt: '2026-02-06T15:30:00Z',
        messages: [
            {
                sender: 'HR Operations',
                recipients: ['Marcus Webb'],
                sentAt: '2026-02-06T15:30:00Z',
                body: 'Summary of medical leave for chemotherapy taken between March and June. Supporting documentation retained by HR only.',
                findings: [{ phrase: 'medical leave for chemotherapy', type: 'PHI', confidence: 94 }],
            },
        ],
    },
    {
        id: 'DOC-45188',
        custodianId: 'c-1026',
        custodianName: 'Priya Nair',
        sourceType: 'PDF',
        subject: 'Counsel memo — litigation hold scope',
        receivedAt: '2026-02-05T09:15:00Z',
        messages: [
            {
                sender: 'Outside Counsel',
                recipients: ['Priya Nair'],
                sentAt: '2026-02-05T09:15:00Z',
                body: 'Draft scope memo prepared by outside counsel for the litigation hold. Distribution limited to the matter team.',
                findings: [{ phrase: 'prepared by outside counsel', type: 'PRIVILEGE', confidence: 96 }],
            },
        ],
    },
    {
        id: 'DOC-45230',
        custodianId: 'c-1027',
        custodianName: 'David Okafor',
        sourceType: 'PDF',
        subject: 'Account statements extract',
        receivedAt: '2026-02-05T13:40:00Z',
        messages: [
            {
                sender: 'Finance Systems',
                recipients: ['David Okafor'],
                sentAt: '2026-02-05T13:40:00Z',
                body: 'Extract of statements for account 5512-8890-114 covering the disputed period. Balances reconciled against the ledger.',
                findings: [{ phrase: 'account 5512-8890-114', type: 'PII', confidence: 90 }],
            },
        ],
    },
    {
        id: 'DOC-45299',
        custodianId: 'c-1028',
        custodianName: 'Lena Fischer',
        sourceType: 'PDF',
        subject: 'Third-party audit findings',
        receivedAt: '2026-02-04T16:25:00Z',
        messages: [
            {
                sender: 'Internal Audit',
                recipients: ['Lena Fischer'],
                sentAt: '2026-02-04T16:25:00Z',
                body: 'Third-party audit findings summary. Twelve observations raised, none rated critical by the reviewing partner.',
                findings: [],
            },
        ],
    },

    // ── Chat logs ──────────────────────────────────────────────────────────────
    {
        id: 'DOC-45341',
        custodianId: 'c-1024',
        custodianName: 'Sarah Chen',
        sourceType: 'CHAT',
        subject: 'Chat: incident #4412',
        receivedAt: '2026-02-13T09:14:00Z',
        messages: [
            {
                sender: 'Sarah Chen',
                recipients: ['#incident-4412'],
                sentAt: '2026-02-13T09:14:00Z',
                body: '09:14 Sarah: customer contact is dana.reyes@mailbox.com',
                findings: [{ phrase: 'dana.reyes@mailbox.com', type: 'PII', confidence: 90 }],
            },
            {
                sender: 'Marcus Webb',
                recipients: ['#incident-4412'],
                sentAt: '2026-02-13T09:16:00Z',
                body: '09:16 Marcus: copy, logging it now',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-45388',
        custodianId: 'c-1025',
        custodianName: 'Marcus Webb',
        sourceType: 'CHAT',
        subject: 'Chat: breach triage',
        receivedAt: '2026-02-13T10:02:00Z',
        messages: [
            {
                sender: 'Marcus Webb',
                recipients: ['#breach-triage'],
                sentAt: '2026-02-13T10:02:00Z',
                body: '10:02 Marcus: triage call starting, bridge open',
                findings: [],
            },
            {
                sender: 'Priya Nair',
                recipients: ['#breach-triage'],
                sentAt: '2026-02-13T10:05:00Z',
                body: '10:05 Priya: joining',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-45450',
        custodianId: 'c-1026',
        custodianName: 'Priya Nair',
        sourceType: 'CHAT',
        subject: 'Chat: legal hold distribution',
        receivedAt: '2026-02-13T11:20:00Z',
        messages: [
            {
                sender: 'Priya Nair',
                recipients: ['#legal-hold'],
                sentAt: '2026-02-13T11:20:00Z',
                body: '11:20 Priya: this channel is privileged and confidential',
                findings: [{ phrase: 'privileged and confidential', type: 'PRIVILEGE', confidence: 95 }],
            },
            {
                sender: 'David Okafor',
                recipients: ['#legal-hold'],
                sentAt: '2026-02-13T11:21:00Z',
                body: '11:21 David: acknowledged',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-45512',
        custodianId: 'c-1027',
        custodianName: 'David Okafor',
        sourceType: 'CHAT',
        subject: 'Chat: HR escalation',
        receivedAt: '2026-02-13T14:40:00Z',
        messages: [
            {
                sender: 'David Okafor',
                recipients: ['#hr-escalation'],
                sentAt: '2026-02-13T14:40:00Z',
                body: '14:40 David: short-term disability claim filed for the employee',
                findings: [{ phrase: 'short-term disability claim', type: 'PHI', confidence: 87 }],
            },
            {
                sender: 'Lena Fischer',
                recipients: ['#hr-escalation'],
                sentAt: '2026-02-13T14:42:00Z',
                body: '14:42 Lena: routing to HR only',
                findings: [],
            },
        ],
    },
    {
        id: 'DOC-45590',
        custodianId: 'c-1028',
        custodianName: 'Lena Fischer',
        sourceType: 'CHAT',
        subject: 'Chat: customer refund thread',
        receivedAt: '2026-02-13T16:05:00Z',
        messages: [
            {
                sender: 'Lena Fischer',
                recipients: ['#refunds'],
                sentAt: '2026-02-13T16:05:00Z',
                body: '16:05 Lena: refund issued to card ending 4417',
                findings: [{ phrase: 'card ending 4417', type: 'PII', confidence: 92 }],
            },
            {
                sender: 'Sarah Chen',
                recipients: ['#refunds'],
                sentAt: '2026-02-13T16:07:00Z',
                body: '16:07 Sarah: noted',
                findings: [],
            },
        ],
    },
];

// Builders
function buildMessages(seed: DocumentSeed): { messages: MockEmailMessage[]; findings: MockAIFinding[] } {
    const messages: MockEmailMessage[] = [];
    const findings: MockAIFinding[] = [];

    seed.messages.forEach((msg, index) => {
        const messageId = `${seed.id}-M${index + 1}`;

        messages.push({
            id: messageId,
            sender: msg.sender,
            recipients: msg.recipients,
            body: msg.body,
            sentAt: msg.sentAt,
        });

        msg.findings.forEach((finding, findingIndex) => {
            const { start, end } = offsetsOf(msg.body, finding.phrase);

            findings.push({
                id: `${messageId}-F${findingIndex + 1}`,
                messageId,
                start,
                end,
                type: finding.type,
                confidence: finding.confidence,
                status: 'PENDING',
            });
        });
    });

    return { messages, findings };
}

function buildDocument(seed: DocumentSeed): ReviewDocument {
    const { messages, findings } = buildMessages(seed);
    const responsiveness: Responsiveness = 'UNREVIEWED';

    return {
        id: seed.id,
        matterId: MATTER_ID,
        custodianId: seed.custodianId,
        custodianName: seed.custodianName,
        sourceType: seed.sourceType,
        subject: seed.subject,
        receivedAt: seed.receivedAt,
        threadCount: messages.length,
        checksum: mockSha256(seed.id),
        messages,
        findings,
        coding: { ...DEFAULT_CODING, responsiveness },
    };
}

// Data
export const MOCK_DOCUMENTS: readonly ReviewDocument[] = SEEDS.map(buildDocument);
