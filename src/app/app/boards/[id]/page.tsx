import CreateTask from '@/components/dialogs/CreateTask';
import TasksKanban from '@/components/kanban/TasksKanban';
import { Button } from '@/components/ui/button';
import { IBoard } from '@/models/board.model';
import { createServerClient } from '@/utils/supabase/server';
import { Plus, SquareKanban } from 'lucide-react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { use } from 'react';

interface Props {
    params: Promise<{
        id: string;
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const board = await getBoarById(id)

    if (board) {
        return {
            title: `CollabTask | ${board.name}`,
            description: board.description
        }
    } else {
        return {}
    }
}

const BoardPage = ({ params }: Props) => {
    const { id } = use(params)
    const board = use(getBoarById(id))

    if (!board) redirect("/app/boards")

    return (
        <>
            <div className="flex justify-between w-full pt-2 pb-8 sticky top-[44px] bg-white z-[48]">
                <h2 className='text-2xl font-semibold flex gap-2 items-center'><SquareKanban /> {board.name}</h2>

                <CreateTask boardId={board.id} trigger={
                    <Button >
                        <Plus />
                        <span>Create task</span>
                    </Button>
                } />
            </div >

            <TasksKanban boardId={board.id} />
        </>
    )
}

const getBoarById = async (id: string): Promise<IBoard | null> => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from('boards').select("*").eq("id", id).single()
    if (error) { return null }

    return data as IBoard
}

export default BoardPage