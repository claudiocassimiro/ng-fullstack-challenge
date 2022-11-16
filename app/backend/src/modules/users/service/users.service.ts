import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AccountsService } from 'src/modules/accounts/service/accounts.service';
import { PrismaService } from 'src/shared/database/prisma.service';
import { BcryptService } from 'src/shared/hash/BcryptService';
import { UserDTO } from '../dto/users.dto';
import { JWTService } from 'src/shared/jwt/JWTService';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
    private account: AccountsService,
    private jwt: JWTService,
  ) {}

  async create(data: UserDTO): Promise<UserDTO | Error> {
    const { username, password } = data;

    const verifyIfUserExists = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (verifyIfUserExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.bcrypt.hash(password);

    const id = randomUUID();
    const accountId = randomUUID();

    const userAccount = {
      id: accountId,
      balance: 100,
      userId: id,
    };

    const user = await this.prisma.user.create({
      data: {
        id,
        username,
        password: hashedPassword,
      },
    });

    this.account.create(userAccount);

    return { ...user, accountId };
  }

  async login({ username, password }: UserDTO): Promise<string | Error> {
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

    const jwtToken = this.jwt.sign(user.id);

    return jwtToken;
  }
}
