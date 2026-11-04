import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../constants/messages.js';
import {
  getAllMasterDataService,
  createMasterDataService,
  updateMasterDataService,
} from './masterData.service.js';
import type {
  CreateMasterDataInput,
  UpdateMasterDataInput,
} from './masterData.validation.js';

export const getAllMasterData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getAllMasterDataService();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.MASTER_DATA_RETRIEVED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createMasterData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.body as CreateMasterDataInput;
    const createdItem = await createMasterDataService(input,  req.user!.id);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.MASTER_DATA_CREATED,
      data: createdItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMasterData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const input = req.body as UpdateMasterDataInput;

    const updatedItem = await updateMasterDataService(id, input,req.user!.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.MASTER_DATA_UPDATED,
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};