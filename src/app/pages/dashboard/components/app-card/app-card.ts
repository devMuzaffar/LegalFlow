import { Component, input } from '@angular/core';

/*
   App Card

   Dashboard panel container. Takes a title and optional subtitle, and projects
   anything marked `action` to the right edge of the header line.
*/
@Component({
    selector: 'app-card',
    templateUrl: './app-card.html',
    host: { class: 'block h-full' },
})
export class AppCard {
    // Vars
    readonly title = input<string>('');
    readonly subtitle = input<string>('');
}
