/*
   Mock Processing Data

   Deterministic seed jobs for MTR-2026-01 aligned with /overview totals:
   12,480 ingested documents reduced to 7,610 review-ready (39% deduplication).
*/

import { ProcessingJob } from '../models/processing.models';

// Jobs
export const MOCK_PROCESSING_JOBS: readonly ProcessingJob[] = [
    {
        id: 'JOB-9041',
        matterId: 'MTR-2026-01',
        containerName: 'sarah_chen_mailbox_q3.pst',
        custodianName: 'Sarah Chen',
        stage: 'AI_PRESCAN',
        status: 'COMPLETED',
        docsIn: 3620,
        docsOut: 2140,
        dedupPct: 41,
        exceptions: 0,
        startedAt: '2026-02-10 08:12',
    },
    {
        id: 'JOB-9042',
        matterId: 'MTR-2026-01',
        containerName: 'marcus_webb_archive.zip',
        custodianName: 'Marcus Webb',
        stage: 'AI_PRESCAN',
        status: 'COMPLETED',
        docsIn: 3050,
        docsOut: 1865,
        dedupPct: 39,
        exceptions: 0,
        startedAt: '2026-02-10 09:05',
    },
    {
        id: 'JOB-9043',
        matterId: 'MTR-2026-01',
        containerName: 'priya_nair_slack_export.json',
        custodianName: 'Priya Nair',
        stage: 'AI_PRESCAN',
        status: 'COMPLETED',
        docsIn: 2510,
        docsOut: 1540,
        dedupPct: 39,
        exceptions: 0,
        startedAt: '2026-02-10 10:18',
    },
    {
        id: 'JOB-9044',
        matterId: 'MTR-2026-01',
        containerName: 'david_okafor_drive_dump.zip',
        custodianName: 'David Okafor',
        stage: 'OCR',
        status: 'EXCEPTION',
        docsIn: 1980,
        docsOut: 1205,
        dedupPct: 39,
        exceptions: 4,
        startedAt: '2026-02-11 07:40',
        errorNote: '4 password-protected PDFs skipped OCR',
    },
    {
        id: 'JOB-9045',
        matterId: 'MTR-2026-01',
        containerName: 'lena_fischer_mail_2026.pst',
        custodianName: 'Lena Fischer',
        stage: 'AI_PRESCAN',
        status: 'RUNNING',
        docsIn: 1320,
        docsOut: 860,
        dedupPct: 35,
        exceptions: 0,
        startedAt: '2026-02-12 06:55',
    },
];
