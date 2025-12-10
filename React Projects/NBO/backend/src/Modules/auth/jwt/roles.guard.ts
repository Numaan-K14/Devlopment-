import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/Modules/users/model/user.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      console.error('No role found on user object!');
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    if (!requiredRoles.includes(user.role)) {
      console.error(
        `User role (${user.role}) does not match required roles (${requiredRoles})`,
      );
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
