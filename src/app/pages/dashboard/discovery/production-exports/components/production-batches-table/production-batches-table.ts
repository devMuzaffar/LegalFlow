/*
   Production Batches Table

   Bates-numbered court export batches with status tags, lightweight read-only
   manifest drawer preview and JSON manifest export actions.
*/

import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { AppCard } from '../../../../components/app-card/app-card';
import { ProductionBatch, ProductionStatus } from '../../models/productions.models';
import { ProductionsStore } from '../../store/productions-store';

@Component({
    selector: 'app-production-batches-table',
    imports: [DatePipe, DecimalPipe, AppCard, TableModule, Tag, ButtonDirective, Drawer, Tooltip],
    templateUrl: './production-batches-table.html',
    host: { class: 'block h-full' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionBatchesTable {
    // Vars
    private readonly store = inject(ProductionsStore);

    readonly batches = this.store.batches;

    readonly previewBatch = signal<ProductionBatch | null>(null);
    readonly drawerVisible = signal(false);

    // Derived
    readonly rows = computed(() => [...this.batches()]);

    readonly previewJson = computed(() => {
        const batch = this.previewBatch();
        return batch ? JSON.stringify(this.store.buildManifestPayload(batch), null, 2) : '';
    });

    // Handlers
    openPreview(batch: ProductionBatch): void {
        this.previewBatch.set(batch);
        this.drawerVisible.set(true);
    }

    onDrawerVisibleChange(visible: boolean): void {
        this.drawerVisible.set(visible);
        if (!visible) {
            this.previewBatch.set(null);
        }
    }

    onExportManifest(batchId: string): void {
        this.store.exportManifest(batchId);
    }

    // Helpers
    statusLabel(status: ProductionStatus): string {
        switch (status) {
            case 'DELIVERED':
                return 'Delivered';
            case 'READY':
                return 'Ready';
            case 'DRAFT':
                return 'Draft';
        }
    }

    statusSeverity(status: ProductionStatus): 'success' | 'info' | 'secondary' {
        switch (status) {
            case 'DELIVERED':
                return 'success';
            case 'READY':
                return 'info';
            case 'DRAFT':
                return 'secondary';
        }
    }
}
