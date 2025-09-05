// src/common/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";
import { AuthRequest } from "src/modules/auth/types/auth-types";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}


canActivate(context: ExecutionContext): boolean {
  const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  console.log('✅ [RolesGuard] Required roles:', requiredRoles);

  const { user } = context.switchToHttp().getRequest() as AuthRequest;
  console.log('✅ [RolesGuard] User from request:', user);

  if (!requiredRoles) return true;
  if (!user || !user.role) {
    console.log('❌ [RolesGuard] Missing user or role');
    return false;
  }

  const hasRole = requiredRoles.includes(user.role as Role);
  console.log('✅ [RolesGuard] Has required role:', hasRole);

  return hasRole;
}

}
