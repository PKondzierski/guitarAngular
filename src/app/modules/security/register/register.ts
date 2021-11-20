import { Role } from "./role";

export interface User {
    email?: string,
    username?: string,
    firstname?: string,
    lastname?: string,
    password?: string,
    motivation?: string,
    role?: Role,
    enabled?: boolean;
}