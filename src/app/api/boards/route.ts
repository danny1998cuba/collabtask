import { createServerClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams
    const select = query.get('select') || '*'

    const supabase = await createServerClient()
    const boardsResponse = await supabase.from('boards').select(select).order("created_at", { ascending: false })
    const boards = boardsResponse.error ? [] : boardsResponse.data

    return NextResponse.json(boards)
}