/*
   Dashboard Routes
*/

import { Routes } from '@angular/router';

// Dashboard routes (mounted under DashboardLayout)
export const dashboardRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'overview' },
    {
        path: '',
        loadChildren: () => import('./workspace/workspace.routes').then((m) => m.workspaceRoutes),
    },
];
