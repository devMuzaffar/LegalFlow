import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { Plus } from '@primeicons/angular/plus';
import { ChevronDown } from '@primeicons/angular/chevron-down';
import { EllipsisV } from '@primeicons/angular/ellipsis-v';
import { PIcon } from '@primeicons/angular/p-icon';
import { NAV_GROUPS, hasActiveSub } from '../menu-list';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [AvatarModule, SidebarModule, Plus, ChevronDown, EllipsisV, PIcon],
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class DashboardSidebar {
  protected readonly navGroups = NAV_GROUPS;
  protected readonly hasActiveSub = hasActiveSub;
}