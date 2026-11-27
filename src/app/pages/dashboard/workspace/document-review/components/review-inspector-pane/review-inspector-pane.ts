/*
   Review Inspector Pane

   Reversible AI findings and the legal coding form. Reversals require a reason
   before they can be submitted; coding saves are blocked for auditors.
*/

import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import {
    DocumentCoding,
    MockAIFinding,
    PrivilegeTag,
    Responsiveness,
    ReviewDocument,
    ReviewerRole,
} from '../../models/review.models';

@Component({
    selector: 'app-review-inspector-pane',
    imports: [
        FormsModule,
        ButtonDirective,
        Select,
        Tag,
        Textarea,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel,
    ],
    templateUrl: './review-inspector-pane.html',
    host: { class: 'flex h-full min-h-0 flex-col' },
})
export class ReviewInspectorPane {
    // Vars
    readonly document = input<ReviewDocument | null>(null);
    readonly role = input<ReviewerRole>('Lead Reviewer');

    readonly confirm = output<string>();
    readonly reverse = output<{ findingId: string; reason: string }>();
    readonly saveCoding = output<DocumentCoding>();

    readonly reversingId = signal<string | null>(null);
    readonly reason = signal('');
    readonly activeTab = signal<'findings' | 'coding'>('findings');

    // Options
    readonly responsivenessOptions: { label: string; value: Responsiveness }[] = [
        { label: 'Unreviewed', value: 'UNREVIEWED' },
        { label: 'Responsive', value: 'RESPONSIVE' },
        { label: 'Non-Responsive', value: 'NON_RESPONSIVE' },
        { label: 'Further Review', value: 'FURTHER_REVIEW' },
    ];

    readonly privilegeOptions: { label: string; value: PrivilegeTag }[] = [
        { label: 'None', value: 'NONE' },
        { label: 'Attorney-Client', value: 'ATTORNEY_CLIENT' },
        { label: 'Work Product', value: 'WORK_PRODUCT' },
    ];

    // Derived
    readonly findings = computed(() => this.document()?.findings ?? []);

    readonly responsiveness = linkedSignal<Responsiveness>(
        () => this.document()?.coding.responsiveness ?? 'UNREVIEWED',
    );
    readonly privilege = linkedSignal<PrivilegeTag>(() => this.document()?.coding.privilege ?? 'NONE');
    readonly notes = linkedSignal<string>(() => this.document()?.coding.notes ?? '');

    readonly isAuditor = computed(() => this.role() === 'Compliance Auditor');

    readonly canSave = computed(() => {
        const doc = this.document();

        if (!doc || this.isAuditor()) {
            return false;
        }

        return (
            doc.coding.responsiveness !== this.responsiveness() ||
            doc.coding.privilege !== this.privilege() ||
            doc.coding.notes !== this.notes()
        );
    });

    readonly canSubmitReversal = computed(() => this.reason().trim().length > 0);

    // Handlers
    startReversal(findingId: string): void {
        this.reversingId.set(findingId);
        this.reason.set('');
    }

    cancelReversal(): void {
        this.reversingId.set(null);
        this.reason.set('');
    }

    submitReversal(): void {
        const findingId = this.reversingId();

        if (!findingId || !this.canSubmitReversal()) {
            return;
        }

        this.reverse.emit({ findingId, reason: this.reason().trim() });
        this.reversingId.set(null);
        this.reason.set('');
    }

    onSave(): void {
        if (!this.canSave()) {
            return;
        }

        this.saveCoding.emit({
            responsiveness: this.responsiveness(),
            privilege: this.privilege(),
            notes: this.notes(),
        });
    }

    // Helpers
    typeSeverity(type: MockAIFinding['type']): 'danger' | 'warn' | 'info' {
        switch (type) {
            case 'PII':
                return 'danger';
            case 'PHI':
                return 'warn';
            case 'PRIVILEGE':
                return 'info';
        }
    }

    statusSeverity(status: MockAIFinding['status']): 'success' | 'warn' | 'secondary' {
        switch (status) {
            case 'CONFIRMED':
                return 'success';
            case 'REVERSED':
                return 'warn';
            case 'PENDING':
                return 'secondary';
        }
    }

    snippet(finding: MockAIFinding): string {
        const doc = this.document();
        const message = doc?.messages.find((m) => m.id === finding.messageId);

        return message ? message.body.slice(finding.start, finding.end) : '';
    }
}
