'use client'

import React, { PropsWithChildren } from 'react'
import { useSidebar } from '../ui/sidebar'
import { cn } from '@/lib/utils'

const UsableArea = ({ children }: PropsWithChildren) => {
    const { open, isMobile } = useSidebar()

    return (
        <div className={cn(
            'w-full',
            {
                "max-w-[calc(100%_-_var(--sidebar-width))]": !isMobile && open,
                "max-w-[calc(100%_-_var(--sidebar-width-icon))]": !isMobile && !open,
            }
        )}>
            {children}
        </div>
    )
}

export default UsableArea