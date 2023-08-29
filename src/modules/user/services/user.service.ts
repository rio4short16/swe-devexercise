import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UpdateCredentialsInput } from '../dto/input/update-credentials.input';

import { RegisterUserInput } from '@modules/auth/dto/input/user.input';
import { BcryptProvider } from '@common/providers/bcrypt.provider';
import { DatabaseService } from '@common/database/database.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService,
  ) {}

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      orderBy: {
        dateCreated: 'desc',
      },
    });
  }

  async fetchUserById(id: string) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException(this.i18n.translate('user.NOT_FOUND'));
    }

    return user;
  }

  async createUser(input: RegisterUserInput) {
    return await this.prisma.user.create({
      data: {
        ...input,
        dateCreated: new Date(),
      },
    });
  }

  async updateCredentials(id: string, credentials: UpdateCredentialsInput) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(this.i18n.translate('user.NOT_FOUND'));
    }

    const { currentPassword, newPassword } = credentials;

    if (BcryptProvider.validateHash(currentPassword, user?.password)) {
      const hashedPassword = BcryptProvider.generateHash(newPassword);

      return this.prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashedPassword,
          lastUpdated: new Date(),
        },
      });
    } else {
      throw new BadRequestException(
        this.i18n.translate('user.UPDATE_CREDENTIALS_ERROR'),
      );
    }
  }
}
