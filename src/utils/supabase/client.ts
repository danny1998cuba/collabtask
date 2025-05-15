import { createBrowserClient } from "@supabase/ssr";
import { type UseSessionReturn } from '@clerk/types'

export const createClient = (session: UseSessionReturn['session']) => {
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            async accessToken() {
                return session?.getToken() ?? null
            },
        }
    );
}