/*
   Review Store

   Root-level signal store for the review queue. Holds documents and the
   append-only audit trail, and exposes the mutations the inspector uses.
   Overview reads `reversedCount` and `auditEvents` so both screens stay in sync.
*/

import { Injectable, computed, signal } from '@angular/core';
import { MOCK_DOCUMENTS } from '../data/mock-documents.data';
import {
    DocumentCoding,
    ReviewAuditAction,
    ReviewAuditEvent,
    ReviewDocument,
    ReviewerRole,
} from '../models/review.models';
import { mockSha256 } from '../utils/text-segments';

// Helpers
function cloneDocuments(): ReviewDocument[] {
    return MOCK_DOCUMENTS.map((doc) => ({
        ...doc,
        messages: doc.messages.map((m) => ({ ...m, recipients: [...m.recipients] })),
        findings: doc.findings.map((f) => ({ ...f })),
        coding: { ...doc.coding },
    }));
}

function nowIso(): string {
    return new Date().toISOString();
}

@Injectable({ providedIn: 'root' })
export class ReviewStore {
    // Vars
    private readonly _documents = signal<ReviewDocument[]>(cloneDocuments());
    private readonly _auditEvents = signal<ReviewAuditEvent[]>([]);
    private readonly _activeMatterId = signal('MTR-2026-01');
    private readonly _activeRole = signal<ReviewerRole>('Lead Reviewer');
    private sequence = 0;

    // Read
    readonly documents = this._documents.asReadonly();
    readonly auditEvents = this._auditEvents.asReadonly();
    readonly activeMatterId = this._activeMatterId.asReadonly();
    readonly activeRole = this._activeRole.asReadonly();

    readonly reversedCount = computed(() =>
        this._documents().reduce(
            (sum, doc) => sum + doc.findings.filter((f) => f.status === 'REVERSED').length,
            0,
        ),
    );

    readonly confirmedCount = computed(() =>
        this._documents().reduce(
            (sum, doc) => sum + doc.findings.filter((f) => f.status === 'CONFIRMED').length,
            0,
        ),
    );

    // Mutations
    confirmFinding(docId: string, findingId: string): void {
        this.updateFinding(docId, findingId, 'CONFIRMED', undefined);
        this.appendAudit('AI_CONFIRMED', docId, `Finding ${findingId} confirmed`);
    }

    reverseFinding(docId: string, findingId: string, reason: string): boolean {
        const trimmed = reason.trim();

        if (!trimmed) {
            return false;
        }

        this.updateFinding(docId, findingId, 'REVERSED', trimmed);
        this.appendAudit('AI_REVERSED', docId, `Finding ${findingId} reversed — ${trimmed}`);

        return true;
    }

    saveCoding(docId: string, coding: DocumentCoding): void {
        const documents = this._documents().map((doc) =>
            doc.id === docId ? { ...doc, coding: { ...coding } } : doc,
        );

        this._documents.set(documents);

        const action: ReviewAuditAction =
            coding.privilege !== 'NONE' ? 'PRIVILEGE_CODED' : 'CODING_SAVED';

        this.appendAudit(action, docId, `Coding saved · ${coding.responsiveness}`);
    }

    setRole(role: ReviewerRole): void {
        this._activeRole.set(role);
    }

    // Helpers
    private updateFinding(
        docId: string,
        findingId: string,
        status: 'CONFIRMED' | 'REVERSED',
        decisionReason: string | undefined,
    ): void {
        const documents = this._documents().map((doc) => {
            if (doc.id !== docId) {
                return doc;
            }

            return {
                ...doc,
                findings: doc.findings.map((finding) =>
                    finding.id === findingId ? { ...finding, status, decisionReason } : finding,
                ),
            };
        });

        this._documents.set(documents);
    }

    private appendAudit(action: ReviewAuditAction, docId: string, detail: string): void {
        const event: ReviewAuditEvent = {
            id: `EVT-${++this.sequence}`,
            timestamp: nowIso(),
            actorRole: this._activeRole(),
            action,
            docId,
            detail,
            hash: mockSha256(`${docId}:${action}:${this.sequence}`),
        };

        this._auditEvents.update((events) => [event, ...events]);
    }
}
