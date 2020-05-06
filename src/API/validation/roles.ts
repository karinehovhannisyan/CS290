import { SetMetadata } from "@nestjs/common";
import { UserRoles } from '../types/userRoles';

export const Roles = (...roles: UserRoles[]) => SetMetadata("roles", roles);