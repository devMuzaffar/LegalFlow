/*
   Processing Jobs Table

   Pipeline ledger showing container extraction, deduplication yield, OCR
   exceptions with hover diagnostics and inline Retry OCR recovery.
*/

import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { SelectButton } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { AppCard } from '../../../../components/app-card/app-card';
import { JobStage, JobStatus, JobStatusFilter } from '../../models/processing.models';
import { ProcessingStore } from '../../store/processing-store';

@Component({
    selector: 'app-processing-jobs-table',
    imports: [
        DecimalPipe,
        FormsModule,
        AppCard,
        TableModule,
        Tag,
        ButtonDirective,
        ProgressBar,
        SelectButton,
        Tooltip,
    ],
    templateUrl: './processing-jobs-table.html',
    host: { class: 'block' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessingJobsTable {
    // Vars
    private readonly store = inject(ProcessingStore);

    readonly statusFilter = signal<JobStatusFilter>('ALL');

    readonly filterOptions: { label: string; value: JobStatusFilter }[] = [
        { label: 'All', value: 'ALL' },
        { label: 'Running', value: 'RUNNING' },
        { label: 'Queued', value: 'QUEUED' },
        { label: 'Exception', value: 'EXCEPTION' },
        { label: 'Completed', value: 'COMPLETED' },
    ];

    // Derived
    readonly rows = computed(() => {
        const filter = this.statusFilter();
        const jobs = this.store.jobs();

        return filter === 'ALL' ? jobs : jobs.filter((job) => job.status === filter);
    });

    // Handlers
    onRetryOcr(jobId: string): void {
        this.store.retryOcr(jobId);
    }

    // Helpers
    stageLabel(stage: JobStage): string {
        switch (stage) {
            case 'EXTRACT':
                return 'Extract';
            case 'DEDUP':
                return 'SHA-256 Dedup';
            case 'OCR':
                return 'OCR & Text';
            case 'THREADING':
                return 'Threading';
            case 'AI_PRESCAN':
                return 'AI Scan';
        }
    }

    stageSeverity(stage: JobStage): 'info' | 'warn' | 'secondary' {
        switch (stage) {
            case 'OCR':
                return 'warn';
            case 'AI_PRESCAN':
                return 'info';
            case 'EXTRACT':
            case 'DEDUP':
            case 'THREADING':
                return 'secondary';
        }
    }

    statusLabel(status: JobStatus): string {
        switch (status) {
            case 'COMPLETED':
                return 'Completed';
            case 'RUNNING':
                return 'Running';
            case 'EXCEPTION':
                return 'Exception';
            case 'QUEUED':
                return 'Queued';
        }
    }

    statusSeverity(status: JobStatus): 'success' | 'info' | 'danger' | 'secondary' {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'RUNNING':
                return 'info';
            case 'EXCEPTION':
                return 'danger';
            case 'QUEUED':
                return 'secondary';
        }
    }
}
