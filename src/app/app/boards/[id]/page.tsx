import React, { use } from 'react'

interface Props {
    params: Promise<{
        id: string;
    }>
}

const BoardPage = ({ params }: Props) => {
    const { id } = use(params)

    return (
        <div>{id}</div>
    )
}

export default BoardPage