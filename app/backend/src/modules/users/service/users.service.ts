import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { UserDTO } from '../dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserDTO) {
    const verifyIfUserExists = await this.prisma.user.findFirst({
      where: {
        username: data.username,
      },
    });

    if (verifyIfUserExists) {
      throw new Error('User already exists');
    }

    const id = randomUUID();

    const user = await this.prisma.user.create({
      data: {
        id,
        username: data.username,
        password: data.password,
      },
    });

    return user;
  }
}
