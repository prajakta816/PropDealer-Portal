import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import {findUserByEmail, findUserById} from './auth.repository.js'
import { loginInput } from "./auth.validation.js";
import { MESSAGES } from "../../constants/messages.js";

const JWT_EXPIRES_IN = '1d';

const createAuthError = (message:string, statusCode:number)=>{
    const error = new Error(message) as Error & {statusCode : number ;};
    error.statusCode = statusCode;
    return error;
}

export const loginService = async(loginData : loginInput)=>{
    const user = await findUserByEmail(loginData.email)

    if(!user){
        throw createAuthError(MESSAGES.ERROR.INVALID_CREDENTIALS, 401);
    }

    const isPaswordValid = await bcrypt.compare(loginData.password , user.passwordHash);

    if(!isPaswordValid){
        throw createAuthError(MESSAGES.ERROR.INVALID_CREDENTIALS, 401);
    }

    const token = jwt.sign({role:user.role}, env.JWT_SECRET ,{subject:user.id , expiresIn:JWT_EXPIRES_IN});

    return{
        token,
        expiresIn:JWT_EXPIRES_IN,
        tokenType: 'Bearer' as const,
        data:{
            name:user.name,
            email:user.email,
            role:user.role
        },
    };   
}

export const getCurrentUserService =async(token:string)=>{
    try{
        const decoded = jwt.verify(token , env.JWT_SECRET);
        if(typeof decoded === 'string' || !decoded.sub){
            throw createAuthError(MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN, 401);
        }

        const user = await findUserById(decoded.sub);
        if(!user){
            throw createAuthError(MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN, 401);
        }

        return{
            name:user.name,
            email:user.email,
            role:user.role
        }
    }catch (error) {
    if (
      error instanceof Error &&
      'statusCode' in error &&
      typeof error.statusCode === 'number'
    ) {
      throw error;
    }

    throw createAuthError(MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN, 401);
  }
}