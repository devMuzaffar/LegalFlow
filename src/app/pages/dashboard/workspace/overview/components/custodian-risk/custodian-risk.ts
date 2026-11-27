/*
   Custodian Risk

   Per-custodian document and risk counts with a review progress column. The
   inspect action routes to the review queue filtered by custodian.
*/

import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../../../components/app-card/app-card';
import { Custodian } from '../../data/matters';

@Component({
    selector: 'app-custodian-risk',
    imports: [AppCard, TableModule, Tag, RouterLink, ButtonDirective, DecimalPipe, ProgressBar],
    templateUrl: './custodian-risk.html',
    host: { class: 'block' },
})
export class CustodianRisk {
    // Vars
    readonly custodians = input.required<readonly Custodian[]>();

    // Derived
    readonly rows = computed(() => [...this.custodians()]);

    // Helpers
    reviewPct(c: Custodian): number {
        return c.totalDocs ? Math.round((c.reviewed / c.totalDocs) * 100) : 0;
    }
}
