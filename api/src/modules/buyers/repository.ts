import { prisma } from '../../../prisma/prisma.js';
import type {
  CreateBuyerRepoInput,
  UpdateBuyerRepoInput,
  BuyerRecord,
} from './types.js';

const auditUserSelect = {
  id: true,
  name: true,
  email: true,
} as const;

export const findAll = (): Promise<BuyerRecord[]> => {
  return prisma.buyer.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      createdBy: {
        select: auditUserSelect,
      },
      updatedBy: {
        select: auditUserSelect,
      },
    },
  });
};

export const findById = (id: string): Promise<BuyerRecord | null> => {
  return prisma.buyer.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: auditUserSelect,
      },
      updatedBy: {
        select: auditUserSelect,
      },
    },
  });
};

export const findByEmail = (email: string): Promise<BuyerRecord | null> => {
  return prisma.buyer.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
    },
  });
};

export const create = (data: CreateBuyerRepoInput): Promise<BuyerRecord> => {
  return prisma.buyer.create({
    data: {
      name: data.name,
      email: data.email,
      createdById: data.createdById,
      updatedById: data.updatedById,
    },
    include: {
      createdBy: {
        select: auditUserSelect,
      },
      updatedBy: {
        select: auditUserSelect,
      },
    },
  });
};

export const update = (
  id: string,
  data: UpdateBuyerRepoInput,
): Promise<BuyerRecord> => {
  return prisma.buyer.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.email ? { email: data.email } : {}),
      updatedById: data.updatedById,
    },
    include: {
      createdBy: {
        select: auditUserSelect,
      },
      updatedBy: {
        select: auditUserSelect,
      },
    },
  });
};

export const remove = (id: string): Promise<BuyerRecord> => {
  return prisma.buyer.delete({
    where: { id },
  });
};