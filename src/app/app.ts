import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/*
   App
*/
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  // Vars
  protected readonly title = signal('LegalFlow');
}
