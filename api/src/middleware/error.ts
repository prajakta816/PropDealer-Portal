import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

interface AppError extends Error {
    statusCode?: number;
}

export const errorHandler = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error('API Error:', error);

    const statusCode =
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