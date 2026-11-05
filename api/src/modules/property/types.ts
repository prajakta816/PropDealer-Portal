import type { PropertyStatus, DealStatus } from '../../constants/property.js';

export interface AuditUser {
  id: string;
  name: string;
  email: string;
}

export interface CreatePropertyRepoInput {
  title: string;
  address: string;
  basePrice: number;
  createdById: string;
  updatedById: string;
}

export interface UpdatePropertyRepoInput {
  title?: string;
  address?: string;
  basePrice?: number;
  updatedById: string;
}

export interface PropertyRecord {
  id: string;
  title: string;
  address: string;
  basePrice: number;
  status: PropertyStatus;
  createdAt: Date;
  createdById: string | null;
  createdBy?: AuditUser | null;
  updatedAt: Date;
  updatedById: string | null;
  updatedBy?: AuditUser | null;
}