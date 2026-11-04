import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../../constants/messages.js';
import {
    getAllBuyers,
    getBuyerById,
    createBuyer,
    updateBuyer,
    deleteBuyer,
} from './service.js';
import type {
    CreateBuyerInput,
    UpdateBuyerInput,
} from './validation.js';

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await getAllBuyers();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: MESSAGES.SUCCESS.BUYERS_RETRIEVED,
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
        const data = await getBuyerById(id);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: MESSAGES.SUCCESS.BUYER_RETRIEVED,
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
        const input = req.body as CreateBuyerInput;

        // if (!req.user) {
        //     return res.status(StatusCodes.UNAUTHORIZED).json({
        //         success: false,
        //         message: MESSAGES.ERROR.AUTHENTICATION_REQUIRED,
        //     });
        // }

        // const actorId = req.user.id;
        const actorId = req.user!.id;

        const data = await createBuyer(input, actorId);

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: MESSAGES.SUCCESS.BUYER_CREATED,
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
        const input = req.body as UpdateBuyerInput;
        // if (!req.user) {
        //     return res.status(StatusCodes.UNAUTHORIZED).json({
        //         success: false,
        //         message: MESSAGES.ERROR.AUTHENTICATION_REQUIRED,
        //     });
        // }

        // const actorId = req.user.id;
        const actorId = req.user!.id;

        const data = await updateBuyer(id, input, actorId);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: MESSAGES.SUCCESS.BUYER_UPDATED,
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

        await deleteBuyer(id);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: MESSAGES.SUCCESS.BUYER_DELETED,
        });
    } catch (error) {
        next(error);
    }
};