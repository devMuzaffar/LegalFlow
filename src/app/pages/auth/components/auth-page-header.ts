import { Component, input } from '@angular/core';

/*
   Auth Page Header

   Title and optional subtitle block reused by the auth screens.
*/
@Component({
  selector: 'auth-page-header',
  template: `
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
        {{ title() }}
      </h1>
      @if (subtitle()) {
        <p class="mt-2 text-sm text-surface-600">
          {{ subtitle() }}
        </p>
      }
    </div>
  `,
})
export class AuthPageHeader {
  // Vars
  title = input<string>('');
  subtitle = input<string>('');
}
