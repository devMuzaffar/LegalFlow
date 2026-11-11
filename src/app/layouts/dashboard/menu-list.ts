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

export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Navigation',
        items: [
            { icon: 'home', label: 'Home', isActive: true },
            { icon: 'inbox', label: 'Inbox', badge: '12' },
            { icon: 'search', label: 'Search' },
            { icon: 'bell', label: 'Notifications', badge: '3' },
        ],
    },
    {
        label: 'Projects',
        action: true,
        items: [
            {
                icon: 'chart-bar',
                label: 'Analytics',
                subItems: [{ label: 'Overview', isActive: true }, { label: 'Reports' }, { label: 'Real-time' }],
            },
            { icon: 'users', label: 'Team' },
            { icon: 'calendar', label: 'Calendar' },
            {
                icon: 'folder',
                label: 'Documents',
                subItems: [{ label: 'Shared' }, { label: 'Private' }, { label: 'Archived' }],
            },
        ],
    },
    {
        label: 'Billing',
        items: [
            { icon: 'credit-card', label: 'Payments' },
            { icon: 'shopping-cart', label: 'Orders' },
            { icon: 'star', label: 'Subscriptions' },
        ],
    },
];

export function hasActiveSub(item: NavItem): boolean {
    return !!item.subItems?.some((sub) => sub.isActive);
}