import CreateBoard from '@/components/dialogs/CreateBoard'
import { SidebarGroupAction } from '@/components/ui/sidebar'
import { auth } from '@clerk/nextjs/server'
import { Plus } from 'lucide-react'
import React from 'react'

const SidebarBoardCreateButton = async () => {
    const { sessionClaims } = await auth()

    if (!((sessionClaims?.org_id && sessionClaims.org_role === 'org:admin') || sessionClaims?.sub)) return null

    return (
        <CreateBoard trigger={
            <SidebarGroupAction title="Add a board">
                <Plus /> <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
        } />
    )
}

export default SidebarBoardCreateButton