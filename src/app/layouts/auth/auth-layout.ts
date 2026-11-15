import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
  /** Used in the footer note of the brand panel. */
  protected readonly year = new Date().getFullYear();
}
