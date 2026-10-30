import type { Request, Response, NextFunction } from "express";

import jwt from 'jsonwebtoken';
import { env } from "../config/env.js";
import { findUserById } from "../modules/auth/auth.repository.js";

import { UserRole } from "../constants/roles.js";
import { MESSAGES } from "../constants/messages.js";
import { StatusCodes } from 'http-status-codes';
import type { AuthenticatedUser } from '../types/auth.types.js';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : undefined;
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.AUTHENTICATION_TOKEN_REQUIRED });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
        if (typeof decoded === 'string' || !decoded.sub) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.INVALID_AUTHENTICATION_TOKEN });
        }

        const user = await findUserById(decoded.sub);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.USER_NOT_FOUND });
        }

        req.user = {
            id: decoded.sub,
            name: user.name,
            email: user.email,
            role: user.role
        }

        return next();
    } catch {
        return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN });
    }
}

export const authorizeRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.AUTHENTICATION_REQUIRED })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
        }

        return next();
    }
}
