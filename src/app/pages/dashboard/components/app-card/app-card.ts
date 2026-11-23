import { Component, input } from '@angular/core';

/**
 * Dashboard panel.
 *
 * - `title`    — header line, styled `text-color font-semibold leading-6`
 * - `subtitle` — muted second line under the title
 * - `[action]` — projected to the far right of the header line
 *
 * Usage:
 * ```html
 * <app-card title="Ingestion" subtitle="Last 24h">
 *   <p-tag action value="39%" severity="success" />
 *   ...body...
 * </app-card>
 * ```
 */
@Component({
    selector: 'app-card',
    templateUrl: './app-card.html',
    host: { class: 'block h-full' },
})
export class AppCard {
    readonly title = input<string>('');
    readonly subtitle = input<string>('');
}
