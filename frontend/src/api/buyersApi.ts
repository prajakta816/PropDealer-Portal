import axios from 'axios';
import apiClient from './apiClient';


export interface AuditUserInfo {
  id: string;
  name: string;
  email: string;
}

export interface BuyerItem {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  createdById: string | null;
  createdBy?: AuditUserInfo | null;
  updatedAt: string;
  updatedById: string | null;
  updatedBy?: AuditUserInfo | null;
}

interface BuyerListResponse {
  success: boolean;
  message: string;
  data: BuyerItem[];
}

interface BuyerSingleResponse {
  success: boolean;
  message: string;
  data: BuyerItem;
}

interface BuyerDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateBuyerRequest {
  name: string;
  email: string;
}

export interface UpdateBuyerRequest {
  name?: string;
  email?: string;
}


export async function getAllBuyersApi(): Promise<BuyerItem[]> {
  try {
    const response = await apiClient.get<BuyerListResponse>('/buyers');
    const result = response.data;

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(result.message || 'Failed to retrieve buyers.');
    }

    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<BuyerListResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Unable to retrieve buyers. Please try again.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}

export async function getBuyerByIdApi(id: string): Promise<BuyerItem> {
  try {
    const response = await apiClient.get<BuyerSingleResponse>(`/buyers/${id}`);
    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to retrieve buyer details.');
    }

    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<BuyerSingleResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Unable to retrieve buyer details. Please try again.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}

export async function createBuyerApi(data: CreateBuyerRequest): Promise<BuyerItem> {
  try {
    const response = await apiClient.post<BuyerSingleResponse>('/buyers', data);
    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to create buyer.');
    }

    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<BuyerSingleResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to create buyer.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}

export async function updateBuyerApi(
  id: string,
  data: UpdateBuyerRequest,
): Promise<BuyerItem> {
  try {
    const response = await apiClient.patch<BuyerSingleResponse>(`/buyers/${id}`, data);
    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to update buyer.');
    }

    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<BuyerSingleResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to update buyer.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}

export async function deleteBuyerApi(id: string): Promise<void> {
  try {
    const response = await apiClient.delete<BuyerDeleteResponse>(`/buyers/${id}`);
    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete buyer.');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError<BuyerDeleteResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete buyer.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}