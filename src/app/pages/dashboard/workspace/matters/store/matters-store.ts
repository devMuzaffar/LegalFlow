/*
   Matters Store

   Root-level signal store for litigation matters and custodian legal holds.
   Shares activeMatterId and auditEvents with ReviewStore so Overview and
   Document Review update live.
*/

import { Injectable, inject, signal } from '@angular/core';
import { ReviewStore } from '../../document-review/store/review-store';
import { MOCK_CUSTODIANS, MOCK_MATTERS } from '../data/mock-matters.data';
import { LegalHoldCustodian, MatterRecord } from '../models/matters.models';

// Helpers
function cloneMatters(): MatterRecord[] {
    return MOCK_MATTERS.map((m) => ({ ...m }));
}

function cloneCustodians(): LegalHoldCustodian[] {
    return MOCK_CUSTODIANS.map((c) => ({ ...c, sources: [...c.sources] }));
}

@Injectable({ providedIn: 'root' })
export class MattersStore {
    // Vars
    private readonly reviewStore = inject(ReviewStore);
    private readonly _matters = signal<MatterRecord[]>(cloneMatters());
    private readonly _custodians = signal<LegalHoldCustodian[]>(cloneCustodians());
    private readonly _inspectedMatterId = signal<string>(this.reviewStore.activeMatterId());

    // Read
    readonly matters = this._matters.asReadonly();
    readonly custodians = this._custodians.asReadonly();
    readonly activeMatterId = this.reviewStore.activeMatterId;
    readonly inspectedMatterId = this._inspectedMatterId.asReadonly();

    // Mutations
    selectInspectedMatter(matterId: string): void {
        this._inspectedMatterId.set(matterId);
    }

    switchActiveMatter(matterId: string): void {
        this.reviewStore.setActiveMatter(matterId);
        this._inspectedMatterId.set(matterId);
    }

    sendReminder(custodianId: string): void {
        const target = this._custodians().find((c) => c.id === custodianId);

        if (!target || target.ackStatus === 'ACKNOWLEDGED' || !target.holdActive) {
            return;
        }

        this._custodians.update((list) =>
            list.map((c) =>
                c.id === custodianId
                    ? {
                          ...c,
                          lastRemindedAt: 'Just now',
                          ackStatus: c.ackStatus === 'OVERDUE' ? 'PENDING' : c.ackStatus,
                      }
                    : c,
            ),
        );

        this.reviewStore.recordAuditEvent(
            'LEGAL_HOLD_REMINDER',
            target.matterId,
            `Preservation reminder sent to ${target.name}`,
        );
    }

    toggleLegalHold(custodianId: string): void {
        const target = this._custodians().find((c) => c.id === custodianId);

        if (!target) {
            return;
        }

        const nextHoldActive = !target.holdActive;

        this._custodians.update((list) =>
            list.map((c) => (c.id === custodianId ? { ...c, holdActive: nextHoldActive } : c)),
        );

        this.reviewStore.recordAuditEvent(
            nextHoldActive ? 'LEGAL_HOLD_ISSUED' : 'LEGAL_HOLD_RELEASED',
            target.matterId,
            `${nextHoldActive ? 'Legal hold issued for' : 'Legal hold released for'} ${target.name}`,
        );
    }
}
