/*
   Legal Hold Tracker

   Custodian preservation table for the inspected matter. Supports status
   filtering, sending preservation reminders, toggling holds and jumping to
   document review for active matter custodians.
*/

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { AppCard } from '../../../../components/app-card/app-card';
import { AckFilter, HoldAckStatus, LegalHoldCustodian, MatterRecord } from '../../models/matters.models';

@Component({
    selector: 'app-legal-hold-tracker',
    imports: [
        DatePipe,
        FormsModule,
        RouterLink,
        AppCard,
        TableModule,
        Tag,
        ButtonDirective,
        SelectButton,
        Tooltip,
    ],
    templateUrl: './legal-hold-tracker.html',
    host: { class: 'block' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalHoldTracker {
    // Vars
    readonly matter = input<MatterRecord | null>(null);
    readonly custodians = input.required<readonly LegalHoldCustodian[]>();
    readonly isActiveMatter = input.required<boolean>();
    readonly ackFilter = input<AckFilter>('ALL');

    readonly ackFilterChange = output<AckFilter>();
    readonly sendReminder = output<string>();
    readonly toggleHold = output<string>();

    readonly filterOptions: { label: string; value: AckFilter }[] = [
        { label: 'All', value: 'ALL' },
        { label: 'Acknowledged', value: 'ACKNOWLEDGED' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Overdue', value: 'OVERDUE' },
    ];

    // Derived
    readonly rows = computed(() => [...this.custodians()]);

    readonly cardTitle = computed(() => {
        const m = this.matter();
        return m ? `${m.id} — ${m.name}` : 'Legal Hold Preservation Tracker';
    });

    // Helpers
    ackLabel(status: HoldAckStatus): string {
        switch (status) {
            case 'ACKNOWLEDGED':
                return 'Acknowledged';
            case 'PENDING':
                return 'Pending';
            case 'OVERDUE':
                return 'Overdue';
        }
    }

    ackSeverity(status: HoldAckStatus): 'success' | 'info' | 'danger' {
        switch (status) {
            case 'ACKNOWLEDGED':
                return 'success';
            case 'PENDING':
                return 'info';
            case 'OVERDUE':
                return 'danger';
        }
    }
}
