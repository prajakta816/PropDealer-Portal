import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../constants/messages.js';
import {
  getDealsByProperty,
  getDealById,
  createDeal,
  updateDeal,
} from './service.js';
import type {
  CreateDealBodyInput,
  UpdateDealBodyInput,
} from './validation.js';

export const getByProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const propertyId = req.params.id as string;
    const data = await getDealsByProperty(propertyId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DEALS_RETRIEVED,
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
    const data = await getDealById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DEAL_RETRIEVED,
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
    const propertyId = req.params.id as string;
    const input = req.body as CreateDealBodyInput;
    const actorId = req.user!.id;

    const data = await createDeal(propertyId, input, actorId);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.DEAL_CREATED,
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
    const input = req.body as UpdateDealBodyInput;
    const actorId = req.user!.id;

    const data = await updateDeal(id, input, actorId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.DEAL_UPDATED,
      data,
    });
  } catch (error) {
    next(error);
  }
};