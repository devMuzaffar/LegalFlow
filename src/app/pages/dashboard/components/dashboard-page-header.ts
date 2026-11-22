import { Component, input } from '@angular/core';

@Component({
  selector: 'dashboard-page-header',
  template: `
    <section class="flex flex-col gap-2">

        <!-- Title -->
        <h1 class="text-xl font-semibold text-surface-900">{{ title() }}</h1>

        <!-- Subtitle -->
        @if (subtitle()) {
          <p class="text-sm text-muted-color">{{subtitle()}}</p>
        }
      </section>
  `,
})
export class AuthPageHeader {
  title = input.required<string>();
  subtitle = input<string>('');
}
