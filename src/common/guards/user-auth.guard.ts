import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly i18n: I18nService) {
    super();
  }
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  handleRequest(error, user) {
    if (error || !user) {
      throw new ForbiddenException(this.i18n.translate('auth.FORBIDDEN'));
    }
    return user;
  }
}
