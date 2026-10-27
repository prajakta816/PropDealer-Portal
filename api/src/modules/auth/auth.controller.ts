import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import { loginService } from "./auth.service.js";
import { loginInput } from "./auth.validation.js";

const COOKIE_MAX_AGE = 86400000;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logindata = req.body as loginInput

    const result = await loginService(logindata);

    res.cookie('accessToken', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/'
    });

    return res.status(200).json({
      statusCode: 200,
      tokenType: result.tokenType,
      message: "login successfull",
      expiresIn: result.expiresIn,
      data: result.data
    });
  } catch (error) {
    if (
      error instanceof Error &&
      'statusCode' in error &&
      typeof error.statusCode === 'number'
    ) {
      const statusCode = error.statusCode;

      return res.status(statusCode).json({
        success: false,
        statusCode,
        message:
          statusCode === 401
            ? 'Invalid email or password.'
            : 'Authentication is not configured correctly.',
      });
    }

    return next(error);
  }
}