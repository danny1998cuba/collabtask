'use client'

import { IBoard } from '@/models/board.model'
import { useAppProvider } from '@/stores/AppStore'
import React, { useEffect } from 'react'

const ClientHandler = ({ board }: { board: IBoard | null }) => {
    useEffect(() => {
        useAppProvider.setState((prev) => ({
            ...prev,
            activeBoard: board
        }))

        return () => {
            useAppProvider.setState((prev) => ({
                ...prev,
                activeBoard: null
            }))
        }
    }, [board])

    return (
        <div className='hidden'>ClientHandler</div>
    )
}

export default ClientHandler