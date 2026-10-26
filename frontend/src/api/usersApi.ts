import axios from 'axios';
import { ROLES, type UserRole } from '../constants/roles';

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface CreatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  createdById?: string | null;
  updatedAt?: string;
  updatedById?: string | null;
}

interface CreateUserResponse {
  success: boolean;
  message: string;
  data?: Partial<CreatedUser>;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export async function createUserApi(
  userData: CreateUserRequest,
): Promise<CreatedUser> {
  try {
    const isBuyer = userData.role === ROLES.BUYER;
    const requestPayload = isBuyer
      ? {
          entityType: 'Buyer' as const,
          name: userData.name.trim(),
          email: userData.email.trim().toLowerCase(),
        }
      : {
          entityType: 'User' as const,
          name: userData.name.trim(),
          email: userData.email.trim().toLowerCase(),
          password: userData.password,
          role: userData.role,
        };

    const response = await axios.post<CreateUserResponse>(
      '/api/users',
      requestPayload,
    );

    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to create user.');
    }

    return {
      id: result.data.id || '',
      name: result.data.name || userData.name.trim(),
      email: result.data.email || userData.email.trim().toLowerCase(),
      role: (result.data.role as UserRole) || userData.role,
      createdAt: result.data.createdAt || new Date().toISOString(),
      createdById: result.data.createdById ?? null,
      updatedAt: result.data.updatedAt || new Date().toISOString(),
      updatedById: result.data.updatedById ?? null,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError<CreateUserResponse>(error)) {
      const result = error.response?.data;

      const validationMessage = result?.errors
        ?.map((item) => `${item.field}: ${item.message}`)
        .join(', ');

      throw new Error(
        validationMessage ||
          result?.message ||
          error.message ||
          'Failed to create user.',
        { cause: error },
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('An unexpected error occurred.', { cause: error });
  }
}