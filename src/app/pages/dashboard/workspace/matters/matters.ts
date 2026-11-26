import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardPageHeader } from '../../components/dashboard-page-header/dashboard-page-header';
import { LegalHoldTracker, MatterStatCard, MattersTable } from './components';
import { AckFilter } from './models/matters.models';
import { MattersStore } from './store/matters-store';

/*
   Matters

   Matters & Legal Holds workspace. Holds live KPI counts, the inspected
   matter selection and delegates preservation actions to MattersStore.
*/
@Component({
    selector: 'app-matters',
    imports: [DashboardPageHeader, MatterStatCard, MattersTable, LegalHoldTracker],
    templateUrl: './matters.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Matters {
    // Vars
    private readonly store = inject(MattersStore);

    readonly matters = this.store.matters;
    readonly activeMatterId = this.store.activeMatterId;
    readonly inspectedMatterId = this.store.inspectedMatterId;
    readonly ackFilter = signal<AckFilter>('ALL');

    // Derived
    readonly activeMattersCount = computed(
        () => this.store.matters().filter((m) => m.status !== 'CLOSED').length,
    );

    readonly custodiansOnHoldCount = computed(
        () => this.store.custodians().filter((c) => c.holdActive).length,
    );

    readonly overdueAckCount = computed(
        () => this.store.custodians().filter((c) => c.ackStatus === 'OVERDUE').length,
    );

    readonly custodianCounts = computed(() => {
        const counts: Record<string, number> = {};

        for (const c of this.store.custodians()) {
            counts[c.matterId] = (counts[c.matterId] ?? 0) + 1;
        }

        return counts;
    });

    readonly inspectedMatter = computed(
        () => this.store.matters().find((m) => m.id === this.inspectedMatterId()) ?? null,
    );

    readonly isInspectedActive = computed(
        () => this.inspectedMatterId() === this.activeMatterId(),
    );

    readonly inspectedCustodians = computed(() => {
        const matterId = this.inspectedMatterId();
        const filter = this.ackFilter();

        return this.store
            .custodians()
            .filter(
                (c) => c.matterId === matterId && (filter === 'ALL' || c.ackStatus === filter),
            );
    });

    // Handlers
    onInspectMatter(matterId: string): void {
        this.store.selectInspectedMatter(matterId);
        this.ackFilter.set('ALL');
    }

    onSwitchActiveMatter(matterId: string): void {
        this.store.switchActiveMatter(matterId);
        this.ackFilter.set('ALL');
    }

    onAckFilterChange(filter: AckFilter): void {
        this.ackFilter.set(filter);
    }

    onSendReminder(custodianId: string): void {
        this.store.sendReminder(custodianId);
    }

    onToggleHold(custodianId: string): void {
        this.store.toggleLegalHold(custodianId);
    }
}
