import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../../../components/app-card/app-card';

/** Zone 2a — ingestion volume and dedup yield. */
@Component({
    selector: 'app-kpi-ingestion',
    imports: [AppCard, Tag, DecimalPipe],
    templateUrl: './kpi-ingestion.html',
    host: { class: 'block h-full' },
})
export class KpiIngestion {
    readonly uploaded = input.required<number>();
    readonly reviewReady = input.required<number>();
    readonly dedupPct = input.required<number>();
}
