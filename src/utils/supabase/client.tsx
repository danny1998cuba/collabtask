"use client"

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PropsWithChildren, useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";
import { create } from "zustand";


type SupabaseStoreType = {
    supabase: SupabaseClient | null
}

export const useSupabase = create<SupabaseStoreType>(() => ({ supabase: null }))

const SupabaseProvider = ({ children }: PropsWithChildren) => {
    const { session, isLoaded } = useSession()

    useEffect(() => {
        if (isLoaded) {
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    async accessToken() {
                        return session?.getToken() ?? null
                    },
                    auth: {
                        persistSession: false
                    }
                })

            useSupabase.setState({ supabase })
        }
    }, [isLoaded, session])

    return children
}

export default SupabaseProvider