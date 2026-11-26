import axios, { type AxiosResponse } from 'axios';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ApiErrorPayload {
  message?: string;
}

export async function executeApiCall<T>(
  apiFn: () => Promise<AxiosResponse<ApiResponse<T>>>,
  fallbackMessage: string,
): Promise<T> {
  try {
    const response = await apiFn();
    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || fallbackMessage);
    }

    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorPayload>(error)) {
      throw new Error(
        error.response?.data?.message || fallbackMessage,
        { cause: error },
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(fallbackMessage, { cause: error });
  }
}

