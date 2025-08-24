import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user: AuthUser;
}


export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
}