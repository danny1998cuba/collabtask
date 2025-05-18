"use client"

import { PropsWithChildren } from "react";
import { create } from "zustand";
import { IBoard } from "@/models/board.model";
import { ITask } from "@/models/task.model";

type AppStoreType = {
    activeBoard: IBoard | null;
    tasks: ITask[]
}

const initialValue: AppStoreType = {
    activeBoard: null,
    tasks: []
}

export const useAppProvider = create<AppStoreType>(() => (initialValue))