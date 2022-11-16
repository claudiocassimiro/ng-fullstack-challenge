import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { BcryptService } from 'src/shared/hash/BcryptService';
import { UserDTO } from '../dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async create(data: UserDTO) {
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

    const user = await this.prisma.user.create({
      data: {
        id,
        username,
        password: hashedPassword,
      },
    });

    return user;
  }
}
