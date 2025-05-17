'use client'

import React, { useMemo, useTransition } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { IBoard } from '@/models/board.model'
import { useAuth } from '@clerk/nextjs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { EllipsisVertical, Loader2, Pencil, SquareKanban, Trash } from 'lucide-react'
import CreateBoard from '../dialogs/CreateBoard'
import { useSupabase } from '@/utils/supabase/client'
import { deleteBoard } from '@/actions/boards.actions'
import { ActionResponse } from '@/types/actions'
import { toast } from 'sonner'
import ConfirmationDialog from '../dialogs/ConfirmationDialog'
import Link from 'next/link'

interface Props {
    board: IBoard
}

const BoardCard = ({ board }: Props) => {
    const { userId } = useAuth()

    const isPersonal = useMemo(() => {
        return board.is_personal || board.created_by === userId
    }, [board, userId])

    const [deleting, startDeleting] = useTransition()
    const deleteBoardLocal = async () => {
        const response = await deleteBoard(board.id)
        const result = JSON.parse(response) as ActionResponse<null>

        if (result.error) {
            console.error(result.error);
            toast.error("Something happened while deleting the board");
        } else {
            toast.success("Board deleted successfully");
        }
    }

    return (
        <Card className='w-full sm:w-[350px] justify-between relative overflow-hidden'>
            <CardContent className='text-sm'>
                <div className='font-semibold text-xl mb-2 flex justify-between w-full'>
                    <Link href={`/app/boards/${board.id}`}>{board.name}</Link>

                    {
                        isPersonal &&
                        <div className="flex gap-1 -mr-3">
                            <CreateBoard prev={board} trigger={
                                <Button size="icon" variant="ghost" title='Edit board'>
                                    <Pencil />
                                </Button>
                            } />
                            <ConfirmationDialog
                                question='Are you sure to delete this board? All its content will be lost.'
                                trigger={
                                    <Button size="icon" variant="ghost" title='Delete board'>
                                        {deleting ? <Loader2 /> : <Trash />}
                                    </Button>
                                }
                                action={() => startDeleting(() => deleteBoardLocal())} />
                        </div>
                    }
                </div>
                <div>{board.description}</div>
            </CardContent>
            <CardFooter className='text-xs justify-end self-end'>
                {
                    !isPersonal ? `${board.user!.first_name} ${board.user!.last_name}` : "Personal"
                }
            </CardFooter>

            <SquareKanban className='absolute -bottom-6 -left-2 opacity-5 rotate-[-25deg] scale-125' size={100} />
        </Card>
    )
}

export default BoardCard