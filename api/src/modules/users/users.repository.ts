
import { prisma } from '../../../prisma/prisma.js';
import type { UserRole } from '../../constant/constant.js';

interface CreateUserRepositoryInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdById?: string;
  updatedById?: string;
}

interface CreateBuyerRepositoryInput {
  name: string;
  email: string;
  createdById?: string;
  updatedById?: string;
}

const auditUserSelect = {
  id: true,
  name: true,
  email: true,
} as const;

export const createUser = (userData: CreateUserRepositoryInput) => {
  return prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      passwordHash: userData.passwordHash,
      role: userData.role,
      ...(userData.createdById
        ? { createdById: userData.createdById }
        : {}),
      ...(userData.updatedById
        ? { updatedById: userData.updatedById }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      createdById: true,
      createdBy: {
        select: auditUserSelect,
      },
      updatedAt: true,
      updatedById: true,
      updatedBy: {
        select: auditUserSelect,
      },
    },
  });
};

export const createBuyer = (buyerData: CreateBuyerRepositoryInput) => {
  return prisma.buyer.create({
    data: {
      name: buyerData.name,
      email: buyerData.email,
      ...(buyerData.createdById
        ? { createdById: buyerData.createdById }
        : {}),
      ...(buyerData.updatedById
        ? { updatedById: buyerData.updatedById }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      createdById: true,
      createdBy: {
        select: auditUserSelect,
      },
      updatedAt: true,
      updatedById: true,
      updatedBy: {
        select: auditUserSelect,
      },
    },
  });
};
