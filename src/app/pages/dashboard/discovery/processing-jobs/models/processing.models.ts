/*
   Processing Models

   Data contracts for container ingestion, SHA-256 deduplication, OCR stages
   and job status filtering.
*/

// Types
export type JobStage = 'EXTRACT' | 'DEDUP' | 'OCR' | 'THREADING' | 'AI_PRESCAN';
export type JobStatus = 'COMPLETED' | 'RUNNING' | 'EXCEPTION' | 'QUEUED';
export type JobStatusFilter = 'ALL' | JobStatus;
export type ProcessingStatTone = 'sky' | 'emerald' | 'amber' | 'rose';

export interface ProcessingJob {
    id: string;
    matterId: string;
    containerName: string;
    custodianName: string;
    stage: JobStage;
    status: JobStatus;
    docsIn: number;
    docsOut: number;
    dedupPct: number;
    exceptions: number;
    startedAt: string;
    errorNote?: string;
}
