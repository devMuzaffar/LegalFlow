import { Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

/** Zone 2d — bring-your-own-key vault and token usage. */
@Component({
    selector: 'app-kpi-byok',
    imports: [Card, Tag],
    templateUrl: './kpi-byok.html',
    host: { class: 'block h-full' },
})
export class KpiByok {
    readonly vaultGb = input.required<number>();
    /** Tokens in millions, pre-formatted to one decimal. */
    readonly tokensM = input.required<string>();
    readonly perDocFee = input.required<number>();
}
