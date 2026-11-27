/*
   Auth Layout

   Split layout for unauthenticated screens: brand panel on the left, routed
   form on the right. The brand panel hides below `lg`.
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
  // Vars
  protected readonly year = new Date().getFullYear();
}
