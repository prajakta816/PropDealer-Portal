import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../constants/messages.js';
import type { MasterDataCategory } from '../../constants/masterData.js';
import type { MasterDataRecord } from './masterData.types.js';
import {
  findAllMasterData,
  findMasterDataById,
  findMasterDataByCategoryAndValue,
  createMasterDataRecord,
  updateMasterDataRecord,
} from './masterData.repository.js';
import type {
  CreateMasterDataInput,
  UpdateMasterDataInput,
} from './masterData.validation.js';

const createServiceError = (message: string, statusCode: number) => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};

export const getAllMasterDataService = async (): Promise<MasterDataRecord[]> => {
  return findAllMasterData();
};

export const createMasterDataService = async (
  input: CreateMasterDataInput,
): Promise<MasterDataRecord> => {
  const category = input.category as MasterDataCategory;

  const existing = await findMasterDataByCategoryAndValue(
    category,
    input.value,
  );

  if (existing) {
    throw createServiceError(
      MESSAGES.ERROR.MASTER_DATA_ALREADY_EXISTS,
      StatusCodes.CONFLICT,
    );
  }

  return createMasterDataRecord({
    category,
    value: input.value,
  });
};

export const updateMasterDataService = async (
  id: string,
  input: UpdateMasterDataInput,
): Promise<MasterDataRecord> => {
  const existingRecord = await findMasterDataById(id);

  if (!existingRecord) {
    throw createServiceError(
      MESSAGES.ERROR.MASTER_DATA_NOT_FOUND,
      StatusCodes.NOT_FOUND,
    );
  }

  const targetCategory = (input.category ?? existingRecord.category) as MasterDataCategory;
  const targetValue = input.value ?? existingRecord.value;

  const duplicate = await findMasterDataByCategoryAndValue(
    targetCategory,
    targetValue,
  );

  if (duplicate && duplicate.id !== id) {
    throw createServiceError(
      MESSAGES.ERROR.MASTER_DATA_ALREADY_EXISTS,
      StatusCodes.CONFLICT,
    );
  }

  return updateMasterDataRecord(id, {
    category: input.category as MasterDataCategory | undefined,
    value: input.value,
  });
};