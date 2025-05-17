'use client'

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
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

    return (
        <Component>
            <SidebarMenuButton asChild isActive={pathname === link}>
                <Link href={link}>
                    {icon}
                    <span>{text}</span>
                </Link>
            </SidebarMenuButton>
        </Component>
    )
}

export default LocalSidebarLink