import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { FilterChip, SearchMode } from '../../models/review.models';

/*
   Review Toolbar

   Search field with a semantic/boolean mode switch, filter chips, the active
   custodian pill and an honest scope badge.
*/
@Component({
    selector: 'app-review-toolbar',
    imports: [
        FormsModule,
        ButtonDirective,
        Card,
        IconField,
        InputIcon,
        InputText,
        SelectButton,
        Tag,
    ],
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
    readonly sampleSize = input<number>(0);
    readonly corpusSize = input<number>(7610);

    readonly queryChange = output<string>();
    readonly modeChange = output<SearchMode>();
    readonly filterChange = output<FilterChip>();
    readonly clearCustodian = output<void>();

    // Options
    readonly modeOptions = [
        { label: 'Semantic Demo', value: 'semantic' },
        { label: 'Boolean', value: 'boolean' },
    ];

    readonly filterOptions: { label: string; value: FilterChip }[] = [
        { label: 'All', value: 'all' },
        { label: 'Email Threads', value: 'threads' },
        { label: 'PII/PHI', value: 'pii' },
        { label: 'Privileged', value: 'privileged' },
        { label: 'Unreviewed', value: 'unreviewed' },
    ];

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
