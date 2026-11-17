import { Routes } from '@angular/router';

/**
 * Dashboard (authenticated) routes.
 * Mounted as children of DashboardLayout in the root app.routes.ts.
 * Module-wise route files are composed here.
 */
export const dashboardRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'overview' },
    {
        path: '',
        loadChildren: () => import('./workspace/workspace.routes').then((m) => m.workspaceRoutes),
    },
];
