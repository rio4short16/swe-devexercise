import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GenericResponse } from '@common/decorators/generic-response.decorator';
import { UserAuthGuard } from '@common/guards/user-auth.guard';
import { Body, Controller, Get, UseGuards, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { UpdateCredentialsInput } from '../dto/input/update-credentials.input';
import { UserMapper } from '../dto/mapper/user.mapper';
import { UserService } from '../services/user.service';
import { GenericResponseDto } from '@common/dto/generic-response.dto';
import { UserOutput } from '../dto/output/user.output';

@Controller('user')
@GenericResponse()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(UserAuthGuard)
  async getAllUsers(): Promise<GenericResponseDto<UserOutput[]>> {
    const users = await this.userService.findAll();
    return {
      data: UserMapper.displayAll(users),
    };
  }

  @Get('information')
  @UseGuards(UserAuthGuard)
  async getUserInfo(
    @CurrentUser() user: User,
  ): Promise<GenericResponseDto<UserOutput>> {
    const data = await this.userService.findOneById(user?.id);
    return {
      data: UserMapper.displayOne(data),
    };
  }

  @Patch('password')
  @UseGuards(UserAuthGuard)
  async updateCredentials(
    @CurrentUser() user: User,
    @Body() input: UpdateCredentialsInput,
  ): Promise<GenericResponseDto<UserOutput>> {
    const data = await this.userService.updateCredentials(user?.id, input);
    return {
      data: UserMapper.displayOne(data),
    };
  }
}
