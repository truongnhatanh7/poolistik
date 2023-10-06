import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../role/role.enum';

export const ROLES_KEY = 'acc-role';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
