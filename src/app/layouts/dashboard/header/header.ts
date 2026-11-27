/*
   Header

   Dashboard top bar. Hosts the sidebar trigger, which resolves its target
   through the surrounding `p-sidebar-layout`.
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sidebar } from '@primeicons/angular/sidebar';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, SidebarModule, Sidebar],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header { }
