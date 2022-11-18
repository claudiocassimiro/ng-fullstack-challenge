import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../shared/database/prisma.service';
import { BcryptService } from '../../../shared/hash/BcryptService';
import { UserDTO } from '../dto/users.dto';
import { JWTService } from '../../../shared/jwt/JWTService';
import { JwtPayload } from 'jsonwebtoken';
import { UserLogin } from '../types';

@Injectable()
export class UsersService {
  constructor(
    private prisma?: PrismaService,
    private bcrypt?: BcryptService,
    private jwt?: JWTService,
  ) {}

  async create(data: UserDTO): Promise<string | Error> {
    try {
      const { username, password } = data;

      const verifyIfUserExists = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (verifyIfUserExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const accountId = randomUUID();

      const userAccount = {
        id: accountId,
        balance: 100,
      };

      const account = this.prisma.account.create({ data: userAccount });

      const id = randomUUID();
      const hashedPassword = await this.bcrypt.hash(password);

      const user = this.prisma.user.create({
        data: {
          id,
          username,
          password: hashedPassword,
          accountId,
        },
      });

      await this.prisma.$transaction([account, user]);

      return 'Successfully registered user';
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login({ username, password }: UserDTO): Promise<UserLogin | Error> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      const passwordMatch = await this.bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }

      const jwtToken = await this.jwt.sign(user);

      return { token: jwtToken, id: user.id, accountId: user.accountId };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserToAuth({ id }: JwtPayload): Promise<UserDTO | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(username: string): Promise<UserDTO | undefined> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });

      return user;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
