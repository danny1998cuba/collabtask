"use server"

import { ITask } from "@/models/task.model"
import { ActionResponse } from "@/types/actions"
import { createServerClient } from "@/utils/supabase/server"
import { revalidateTag } from "next/cache"

export const createTask = async (task: Partial<ITask>): Promise<string> => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("tasks").insert(task).select().single()
    let response: ActionResponse<ITask>

    if (error) {
        response = { error: true, message: error.message }
    } else {
        response = {
            error: false, message: "task created", data
        }
        revalidateTag("tasks")
    }

    return JSON.stringify(response)
}

export const updateTask = async (id: string, task: Partial<ITask>): Promise<string> => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("tasks").update(task).eq("id", id).select().single()
    let response: ActionResponse<ITask>

    if (error) {
        response = { error: true, message: error.message }
    } else {
        response = {
            error: false, message: "task udpated", data
        }
        revalidateTag("tasks")
    }

    return JSON.stringify(response)
}

export const deleteTask = async (id: string): Promise<string> => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("tasks").delete().eq("id", id)
    let response: ActionResponse<null>

    if (error) {
        response = { error: true, message: error.message }
    } else {
        response = { error: false, message: "task deleted", data: null }
        revalidateTag("tasks")
    }

    return JSON.stringify(response)
}