import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tag } from 'primeng/tag';
import { Timeline } from 'primeng/timeline';
import { Tooltip } from 'primeng/tooltip';
import { AuditEntry } from '../../data/matters';

/** Zone 4 right — recent immutable audit trail as a PrimeNG timeline. */
@Component({
    selector: 'app-audit-feed',
    imports: [Timeline, Tag, RouterLink, Tooltip],
    templateUrl: './audit-feed.html',
    host: { class: 'block' },
})
export class AuditFeed {
    readonly entries = input.required<readonly AuditEntry[]>();

    /** p-timeline's [value] is typed as a mutable array. */
    readonly events = computed(() => [...this.entries()]);

    /** Truncated SHA-256: first 10 + last 4 hex chars. */
    shortHash(sha256: string): string {
        return `${sha256.slice(0, 10)}…${sha256.slice(-4)}`;
    }

    ago(minutes: number): string {
        if (minutes < 60) return `${minutes}m ago`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m ? `${h}h ${m}m ago` : `${h}h ago`;
    }

    label(action: AuditEntry['action']): string {
        switch (action) {
            case 'AI_DECISION_REVERSED':
                return 'AI reversed';
            case 'PRIVILEGE_CODED':
                return 'Privilege coded';
            case 'LEGAL_HOLD_ISSUED':
                return 'Legal hold issued';
        }
    }

    severity(action: AuditEntry['action']): 'danger' | 'info' | 'warn' {
        switch (action) {
            case 'AI_DECISION_REVERSED':
                return 'danger';
            case 'PRIVILEGE_CODED':
                return 'info';
            case 'LEGAL_HOLD_ISSUED':
                return 'warn';
        }
    }
}
