import { auth } from "@clerk/nextjs/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null

export const createServerClient = async () => {
    if (!supabase) {
        supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                async accessToken() {
                    return (await auth()).getToken()
                },
                auth: {
                    persistSession: false
                }
            }
        );
    }

    return supabase
};
