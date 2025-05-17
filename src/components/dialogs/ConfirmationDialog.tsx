"use client";

import React, { ReactNode, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import BoardsDataForm from '../forms/BoardsDataForm'
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';

const ConfirmationDialog = ({ trigger, question, action }: {
    trigger: ReactNode,
    question: string;
    action: VoidFunction
}) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" aria-describedby="Confirm action">
                <DialogHeader>
                    <DialogTitle>Confirm action</DialogTitle>
                </DialogHeader>
                <DialogDescription>{question}</DialogDescription>

                <DialogFooter className='!justify-center'>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" variant="default" onClick={action}>
                            Confirm
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationDialog