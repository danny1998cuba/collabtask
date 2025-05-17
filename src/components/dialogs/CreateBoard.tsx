"use client";

import React, { ReactNode, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import BoardsDataForm from '../forms/BoardsDataForm'
import { IBoard } from '@/models/board.model';

const CreateBoard = ({ trigger, prev }: {
    trigger: ReactNode,
    prev?: IBoard;
}) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" aria-describedby={`${prev ? "Edit" : "Add a new"} board`}>
                <DialogHeader>
                    <DialogTitle>{prev ? "Edit" : "Add a new"} board</DialogTitle>
                </DialogHeader>
                <BoardsDataForm closeDialog={() => setOpen(false)} prev={prev} />
            </DialogContent>
        </Dialog>
    )
}

export default CreateBoard