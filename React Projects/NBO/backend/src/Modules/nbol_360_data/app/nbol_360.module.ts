import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tenant } from '../model/tenants.model';
import { Clients } from 'src/Modules/clients/model/clients.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      name: 'nbol360',
      useFactory: () => ({
        dialect: 'postgres',
        host: process.env.DB_HOST_360 || 'localhost',
        port: +(process.env.DB_PORT_360 ?? 5432),
        username: process.env.DB_USER_360 || 'postgres',
        password: process.env.DB_PASS_360 || 'Bismillah@123',
        database: process.env.DB_NAME_DEVELOPMENT_360 || 'nbo360',
        models: [Tenant],
        synchronize: true,
        autoLoadModels: true,
      }),
    }),
    SequelizeModule.forFeature([Tenant],"nbol360" ),
  ],
  controllers: [],
  providers: [],
  exports: [SequelizeModule],
})
export class Nbol_360_Module {}
