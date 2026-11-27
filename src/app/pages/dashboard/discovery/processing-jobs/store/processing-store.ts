/*
   Processing Store

   Root-level signal store for ingestion and deduplication jobs. Retrying OCR
   clears job exceptions and appends an event to the shared ReviewStore audit
   trail.
*/

import { Injectable, inject, signal } from '@angular/core';
import { ReviewStore } from '../../../workspace/document-review/store/review-store';
import { MOCK_PROCESSING_JOBS } from '../data/mock-processing.data';
import { ProcessingJob } from '../models/processing.models';

// Helpers
function cloneJobs(): ProcessingJob[] {
    return MOCK_PROCESSING_JOBS.map((job) => ({ ...job }));
}

@Injectable({ providedIn: 'root' })

export class ProcessingStore {
    // Vars
    private readonly reviewStore = inject(ReviewStore);
    private readonly _jobs = signal<ProcessingJob[]>(cloneJobs());

    // Read
    readonly jobs = this._jobs.asReadonly();
    readonly activeMatterId = this.reviewStore.activeMatterId;

    // Mutations
    retryOcr(jobId: string): void {
        const target = this._jobs().find((job) => job.id === jobId);

        if (!target || target.status !== 'EXCEPTION') {
            return;
        }

        this._jobs.update((list) =>
            list.map((job) =>
                job.id === jobId
                    ? {
                        ...job,
                        status: 'COMPLETED',
                        exceptions: 0,
                        errorNote: undefined,
                    }
                    : job,
            ),
        );

        this.reviewStore.recordAuditEvent(
            'PROCESSING_RETRIED',
            target.id,
            `OCR retried and cleared for ${target.containerName}`,
        );
    }
}
