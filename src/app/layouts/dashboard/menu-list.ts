// Types
export interface NavItem {
    icon: string;
    label: string;
    isActive?: boolean;
    badge?: string;
    subItems?: { label: string; isActive?: boolean }[];
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
            { icon: 'chart-pie', label: 'Overview', isActive: true },
            { icon: 'briefcase', label: 'Matters' },
            { icon: 'folder', label: 'Documents' },
            { icon: 'file-check', label: 'Document Review' },
        ],
    },
    {
        label: 'Discovery',
        items: [
            { icon: 'cog', label: 'Processing Jobs' },
            { icon: 'search', label: 'Search & Discovery' },
            { icon: 'file-export', label: 'Production Exports' },
        ],
    },
    {
        label: 'Governance',
        items: [
            { icon: 'history', label: 'Audit Logs' },
            { icon: 'users', label: 'User Management' },
            { icon: 'shield', label: 'Role Management' },
        ],
    },
];

export function hasActiveSub(item: NavItem): boolean {
    return !!item.subItems?.some((sub) => sub.isActive);
}