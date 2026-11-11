import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth/auth-layout';
import { DashboardLayout } from './layouts/dashboard/dashboard-layout';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayout,
        children: [
        ],
    },
    {
        path: '',
        component: DashboardLayout,
        children: [],
    },
];
