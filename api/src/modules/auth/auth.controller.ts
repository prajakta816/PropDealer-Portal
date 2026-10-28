import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import { loginService,getCurrentUserService } from "./auth.service.js";
import { loginInput } from "./auth.validation.js";

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

    return res.status(200).json({
      statusCode: 200,
      token:result.token,
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
      if (statusCode === 401) {
        //code of clear cookiw after the error
        // res.clearCookie('accessToken', {
        // httpOnly: true,
        // sameSite: 'lax',
        // path: '/',
        // });
      }

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

export const getCurrentUser = async(req:Request, res: Response,next:NextFunction)=>{
  try {
    // const token = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;

    if(!token){
      res.status(401).json({
        status:'error',
        message:'not authenticated'
      });
      return;
    }

    const user = await getCurrentUserService(token);
    return res.status(200).json({
      status:'success',
      data:{
        user,
      }
    });
  } catch (error) {
    next(error);
  }
}