/*
   Review Toolbar

   Search field, search-mode select and document filter on one twelve column
   grid, with the active custodian pill dropping to its own row.
*/

import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { AppCard } from '../../../../components/app-card/app-card';
import { FilterChip, SearchMode } from '../../models/review.models';

@Component({
    selector: 'app-review-toolbar',
    imports: [FormsModule, ButtonDirective, AppCard, IconField, InputIcon, InputText, Select],
    templateUrl: './review-toolbar.html',
    host: { class: 'block' },
})
export class ReviewToolbar {
    // Vars
    private readonly destroyRef = inject(DestroyRef);
    private timer?: ReturnType<typeof setTimeout>;

    readonly query = input<string>('');
    readonly mode = input<SearchMode>('semantic');
    readonly filter = input<FilterChip>('all');
    readonly custodianName = input<string | null>(null);

    readonly queryChange = output<string>();
    readonly modeChange = output<SearchMode>();
    readonly filterChange = output<FilterChip>();
    readonly clearCustodian = output<void>();

    // Options
    readonly modeOptions: { label: string; value: SearchMode }[] = [
        { label: 'Semantic', value: 'semantic' },
        { label: 'Boolean', value: 'boolean' },
    ];

    readonly filterOptions: { label: string; value: FilterChip }[] = [
        { label: 'All', value: 'all' },
        { label: 'Threads', value: 'threads' },
        { label: 'PII / PHI', value: 'pii' },
        { label: 'Privileged', value: 'privileged' },
        { label: 'Unreviewed', value: 'unreviewed' },
    ];

    constructor() {
        this.destroyRef.onDestroy(() => clearTimeout(this.timer));
    }

    // Handlers
    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.queryChange.emit(value), 200);
    }

    onModeChange(mode: SearchMode): void {
        this.modeChange.emit(mode);
    }

    onFilterChange(filter: FilterChip): void {
        this.filterChange.emit(filter);
    }
}
