import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import {findUserByEmail} from './auth.repository.js'
import { loginInput } from "./auth.validation.js";

const JWT_EXPIRES_IN = '1d';

const createAuthError = (message:string, statusCode:number)=>{
    const error = new Error(message) as Error & {statusCode : number ;};
    error.statusCode = statusCode;
    return error;
}

export const loginService = async(loginData : loginInput)=>{
    const user = await findUserByEmail(loginData.email)

    if(!user){
        throw createAuthError("Invalid email or passoword",401);
    }

    const isPaswordValid = await bcrypt.compare(loginData.password , user.passwordHash);

    if(!isPaswordValid){
        throw createAuthError("Invalid email or passoword",401);
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