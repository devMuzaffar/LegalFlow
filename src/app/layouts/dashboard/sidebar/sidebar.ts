import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChevronDown } from '@primeicons/angular/chevron-down';
import { PIcon } from '@primeicons/angular/p-icon';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { NAV_GROUPS } from '../menu-list';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [AvatarModule, SidebarModule, ChevronDown, PIcon, RouterLink, RouterLinkActive],
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class DashboardSidebar {
  protected readonly navGroups = NAV_GROUPS;
}