import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { Header } from './header/header';
import { DashboardSidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SidebarModule, Header, DashboardSidebar],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout implements OnInit {
  // Vars
  private readonly destroyRef = inject(DestroyRef);
  protected readonly isMobile = signal(false);
  protected readonly open = signal(true);

  // Mobile Logic
  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(max-width: 1023px)');
    this.isMobile.set(mql.matches);
    this.open.set(!mql.matches);

    const listener = (e: MediaQueryListEvent) => {
      this.isMobile.set(e.matches);
      this.open.set(!e.matches);
    };
    mql.addEventListener('change', listener);
    this.destroyRef.onDestroy(() => mql.removeEventListener('change', listener));
  }
}
