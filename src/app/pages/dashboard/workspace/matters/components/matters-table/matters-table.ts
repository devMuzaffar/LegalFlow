/*
   Matters Table

   Directory of active and archived litigation matters. Clicking a row selects
   it for legal-hold inspection; Switch Active promotes it workspace-wide.
*/

import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../../../components/app-card/app-card';
import { MatterRecord, MatterStatus } from '../../models/matters.models';

@Component({
    selector: 'app-matters-table',
    imports: [AppCard, TableModule, Tag, ButtonDirective, DecimalPipe],
    templateUrl: './matters-table.html',
    host: { class: 'block' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MattersTable {
    // Vars
    readonly matters = input.required<readonly MatterRecord[]>();
    readonly custodianCounts = input.required<Record<string, number>>();
    readonly activeMatterId = input.required<string>();
    readonly inspectedMatterId = input.required<string>();

    readonly inspect = output<string>();
    readonly switchActive = output<string>();

    // Derived
    readonly rows = computed(() => [...this.matters()]);

    // Helpers
    statusLabel(status: MatterStatus): string {
        switch (status) {
            case 'HOLD_ACTIVE':
                return 'Hold Active';
            case 'ACTIVE':
                return 'Active';
            case 'CLOSED':
                return 'Closed';
        }
    }

    statusSeverity(status: MatterStatus): 'warn' | 'success' | 'secondary' {
        switch (status) {
            case 'HOLD_ACTIVE':
                return 'warn';
            case 'ACTIVE':
                return 'success';
            case 'CLOSED':
                return 'secondary';
        }
    }

    custodianCount(matterId: string): number {
        return this.custodianCounts()[matterId] ?? 0;
    }
}
