import { ITask, TASKS_STATUS } from '@/models/task.model'
import React from 'react'
import { DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { format, formatDistance, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@clerk/nextjs';

interface Props {
    task: ITask;
}

const TaskDialogContent = ({ task }: Props) => {
    const { userId } = useAuth()

    return (
        <>
            <DialogHeader>
                <DialogTitle>{task.title}</DialogTitle>
            </DialogHeader>

            <div className="flex gap-4 flex-wrap mb-2">
                <div className='text-sm flex items-center gap-2'>
                    Current Status:
                    <Badge variant="outline" className={cn({
                        "!bg-green-300": ['done', 'archived'].includes(task.status),
                        "!bg-yellow-200": ['todo'].includes(task.status),
                        "!bg-blue-300": ['in_review', 'in_progress'].includes(task.status),
                        "!bg-red-300": ['cancelled'].includes(task.status),
                    })}>
                        {TASKS_STATUS[task.status]}
                    </Badge>
                </div>
                <div className='text-sm flex items-center gap-2'>
                    Date Due: {task.due_date ? `${format(new Date(task.due_date), "PPpp")} (${formatDistanceToNow(task.due_date)})` : "Not assigned"}
                </div>
            </div>

            <fieldset className='border rounded-lg px-4 pt-2 pb-4 mb-2'>
                <legend className='text-sm font-semibold px-2'>Details</legend>
                {task.description}

                <div className='text-sm flex items-center gap-2 mt-6'>
                    Assigned to: {task.assigned_to && typeof task.assigned_to === 'object' ? (task.assigned_to.id !== userId ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}` : "Me") : "Not assigned"}
                </div>
            </fieldset>

            <DialogFooter className='!flex-col'>
                <div className='font-semibold text-lg'>Comments</div>
            </DialogFooter>
        </>
    )
}

export default TaskDialogContent