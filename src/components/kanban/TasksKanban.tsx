import { ITask } from '@/models/task.model';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import { KanbanBoard } from './kanban/KanbanBoard';
import ClientHandler from './ClientHandler';
import { stringify } from 'qs';

interface Props {
    boardId: string;
}

const getTasksByBoard = async (boardId: string, query?: string) => {
    const { getToken } = await auth()
    const token = await getToken()

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tasks/${boardId}?${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        next: { tags: ['tasks'] }
    })
    return response.ok ? await response.json() : []
}

const TasksKanban = async ({ boardId }: Props) => {
    const tasks: ITask[] = await getTasksByBoard(boardId, stringify({
        select: "*, assigned_to:assigned_to (id, first_name, last_name)"
    }));

    return (
        <>
            <ClientHandler tasks={tasks} />
            <KanbanBoard tasks={tasks} />
        </>)
}

export default TasksKanban