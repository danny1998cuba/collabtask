'use client'

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical, Pencil } from "lucide-react";
import { ITask } from "@/models/task.model";
import { useAuth } from "@clerk/nextjs";
import CreateTask from "@/components/dialogs/CreateTask";
import { useAppProvider } from "@/stores/AppStore";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TaskDialogContent from "@/components/dialogs/TaskDialogContent";
import DeleteButton from "./DeleteButton";
import { Fragment, useEffect, useState } from "react";

interface TaskCardProps {
    task: ITask;
    isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
    type: TaskType;
    task: ITask;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
    const { userId } = useAuth()
    const { activeBoard, tasks } = useAppProvider()
    const searchParams = useSearchParams()

    const router = useRouter();
    const pathname = usePathname()
    const [open, setOpen] = useState<boolean>(false)

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        } satisfies TaskDragData,
        attributes: {
            roleDescription: "Task",
        },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const variants = cva("!py-2 !gap-2", {
        variants: {
            dragging: {
                over: "ring-2 opacity-30",
                overlay: "ring-2 ring-primary",
            },
        },
    });

    useEffect(() => {
        if (searchParams.get("task") === task.id) { setOpen(true) }
    }, [searchParams, task])

    if (!activeBoard) { return null }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            })}
        >
            <CardHeader className="px-3 py-3 justify-between items-center flex flex-row border-b-2 border-secondary relative">
                <Button
                    variant={"ghost"}
                    role={attributes.role}
                    aria-disabled={attributes["aria-disabled"]}
                    aria-pressed={attributes["aria-pressed"]}
                    tabIndex={attributes.tabIndex}
                    {...listeners}
                    className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
                >
                    <span className="sr-only">Move task</span>
                    <GripVertical />
                </Button>
                <div className="flex gap-1 -mr-3">
                    <CreateTask boardId={activeBoard.id} prev={task} trigger={
                        <Button size="icon" variant="ghost" title='Edit task'
                            onClick={(e) => e.stopPropagation()}>
                            <Pencil />
                        </Button>
                    } />
                    <DeleteButton task={task} />
                </div>
            </CardHeader>
            <Dialog open={open} onOpenChange={(val) => {
                if (val) {
                    router.replace(`${pathname}?task=${task.id}`)
                } else {
                    router.replace(pathname)
                }
                setOpen(val)
            }}>
                <DialogTrigger>
                    <Fragment>
                        <CardContent className="px-3 py-3 text-left whitespace-pre-wrap">
                            {task.title}
                        </CardContent>
                        <CardFooter className="text-xs justify-between px-3 gap-4">
                            {
                                task.assigned_to && typeof task.assigned_to === 'object' ?
                                    <div className="flex gap-1 items-center">
                                        <span>Assigned to:</span>
                                        <span>
                                            {task.assigned_to.id === userId ? "Me" : `${task.assigned_to.first_name} ${task.assigned_to.last_name}`}
                                        </span>
                                    </div> : <div></div>
                            }
                            {
                                task.due_date &&
                                <div className="flex gap-1 items-center">
                                    <span>Date due:</span>
                                    <span>{format(new Date(task.due_date), "P")}</span>
                                </div>
                            }
                        </CardFooter>
                    </Fragment>
                </DialogTrigger>
                <DialogContent className="w-[95%] sm:w-3/4 lg:w-2/3 xl:w-1/2 !max-w-[unset]">
                    <TaskDialogContent task={task} />
                </DialogContent>
            </Dialog>
        </Card>
    );
}