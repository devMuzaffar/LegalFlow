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
    items: NavItem[];
}

// Menu List
export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Workspace',
        items: [
            { icon: 'chart-pie', label: 'ECA Overview', route: '/overview' },
            { icon: 'briefcase', label: 'Matters & Holds', route: '/matters' },
            { icon: 'file-check', label: 'Review & Search', route: '/document-review', badge: 'AI' },
        ],
    },
    {
        label: 'Discovery',
        items: [
            { icon: 'cog', label: 'Processing & Dedup', route: '/processing-jobs' },
            { icon: 'file-export', label: 'Productions', route: '/production-exports' },
        ],
    },
    {
        label: 'Governance',
        items: [
            { icon: 'history', label: 'Audit Logs', route: '/audit-logs' },
            { icon: 'key', label: 'BYOK AI Vault', route: '/byok-vault' },
            { icon: 'shield', label: 'Access Control', route: '/access-control' },
        ],
    },
];