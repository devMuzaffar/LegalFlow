import { Component, computed, input } from '@angular/core';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

const numberFormat = new Intl.NumberFormat('en-US');

/** Zone 2c — AI pre-scan flag counts, each rendered as a severity tag. */
@Component({
    selector: 'app-kpi-risk-flags',
    imports: [Card, Tag],
    templateUrl: './kpi-risk-flags.html',
    host: { class: 'block h-full' },
})
export class KpiRiskFlags {
    readonly privilege = input.required<number>();
    readonly pii = input.required<number>();
    readonly reversed = input.required<number>();

    /** p-tag only accepts strings, so the counts are pre-formatted. */
    readonly privilegeLabel = computed(() => numberFormat.format(this.privilege()));
    readonly piiLabel = computed(() => numberFormat.format(this.pii()));
    readonly reversedLabel = computed(() => numberFormat.format(this.reversed()));
}
