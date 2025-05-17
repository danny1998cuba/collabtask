import { IUser } from "./user.model";

export interface IBoard {
    id: string;
    name: string;
    description?: string;
    is_personal: boolean;
    organization_id?: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
    // Populated
    user?: Partial<IUser>
}