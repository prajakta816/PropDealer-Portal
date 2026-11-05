import { prisma } from '../../../prisma/prisma.js';
import { PROPERTY_SORT_FIELDS, SORT_DIRECTION } from '../../constants/property.js';
import type { PropertyStatus, PropertySortField, SortDirection } from '../../constants/property.js';
import type {
  CreatePropertyRepoInput,
  UpdatePropertyRepoInput,
  PropertyRecord,
} from './types.js';


const auditUserSelect = {
  id: true,
  name: true,
  email: true,
} as const;

const propertyInclude = {
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
} as const;


export interface FindAllPropertiesOptions {
  search?: string;
  status?: PropertyStatus;
  sortField?: PropertySortField;
  sortDirection?: SortDirection;
}


export const findAll = (
  options: FindAllPropertiesOptions = {},
): Promise<PropertyRecord[]> => {
  const {
    search,
    status,
    sortField = PROPERTY_SORT_FIELDS.TITLE,
    sortDirection = SORT_DIRECTION.ASC,
  } = options;

  return prisma.property.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { [sortField]: sortDirection },
    include: propertyInclude,
  }) as Promise<PropertyRecord[]>;
};

export const findById = (id: string): Promise<PropertyRecord | null> => {
  return prisma.property.findUnique({
    where: { id },
    include: propertyInclude,
  }) as Promise<PropertyRecord | null>;
};

export const findByTitle = (title: string): Promise<PropertyRecord | null> => {
  return prisma.property.findFirst({
    where: {
      title: {
        equals: title,
        mode: 'insensitive',
      },
    },
  }) as Promise<PropertyRecord | null>;
};

export const findByAddress = (address: string): Promise<PropertyRecord | null> => {
  return prisma.property.findFirst({
    where: {
      address: {
        equals: address,
        mode: 'insensitive',
      },
    },
  }) as Promise<PropertyRecord | null>;
};

export const createRecord = (
  data: CreatePropertyRepoInput,
): Promise<PropertyRecord> => {
  return prisma.property.create({
    data: {
      title: data.title,
      address: data.address,
      basePrice: data.basePrice,
      createdById: data.createdById,
      updatedById: data.updatedById,
    },
    include: propertyInclude,
  }) as Promise<PropertyRecord>;
};

export const updateRecord = (
  id: string,
  data: UpdatePropertyRepoInput,
): Promise<PropertyRecord> => {
  return prisma.property.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.basePrice !== undefined ? { basePrice: data.basePrice } : {}),
      updatedById: data.updatedById,
    },
    include: propertyInclude,
  }) as Promise<PropertyRecord>;
};

export const deleteRecord = (id: string): Promise<PropertyRecord> => {
  return prisma.property.delete({
    where: { id },
    include: propertyInclude,
  }) as Promise<PropertyRecord>;
};

export const countActiveOrClosedDeals = (propertyId: string): Promise<number> => {
  return prisma.deal.count({
    where: {
      propertyId,
      status: { not: 'Lost' },
    },
  });
};