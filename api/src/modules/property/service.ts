import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../constants/messages.js';
import type { PropertyRecord } from './types.js';
import {
  findAll,
  findById,
  findByTitle,
  findByAddress,
  createRecord,
  updateRecord,
  deleteRecord,
  countActiveOrClosedDeals,
  type FindAllPropertiesOptions,
} from './repository.js';
import type {
  CreatePropertyInput,
  UpdatePropertyInput,
} from './validation.js';


const createServiceError = (message: string, statusCode: number) => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};


export const getAllProperties = async (
  options: FindAllPropertiesOptions,
): Promise<PropertyRecord[]> => {
  return findAll(options);
};

export const getPropertyById = async (id: string): Promise<PropertyRecord> => {
  const property = await findById(id);

  if (!property) {
    throw createServiceError(
      MESSAGES.ERROR.PROPERTY_NOT_FOUND,
      StatusCodes.NOT_FOUND,
    );
  }

  return property;
};

export const createProperty = async (
  input: CreatePropertyInput,
  actorId: string,
): Promise<PropertyRecord> => {
  const duplicateTitle = await findByTitle(input.title);

  if (duplicateTitle) {
    throw createServiceError(
      MESSAGES.ERROR.PROPERTY_TITLE_EXISTS,
      StatusCodes.CONFLICT,
    );
  }

  const duplicateAddress = await findByAddress(input.address);

  if (duplicateAddress) {
    throw createServiceError(
      MESSAGES.ERROR.PROPERTY_ADDRESS_EXISTS,
      StatusCodes.CONFLICT,
    );
  }

  return createRecord({
    title: input.title,
    address: input.address,
    basePrice: input.basePrice,
    createdById: actorId,
    updatedById: actorId,
  });
};

export const updateProperty = async (
  id: string,
  input: UpdatePropertyInput,
  actorId: string,
): Promise<PropertyRecord> => {
  const existing = await findById(id);

  if (!existing) {
    throw createServiceError(
      MESSAGES.ERROR.PROPERTY_NOT_FOUND,
      StatusCodes.NOT_FOUND,
    );
  }

  if (input.title !== undefined) {
    const duplicateTitle = await findByTitle(input.title);

    if (duplicateTitle && duplicateTitle.id !== id) {
      throw createServiceError(
        MESSAGES.ERROR.PROPERTY_TITLE_EXISTS,
        StatusCodes.CONFLICT,
      );
    }
  }

  if (input.address !== undefined) {
    const duplicateAddress = await findByAddress(input.address);

    if (duplicateAddress && duplicateAddress.id !== id) {
      throw createServiceError(
        MESSAGES.ERROR.PROPERTY_ADDRESS_EXISTS,
        StatusCodes.CONFLICT,
      );
    }
  }

  return updateRecord(id, {
    title: input.title,
    address: input.address,
    basePrice: input.basePrice,
    updatedById: actorId,
  });
};

export const deleteProperty = async (id: string): Promise<PropertyRecord> => {
  const existing = await findById(id);

  if (!existing) {
    throw createServiceError(
      MESSAGES.ERROR.PROPERTY_NOT_FOUND,
      StatusCodes.NOT_FOUND,
    );
  }

  const activeDealsCount = await countActiveOrClosedDeals(id);

  if (activeDealsCount > 0) {
    throw createServiceError(
      MESSAGES.ERROR.PROPERTY_HAS_ACTIVE_DEALS,
      StatusCodes.CONFLICT,
    );
  }

  return deleteRecord(id);
};