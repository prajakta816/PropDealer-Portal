import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../constants/messages.js';
import { DEAL_STATUS, PROPERTY_STATUS } from '../../constants/property.js';
import type { PropertyStatus, DealStatus } from '../../constants/property.js';
import type { DealRecord } from './types.js';
import {
  findByProperty,
  findById,
  findActiveByBuyerAndProperty,
  createDealWithTransaction,
  updateDealWithTransaction,
} from './repository.js';
import { findById as findPropertyById } from '../property/repository.js';
import { findById as findBuyerById } from '../buyers/repository.js';
import type {
  CreateDealBodyInput,
  UpdateDealBodyInput,
} from './validation.js';


const createServiceError = (message: string, statusCode: number) => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};


const computePropertyStatus = (deals: DealRecord[]): PropertyStatus => {
  if (deals.some((d) => d.status === DEAL_STATUS.CLOSED)) {
    return PROPERTY_STATUS.SOLD;
  }
  if (deals.some((d) => d.status === DEAL_STATUS.NEGOTIATION)) {
    return PROPERTY_STATUS.UNDER_NEGOTIATION;
  }
  return PROPERTY_STATUS.AVAILABLE;
};


export const getDealsByProperty = async (propertyId: string): Promise<DealRecord[]> => {
  const property = await findPropertyById(propertyId);
  if (!property) {
    throw createServiceError(MESSAGES.ERROR.PROPERTY_NOT_FOUND, StatusCodes.NOT_FOUND);
  }

  return findByProperty(propertyId);
};

export const getDealById = async (id: string): Promise<DealRecord> => {
  const deal = await findById(id);
  if (!deal) {
    throw createServiceError(MESSAGES.ERROR.DEAL_NOT_FOUND, StatusCodes.NOT_FOUND);
  }

  return deal;
};

export const createDeal = async (
  propertyId: string,
  input: CreateDealBodyInput,
  actorId: string,
): Promise<DealRecord> => {

    const property = await findPropertyById(propertyId);
  if (!property) {
    throw createServiceError(MESSAGES.ERROR.PROPERTY_NOT_FOUND, StatusCodes.NOT_FOUND);
  }

  if (property.status === PROPERTY_STATUS.SOLD) {
    throw createServiceError(MESSAGES.ERROR.DEAL_CANNOT_CREATE_ON_SOLD, StatusCodes.CONFLICT);
  }

  const buyer = await findBuyerById(input.buyerId);
  if (!buyer) {
    throw createServiceError(MESSAGES.ERROR.BUYER_NOT_FOUND, StatusCodes.NOT_FOUND);
  }

  const existingActiveDeal = await findActiveByBuyerAndProperty(input.buyerId, propertyId);
  if (existingActiveDeal) {
    throw createServiceError(MESSAGES.ERROR.DEAL_BUYER_CONFLICT, StatusCodes.CONFLICT);
  }

  return createDealWithTransaction(
    {
      propertyId,
      buyerId: input.buyerId,
      dealPrice: input.dealPrice,
      status: DEAL_STATUS.NEGOTIATION,
      createdById: actorId,
      updatedById: actorId,
    },
    PROPERTY_STATUS.UNDER_NEGOTIATION,
  );
};

export const updateDeal = async (
  id: string,
  input: UpdateDealBodyInput,
  actorId: string,
): Promise<DealRecord> => {

    const existingDeal = await findById(id);
  if (!existingDeal) {
    throw createServiceError(MESSAGES.ERROR.DEAL_NOT_FOUND, StatusCodes.NOT_FOUND);
  }

  if (existingDeal.status === DEAL_STATUS.LOST) {
    throw createServiceError(MESSAGES.ERROR.DEAL_LOCKED, StatusCodes.CONFLICT);
  }

  if (input.buyerId && input.buyerId !== existingDeal.buyerId) {
    if (existingDeal.status === DEAL_STATUS.CLOSED) {
      throw createServiceError(MESSAGES.ERROR.DEAL_BUYER_LOCKED, StatusCodes.CONFLICT);
    }

    const buyer = await findBuyerById(input.buyerId);
    if (!buyer) {
      throw createServiceError(MESSAGES.ERROR.BUYER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const conflict = await findActiveByBuyerAndProperty(input.buyerId, existingDeal.propertyId, id);
    if (conflict) {
      throw createServiceError(MESSAGES.ERROR.DEAL_BUYER_CONFLICT, StatusCodes.CONFLICT);
    }
  }

  const targetStatus = (input.status ?? existingDeal.status) as DealStatus;
  const targetPrice = targetStatus === DEAL_STATUS.LOST
    ? 0
    : input.dealPrice !== undefined
      ? input.dealPrice
      : existingDeal.dealPrice;

  if (targetStatus === DEAL_STATUS.CLOSED) {
    const property = await findPropertyById(existingDeal.propertyId);
    if (property && targetPrice < property.basePrice) {
      throw createServiceError(MESSAGES.ERROR.DEAL_PRICE_BELOW_BASE, StatusCodes.BAD_REQUEST);
    }
  }

  let autoMarkOtherDealsLost = false;
  let newPropertyStatus: PropertyStatus = PROPERTY_STATUS.UNDER_NEGOTIATION;

  if (targetStatus === DEAL_STATUS.CLOSED) {
    autoMarkOtherDealsLost = true;
    newPropertyStatus = PROPERTY_STATUS.SOLD;
  } else {
    const allPropertyDeals = await findByProperty(existingDeal.propertyId);
    const simulatedDeals = allPropertyDeals.map((d) =>
      d.id === id ? { ...d, status: targetStatus, dealPrice: targetPrice } : d,
    );
    newPropertyStatus = computePropertyStatus(simulatedDeals);
  }

  return updateDealWithTransaction(
    id,
    existingDeal.propertyId,
    {
      buyerId: input.buyerId,
      dealPrice: targetPrice,
      status: targetStatus,
      updatedById: actorId,
    },
    {
      autoMarkOtherDealsLost,
      newPropertyStatus,
    },
  );
};