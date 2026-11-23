import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { AppCard } from '../../../../components/app-card/app-card';

/** Zone 2b — coding progress with a PrimeNG progress bar. */
@Component({
    selector: 'app-kpi-review-velocity',
    imports: [AppCard, ProgressBar, DecimalPipe],
    templateUrl: './kpi-review-velocity.html',
    host: { class: 'block h-full' },
})
export class KpiReviewVelocity {
    readonly codedPct = input.required<number>();
    readonly coded = input.required<number>();
    readonly pending = input.required<number>();
}
