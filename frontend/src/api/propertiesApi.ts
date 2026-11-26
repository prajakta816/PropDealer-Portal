import axios from 'axios';
import apiClient from './apiClient';
import type {
  Property,
  PropertyStatus,
  PropertySortField,
  SortDirection,
} from '../constants/properties';

interface PropertyListResponse {
  success: boolean;
  message: string;
  data: Property[];
}

interface PropertySingleResponse {
  success: boolean;
  message: string;
  data: Property;
}

interface PropertyDeleteResponse {
  success: boolean;
  message: string;
}

export interface GetPropertiesQueryParams {
  search?: string;
  status?: PropertyStatus;
  sortField?: PropertySortField;
  sortDirection?: SortDirection;
}

export interface CreatePropertyRequest {
  title: string;
  address: string;
  basePrice: number;
}

export interface UpdatePropertyRequest {
  title?: string;
  address?: string;
  basePrice?: number;
}

export async function getAllPropertiesApi(
  params?: GetPropertiesQueryParams,
): Promise<Property[]> {
  try {
    const response = await apiClient.get<PropertyListResponse>('/properties', {
      params,
    });
    const result = response.data;

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(result.message || 'Failed to retrieve properties.');
    }

    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<PropertyListResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Unable to retrieve properties. Please try again.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}

export async function getPropertyByIdApi(id: string): Promise<Property> {
  try {
    const response = await apiClient.get<PropertySingleResponse>(`/properties/${id}`);
    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to retrieve property details.');
    }

    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<PropertySingleResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Unable to retrieve property details. Please try again.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}

export async function createPropertyApi(data: CreatePropertyRequest): Promise<Property> {
  try {
    const response = await apiClient.post<PropertySingleResponse>('/properties', data);
    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to create property.');
    }

    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<PropertySingleResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to create property.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}

export async function updatePropertyApi(
  id: string,
  data: UpdatePropertyRequest,
): Promise<Property> {
  try {
    const response = await apiClient.patch<PropertySingleResponse>(`/properties/${id}`, data);
    const result = response.data;

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to update property.');
    }

    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<PropertySingleResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to update property.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}

export async function deletePropertyApi(id: string): Promise<void> {
  try {
    const response = await apiClient.delete<PropertyDeleteResponse>(`/properties/${id}`);
    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete property.');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError<PropertyDeleteResponse>(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete property.',
        { cause: error },
      );
    }
    if (error instanceof Error) throw error;
    throw new Error('An unexpected error occurred.', { cause: error });
  }
}