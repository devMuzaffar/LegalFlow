import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { MockAIFinding, ReviewDocument } from '../../models/review.models';
import { buildSegments } from '../../utils/text-segments';

/*
   Evidence Reader Pane

   Sticky metadata bar plus the stacked thread reader. Findings render as typed
   segments produced by the offset splitter, never via `[innerHTML]`.
*/
@Component({
    selector: 'app-evidence-reader-pane',
    imports: [FormsModule, DatePipe, ButtonDirective, ToggleSwitch, Tooltip],
    templateUrl: './evidence-reader-pane.html',
    host: { class: 'flex h-full min-h-0 flex-col' },
})
export class EvidenceReaderPane {
    // Vars
    readonly document = input<ReviewDocument | null>(null);
    readonly showRedactions = input<boolean>(false);

    readonly redactionChange = output<boolean>();
    readonly prev = output<void>();
    readonly next = output<void>();

    // Derived
    readonly threads = computed(() => {
        const doc = this.document();

        if (!doc) {
            return [];
        }

        return doc.messages.map((message) => ({
            message,
            segments: buildSegments(message.body, doc.findings, message.id),
        }));
    });

    // Helpers
    shortHash(value: string): string {
        return `${value.slice(0, 10)}…${value.slice(-4)}`;
    }

    /** Redaction blocks cover unreversed PII/PHI/privilege spans. */
    isRedacted(finding: MockAIFinding | undefined): boolean {
        return !!finding && finding.status !== 'REVERSED' && this.showRedactions();
    }

    markClass(finding: MockAIFinding | undefined): string {
        if (!finding) {
            return '';
        }

        if (finding.status === 'REVERSED') {
            return 'rounded-sm bg-surface-200/60 px-0.5 text-muted-color line-through';
        }

        switch (finding.type) {
            case 'PRIVILEGE':
                return 'rounded-sm bg-amber-100 px-0.5 text-amber-950';
            case 'PHI':
                return 'rounded-sm bg-purple-100 px-0.5 text-purple-950';
            case 'PII':
                return 'rounded-sm bg-rose-100 px-0.5 text-rose-950';
        }
    }
}
