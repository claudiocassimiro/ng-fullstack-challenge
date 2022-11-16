import { Body, Controller, Post } from '@nestjs/common';
import { validatePassword } from 'src/shared/helpers/validatePassword';
import { UserDTO } from '../dto/users.dto';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: UserDTO) {
    const { username, password } = data;

    if (username.length < 3) {
      throw new Error('username too short');
    }

    if (!validatePassword(password)) {
      throw new Error('password too weak');
    }

    return this.usersService.create(data);
  }
}
