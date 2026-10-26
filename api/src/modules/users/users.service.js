
import bcrypt from 'bcryptjs';
import { createUser } from './users.repository.js';

const CREATABLE_ROLES = ['Agent', 'CommissionManager'];

export const createUserService = async (userData) => {
  const { name, email, password, role } = userData;

  if (!CREATABLE_ROLES.includes(role)) {
    const error = new Error('This role cannot be created through this API.');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return createUser({
    name,
    email,
    passwordHash,
    role,
  });
};
