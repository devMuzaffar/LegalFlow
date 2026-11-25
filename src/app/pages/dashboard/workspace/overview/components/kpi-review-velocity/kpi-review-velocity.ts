import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { AppCard } from '../../../../components/app-card/app-card';

/*
   KPI Review Velocity

   Coding progress against pending documents, visualised with a PrimeNG
   progress bar.
*/
@Component({
    selector: 'app-kpi-review-velocity',
    imports: [AppCard, ProgressBar, DecimalPipe],
    templateUrl: './kpi-review-velocity.html',
    host: { class: 'block h-full' },
})
export class KpiReviewVelocity {
    // Vars
    readonly codedPct = input.required<number>();
    readonly coded = input.required<number>();
    readonly pending = input.required<number>();
}
