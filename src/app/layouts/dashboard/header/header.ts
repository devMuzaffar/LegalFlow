import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { Sidebar } from '@primeicons/angular/sidebar';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, SidebarModule, Sidebar],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header { }
