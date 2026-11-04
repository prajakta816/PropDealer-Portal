import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MESSAGES } from '../constants/messages.js';
import { Prisma } from  '../../generated/prisma/client.js';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error('API Error:', error);
    console.log('Error message:', error.message);
    console.log('Error statusCode:', 'statusCode' in error ? error.statusCode : 'Not found');

    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
    ) {
        return res.status(StatusCodes.CONFLICT).json({
            success: false,
            message: MESSAGES.ERROR.MASTER_DATA_ALREADY_EXISTS,
        });
    }

    const statusCode =
        'statusCode' in error &&
        typeof error.statusCode === 'number' &&
        error.statusCode >= 400 &&
        error.statusCode <= 599
            ? error.statusCode
            : StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
        success: false,
        message:
            statusCode >= 500
                ? 'Internal server error'
                : error.message,
    });
};

/*     if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
    ) {
        return res.status(StatusCodes.CONFLICT).json({
            success: false,
            message: MESSAGES.ERROR.MASTER_DATA_ALREADY_EXISTS,
        });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Record not found' });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid input data' });
    }

    const statusCode = */