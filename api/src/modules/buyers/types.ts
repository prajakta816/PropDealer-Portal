export interface AuditUser {
  id: string;
  name: string;
  email: string;
}

export interface CreateBuyerRepoInput {
  name: string;
  email: string;
  createdById: string;
  updatedById: string;
}

export interface UpdateBuyerRepoInput {
  name?: string;
  email?: string;
  updatedById: string;
}

export interface BuyerRecord {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  createdById: string | null;
  createdBy?: AuditUser | null;
  updatedAt: Date;
  updatedById: string | null;
  updatedBy?: AuditUser | null;
}