import { SidebarMenu, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar"
import { SquareKanban } from "lucide-react"
import LocalSidebarLink from "../LocalSidebarLink"
import { IBoard } from "@/models/board.model"
import { auth } from "@clerk/nextjs/server"
import { stringify } from "qs"

export const getBoards = async (query?: string) => {
    const { getToken } = await auth()
    const token = await getToken()

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/boards?${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        next: { tags: ['boards'] }
    })
    return response.ok ? await response.json() : []
}

const SidebarBoard = async () => {
    const boards: IBoard[] = await getBoards(stringify({
        select: "name, id"
    }))

    if (!boards || boards.length === 0) {
        return <div className="text-xs text-muted-foreground w-full text-center">No boards found</div>
    }

    return (
        <SidebarMenuSub>
            {boards.map((b) => (
                <LocalSidebarLink key={`board_sidebar_${b.id}`} icon={<SquareKanban />}
                    link={`/app/boards/${b.id}`} text={b.name} Component={SidebarMenuSubItem} />
            ))
            }
        </SidebarMenuSub>
    )
}

export default SidebarBoard