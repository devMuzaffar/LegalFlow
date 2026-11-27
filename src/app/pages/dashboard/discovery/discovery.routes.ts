/*
   Discovery Routes
*/

import { Routes } from '@angular/router';

/** Discovery module routes. Paths match sidebar links directly. */
export const discoveryRoutes: Routes = [
    {
        path: 'processing-jobs',
        loadComponent: () =>
            import('./processing-jobs/processing-jobs').then((m) => m.ProcessingJobs),
    },
    {
        path: 'production-exports',
        loadComponent: () =>
            import('./production-exports/production-exports').then((m) => m.ProductionExports),
    },
];
