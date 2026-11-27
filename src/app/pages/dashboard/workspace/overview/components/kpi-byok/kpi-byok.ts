/*
   KPI Byok

   Bring-your-own-key vault size, token usage and the per-document AI fee.
*/

import { Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../../../components/app-card/app-card';

@Component({
    selector: 'app-kpi-byok',
    imports: [AppCard, Tag],
    templateUrl: './kpi-byok.html',
    host: { class: 'block h-full' },
})
export class KpiByok {
    // Vars
    readonly vaultGb = input.required<number>();
    readonly tokensM = input.required<string>();
    readonly perDocFee = input.required<number>();
}
