import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Tag } from 'primeng/tag';
import { Toolbar } from 'primeng/toolbar';
import { ReviewDocument } from '../../models/review.models';

/*
   Document List Pane

   Compact, scrollable cards for the current page of filtered documents, a
   sticky paginator footer and a keyboard shortcut legend.
*/
@Component({
    selector: 'app-document-list-pane',
    imports: [DatePipe, Tag, ButtonDirective, Paginator, Toolbar],
    templateUrl: './document-list-pane.html',
    host: { class: 'flex h-full min-h-0 flex-col' },
})
export class DocumentListPane {
    // Vars
    readonly documents = input.required<readonly ReviewDocument[]>();
    readonly selectedId = input<string | null>(null);
    readonly first = input<number>(0);
    readonly total = input<number>(0);
    readonly rows = input<number>(10);

    readonly select = output<string>();
    readonly pageChange = output<number>();
    readonly resetFilters = output<void>();

    // Helpers
    sourceSeverity(type: ReviewDocument['sourceType']): 'info' | 'warn' | 'secondary' {
        switch (type) {
            case 'EMAIL':
                return 'info';
            case 'PDF':
                return 'warn';
            case 'CHAT':
                return 'secondary';
        }
    }

    riskTypes(doc: ReviewDocument): string[] {
        const types = new Set<string>();

        for (const finding of doc.findings) {
            if (finding.status === 'REVERSED') continue;
            types.add(finding.type === 'PHI' ? 'PHI' : finding.type);
        }

        return [...types];
    }

    isCoded(doc: ReviewDocument): boolean {
        return doc.coding.responsiveness !== 'UNREVIEWED';
    }

    onPage(event: PaginatorState): void {
        this.pageChange.emit(event.first ?? 0);
    }
}
