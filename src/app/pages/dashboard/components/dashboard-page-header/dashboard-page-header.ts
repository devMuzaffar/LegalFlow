import { Component, input } from '@angular/core';

/*
   Dashboard Page Header

   Page title with optional subtitle and a right-aligned action slot for page
   level controls.
*/
@Component({
    selector: 'dashboard-page-header',
    templateUrl: './dashboard-page-header.html',
})
export class DashboardPageHeader {
    // Vars
    readonly title = input.required<string>();
    readonly subtitle = input<string>('');
}
