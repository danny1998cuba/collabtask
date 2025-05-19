"use client"

import { deleteTask, updateTask } from '@/actions/tasks.actions'
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog'
import { Button } from '@/components/ui/button'
import { ITask } from '@/models/task.model'
import { useAppProvider } from '@/stores/AppStore'
import { ActionResponse } from '@/types/actions'
import { Loader2, Trash } from 'lucide-react'
import React, { useTransition } from 'react'
import { toast } from 'sonner'

const DeleteButton = ({ task }: { task: ITask }) => {
    const { tasks } = useAppProvider()

    const [deleting, startDeleting] = useTransition()
    const deleteBoardLocal = async () => {
        const tasksFromColumn = tasks.filter(t => t.status === task.status && t.id !== task.id)

        const response = await deleteTask(task.id)
        const result = JSON.parse(response) as ActionResponse<null>

        if (result.error) {
            console.error(result.error);
            toast.error("Something happened while deleting the task");

        } else {
            toast.success("Task deleted successfully");
            if (tasksFromColumn.length > 0) {
                Promise.allSettled(tasksFromColumn.map((t, index) => updateTask(t.id, { order: index })))
            }
        }
    }


    return (
        <ConfirmationDialog
            question='Are you sure to delete this task?'
            trigger={
                <Button size="icon" variant="ghost" title='Delete task'>
                    {deleting ? <Loader2 /> : <Trash />}
                </Button>
            }
            action={() => startDeleting(() => deleteBoardLocal())} />
    )
}

export default DeleteButton