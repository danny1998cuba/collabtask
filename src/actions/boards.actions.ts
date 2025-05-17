"use server"

import { IBoard } from "@/models/board.model"
import { ActionResponse } from "@/types/actions"
import { createServerClient } from "@/utils/supabase/server"
import { revalidateTag } from "next/cache"

export const createBoard = async (board: Partial<IBoard>): Promise<string> => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("boards").insert(board).select().single()
    let response: ActionResponse<IBoard>

    if (error) {
        response = { error: true, message: error.message }
    } else {
        response = {
            error: false, message: "board created", data
        }
        revalidateTag("boards")
    }

    return JSON.stringify(response)
}

export const updateBoard = async (id: string, board: Partial<IBoard>): Promise<string> => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("boards").update(board).eq("id", id).select().single()
    let response: ActionResponse<IBoard>

    if (error) {
        response = { error: true, message: error.message }
    } else {
        response = {
            error: false, message: "board udpated", data
        }
        revalidateTag("boards")
    }

    return JSON.stringify(response)
}

export const deleteBoard = async (id: string): Promise<string> => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("boards").delete().eq("id", id)
    let response: ActionResponse<null>

    if (error) {
        response = { error: true, message: error.message }
    } else {
        response = { error: false, message: "board udpated", data: null }
        revalidateTag("boards")
    }

    return JSON.stringify(response)
}