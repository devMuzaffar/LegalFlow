// Imports
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DashboardPageHeader } from '../../components/dashboard-page-header/dashboard-page-header';
import { ReviewStore } from '../document-review/store/review-store';
import {
    AuditFeed,
    CustodianRisk,
    FileTypeMix,
    KpiByok,
    KpiIngestion,
    KpiReviewVelocity,
    KpiRiskFlags,
    MatterContextStrip,
    PipelineStrip,
} from './components';
import { FALLBACK_MATTER, MATTERS } from './data/matters';

/*
   Overview

   ECA Command Center. Holds the active matter and the KPIs derived from it;
   every zone is a presentational component that receives plain values.
*/
@Component({
    selector: 'app-overview',
    imports: [
        FormsModule,
        Select,
        DashboardPageHeader,
        MatterContextStrip,
        KpiIngestion,
        KpiReviewVelocity,
        KpiRiskFlags,
        KpiByok,
        PipelineStrip,
        CustodianRisk,
        AuditFeed,
        FileTypeMix,
    ],
    templateUrl: './overview.html',
})
export class Overview {
    // Vars
    private readonly reviewStore = inject(ReviewStore);

    readonly activeMatterId = this.reviewStore.activeMatterId;
    readonly matterOptions = MATTERS.map((m) => ({ label: `${m.id} — ${m.name}`, value: m.id }));

    // Derived
    readonly matter = computed(
        () => MATTERS.find((m) => m.id === this.activeMatterId()) ?? FALLBACK_MATTER,
    );

    /** Dedup yield. */
    readonly dedupPct = computed(() => {
        const m = this.matter();
        return m.uploaded ? Math.round((1 - m.reviewReady / m.uploaded) * 100) : 0;
    });

    /** Share of review-ready docs already coded. */
    readonly codedPct = computed(() => {
        const m = this.matter();
        const total = m.coded + m.pending;
        return total ? Math.round((m.coded / total) * 100) : 0;
    });

    /** Tokens used, in millions. */
    readonly tokensM = computed(() => (this.matter().aiTokens / 1_000_000).toFixed(1));

    /** Seed metric plus reversals made in the review workspace. */
    readonly humanReversed = computed(
        () => this.matter().humanReversed + this.reviewStore.reversedCount(),
    );

    /** Review-workspace events merged ahead of the seeded trail. */
    readonly auditEntries = computed(() => {
        const live = this.reviewStore.auditEvents().map((event) => ({
            id: event.id,
            action: event.action,
            actorRole: event.actorRole,
            docId: event.docId,
            minutesAgo: Math.max(
                0,
                Math.round((Date.now() - new Date(event.timestamp).getTime()) / 60000),
            ),
            sha256: event.hash,
        }));

        return [...live, ...this.matter().audit];
    });

    // Handlers
    onMatterChange(id: string): void {
        this.reviewStore.setActiveMatter(id);
    }
}
