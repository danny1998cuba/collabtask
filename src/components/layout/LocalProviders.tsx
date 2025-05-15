import { ClerkProvider } from "@clerk/nextjs"
import { PropsWithChildren } from "react"

const LocalProviders = ({ children }: PropsWithChildren) => {
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    )
}

export default LocalProviders