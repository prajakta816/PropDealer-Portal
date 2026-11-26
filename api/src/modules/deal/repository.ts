import { prisma } from '../../../prisma/prisma.js';
import { DEAL_STATUS } from '../../constants/property.js';
import type { PropertyStatus } from '../../constants/property.js';
import type {
  CreateDealRepoInput,
  UpdateDealRepoInput,
  DealRecord,
} from './types.js';


const auditUserSelect = {
  id: true,
  name: true,
  email: true,
} as const;

const propertySummarySelect = {
  id: true,
  title: true,
  address: true,
  basePrice: true,
} as const;

const buyerSummarySelect = {
  id: true,
  name: true,
  email: true,
} as const;

const dealInclude = {
  property: { select: propertySummarySelect },
  buyer: { select: buyerSummarySelect },
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
} as const;


export const findByProperty = (propertyId: string): Promise<DealRecord[]> => {
  return prisma.deal.findMany({
    where: { propertyId },
    orderBy: { createdAt: 'desc' },
    include: dealInclude,
  }) as Promise<DealRecord[]>;
};

export const findById = (id: string): Promise<DealRecord | null> => {
  return prisma.deal.findUnique({
    where: { id },
    include: dealInclude,
  }) as Promise<DealRecord | null>;
};

export const findActiveByBuyerAndProperty = (
  buyerId: string,
  propertyId: string,
  excludeDealId?: string,
): Promise<DealRecord | null> => {
  return prisma.deal.findFirst({
    where: {
      buyerId,
      propertyId,
      status: { not: DEAL_STATUS.LOST },
      ...(excludeDealId ? { id: { not: excludeDealId } } : {}),
    },
    include: dealInclude,
  }) as Promise<DealRecord | null>;
};

export const createDealWithTransaction = async (
  dealData: CreateDealRepoInput,
  newPropertyStatus: PropertyStatus,
): Promise<DealRecord> => {
  return prisma.$transaction(async (tx) => {
    const createdDeal = await tx.deal.create({
      data: {
        propertyId: dealData.propertyId,
        buyerId: dealData.buyerId,
        dealPrice: dealData.dealPrice,
        status: dealData.status,
        createdById: dealData.createdById,
        updatedById: dealData.updatedById,
      },
      include: dealInclude,
    });

    await tx.property.update({
      where: { id: dealData.propertyId },
      data: {
        status: newPropertyStatus,
        updatedById: dealData.updatedById,
      },
    });

    return createdDeal as DealRecord;
  });
};

export interface UpdateDealTransactionOptions {
  autoMarkOtherDealsLost?: boolean;
  newPropertyStatus: PropertyStatus;
}

export const updateDealWithTransaction = async (
  dealId: string,
  propertyId: string,
  updateData: UpdateDealRepoInput,
  options: UpdateDealTransactionOptions,
): Promise<DealRecord> => {
  return prisma.$transaction(async (tx) => {
    const updatedDeal = await tx.deal.update({
      where: { id: dealId },
      data: {
        ...(updateData.buyerId !== undefined ? { buyerId: updateData.buyerId } : {}),
        ...(updateData.dealPrice !== undefined ? { dealPrice: updateData.dealPrice } : {}),
        ...(updateData.status !== undefined ? { status: updateData.status } : {}),
        updatedById: updateData.updatedById,
      },
      include: dealInclude,
    });

    if (options.autoMarkOtherDealsLost) {
      await tx.deal.updateMany({
        where: {
          propertyId,
          id: { not: dealId },
          status: DEAL_STATUS.NEGOTIATION,
        },
        data: {
          status: DEAL_STATUS.LOST,
          dealPrice: 0,
          updatedById: updateData.updatedById,
        },
      });
    }

    await tx.property.update({
      where: { id: propertyId },
      data: {
        status: options.newPropertyStatus,
        updatedById: updateData.updatedById,
      },
    });

    return updatedDeal as DealRecord;
  });
};