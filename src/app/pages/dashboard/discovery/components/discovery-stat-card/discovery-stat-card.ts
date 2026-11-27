/*
   Discovery Stat Card

   Compact KPI panel shared by Discovery routes. Displays a live numeric
   figure, optional inline status tag, supporting caption and tone-coded icon.
*/

import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../../components/app-card/app-card';

@Component({
    selector: 'app-discovery-stat-card',
    imports: [AppCard, Tag, DecimalPipe],
    templateUrl: './discovery-stat-card.html',
    host: { class: 'block h-full' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoveryStatCard {
    // Vars
    readonly title = input.required<string>();
    readonly value = input.required<number>();
    readonly subtitle = input.required<string>();
    readonly icon = input.required<string>();
    readonly tone = input<'sky' | 'emerald' | 'amber' | 'rose'>('sky');
    readonly badge = input<string | null>(null);
    readonly badgeSeverity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary'>('secondary');

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

    readonly valueClass = computed(() => {
        switch (this.tone()) {
            case 'rose':
                return 'text-rose-700';
            case 'emerald':
                return 'text-emerald-700';
            case 'amber':
                return 'text-amber-700';
            case 'sky':
                return 'text-surface-900';
        }
    });
}
