/*
   Workspace Routes
*/

import { Routes } from '@angular/router';

/** Workspace module routes. Paths are flat so sidebar links can stay short. */
export const workspaceRoutes: Routes = [
    {
        path: 'overview',
        loadComponent: () => import('./overview/overview').then((m) => m.Overview),
    },
    {
        path: 'document-review',
        loadComponent: () =>
            import('./document-review/document-review').then((m) => m.DocumentReview),
    },
];
