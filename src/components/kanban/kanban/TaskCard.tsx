'use client'

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical, Loader2, Pencil, Trash } from "lucide-react";
import { Badge } from "../../ui/badge";
import { ITask } from "@/models/task.model";
import { useAuth } from "@clerk/nextjs";
import CreateTask from "@/components/dialogs/CreateTask";
import { useAppProvider } from "@/stores/AppStore";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import { useTransition } from "react";
import { deleteTask, updateTask } from "@/actions/tasks.actions";
import { ActionResponse } from "@/types/actions";
import { toast } from "sonner";
import { format } from "date-fns";

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
                        <Button size="icon" variant="ghost" title='Edit task'>
                            <Pencil />
                        </Button>
                    } />
                    <ConfirmationDialog
                        question='Are you sure to delete this task?'
                        trigger={
                            <Button size="icon" variant="ghost" title='Delete task'>
                                {deleting ? <Loader2 /> : <Trash />}
                            </Button>
                        }
                        action={() => startDeleting(() => deleteBoardLocal())} />
                </div>
            </CardHeader>
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
        </Card>
    );
}