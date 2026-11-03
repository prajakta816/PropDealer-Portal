import type { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findUserById } from '../modules/auth/auth.repository.js';

import { UserRole } from '../constants/roles.js';
import { MESSAGES } from '../constants/messages.js';
import { StatusCodes } from 'http-status-codes';

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : undefined;

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: MESSAGES.ERROR.AUTHENTICATION_TOKEN_REQUIRED
        });
    }

    let decoded: jwt.JwtPayload;

    try {
        const verifiedToken = jwt.verify(token, env.JWT_SECRET, {
            algorithms: ['HS256']
        });

        if (
            typeof verifiedToken === 'string' ||
            typeof verifiedToken.sub !== 'string' ||
            !verifiedToken.sub
        ) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.ERROR.INVALID_AUTHENTICATION_TOKEN
            });
        }

        decoded = verifiedToken;

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN
            });
        }

        return next(error);
    }

    try {
        const user = await findUserById(decoded.sub!);

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.ERROR.USER_NOT_FOUND
            });
        }

        req.user = {
            id: decoded.sub!,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return next();

    } catch (error) {
        return next(error);
    }
};

export const authorizeRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.ERROR.AUTHENTICATION_REQUIRED
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: MESSAGES.ERROR.UNAUTHORIZED
            });
        }

        return next();
    };
};