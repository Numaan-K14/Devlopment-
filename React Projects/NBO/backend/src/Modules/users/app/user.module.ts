// import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../model/user.model';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { RequestParamsService } from 'src/Modules/requestParams';
import { EmailService } from 'src/Modules/mail/email.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Users, Participants, Assessros]),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET || 'default_secret',
    //   signOptions: { expiresIn: '1h' },
    // }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY'),
          },
        };
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, RequestParamsService, EmailService],
  exports: [UserService],
})
export class UserModule {}
