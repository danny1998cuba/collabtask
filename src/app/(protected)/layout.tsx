import React, { PropsWithChildren } from 'react'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <div>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>
                        <UserButton showName />
                    </SidebarHeader>
                    <SidebarContent>
                        Hi
                    </SidebarContent>
                    <SidebarFooter>
                        <OrganizationSwitcher />
                    </SidebarFooter>
                </Sidebar>
            </SidebarProvider>
            {children}
        </div>
    )
}

export default ProtectedLayout