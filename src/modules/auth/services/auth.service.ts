import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { BcryptProvider } from '@common/providers/bcrypt.provider';
import { UserService } from '@modules/user/services/user.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { JwtPayloadInput } from '../dto/input/jwt-payload.input';
import { LoginUserInput, RegisterUserInput } from '../dto/input/user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async registerUser(input: RegisterUserInput): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(input?.email);

    if (existingUser) {
      throw new BadRequestException(this.i18n.translate('auth.ALREADY_EXISTS'));
    }

    const hashedPassword = BcryptProvider.generateHash(input.password);
    const userData: RegisterUserInput = {
      ...input,
      password: hashedPassword,
    };
    return await this.userService.createUser(userData);
  }

  async loginUser(input: LoginUserInput): Promise<any> {
    const userExists = await this.userService.findOneByEmail(input.email);

    if (!userExists) {
      throw new ForbiddenException(
        this.i18n.translate('auth.INVALID_CREDENTIALS'),
      );
    }

    const validatePassword = BcryptProvider.validateHash(
      input.password,
      userExists?.password,
    );

    if (validatePassword) {
      return {
        user: userExists,
        token: await this.generateToken(userExists),
      };
    } else {
      throw new ForbiddenException(
        this.i18n.translate('auth.INVALID_CREDENTIALS'),
      );
    }
  }

  async registerToken(user: User): Promise<string> {
    const payload: JwtPayloadInput = {
      id: user?.id,
      email: user?.email,
    };

    return this.jwtService.sign(payload);
  }

  async generateToken(user: User): Promise<string> {
    const payload: JwtPayloadInput = {
      id: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
