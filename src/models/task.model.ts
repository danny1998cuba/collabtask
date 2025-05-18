import { IBoard } from "./board.model";
import { IUser } from "./user.model";

export const TASKS_STATUS = {
    // 'backlog': "Backlog",
    'todo': "To do",
    'in_progress': "In Progress",
    // 'blocked': "Blocked",
    'in_review': "In Review",
    'done': "Done",
    'cancelled': "Cancelled",
    'archived': "Archived"
}

export type TaskStatus = keyof typeof TASKS_STATUS

export interface ITask {
    id: string;
    board_id: string;
    title: string;
    order: number;
    description?: string;
    status: TaskStatus;
    assigned_to?: string | Partial<IUser>;
    created_by: string | Partial<IUser>;
    created_at: Date;
    updated_at: Date;
    due_date: Date;

    board?: Partial<IBoard>
}