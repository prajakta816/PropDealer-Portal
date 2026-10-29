
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

  const passwordHash = await bcrypt.hash(userData.password, 12);

  return createUser({
    name: userData.name,
    email: userData.email,
    passwordHash,
    role: userData.role,
  });
};
