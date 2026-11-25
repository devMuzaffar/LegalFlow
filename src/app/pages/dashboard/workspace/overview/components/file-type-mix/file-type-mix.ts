import { Component, computed, input } from '@angular/core';
import { MeterGroup, MeterItem } from 'primeng/metergroup';
import { AppCard } from '../../../../components/app-card/app-card';
import { FileType } from '../../data/matters';

// Constants
const COLORS = ['var(--p-primary-color)', 'var(--p-sky-400)', 'var(--p-amber-400)'];

/*
   File Type Mix

   File type distribution of the review-ready corpus as a stacked meter, with
   no chart library involved.
*/
@Component({
    selector: 'app-file-type-mix',
    imports: [AppCard, MeterGroup],
    templateUrl: './file-type-mix.html',
    host: { class: 'block h-full' },
})
export class FileTypeMix {
    // Vars
    readonly fileTypes = input.required<readonly FileType[]>();

    // Derived
    readonly meters = computed<MeterItem[]>(() =>
        this.fileTypes().map((type, i) => ({
            label: type.label,
            value: type.pct,
            color: COLORS[i % COLORS.length],
        })),
    );
}
