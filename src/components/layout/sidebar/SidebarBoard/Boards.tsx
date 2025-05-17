import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import React, { Suspense } from 'react'
import SidebarBoard from './SidebarBoard'
import SidebarBoardSkeleton from './SidebarBoardSkeleton'
import SidebarBoardCreateButton from './SidebarBoardCreateButton'
import LocalSidebarLink from '../LocalSidebarLink'
import { SquareKanban } from 'lucide-react'

const Boards = () => {

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                Boards
            </SidebarGroupLabel>
            <SidebarBoardCreateButton />

            <SidebarGroupContent>
                <SidebarMenu>
                    <LocalSidebarLink text='My boards' icon={<SquareKanban />} link='/app/boards' />
                    <Suspense fallback={<SidebarBoardSkeleton />}>
                        <SidebarBoard />
                    </Suspense>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup >
    )
}

export default Boards