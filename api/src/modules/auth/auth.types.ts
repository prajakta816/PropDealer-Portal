import type { UserRole } from '../../constants/roles.js';

export interface AuthUserData {
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginServiceResult {
  token: string;
  expiresIn: string;
  tokenType: 'Bearer';
  data: AuthUserData;
}

export interface CurrentUserServiceResult {
  name: string;
  email: string;
  role: UserRole;
}

