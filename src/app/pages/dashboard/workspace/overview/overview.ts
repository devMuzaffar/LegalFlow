import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DashboardPageHeader } from '../../components/dashboard-page-header/dashboard-page-header';
import { AuditFeed } from './components/audit-feed/audit-feed';
import { CustodianRisk } from './components/custodian-risk/custodian-risk';
import { FileTypeMix } from './components/file-type-mix/file-type-mix';
import { KpiByok } from './components/kpi-byok/kpi-byok';
import { KpiIngestion } from './components/kpi-ingestion/kpi-ingestion';
import { KpiReviewVelocity } from './components/kpi-review-velocity/kpi-review-velocity';
import { KpiRiskFlags } from './components/kpi-risk-flags/kpi-risk-flags';
import { MatterContextStrip } from './components/matter-context-strip/matter-context-strip';
import { PipelineStrip } from './components/pipeline-strip/pipeline-strip';
import { FALLBACK_MATTER, MATTERS } from './data/matters';

/**
 * ECA Command Center.
 * Holds the active matter and the KPIs derived from it; every zone is a
 * presentational component that receives plain values.
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
    /** Single source of truth. Move to a shared service when the top bar gets a matter switcher. */
    readonly activeMatterId = signal(FALLBACK_MATTER.id);
    readonly matters = MATTERS;

    /** Options for the header's matter switcher. */
    readonly matterOptions = MATTERS.map((m) => ({ label: `${m.id} — ${m.name}`, value: m.id }));

    readonly matter = computed(
        () => MATTERS.find((m) => m.id === this.activeMatterId()) ?? FALLBACK_MATTER,
    );

    /** SHA-256 duplicates removed during ingestion. */
    readonly dedupPct = computed(() => {
        const m = this.matter();
        return m.uploaded ? Math.round((1 - m.reviewReady / m.uploaded) * 100) : 0;
    });

    /** Share of review-ready documents that have been coded. */
    readonly codedPct = computed(() => {
        const m = this.matter();
        const total = m.coded + m.pending;
        return total ? Math.round((m.coded / total) * 100) : 0;
    });

    /** AI tokens consumed, in millions to one decimal. */
    readonly tokensM = computed(() => (this.matter().aiTokens / 1_000_000).toFixed(1));

    /** Switches the active matter from the header's switcher. */
    onMatterChange(id: string): void {
        this.activeMatterId.set(id);
    }
}
