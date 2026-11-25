// Imports
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DashboardPageHeader } from '../../components/dashboard-page-header/dashboard-page-header';
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
    readonly activeMatterId = signal(FALLBACK_MATTER.id);
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

    // Handlers
    onMatterChange(id: string): void {
        this.activeMatterId.set(id);
    }
}
