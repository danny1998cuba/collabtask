import BoardCard from '@/components/cards/BoardCard'
import CreateBoard from '@/components/dialogs/CreateBoard'
import { getBoards } from '@/components/layout/sidebar/SidebarBoard/SidebarBoard'
import { Button } from '@/components/ui/button'
import { IBoard } from '@/models/board.model'
import { Plus, SquareDashedKanban, SquareKanban } from 'lucide-react'
import { stringify } from 'qs'
import React from 'react'

const BoardsPage = async () => {
    const boards: IBoard[] = await getBoards(stringify({
        select: "id, name, description, user:created_by (id, first_name, last_name), created_by"
    }))

    return (
        <>
            <div className="flex justify-between w-full pt-2 pb-8 sticky top-[44px] bg-white z-[48]">
                <h2 className='text-2xl font-semibold flex gap-2 items-center'><SquareKanban /> My boards</h2>

                <CreateBoard trigger={
                    <Button >
                        <Plus />
                        <span>Create board</span>
                    </Button>
                } />
            </div>

            {
                boards.length > 0 &&
                <div className="flex flex-wrap gap-6 w-full px-1">
                    {boards.map(b => <BoardCard board={b} key={b.id} />)}
                </div>
            }

            {
                boards.length === 0 &&
                <div className='flex-col gap-4 flex items-center justify-center w-full min-h-[400px] border rounded-xl'>
                    <SquareDashedKanban size={60} />
                    No boards found
                </div>
            }
        </>
    )
}

export default BoardsPage