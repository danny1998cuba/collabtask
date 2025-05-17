'use client'

import React, { useTransition } from 'react'
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
import { Loader2 } from 'lucide-react'

interface Props {
    prev?: IBoard;
    closeDialog?: VoidFunction
}

const formSchema = z.object({
    name: z.string({ required_error: "This field is required" }).min(1, "This field is required").describe("Board name"),
    description: z.string().describe("Board description").optional()
})

const BoardsDataForm = ({ prev, closeDialog }: Props) => {
    const isEdit = !!prev
    const [isLoading, startLoading] = useTransition()

    const { sessionClaims } = useAuth()

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "all",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: prev?.name ?? "",
            description: prev?.description ?? "",
        }
    })

    if (!sessionClaims) return null

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const toSave: Partial<IBoard> = {
            is_personal: !sessionClaims.org_id,
            created_by: sessionClaims.sub,
            name: data.name.trim(),
            description: data.description && data.description.trim() !== "" ? data.description.trim() : undefined
        }

        if (sessionClaims?.org_id) {
            toSave.organization_id = sessionClaims.org_id
        }

        if (isEdit) {
            const response = await updateBoard(prev.id, { ...toSave, updated_at: new Date() })
            const result = JSON.parse(response) as ActionResponse<IBoard>

            if (result.error) {
                console.error(result.error);
                toast.error("Something happened while updating the board");
            } else {
                console.log(result.data)
                toast.success("Board updated successfully");
                if (closeDialog) closeDialog()
            }
        } else {
            const response = await createBoard(toSave)
            const result = JSON.parse(response) as ActionResponse<IBoard>

            if (result.error) {
                console.error(result.error);
                toast.error("Something happened while creating the board");
            } else {
                console.log(result.data)
                toast.success("Board created successfully");
                if (closeDialog) closeDialog()
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => startLoading(() => onSubmit(data)))} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
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
        </Form>
    )
}

export default BoardsDataForm