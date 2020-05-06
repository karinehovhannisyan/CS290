import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../types/userRoles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRoles[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (roles.length === 1 && roles[0] === UserRoles.guest)
      return !request.user;
    if (roles.includes(UserRoles.guest))
      return true;
    const hasRole = () => roles.includes(user.role);
    return user && user.role && hasRole();
  }

  public getRoles(context: ExecutionContext) {
    return this.reflector.get<UserRoles[]>("roles", context.getHandler());
  }
}
