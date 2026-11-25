import { Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../../../components/app-card/app-card';

// Constants
const numberFormat = new Intl.NumberFormat('en-US');

/*
   KPI Risk Flags

   AI pre-scan counts for privilege, PII/PHI and human reversals, each rendered
   as a severity tag.
*/
@Component({
    selector: 'app-kpi-risk-flags',
    imports: [AppCard, Tag],
    templateUrl: './kpi-risk-flags.html',
    host: { class: 'block h-full' },
})
export class KpiRiskFlags {
    // Vars
    readonly privilege = input.required<number>();
    readonly pii = input.required<number>();
    readonly reversed = input.required<number>();

    // Derived
    readonly privilegeLabel = computed(() => numberFormat.format(this.privilege()));
    readonly piiLabel = computed(() => numberFormat.format(this.pii()));
    readonly reversedLabel = computed(() => numberFormat.format(this.reversed()));
}
