import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

export interface User {
  email: string  
}


export interface AuthState  {
  user: User | null
  token: TokenResponse | null
}

export interface TokenResponse {
    token: string
  }
  
  export interface LoginRequest {
    email: string
    password: string
  }

  export interface AuthApiState  {
    user: User ,
    token: TokenResponse 
  }