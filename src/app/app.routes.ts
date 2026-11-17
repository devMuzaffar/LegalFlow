import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./layouts/auth/auth-layout').then(m => m.AuthLayout),
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes),
    },
    // App entry point: unauthenticated users land on the login screen.
    // Default Entry of your page
    { path: '', pathMatch: 'full', redirectTo: 'overview' },
    {
        path: '',
        loadComponent: () => import('./layouts/dashboard/dashboard-layout').then(m => m.DashboardLayout),
        loadChildren: () => import('./pages/dashboard/app.routes').then(m => m.dashboardRoutes),
    },
];
