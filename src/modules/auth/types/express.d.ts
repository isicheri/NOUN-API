import { AuthUser } from './auth-user.type';

declare module 'express' {
  interface Request {
    user?: AuthUser; // optional, since not all routes are guarded
  }
}