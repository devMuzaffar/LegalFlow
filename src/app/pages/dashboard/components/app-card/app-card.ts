/*
   App Card

   Dashboard panel container. Takes a title and optional subtitle, and projects
   anything marked `action` to the right edge of the header line.
*/

import { Component, input } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './app-card.html',
    host: { class: 'block h-full' },
})
export class AppCard {
    // Vars
    readonly title = input<string>('');
    readonly subtitle = input<string>('');

    /** Card padding. Pass `p-0`/`p-2` for flush panels; replaces the default `p-4`. */
    readonly bodyClass = input<string>('p-4');
}
