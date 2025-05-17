"use client";

import React, { ReactNode, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ITask } from '@/models/task.model';
import TasksDataForm from '../forms/TasksDataForm';

const CreateTask = ({ trigger, prev, boardId }: {
    boardId: string;
    trigger: ReactNode,
    prev?: ITask;
}) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" aria-describedby={`${prev ? "Edit" : "Add a new"} task`}>
                <DialogHeader>
                    <DialogTitle>{prev ? "Edit" : "Add a new"} task</DialogTitle>
                </DialogHeader>
                <TasksDataForm closeDialog={() => setOpen(false)} prev={prev} boardId={boardId} />
            </DialogContent>
        </Dialog>
    )
}

export default CreateTask