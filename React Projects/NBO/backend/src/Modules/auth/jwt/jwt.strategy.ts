import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/Modules/users/model/user.model';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Users)
    private readonly userModel: typeof Users,
  ) {
    const secretOrKey = process.env.ACCESS_TOKEN_SECRET as string;
    if (!secretOrKey) {
      throw new Error(
        'ACCESS_TOKEN_SECRET is not defined in environment variables',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey,
    });
  }

  async validate(payload: any) {

    const user = await this.userModel.findByPk(payload.id, {
      attributes: ['id', 'email', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}
