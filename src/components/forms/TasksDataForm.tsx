'use client'

import React, { useEffect, useMemo, useState, useTransition } from 'react'
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
import { useAppProvider } from '@/stores/AppStore'
import { DateTimePicker } from '../ui/datetime-picker'

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

    const { tasks } = useAppProvider()
    const todosNumber = tasks.filter(t => t.status === 'todo').length

    const { sessionClaims, orgId, userId } = useAuth()
    const { supabase } = useSupabase()
    const [members, setMembers] = useState<Partial<IOrganizationMember>[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "all",
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: prev?.title ?? "",
            description: prev?.description ?? "",
            assignedTo: !!prev?.assigned_to ? typeof prev.assigned_to === 'object' ? prev.assigned_to.id : prev.assigned_to : "",
            due_date: prev?.due_date ? new Date(prev.due_date) : undefined
        }
    })

    useEffect(() => {
        if (orgId && supabase) {
            supabase.from("organization_members").select("user:user_id (first_name, last_name, id)").eq("organization_id", orgId).then(r => {
                const { data, error } = r
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
            assigned_to: data.assignedTo?.trim() !== "" ? data.assignedTo : null,
            due_date: data.due_date ?? null
        }

        if (isEdit) {
            const response = await updateTask(prev.id, { ...toSave, updated_at: new Date() })
            const result = JSON.parse(response) as ActionResponse<ITask>

            if (result.error) {
                console.error(result.message);
                toast.error("Something happened while updating the task");
            } else {
                console.log(result.data)
                toast.success("Task updated successfully");
                if (closeDialog) closeDialog()
            }
        } else {
            toSave.created_by = userId
            toSave.status = 'todo'
            toSave.order = todosNumber

            const response = await createTask(toSave)
            const result = JSON.parse(response) as ActionResponse<ITask>

            if (result.error) {
                console.error(result.message);
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
                            <DateTimePicker {...field} value={form.watch('due_date')} use12HourFormat timePicker={{ hour: true, minute: true }}
                                clearable timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                                min={new Date()} />
                            {/* <Popover>
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

                                            {
                                                field.value && <SelectIcon onClick={(e) => { e.stopPropagation(); console.log("reseting"); form.setValue("due_date", undefined, { shouldValidate: true }) }}>
                                                    <CircleX className='cursor-pointer' />
                                                </SelectIcon>
                                            }
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
                            </Popover> */}
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
                                            <SelectValue />
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

                                        {
                                            field.value &&
                                            <Button
                                                className="w-full px-2"
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    form.setValue('assignedTo', "")
                                                }}
                                            >
                                                Clear
                                            </Button>
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