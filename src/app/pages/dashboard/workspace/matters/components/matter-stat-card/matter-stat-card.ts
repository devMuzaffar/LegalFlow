/*
   Matter Stat Card

   Compact KPI panel for the Matters header strip. Displays a live count,
   supporting subtitle and a tone-coded icon badge.
*/

import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppCard } from '../../../../components/app-card/app-card';
import { StatTone } from '../../models/matters.models';

@Component({
    selector: 'app-matter-stat-card',
    imports: [AppCard, DecimalPipe],
    templateUrl: './matter-stat-card.html',
    host: { class: 'block h-full' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatterStatCard {
    // Vars
    readonly title = input.required<string>();
    readonly value = input.required<number>();
    readonly subtitle = input.required<string>();
    readonly icon = input.required<string>();
    readonly tone = input<StatTone>('sky');

    // Derived
    readonly iconWrapClass = computed(() => {
        switch (this.tone()) {
            case 'sky':
                return 'bg-sky-50 text-sky-700';
            case 'emerald':
                return 'bg-emerald-50 text-emerald-700';
            case 'amber':
                return 'bg-amber-50 text-amber-700';
            case 'rose':
                return 'bg-rose-50 text-rose-700';
        }
    });

    readonly valueClass = computed(() =>
        this.tone() === 'rose'
            ? 'text-rose-700'
            : this.tone() === 'emerald'
                ? 'text-emerald-700'
                : 'text-surface-900',
    );
}
