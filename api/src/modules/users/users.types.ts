import type { UserRole } from '../../constants/roles.js';

export interface CreateUserRepositoryInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdById?: string;
  updatedById?: string;
}

export interface CreateBuyerRepositoryInput {
  name: string;
  email: string;
  createdById?: string;
  updatedById?: string;
}

