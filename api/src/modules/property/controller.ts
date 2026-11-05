import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../constants/messages.js';
import type {
  PropertyStatus,
  PropertySortField,
  SortDirection,
} from '../../constants/property.js';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from './service.js';
import type {
  CreatePropertyInput,
  UpdatePropertyInput,
} from './validation.js';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, status, sortField, sortDirection } = req.query;

    const data = await getAllProperties({
      search: typeof search === 'string' ? search : undefined,
      status: typeof status === 'string' ? (status as PropertyStatus) : undefined,
      sortField: typeof sortField === 'string' ? (sortField as PropertySortField) : undefined,
      sortDirection: typeof sortDirection === 'string' ? (sortDirection as SortDirection) : undefined,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PROPERTIES_RETRIEVED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const data = await getPropertyById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PROPERTY_RETRIEVED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.body as CreatePropertyInput;
    const actorId = req.user!.id;

    const data = await createProperty(input, actorId);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.PROPERTY_CREATED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const input = req.body as UpdatePropertyInput;
    const actorId = req.user!.id;

    const data = await updateProperty(id, input, actorId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PROPERTY_UPDATED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;

    await deleteProperty(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.PROPERTY_DELETED,
    });
  } catch (error) {
    next(error);
  }
};