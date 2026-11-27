/*
   Privilege Log Table

   Schedule of privileged documents withheld from court production with one-click
   client-side CSV export.
*/

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../../../components/app-card/app-card';
import { PrivilegeType } from '../../models/productions.models';
import { ProductionsStore } from '../../store/productions-store';

@Component({
    selector: 'app-privilege-log-table',
    imports: [DatePipe, AppCard, TableModule, Tag, ButtonDirective],
    templateUrl: './privilege-log-table.html',
    host: { class: 'block h-full' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegeLogTable {
    // Vars
    private readonly store = inject(ProductionsStore);

    readonly entries = this.store.privilegeLog;

    // Derived
    readonly rows = computed(() => [...this.entries()]);

    // Handlers
    onDownloadCsv(): void {
        this.store.downloadPrivilegeCsv();
    }

    // Helpers
    privilegeSeverity(type: PrivilegeType): 'info' | 'warn' {
        return type === 'Attorney-Client' ? 'info' : 'warn';
    }
}
