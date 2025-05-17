export interface IUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    image_url: string;
    created_at: Date;
    updated_at: Date;
}

export interface IOrganizationMember {
    organization_id: string
    user_id: string
    role: "org:admin" | "org:member"
    joined_at: Date
    updated_at: Date

    user?: Partial<IUser>;
}