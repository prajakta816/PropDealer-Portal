import type { Request, Response, NextFunction } from "express";

import jwt from 'jsonwebtoken';
import { env } from "../config/env.js";
import { findUserById } from "../modules/auth/auth.repository.js";

import { UserRole } from "../constants/roles.js";
import { MESSAGES } from "../constants/messages.js";

export interface AuthenticatedUser {
    id: string,
    name: string,
    email: string,
    role: UserRole
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer')
            ? authHeader.split(' ')[1]
            : undefined;
        if (!token) {
            return res.status(401).json({ success: false, message: MESSAGES.ERROR.AUTHENTICATION_TOKEN_REQUIRED });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (typeof decoded === 'string' || !decoded.sub) {
            return res.status(401).json({ success: false, message: MESSAGES.ERROR.INVALID_AUTHENTICATION_TOKEN });
        }

        const user = await findUserById(decoded.sub);
        if (!user) {
            return res.status(401).json({ success: false, message: MESSAGES.ERROR.USER_NOT_FOUND });
        }

        req.user = {
            id: decoded.sub,
            name: user.name,
            email: user.email,
            role: user.role
        }

        return next();
    } catch {
        return res.status(401).json({ success: false, message: MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN });
    }
}

export const authorizeRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: MESSAGES.ERROR.AUTHENTICATION_REQUIRED })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
        }

        return next();
    }
}
