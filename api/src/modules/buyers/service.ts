import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../constants/messages.js';
import type { BuyerRecord } from './types.js';
import {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove,
} from './repository.js';
import type {
  CreateBuyerInput,
  UpdateBuyerInput,
} from './validation.js';

const createServiceError = (message: string, statusCode: number) => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};

export const getAllBuyers = async (): Promise<BuyerRecord[]> => {
  return findAll();
};

export const getBuyerById = async (id: string): Promise<BuyerRecord> => {
  const buyer = await findById(id);

  if (!buyer) {
    throw createServiceError(
      MESSAGES.ERROR.BUYER_NOT_FOUND,
      StatusCodes.NOT_FOUND,
    );
  }

  return buyer;
};

export const createBuyer = async (
  input: CreateBuyerInput,
  actorId: string,
): Promise<BuyerRecord> => {
  const existing = await findByEmail(input.email);

  if (existing) {
    throw createServiceError(
      MESSAGES.ERROR.BUYER_ALREADY_EXISTS,
      StatusCodes.CONFLICT,
    );
  }

  return create({
    name: input.name,
    email: input.email,
    createdById: actorId,
    updatedById: actorId,
  });
};

export const updateBuyer = async (
  id: string,
  input: UpdateBuyerInput,
  actorId: string,
): Promise<BuyerRecord> => {
  const existingRecord = await findById(id);

  if (!existingRecord) {
    throw createServiceError(
      MESSAGES.ERROR.BUYER_NOT_FOUND,
      StatusCodes.NOT_FOUND,
    );
  }

  if (input.email && input.email !== existingRecord.email) {
    const duplicate = await findByEmail(input.email);

    if (duplicate && duplicate.id !== id) {
      throw createServiceError(
        MESSAGES.ERROR.BUYER_ALREADY_EXISTS,
        StatusCodes.CONFLICT,
      );
    }
  }

  return update(id, {
    name: input.name,
    email: input.email,
    updatedById: actorId,
  });
};

export const deleteBuyer = async (id: string): Promise<BuyerRecord> => {
  const existingRecord = await findById(id);

  if (!existingRecord) {
    throw createServiceError(
      MESSAGES.ERROR.BUYER_NOT_FOUND,
      StatusCodes.NOT_FOUND,
    );
  }

  return remove(id);
};