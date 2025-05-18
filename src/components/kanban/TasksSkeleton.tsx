import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const TasksSkeleton = () => {
    return (
        <div className="px-2 md:px-0 flex pb-4">
            <div className="flex gap-4 items-start flex-row justify-center">
                {
                    Array(3).fill("").map((_, index) => <Card
                        key={`kanban_skeleton_column_${index}`}
                        className="min-h-[500px] w-[350px] max-w-full flex flex-col flex-shrink-0 snap-center !pt-2 !gap-4"
                    >
                        <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row items-center">
                            <Skeleton className="ml-auto w-2/3 sm:w-1/2 h-8" />
                        </CardHeader>
                        <CardContent className="flex flex-grow flex-col gap-2 p-2">
                            {Array(2).fill("").map((_, index_card) => <Card
                                key={`kanban_skeleton_column_${index}_task_${index_card}`}
                                className="!pt-2 !gap-2"
                            >
                                <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
                                    <Skeleton className="ml-auto w-2/3 sm:w-1/2 h-8" />
                                </CardHeader>
                                <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
                                    <Skeleton className="w-full h-6 mb-2" />
                                    <Skeleton className="w-2/3 h-6" />
                                </CardContent>
                            </Card>
                            )}
                        </CardContent>
                    </Card>)
                }
            </div>
        </div>
    )
}

export default TasksSkeleton