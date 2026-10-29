import type { Request, Response, NextFunction } from "express";

import jwt from 'jsonwebtoken';
import { env } from "../config/env.js";
import { findUserById } from "../modules/auth/auth.repository.js";
import { UserRole } from "../constants/roles.js";

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
            return res.status(401).json({ success: false, message: "Authentication token is required" });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (typeof decoded === 'string' || !decoded.sub) {
            return res.status(401).json({ success: false, message: "Invalid authentication token" });
        }

        const user = await findUserById(decoded.sub);
        if (!user) {
            return res.status(401).json({ success: false, message: "User associated with this token was not found." });
        }

        req.user = {
            id: decoded.sub,
            name: user.name,
            email: user.email,
            role: user.role
        }

        return next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid or expired authentication token." });
    }
}

export const authorizeRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Authentication required." })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "You do not have permission to access this resource." });
        }

        return next();
    }
}
