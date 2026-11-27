/*
   Production Exports

   Bates-numbered court production batches and withheld privilege log screen.
   Derives the KPI strip from ProductionsStore; the panels own their own actions.
*/

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Tag } from 'primeng/tag';
import { DashboardPageHeader } from '../../components/dashboard-page-header/dashboard-page-header';
import { DiscoveryStatCard } from '../components/discovery-stat-card/discovery-stat-card';
import { PrivilegeLogTable, ProductionBatchesTable } from './components';
import { ProductionsStore } from './store/productions-store';

@Component({
    selector: 'app-production-exports',
    imports: [
        Tag,
        DashboardPageHeader,
        DiscoveryStatCard,
        ProductionBatchesTable,
        PrivilegeLogTable,
    ],
    templateUrl: './production-exports.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionExports {
    // Vars
    private readonly store = inject(ProductionsStore);

    readonly activeMatterId = this.store.activeMatterId;

    // Derived
    readonly totalProducedDocs = computed(() =>
        this.store.batches().reduce((sum, batch) => sum + batch.docCount, 0),
    );

    readonly redactedDocuments = computed(() =>
        this.store.batches().reduce((sum, batch) => sum + batch.redactedCount, 0),
    );

    readonly privilegedWithheld = computed(() =>
        this.store.batches().reduce((sum, batch) => sum + batch.withheldPrivileged, 0),
    );

    readonly batchCount = computed(() => this.store.batches().length);
}
