import type { Request, Response,NextFunction } from "express";

import jwt from 'jsonwebtoken';
import { env } from "../config/env.js";
import { findUserById } from "../modules/auth/auth.repository.js";
import { UserRole } from "../constant/constant.js";
import { success } from "zod";

export interface AuthenticatedUser{
    id : string,
    name : string,
    email: string,
    role : UserRole
}

declare global {
    namespace Express{
        interface Request{
            user?:AuthenticatedUser;
        }

    }
}

export const authenticateToken = async(req: Request, res:Response, next:NextFunction)=>{
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer') ? authHeader.slice('Bearer'.length) : undefined;
        if(!token){
            return res.status(401).json({success:false , message :"Authentication token is required"});
        }

        const decoded = jwt.verify(token , env.JWT_SECRET);
        if(typeof decoded === 'string' || !decoded.sub){
            return res.status(401).json({success:false , message:"Invalid authentication token"});
        }

        const user = await findUserById(decoded.sub);
        if(!user){
            return res.status(401).json({success:false , message:"User not found associated with this token"});
        }
        
        req.user = {
            id   : decoded.id,
            name : decoded.name,
            email: decoded.email,
            role : decoded.role
        }  

        return next();
    }catch{
        return res.status(401).json({success:false , message:"invalid or expired autentication token"});
    }
}

export const autherizeRole =(...allowedRoles : UserRole[]) =>{
    return (req: Request , res: Response, next: NextFunction)=>{
        if(!req.user){
            return res.status(401).json({success: false , message : " authentication is needed"})
        }

        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({success:false ,message:"this user dont have permission to sccess this "});
        }

        return next();
    }
}