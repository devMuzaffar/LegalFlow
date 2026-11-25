import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../../../components/app-card/app-card';

/*
   KPI Ingestion

   Ingested volume against review-ready documents, with the SHA-256 dedup
   yield as a percentage.
*/
@Component({
    selector: 'app-kpi-ingestion',
    imports: [AppCard, Tag, DecimalPipe],
    templateUrl: './kpi-ingestion.html',
    host: { class: 'block h-full' },
})
export class KpiIngestion {
    // Vars
    readonly uploaded = input.required<number>();
    readonly reviewReady = input.required<number>();
    readonly dedupPct = input.required<number>();
}
