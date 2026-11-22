import { Component, input } from '@angular/core';

/**
 * Page header for dashboard screens: title + optional subtitle, plus an action
 * slot projected to the far right.
 *
 * Usage:
 * ```html
 * <dashboard-page-header title="Overview" subtitle="...">
 *   <button pButton>Any control</button>
 * </dashboard-page-header>
 * ```
 */
@Component({
    selector: 'dashboard-page-header',
    templateUrl: './dashboard-page-header.html',
})
export class DashboardPageHeader {
    readonly title = input.required<string>();
    readonly subtitle = input<string>('');
}
