import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserDTO } from './users.dto';

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

    const user = await this.prisma.user.create({
      data,
    });

    return user;
  }
}
