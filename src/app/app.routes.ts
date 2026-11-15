import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./layouts/auth/auth-layout').then(m => m.AuthLayout),
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes),
    },
    {
        path: '',
        loadComponent: () => import('./layouts/dashboard/dashboard-layout').then(m => m.DashboardLayout),
        children: [
            // Lazy load dashboard pages here
        ],
    },
];
