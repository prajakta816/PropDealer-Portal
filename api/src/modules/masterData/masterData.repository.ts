import {prisma} from '../../../prisma/prisma.js';

import type {CreateMasterDataRepoInput, MasterDataRecord, UpdateMasterDataRepoInput} from './masterData.types.js';
import type{MasterDataCategory} from '../../constants/masterData.js';

export const createMasterDataRecord = (data: CreateMasterDataRepoInput): Promise<MasterDataRecord>=>{
    return prisma.masterData.create({
        data,
    });
};

export const updateMasterDataRecord = (
    id: string ,
    data:UpdateMasterDataRepoInput
   ):Promise<MasterDataRecord>=>{
    return prisma.masterData.update({
        where: {id},
        data,
    })
   }

export const findAllMasterData = (): Promise<MasterDataRecord[]> => {
  return prisma.masterData.findMany({
    orderBy: [
      { category: 'asc' },
      { value: 'asc' },
    ],
  });
};

export const findMasterDataById = (id: string): Promise<MasterDataRecord | null> => {
  return prisma.masterData.findUnique({
    where: { id },
  });
};

export const findMasterDataByCategoryAndValue = (
  category: MasterDataCategory,
  value: string,
): Promise<MasterDataRecord | null> => {
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
