import { HttpException, HttpStatus, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JWTService } from 'src/shared/jwt/JWTService';
import { UsersService } from '../../modules/users/service/users.service';

export class ApiTokenCheckMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    let { token } = req.headers;

    if (Array.isArray(token)) {
      token = token[0];
    }

    const jwt = new JWTService();
    const usersService = new UsersService();

    try {
      const userId = await jwt.verify(token);

      const user = await usersService.getUserToAuth({ userId });

      if (!user) {
        throw new HttpException('Token Invalido', HttpStatus.BAD_REQUEST);
      }

      next();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
