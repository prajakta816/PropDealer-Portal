
import bcrypt from 'bcryptjs';
import {
  ENTITY_TYPES,
  ROLES,
  type UserRole,
} from '../../constant/constant.js';
import {
  createUser,
  createBuyer,
  getAllUsers
} from './users.repository.js';
import type { CreateUserInput } from './users.validation.js';

const CREATABLE_ROLES: UserRole[] = [
  ROLES.ADMIN,
  ROLES.AGENT,
  ROLES.COMMISSION_MANAGER,
];

export const getAllUsersService = async()=>{
  return getAllUsers();
}
export const createUserService = async (
  userData: CreateUserInput,
) => {
  if (userData.entityType === ENTITY_TYPES.BUYER) {
    return createBuyer({
      name: userData.name,
      email: userData.email,
    });
  }

  if (!CREATABLE_ROLES.includes(userData.role)) {
    const error = new Error(
      'This role cannot be created through this API.',
    ) as Error & { statusCode: number };

    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(userData.password, 12);

  return createUser({
    name: userData.name,
    email: userData.email,
    passwordHash,
    role: userData.role,
  });
};
