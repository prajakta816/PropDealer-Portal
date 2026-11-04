import axios from 'axios';
import apiClient from './apiClient';
import type { MasterDataCategory } from '../constants/masterData.ts';

interface MasterDataItem {
    id: string,
    category: MasterDataCategory,
    value: string,
    createdAt: string,
    createdById: string | null,
    createdBy: { name: string } | null,
    updatedAt: string 
    updatedById: string | null,
    updatedBy: { name: string } | null
}

interface MasterDataListResponse {
    success: boolean,
    message: string,
    data: MasterDataItem[]
}

interface MasterDataSingleResponse {
    success: boolean,
    message: string,
    data: MasterDataItem
}

export interface CreateMasterDataRequest {
    category: MasterDataCategory,
    value: string
}

export interface UpdateMasterDataRequest {
    category?: MasterDataCategory,
    value?: string
}

export async function getAllMasterDataApi(): Promise<MasterDataItem[]> {
    try {
        const response = await apiClient.get<MasterDataListResponse>('/master-data');
        const result = response.data;
        if (!result.success || !Array.isArray(result.data)) {
            throw new Error(result.message || 'failed to get the master data');
        }
        return result.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<MasterDataListResponse>(error)) {
            throw new Error(
                error.response?.data?.message || 'Unable to retrieve master data. Please try again.',
                { cause: error },
            );
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred.', { cause: error });
    }
}

export async function createMasterDataApi(data: CreateMasterDataRequest,): Promise<MasterDataItem> {
    try {
        const response = await apiClient.post<MasterDataSingleResponse>('/master-data', data);
        const result = response.data;
        if (!result.success || !result.data) {
            throw new Error(result.message || "failed to create the master data");
        }
        return result.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<MasterDataSingleResponse>(error)) {
            throw new Error(
                error.response?.data?.message || 'Unable to create master data. Please try again.',
                { cause: error },
            );
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred.', { cause: error });
    }
}

export async function updateMasterDataApi(id: string,
    data: UpdateMasterDataRequest): Promise<MasterDataItem> {
    try {
        const response = await apiClient.put<MasterDataSingleResponse>(`/master-data/${id}`, data);
        const result = response.data;
        if (!result.success || !result.data) {
            throw new Error(result.message || "failed to update the master data");
        }
        return result.data;
    } catch (error: unknown) {
        if (axios.isAxiosError<MasterDataSingleResponse>(error)) {
            throw new Error(
                error.response?.data?.message || 'Unable to update master data. Please try again.',
                { cause: error },
            );
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred.', { cause: error });
    }
}

