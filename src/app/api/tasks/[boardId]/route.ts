import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ boardId: string }> }) {
    const { boardId } = await params

    const query = req.nextUrl.searchParams
    const select = query.get('select') || '*'

    const supabase = await createServerClient()
    const boardsResponse = await supabase.from('tasks').select(select).eq("board_id", boardId).order("order", { ascending: true })
    const boards = boardsResponse.error ? [] : boardsResponse.data

    return NextResponse.json(boards)
}