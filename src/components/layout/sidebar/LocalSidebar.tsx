import React from 'react'
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarHeader, SidebarMenu,
    useSidebar
} from '../../ui/sidebar'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import Logo from '../Logo'
import AssignedTasks from './AssignedTasks'
import { LayoutDashboard } from 'lucide-react'
import LocalSidebarLink from './LocalSidebarLink'
import Boards from './SidebarBoard/Boards'

const LocalSidebar = () => {
    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader><Logo /></SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <LocalSidebarLink icon={<LayoutDashboard />} link='/app/dashboard' text='Dashboard' />
                    </SidebarMenu>
                </SidebarGroup>
                <Boards />
                <AssignedTasks />
            </SidebarContent>
            <SidebarFooter className='flex-row justify-between items-center py-4 px-3'>
                <OrganizationSwitcher hideSlug />
                <UserButton />
            </SidebarFooter>
        </Sidebar >
    )
}

export default LocalSidebar