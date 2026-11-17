// Types
export interface NavItem {
    icon: string;
    label: string;
    /** Router path this item navigates to. */
    route: string;
    isActive?: boolean;
    badge?: string;
    subItems?: { label: string; route: string; isActive?: boolean }[];
}

export interface NavGroup {
    label: string;
    action?: boolean;
    items: NavItem[];
}

// Menu List
export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Workspace',
        items: [
            { icon: 'chart-pie', label: 'Overview', route: '/overview' },
            { icon: 'briefcase', label: 'Matters', route: '/matters' },
            { icon: 'folder', label: 'Documents', route: '/documents' },
            { icon: 'file-check', label: 'Document Review', route: '/document-review' },
        ],
    },
    {
        label: 'Discovery',
        items: [
            { icon: 'cog', label: 'Processing Jobs', route: '/processing-jobs' },
            { icon: 'search', label: 'Search & Discovery', route: '/search' },
            { icon: 'file-export', label: 'Production Exports', route: '/production-exports' },
        ],
    },
    {
        label: 'Governance',
        items: [
            { icon: 'history', label: 'Audit Logs', route: '/audit-logs' },
            { icon: 'users', label: 'User Management', route: '/users' },
            { icon: 'shield', label: 'Role Management', route: '/roles' },
        ],
    },
];
