'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { IBoard } from '@/models/board.model'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'
import { createBoard, updateBoard } from '@/actions/boards.actions'
import { ActionResponse } from '@/types/actions'
import { toast } from 'sonner'
import { CalendarIcon, CircleX, Loader2 } from 'lucide-react'
import { ITask, TASKS_STATUS, TaskStatus } from '@/models/task.model'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { IOrganizationMember } from '@/models/user.model'
import { useSupabase } from '@/utils/supabase/client'
import { SelectIcon } from '@radix-ui/react-select'
import { createTask, updateTask } from '@/actions/tasks.actions'

interface Props {
    boardId: string;
    prev?: ITask;
    closeDialog?: VoidFunction
}

const formSchema = z.object({
    title: z.string({ required_error: "This field is required" }).min(1, "This field is required").describe("Task title"),
    description: z.string().describe("Board description").optional(),
    assignedTo: z.string().optional(),
    due_date: z.date().optional()
})

const TasksDataForm = ({ prev, closeDialog, boardId }: Props) => {
    const isEdit = !!prev
    const [isLoading, startLoading] = useTransition()

    const { sessionClaims, orgId, userId } = useAuth()
    const { supabase } = useSupabase()
    const [members, setMembers] = useState<Partial<IOrganizationMember>[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "all",
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: prev?.title ?? "",
            description: prev?.description ?? "",
            assignedTo: prev?.assigned_to as string | undefined,
            due_date: prev?.due_date
        }
    })

    useEffect(() => {
        if (orgId && supabase) {
            console.log(orgId)
            supabase.from("organization_members").select("user:user_id (first_name, last_name, id)").eq("organization_id", orgId).then(r => {
                const { data, error } = r

                console.log(data)

                if (error) { setMembers([]) }
                else { setMembers(data as Partial<IOrganizationMember>[]) }
            })
        }
    }, [orgId, supabase])

    if (!sessionClaims) return null

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const toSave: Partial<ITask> = {
            board_id: boardId,
            title: data.title.trim(),
            description: data.description && data.description.trim() !== "" ? data.description.trim() : undefined,
            assigned_to: data.assignedTo,
            due_date: data.due_date
        }

        if (isEdit) {
            const response = await updateTask(prev.id, { ...toSave, updated_at: new Date() })
            const result = JSON.parse(response) as ActionResponse<ITask>

            if (result.error) {
                console.error(result.error);
                toast.error("Something happened while updating the task");
            } else {
                console.log(result.data)
                toast.success("Task updated successfully");
                if (closeDialog) closeDialog()
            }
        } else {
            toSave.created_by = userId
            toSave.status = 'todo'

            const response = await createTask(toSave)
            const result = JSON.parse(response) as ActionResponse<ITask>

            if (result.error) {
                console.error(result.error);
                toast.error("Something happened while creating the task");
            } else {
                console.log(result.data)
                toast.success("Task created successfully");
                if (closeDialog) closeDialog()
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => startLoading(() => onSubmit(data)))} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date <= new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {
                    orgId &&
                    <FormField
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                            <FormItem className='w-full flex-1'>
                                <FormLabel>Assigned to</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl className='w-full'>
                                        <SelectTrigger >
                                            <div className="flex justify-between items-center w-full">
                                                <SelectValue />
                                                {
                                                    field.value && <SelectIcon onClick={(e) => { e.stopPropagation(); console.log("reseting"); form.setValue("assignedTo", "", { shouldValidate: true }) }}>
                                                        <CircleX className='cursor-pointer' />
                                                    </SelectIcon>
                                                }
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            members
                                                .filter(m => !!m.user)
                                                .map(m =>
                                                    <SelectItem key={m.user!.id} value={m.user!.id!}>{m.user!.first_name} {m.user!.last_name}</SelectItem>
                                                )
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                }

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={!form.formState.isValid || isLoading}>
                    {
                        isLoading && <Loader2 size={15} />
                    }
                    Submit
                </Button>
            </form>
        </Form >
    )
}

export default TasksDataForm