import { prisma } from '../../../prisma/prisma.js';

import type {
  CreateMasterDataRepoInput,
  UpdateMasterDataRepoInput,
} from './masterData.types.js';
import type { MasterDataCategory } from '../../constants/masterData.js';

export const createMasterDataRecord = (data: CreateMasterDataRepoInput) => {
  return prisma.masterData.create({
    data: {
      category: data.category,
      value: data.value,
      createdById: data.createdById,
      updatedById: data.updatedById,
    },
    include: {
    createdBy: {
      select: { name: true, },
    },
    updatedBy: {
      select: { name: true, },
    },
  },

  });
};

export const updateMasterDataRecord = (
  id: string,
  data: UpdateMasterDataRepoInput,
) => {
  return prisma.masterData.update({
    where: { id },
    data: {
      ...(data.category ? { category: data.category } : {}),
      ...(data.value ? { value: data.value } : {}),
      updatedById: data.updatedById,
    },
  });
};

export const findAllMasterData = () => {
  return prisma.masterData.findMany({
    include: {
      createdBy: {
        select: { name: true, },
      },
      updatedBy: {
        select: { name: true, },
      },
    },

    orderBy: [
      { category: 'asc' },
      { value: 'asc' },
    ],
  });
};

export const findMasterDataById = (id: string) => {
  return prisma.masterData.findUnique({
    where: { id },
  });
};

export const findMasterDataByCategoryAndValue = (
  category: MasterDataCategory,
  value: string,
) => {
  return prisma.masterData.findFirst({
    where: {
      category,
      value: {
        equals: value,
        mode: 'insensitive',
      },
    },
  });
};
