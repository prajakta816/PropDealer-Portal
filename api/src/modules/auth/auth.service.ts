import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { findUserByEmail } from './auth.repository.js';
import type { loginInput } from "./auth.validation.js";
import type { LoginServiceResult } from "./auth.types.js";

import { MESSAGES } from "../../constants/messages.js";
import { StatusCodes } from 'http-status-codes';

const JWT_EXPIRES_IN = '1d';

const DUMMY_HASH = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234';

const createAuthError = (message: string, statusCode: number) => {
    const error = new Error(message) as Error & { statusCode: number };
    error.statusCode = statusCode;
    return error;
};

export const loginService = async (loginData: loginInput): Promise<LoginServiceResult> => {
    const user = await findUserByEmail(loginData.email);

    const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
    const isPasswordValid = await bcrypt.compare(loginData.password, hashToCompare);

    if (!user || !isPasswordValid) {
        throw createAuthError(MESSAGES.ERROR.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
    }

    const token = jwt.sign({ role: user.role }, env.JWT_SECRET, { subject: user.id, expiresIn: JWT_EXPIRES_IN });

    return {
        token,
        expiresIn: JWT_EXPIRES_IN,
        tokenType: 'Bearer',
        data: {
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
