import React, { PropsWithChildren } from 'react'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import LocalSidebar from '@/components/layout/sidebar/LocalSidebar';
import LocalNavbar from '@/components/layout/LocalNavbar';
import UsableArea from '@/components/layout/UsableArea';

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <SidebarProvider>
            <LocalSidebar />
            <UsableArea>
                <LocalNavbar />

                <main className='p-4' role='main'>
                    {children}
                </main>
            </UsableArea>
        </SidebarProvider>
    )
}

export default ProtectedLayout