'use client'

import { IBoard } from '@/models/board.model'
import { ITask } from '@/models/task.model'
import { useAppProvider } from '@/stores/AppStore'
import React, { useEffect } from 'react'

const ClientHandler = ({ tasks }: { tasks: ITask[] }) => {
    useEffect(() => {
        useAppProvider.setState((prev) => ({
            ...prev,
            tasks
        }))

        return () => {
            useAppProvider.setState((prev) => ({
                ...prev,
                tasks: []
            }))
        }
    }, [tasks])

    return (
        <div className='hidden'>ClientHandler</div>
    )
}

export default ClientHandler