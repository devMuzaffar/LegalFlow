/*
   Productions Store

   Root-level signal store for Bates-numbered production batches and the
   withheld privilege log. Builds manifest JSON and CSV exports and appends
   events to ReviewStore.
*/

import { Injectable, inject, signal } from '@angular/core';
import { downloadTextFile } from '../../utils/download';
import { ReviewStore } from '../../../workspace/document-review/store/review-store';
import { MOCK_PRIVILEGE_LOG, MOCK_PRODUCTION_BATCHES } from '../data/mock-productions.data';
import { PrivilegeLogEntry, ProductionBatch } from '../models/productions.models';

// Helpers
function cloneBatches(): ProductionBatch[] {
    return MOCK_PRODUCTION_BATCHES.map((b) => ({ ...b }));
}

function clonePrivilegeLog(): PrivilegeLogEntry[] {
    return MOCK_PRIVILEGE_LOG.map((entry) => ({ ...entry }));
}

function escapeCsvCell(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
}

@Injectable({ providedIn: 'root' })
export class ProductionsStore {
    // Vars
    private readonly reviewStore = inject(ReviewStore);
    private readonly _batches = signal<ProductionBatch[]>(cloneBatches());
    private readonly _privilegeLog = signal<PrivilegeLogEntry[]>(clonePrivilegeLog());

    // Read
    readonly batches = this._batches.asReadonly();
    readonly privilegeLog = this._privilegeLog.asReadonly();
    readonly activeMatterId = this.reviewStore.activeMatterId;

    // Helpers
    buildManifestPayload(batch: ProductionBatch): Record<string, unknown> {
        return {
            batchId: batch.id,
            matterId: batch.matterId,
            name: batch.name,
            status: batch.status,
            format: batch.format,
            batesRange: {
                start: batch.batesStart,
                end: batch.batesEnd,
            },
            counts: {
                producedDocs: batch.docCount,
                redactedDocs: batch.redactedCount,
                withheldPrivileged: batch.withheldPrivileged,
            },
            createdAt: batch.createdAt,
            exportedAt: new Date().toISOString(),
        };
    }

    // Mutations
    exportManifest(batchId: string): void {
        const batch = this._batches().find((b) => b.id === batchId);

        if (!batch || batch.status === 'DRAFT') {
            return;
        }

        const payload = JSON.stringify(this.buildManifestPayload(batch), null, 2);
        downloadTextFile(`${batch.id}-manifest.json`, payload, 'application/json;charset=utf-8');

        this.reviewStore.recordAuditEvent(
            'PRODUCTION_EXPORTED',
            batch.id,
            `Exported production manifest for ${batch.name} (${batch.batesStart}–${batch.batesEnd})`,
        );
    }

    downloadPrivilegeCsv(): void {
        const header = ['Doc ID', 'Control #', 'Date', 'Custodian', 'Privilege Type', 'Withholding Basis'];
        const rows = this._privilegeLog().map((entry) =>
            [
                entry.docId,
                entry.batesControl,
                entry.date,
                entry.custodian,
                entry.privilegeType,
                entry.basis,
            ]
                .map(escapeCsvCell)
                .join(','),
        );

        const csv = [header.map(escapeCsvCell).join(','), ...rows].join('\r\n');
        downloadTextFile('MTR-2026-01-privilege-log.csv', csv, 'text/csv;charset=utf-8');

        this.reviewStore.recordAuditEvent(
            'PRIVILEGE_LOG_EXPORTED',
            'MTR-2026-01',
            `Downloaded withheld privilege log CSV (${this._privilegeLog().length} entries)`,
        );
    }
}
