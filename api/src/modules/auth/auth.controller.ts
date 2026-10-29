import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import { loginService, getCurrentUserService } from "./auth.service.js";
import { loginInput } from "./auth.validation.js";

import { MESSAGES } from '../../constants/messages.js';
import { StatusCodes } from "http-status-codes";

// const COOKIE_MAX_AGE = 86400000;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logindata = req.body as loginInput

    const result = await loginService(logindata);

    //creating the cookie of token 
    // res.cookie('accessToken', result.token, {
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   maxAge: COOKIE_MAX_AGE,
    //   path: '/'
    // });

    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      token: result.token,
      tokenType: result.tokenType,
      message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
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
      //code of clear cookiw after the error
      // if (statusCode ===StatusCodes.UNAUTHORIZED) {     
      //    res.clearCookie('accessToken', {
      //    httpOnly: true,
      //    sameSite: 'lax',
      //    path: '/',
      //    });
      // }

      return res.status(statusCode).json({
        success: false,
        statusCode,
        message:
          statusCode === StatusCodes.UNAUTHORIZED
            ? MESSAGES.ERROR.INVALID_CREDENTIALS
            : MESSAGES.ERROR.AUTH_CONFIG_ERROR,
      });
    }

    return next(error);
  }
}

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const token = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: MESSAGES.ERROR.NOT_AUTHENTICATED
      });
      return;
    }

    const user = await getCurrentUserService(token);
    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        user,
      }
    });
  } catch (error) {
    next(error);
  }
}