import apiClient from "./apiClient";

import { type UserRole } from "../constants/roles";
export interface AuthUser{
    name: string,
    email:string,
    role:UserRole
}

export interface loginResponse{
    message:string,
    token:string,
    tokenType:'Bearer',
    expiresIn:string,
    data:AuthUser
}

export interface CurrentUserResponse{
    success: boolean,
    message: string,
    data:AuthUser
}

export const loginApi = async(email:string, password:string):Promise<loginResponse>=>{
    const response = await apiClient.post<loginResponse>('/auth/login',{email,password},);
    return response.data;
}

export const getCurrentUserApi = async() : Promise<CurrentUserResponse>=>{
    const response = await apiClient.get<CurrentUserResponse>('/auth/me');
    return response.data;
}