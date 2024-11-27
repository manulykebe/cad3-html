import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
  id: string;
  isAdmin: boolean;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}