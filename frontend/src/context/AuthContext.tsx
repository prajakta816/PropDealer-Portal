import { useEffect, useState, type ReactNode } from 'react'

import type { UserRole } from '../constants/roles'

import { AuthContext } from './authContextDef'
import {loginApi,getCurrentUserApi, type AuthUser} from '../api/authApi'

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(()=>localStorage.getItem('accessToken'));

  //during cookie 
  // useEffect(()=>{
  //   const getLoggedInUser = async()=>{
  //       try{
  //          const response = await getCurrentUserApi();
  //          setUser(response.data.user);
  //       }catch{
  //           setUser(null);
  //       }finally{
  //         setIsLoading(false);
  //       }
  //   } ;
  //   getLoggedInUser();
  // },[])

  useEffect(()=>{
    const getLoggedInUser = async()=>{
      const savedToken = localStorage.getItem('accessToken');
      if(!savedToken){
        setUser(null);
        setIsLoading(false);
        return ;
      }
      try{
        const response = await getCurrentUserApi();
        setUser(response.data.user);
      } catch (error: unknown) {
        const status =
          typeof error === 'object' && error !== null && 'response' in error
            ? (error as { response?: { status?: number } }).response?.status
            : undefined;

        if (status === 401) {
          localStorage.removeItem('accessToken');
          setToken(null);
        }

        setUser(null);
      } finally{
         setIsLoading(false);
      }
    };
    getLoggedInUser();
  },[])
   const login = async(email:string, password:string):Promise<{success:boolean;  message?:string}>=>{
      try{
        const response = await loginApi(email,password)

        localStorage.setItem('accessToken',response.token);
        setToken(response.token);

        const sessionUser : AuthUser = {
          name :response.data.name,
          email:response.data.email,
          role :response.data.role,
        };
          
        setUser(sessionUser);

        return {
          success:true,
          message:response.message
        }
      }catch (error: unknown) {
      let message = 'Unable to log in. Please try again.';

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const apiError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message =
          apiError.response?.data?.message ?? message;
      }

      return {
        success: false,
        message,
      };
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setToken(null);
  }

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false
    return allowedRoles.includes(user.role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),//its used to chekc whether the user is logged in or not. If user is not null, it means the user is authenticated, and the value will be true. If user is null, it means no user is logged in, and the value will be false.
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
