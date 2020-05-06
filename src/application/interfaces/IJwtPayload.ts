import { UserRoles } from "src/API/types/userRoles";

export interface IJwtPayload {
    id: string;
    role: UserRoles;
}
