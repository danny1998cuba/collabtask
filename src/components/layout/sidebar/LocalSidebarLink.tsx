'use client'

import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ComponentType, PropsWithChildren, ReactNode } from 'react'

type Props = {
    text: string;
    link: string;
    icon?: ReactNode;
    Component?: ComponentType<PropsWithChildren>
}

const LocalSidebarLink = ({ text, link, icon, Component = SidebarMenuItem }: Props) => {
    const pathname = usePathname()
    const { isMobile, toggleSidebar } = useSidebar()

    return (
        <Component>
            <SidebarMenuButton asChild isActive={pathname === link}>
                <Link href={link} onClick={() => {
                    if (isMobile) { toggleSidebar() }
                }}>
                    {icon}
                    <span>{text}</span>
                </Link>
            </SidebarMenuButton>
        </Component>
    )
}

export default LocalSidebarLink