import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { BcryptService } from 'src/shared/hash/BcryptService';
import { UserDTO } from '../dto/users.dto';
import { JWTService } from 'src/shared/jwt/JWTService';
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
        throw new Error('User already exists');
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
      throw new Error(error);
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
        throw new Error('User not exists');
      }

      const passwordMatch = await this.bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error('Invalid password');
      }

      const jwtToken = await this.jwt.sign(user);

      return { token: jwtToken, id: user.id, accountId: user.accountId };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUser({ id }: JwtPayload): Promise<UserDTO | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
}
