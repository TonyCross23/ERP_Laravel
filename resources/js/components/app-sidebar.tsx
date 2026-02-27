import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, PanelTopClose, SquareXIcon } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Contacts',
        href: '/contacts',
        icon: PanelTopClose,
    },
    {
        title: 'Products',
        href: '/products',
        icon: SquareXIcon,
    },
    {
        title: 'WareHouse',
        href: '/warehouse',
        icon: SquareXIcon,
    },
    {
        title: 'Stock Management',
        href: '/stocks',
        icon: SquareXIcon,
    },
    {
        title: 'Sale',
        href: '/sales',
        icon: SquareXIcon,
    },
    {
        title: 'Accounting',
        href: '/accounting/journals',
        icon: SquareXIcon,
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: SquareXIcon,
    },


];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
