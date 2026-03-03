import { User, UserRole } from "@prisma/client"

export interface IUser {
    name: string,
    email: string,
    contactNumber: string,
    password: string
    role: UserRole
}


export type IUserFilters = {
    searchTerm?: string;
    role?: string;
    status?: string;
};

export type IPaginationOptions = {
    page?: number;
    limit?: number;
    sortBy?: keyof User;
    sortOrder?: "asc" | "desc";
};

export interface UpdateUserPayload extends Partial<User> {
    shopName?: string;
}