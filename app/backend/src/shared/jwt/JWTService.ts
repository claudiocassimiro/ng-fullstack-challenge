import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class JWTService {
  constructor() {}

  async sign(payload: string): Promise<string> {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  async verify(token: string): Promise<jwt.JwtPayload | string> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
