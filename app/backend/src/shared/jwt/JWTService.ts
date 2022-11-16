import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserDTO } from 'src/modules/users/dto/users.dto';

@Injectable()
export class JWTService {
  constructor() {}

  async sign(user: UserDTO): Promise<string> {
    try {
      return jwt.sign({ id: user.id }, `process.env.JWT_SECRET`, {
        expiresIn: '24h',
      });
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async verify(token: string): Promise<jwt.JwtPayload | string> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
