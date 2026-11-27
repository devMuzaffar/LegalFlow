/*
   Processing Jobs

   Discovery ingestion and deduplication workspace. Derives the pipeline KPI
   strip from ProcessingStore; the ledger panel owns its own filter and retry.
*/

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Tag } from 'primeng/tag';
import { DashboardPageHeader } from '../../components/dashboard-page-header/dashboard-page-header';
import { DiscoveryStatCard } from '../components/discovery-stat-card/discovery-stat-card';
import { ProcessingJobsTable } from './components';
import { ProcessingStore } from './store/processing-store';

@Component({
    selector: 'app-processing-jobs',
    imports: [Tag, DashboardPageHeader, DiscoveryStatCard, ProcessingJobsTable],
    templateUrl: './processing-jobs.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessingJobs {
    // Vars
    private readonly store = inject(ProcessingStore);

    readonly activeMatterId = this.store.activeMatterId;

    // Derived
    readonly totalIngested = computed(() =>
        this.store.jobs().reduce((sum, job) => sum + job.docsIn, 0),
    );

    readonly reviewReadyTotal = computed(() =>
        this.store.jobs().reduce((sum, job) => sum + job.docsOut, 0),
    );

    readonly duplicatesRemoved = computed(() => this.totalIngested() - this.reviewReadyTotal());

    readonly overallDedupPct = computed(() => {
        const total = this.totalIngested();
        return total ? Math.round((this.duplicatesRemoved() / total) * 100) : 0;
    });

    readonly exceptionsCount = computed(() =>
        this.store.jobs().reduce((sum, job) => sum + job.exceptions, 0),
    );

    readonly activeJobsCount = computed(
        () =>
            this.store.jobs().filter((job) => job.status === 'RUNNING' || job.status === 'QUEUED')
                .length,
    );

    readonly containerCount = computed(() => this.store.jobs().length);
}
