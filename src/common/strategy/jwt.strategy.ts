import { JwtPayloadInput } from '@modules/auth/dto/input/jwt-payload.input';
import { UserService } from '@modules/user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    // make this public for the configService be accessbble to super()
    public configService: ConfigService,
  ) {
    // You extends a class so you need to have a super()
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // it will inject this data to the request itself
  async validate(payload: JwtPayloadInput) {
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
