import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { AppCard } from '../../../../components/app-card/app-card';
import { Matter } from '../../data/matters';

/**
 * Zone 1 — active matter context: title, ID, legal hold pill and the primary
 * CTA back into the review queue. The matter switcher lives in the page
 * header's action slot.
 */
@Component({
    selector: 'app-matter-context-strip',
    imports: [RouterLink, ButtonDirective, Tag, AppCard],
    templateUrl: './matter-context-strip.html',
    host: { class: 'block' },
})
export class MatterContextStrip {
    readonly matter = input.required<Matter>();
}
