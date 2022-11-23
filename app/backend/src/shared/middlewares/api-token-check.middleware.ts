import {
  Injectable,
  HttpException,
  HttpStatus,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JWTService } from '../jwt/JWTService';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class ApiTokenCheckMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    let { token } = req.headers;

    if (Array.isArray(token)) {
      token = token[0];
    }

    const jwt = new JWTService();

    try {
      const { id } = await jwt.verify(token);
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) {
        throw new HttpException('Token Invalido', HttpStatus.BAD_REQUEST);
      }

      next();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
