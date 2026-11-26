import type { DealStatus } from '../../constants/property.js';

export interface AuditUser {
  id: string;
  name: string;
  email: string;
}

export interface DealPropertySummary {
  id: string;
  title: string;
  address: string;
  basePrice: number;
}

export interface DealBuyerSummary {
  id: string;
  name: string;
  email: string;
}

export interface CreateDealRepoInput {
  propertyId: string;
  buyerId: string;
  dealPrice: number;
  status: DealStatus;
  createdById: string;
  updatedById: string;
}

export interface UpdateDealRepoInput {
  buyerId?: string;
  dealPrice?: number;
  status?: DealStatus;
  updatedById: string;
}

export interface DealRecord {
  id: string;
  propertyId: string;
  buyerId: string;
  dealPrice: number;
  status: DealStatus;
  createdAt: Date;
  createdById: string | null;
  createdBy?: AuditUser | null;
  updatedAt: Date;
  updatedById: string | null;
  updatedBy?: AuditUser | null;
  property?: DealPropertySummary;
  buyer?: DealBuyerSummary;
}