import { Component, computed, input } from '@angular/core';
import { MeterGroup, MeterItem } from 'primeng/metergroup';
import { FileType } from '../../data/matters';

/** Palette for the stacked meter, in order. */
const COLORS = ['var(--p-primary-color)', 'var(--p-sky-400)', 'var(--p-amber-400)'];

/** Zone 5 — file type mix as a PrimeNG stacked meter. */
@Component({
    selector: 'app-file-type-mix',
    imports: [MeterGroup],
    templateUrl: './file-type-mix.html',
    host: { class: 'block h-full' },
})
export class FileTypeMix {
    readonly fileTypes = input.required<readonly FileType[]>();

    /**
     * MeterGroup renders `label` followed by its own percentage, so the label is
     * just the type name — appending the pct here would print it twice.
     */
    readonly meters = computed<MeterItem[]>(() =>
        this.fileTypes().map((type, i) => ({
            label: type.label,
            value: type.pct,
            color: COLORS[i % COLORS.length],
        })),
    );
}
