import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/Modules/users/model/user.model';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    @InjectModel(Users)
    private readonly userModel: typeof Users,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async use(req: Request & { user?: any }, _: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new UnauthorizedException('Unauthorized user');
      const secret =
        this.config.get<string>('JWTKEY') || process.env.ACCESS_TOKEN_SECRET;
      if (!secret) {
        this.logger.error('JWT secret not configured');
        throw new UnauthorizedException('Unauthorized user');
      }
      const payload = this.jwtService.verify(token, { secret });
      const user = await this.userModel.findOne({
        where: { id: payload.id },
        attributes: { exclude: ['password'] },
      });
      if (!user) throw new UnauthorizedException('Unauthorized user');
      req.user = user;
      next();
    } catch (err) {
      this.logger.warn(`Auth failed: ${err?.message || err}`);
      console.log(err.message);
      console.log('Auth failed: ', err);
      throw new UnauthorizedException('Unauthorized user');
    }
  }
}
