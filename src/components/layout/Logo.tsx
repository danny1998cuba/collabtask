'use client'

import Image from 'next/image'
import React from 'react'
import { useSidebar } from '../ui/sidebar'

const Logo = () => {
    const { open } = useSidebar()

    return (
        <>
            {
                !open ?
                    <div className='mx-auto'>
                        <Image src="/images/collabtask-logo.png" alt="Logo" width={860} height={871} className="h-[20px] w-[20px] translate-x-1" />
                    </div>
                    :
                    <div className='w-fit flex items-center mb-2 text-2xl font-semibold tracking-wide px-2 relative after:content-[""]
                                after:w-[50px] after:absolute after:-right-1 after:-bottom-0.5 after:bg-blue-600 after:h-[3px]'>
                        <span className='text-blue-600 font-bold'>C</span>ollab<span className='text-blue-600 font-bold'>T</span>ask
                    </div>
            }
        </>
    )
}

export default Logo