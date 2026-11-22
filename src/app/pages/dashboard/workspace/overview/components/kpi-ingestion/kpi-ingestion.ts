import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

/** Zone 2a — ingestion volume and dedup yield. */
@Component({
    selector: 'app-kpi-ingestion',
    imports: [Card, Tag, DecimalPipe],
    templateUrl: './kpi-ingestion.html',
    host: { class: 'block h-full' },
})
export class KpiIngestion {
    readonly uploaded = input.required<number>();
    readonly reviewReady = input.required<number>();
    readonly dedupPct = input.required<number>();
}
