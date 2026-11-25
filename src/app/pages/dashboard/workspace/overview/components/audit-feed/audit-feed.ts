import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tag } from 'primeng/tag';
import { Timeline } from 'primeng/timeline';
import { Tooltip } from 'primeng/tooltip';
import { AppCard } from '../../../../components/app-card/app-card';
import { AuditEntry } from '../../data/matters';

/*
   Audit Feed

   Recent immutable audit trail rendered as a vertical timeline. Shows the
   action, actor role, document ID and a truncated SHA-256 hash.
*/
@Component({
    selector: 'app-audit-feed',
    imports: [AppCard, Timeline, Tag, RouterLink, Tooltip],
    templateUrl: './audit-feed.html',
    host: { class: 'block' },
})
export class AuditFeed {
    // Vars
    readonly entries = input.required<readonly AuditEntry[]>();

    // Derived
    readonly events = computed(() => [...this.entries()]);

    // Helpers
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
