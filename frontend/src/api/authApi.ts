import apiClient from "./apiClient";

export type UserRole = 'Admin'|'Agent'|'CommissionManager';

export interface AuthUser{
    name: string,
    email:string,
    role:UserRole
}

export interface loginResponse{
    message:string,
    expiresIn:string,
    data:AuthUser
}

export const loginApi = async(email:string, password:string):Promise<loginResponse>=>{
    const response = await apiClient.post<loginResponse>('/auth/login',{email,password},);
    return response.data;
}

export const getCurrentUserApi = async()=>{
    const response = await apiClient.get<{status:string,data:{user:AuthUser}}>('/auth/me');
    return response.data;
}