import { prisma } from '../../../prisma/prisma.js';
import type { CreateUserRepositoryInput, CreateBuyerRepositoryInput } from './users.types.js';

const auditUserSelect = {
  id: true,
  name: true,
  email: true,
} as const;

export const getAllUsers = async () => {
  const [users, buyers] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        createdById: true,
        updatedAt: true,
        updatedById: true,
      },
    }),

    prisma.buyer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        createdById: true,
        updatedAt: true,
        updatedById: true,
      },
    }),
  ]);

  const allUsers = [
    ...users,
    ...buyers.map((buyer) => ({
      ...buyer,
      role: 'Buyer' as const,
    })),
  ];

  return allUsers.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
};

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
