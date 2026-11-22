import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import { ProgressBar } from 'primeng/progressbar';

/** Zone 2b — coding progress with a PrimeNG progress bar. */
@Component({
    selector: 'app-kpi-review-velocity',
    imports: [Card, ProgressBar, DecimalPipe],
    templateUrl: './kpi-review-velocity.html',
    host: { class: 'block h-full' },
})
export class KpiReviewVelocity {
    readonly codedPct = input.required<number>();
    readonly coded = input.required<number>();
    readonly pending = input.required<number>();
}
