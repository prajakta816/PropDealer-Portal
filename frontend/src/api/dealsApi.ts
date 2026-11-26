import apiClient from './apiClient';
import { executeApiCall } from './apiHandler';
import type { Deal, DealStatus } from '../constants/deals';

export interface CreateDealRequest {
  buyerId: string;
  dealPrice: number;
}

export interface UpdateDealRequest {
  buyerId?: string;
  dealPrice?: number;
  status?: DealStatus;
}

export function getDealsByPropertyApi(propertyId: string): Promise<Deal[]> {
  return executeApiCall(
    () => apiClient.get(`/deals/property/${propertyId}`),
    'Unable to retrieve deals for this property.',
  );
}

export function getDealByIdApi(id: string): Promise<Deal> {
  return executeApiCall(
    () => apiClient.get(`/deals/${id}`),
    'Unable to retrieve deal details.',
  );
}

export function createDealApi(
  propertyId: string,
  data: CreateDealRequest,
): Promise<Deal> {
  return executeApiCall(
    () => apiClient.post(`/deals/property/${propertyId}`, data),
    'Failed to create deal.',
  );
}

export function updateDealApi(
  id: string,
  data: UpdateDealRequest,
): Promise<Deal> {
  return executeApiCall(
    () => apiClient.patch(`/deals/${id}`, data),
    'Failed to update deal.',
  );
}

