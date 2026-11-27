/*
   Document Review

   Review and search workspace: toolbar, three-pane split layout and URL-synced
   selection. All state lives in the root ReviewStore.
*/

import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Splitter, SplitterPanel } from 'primeng/splitter';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../components/app-card/app-card';
import { DashboardPageHeader } from '../../components/dashboard-page-header/dashboard-page-header';
import { FALLBACK_MATTER, MATTERS } from '../overview/data/matters';
import { DocumentListPane } from './components/document-list-pane/document-list-pane';
import { EvidenceReaderPane } from './components/evidence-reader-pane/evidence-reader-pane';
import { ReviewInspectorPane } from './components/review-inspector-pane/review-inspector-pane';
import { ReviewToolbar } from './components/review-toolbar/review-toolbar';
import {
    DocumentCoding,
    FilterChip,
    ReviewDocument,
    SearchMode,
} from './models/review.models';
import { ReviewStore } from './store/review-store';

// Constants
const PAGE_SIZE = 10;

/** Token/synonym expansion for the honestly-labelled semantic demo. */
const SYNONYMS: Record<string, string[]> = {
    breach: ['incident', 'exposure', 'compromise'],
    privilege: ['counsel', 'attorney', 'work product', 'confidential'],
    privileged: ['counsel', 'attorney', 'work product', 'confidential'],
    pii: ['ssn', 'email', 'passport', 'account', 'phone', 'card'],
    phi: ['medical', 'diagnosis', 'disability', 'treatment', 'claim'],
    hold: ['preserve', 'retention', 'litigation'],
    wire: ['transfer', 'reconciliation', 'payment'],
};

@Component({
    selector: 'app-document-review',
    imports: [
        Splitter,
        SplitterPanel,
        DashboardPageHeader,
        ReviewToolbar,
        DocumentListPane,
        EvidenceReaderPane,
        ReviewInspectorPane,
        AppCard,
        Tag,
    ],
    templateUrl: './document-review.html',
    host: {
        class: 'block',
        '(document:keydown)': 'onKeydown($event)',
    },
})
export class DocumentReview {
    // Vars
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly store = inject(ReviewStore);

    readonly pageSize = signal(PAGE_SIZE);
    readonly role = this.store.activeRole;

    private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });

    // Derived
    readonly filters = computed(() => {
        const params = this.params();

        return {
            query: params.get('q') ?? '',
            mode: (params.get('mode') === 'boolean' ? 'boolean' : 'semantic') as SearchMode,
            filter: (params.get('filter') ?? 'all') as FilterChip,
            custodian: params.get('custodian'),
            docId: params.get('docId'),
        };
    });

    readonly custodianName = computed(() => {
        const key = this.filters().custodian;

        if (!key) {
            return null;
        }

        const match = this.store.documents().find((doc) => this.matchesCustodian(doc, key));

        return match?.custodianName ?? key;
    });

    readonly corpusSize = computed(
        () =>
            MATTERS.find((matter) => matter.id === this.store.activeMatterId())?.reviewReady ??
            FALLBACK_MATTER.reviewReady,
    );

    readonly filteredDocuments = computed(() => {
        const { query, mode, filter, custodian } = this.filters();
        let docs = this.store.documents();

        if (custodian) {
            docs = docs.filter((doc) => this.matchesCustodian(doc, custodian));
        }

        if (filter === 'threads') {
            docs = docs.filter((doc) => doc.sourceType === 'EMAIL' && doc.threadCount > 1);
        }

        if (filter === 'pii') {
            docs = docs.filter((doc) =>
                doc.findings.some((f) => f.type === 'PII' || f.type === 'PHI'),
            );
        }

        if (filter === 'privileged') {
            docs = docs.filter(
                (doc) =>
                    doc.findings.some((f) => f.type === 'PRIVILEGE') || doc.coding.privilege !== 'NONE',
            );
        }

        if (filter === 'unreviewed') {
            docs = docs.filter((doc) => doc.coding.responsiveness === 'UNREVIEWED');
        }

        if (query.trim()) {
            docs =
                mode === 'boolean'
                    ? docs.filter((doc) => this.matchesBoolean(doc, query))
                    : docs.filter((doc) => this.matchesSemantic(doc, query));
        }

        return docs;
    });

    readonly selectedDocId = computed(() => {
        const requested = this.filters().docId;
        const docs = this.filteredDocuments();

        if (requested && docs.some((doc) => doc.id === requested)) {
            return requested;
        }

        return docs[0]?.id ?? null;
    });

    /** Deep links land on the right page; filter changes drop back to page one. */
    readonly first = linkedSignal(() => {
        const docs = this.filteredDocuments();
        const rows = this.pageSize();
        const index = docs.findIndex((doc) => doc.id === this.selectedDocId());

        return index >= 0 ? Math.floor(index / rows) * rows : 0;
    });

    readonly pagedDocuments = computed(() =>
        this.filteredDocuments().slice(this.first(), this.first() + this.pageSize()),
    );

    readonly selectedDocument = computed(
        () => this.filteredDocuments().find((doc) => doc.id === this.selectedDocId()) ?? null,
    );

    /** Per-document viewer state resets whenever the selection changes. */
    readonly viewerState = linkedSignal(() => ({
        showRedactions: false,
    }));

    readonly showRedactions = computed(() => this.viewerState().showRedactions);

    // Handlers
    onQueryChange(query: string): void {
        this.syncUrl({ q: query || null, docId: null });
    }

    onModeChange(mode: SearchMode): void {
        this.syncUrl({ mode: mode === 'semantic' ? null : mode, docId: null });
    }

    onFilterChange(filter: FilterChip): void {
        this.syncUrl({ filter: filter === 'all' ? null : filter, docId: null });
    }

    onClearCustodian(): void {
        this.syncUrl({ custodian: null, docId: null });
    }

    onResetFilters(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { q: null, mode: null, filter: null, custodian: null, docId: null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    onSelect(docId: string): void {
        this.syncUrl({ docId });
    }

    onPageChange(event: { first: number; rows: number }): void {
        if (event.rows !== this.pageSize()) {
            this.pageSize.set(event.rows);
            return;
        }

        this.first.set(event.first);

        const docs = this.filteredDocuments();
        const target = docs[event.first] ?? docs[0];

        if (target) {
            this.syncUrl({ docId: target.id });
        }
    }

    onRedactionChange(value: boolean): void {
        this.viewerState.update((state) => ({ ...state, showRedactions: value }));
    }

    onStep(delta: number): void {
        const docs = this.filteredDocuments();
        const index = docs.findIndex((doc) => doc.id === this.selectedDocId());
        const target = docs[index + delta];

        if (target) {
            this.syncUrl({ docId: target.id });
        }
    }

    onConfirm(findingId: string): void {
        const doc = this.selectedDocument();

        if (doc) {
            this.store.confirmFinding(doc.id, findingId);
        }
    }

    onReverse(event: { findingId: string; reason: string }): void {
        const doc = this.selectedDocument();

        if (doc) {
            this.store.reverseFinding(doc.id, event.findingId, event.reason);
        }
    }

    onSaveCoding(coding: DocumentCoding): void {
        const doc = this.selectedDocument();

        if (doc) {
            this.store.saveCoding(doc.id, coding);
        }
    }

    onKeydown(event: KeyboardEvent): void {
        // Focus guard: never hijack typing or modifier combos
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        const target = event.target as HTMLElement | null;

        if (target?.closest('input, textarea, select, [contenteditable="true"], p-select')) {
            return;
        }

        const key = event.key.toLowerCase();

        if (key === 'j') {
            this.onStep(1);
        }

        if (key === 'k') {
            this.onStep(-1);
        }
    }

    // Helpers
    private syncUrl(patch: Record<string, string | null>): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: patch,
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    /** Accepts either the custodian id (`c-1024`) or a name slug (`sarah-chen`). */
    private matchesCustodian(doc: ReviewDocument, key: string): boolean {
        const slug = doc.custodianName.toLowerCase().replace(/\s+/g, '-');

        return doc.custodianId === key || slug === key;
    }

    private haystack(doc: ReviewDocument): string {
        return [doc.subject, doc.custodianName, ...doc.messages.map((m) => m.body)]
            .join(' ')
            .toLowerCase();
    }

    private matchesBoolean(doc: ReviewDocument, query: string): boolean {
        const tokens = query.match(/AND|OR|NOT|\S+/gi) ?? [];
        const haystack = this.haystack(doc);

        let result: boolean | null = null;
        let operator: 'AND' | 'OR' = 'AND';
        let negate = false;

        for (const token of tokens) {
            const upper = token.toUpperCase();

            if (upper === 'AND' || upper === 'OR') {
                operator = upper;
                continue;
            }

            if (upper === 'NOT') {
                negate = true;
                continue;
            }

            const hit = haystack.includes(token.toLowerCase());
            const term = negate ? !hit : hit;
            negate = false;

            result = result === null ? term : operator === 'AND' ? result && term : result || term;
        }

        return result ?? true;
    }

    private matchesSemantic(doc: ReviewDocument, query: string): boolean {
        const haystack = this.haystack(doc);
        const terms = query
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean)
            .flatMap((term) => [term, ...(SYNONYMS[term] ?? [])]);

        return terms.some((term) => haystack.includes(term));
    }
}
