import { GenericResponse } from '@common/decorators/generic-response.decorator';
import { GenericResponseDto } from '@common/dto/generic-response.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { LoginUserInput, RegisterUserInput } from '../dto/input/user.input';
import { AuthService } from '../services/auth.service';
import { UserMapper } from '@modules/user/dto/mapper/user.mapper';

@Controller('auth')
@GenericResponse()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() input: RegisterUserInput,
  ): Promise<GenericResponseDto<any>> {
    const user = await this.authService.registerUser(input);
    return {
      data: UserMapper.displayOne(user),
    };
  }

  @Post('login')
  async loginUser(
    @Body() input: LoginUserInput,
  ): Promise<GenericResponseDto<any>> {
    const { user, token } = await this.authService.loginUser(input);
    return {
      data: { ...UserMapper.displayOne(user), token },
    };
  }
}
