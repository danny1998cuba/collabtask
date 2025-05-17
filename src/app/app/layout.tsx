import React, { PropsWithChildren } from 'react'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import LocalSidebar from '@/components/layout/sidebar/LocalSidebar';
import LocalNavbar from '@/components/layout/LocalNavbar';

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <SidebarProvider>
            <LocalSidebar />
            <div className='w-full'>
                <LocalNavbar />

                <main className='p-4' role='main'>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}

export default ProtectedLayout