import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { ReviewDocument } from '../../models/review.models';

/*
   Document List Pane

   Compact, scrollable cards for the current page of filtered documents, a
   sticky paginator footer with rows-per-page selection and range summary.
*/
@Component({
    selector: 'app-document-list-pane',
    imports: [DatePipe, FormsModule, Tag, ButtonDirective, Paginator, Select],
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
    readonly rowsOptions = [5, 10, 25, 50];

    readonly select = output<string>();
    readonly pageChange = output<{ first: number; rows: number }>();
    readonly resetFilters = output<void>();

    // Derived
    readonly rangeStart = computed(() => (this.total() === 0 ? 0 : this.first() + 1));
    readonly rangeEnd = computed(() => Math.min(this.first() + this.rows(), this.total()));

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

    // Handlers
    onPage(event: PaginatorState): void {
        this.pageChange.emit({
            first: event.first ?? 0,
            rows: event.rows ?? this.rows(),
        });
    }

    onRowsChange(rows: number): void {
        this.pageChange.emit({
            first: 0,
            rows,
        });
    }
}
