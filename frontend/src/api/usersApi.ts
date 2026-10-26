import axios from 'axios';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'Agent' | 'CommissionManager';
}

export interface CreatedUser {
  id: string;
  name: string;
  email: string;
  role: 'Agent' | 'CommissionManager';
  createdAt: string;
  createdById: string | null;
  updatedAt: string;
  updatedById: string | null;
}

interface CreateUserResponse {
  success: boolean;
  message: string;
  data?: CreatedUser;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export async function createUserApi(
  userData: CreateUserRequest,
): Promise<CreatedUser> {
  try {
    const response = await axios.post<CreateUserResponse>(
      '/api/users',
      userData,
    );

    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(
        result.message || 'Failed to create user.',
      );
    }

    return result.data;
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
        )
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('An unexpected error occurred.', { cause: error, })
  }
}