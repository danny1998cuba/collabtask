import SupabaseProvider from "@/utils/supabase/client"
import { ClerkProvider } from "@clerk/nextjs"
import { PropsWithChildren } from "react"

const LocalProviders = ({ children }: PropsWithChildren) => {
    return (
        <ClerkProvider>
            <SupabaseProvider>
                {children}
            </SupabaseProvider>
        </ClerkProvider>
    )
}

export default LocalProviders