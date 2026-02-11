import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from 'node:process';
import { ConfigService } from 'aws-sdk';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT ? +process.env.EMAIL_PORT : 587,
        secure: process.env.EMAIL_SECURE === '1',
        auth: {
          user: process.env.Admin_Email,
          pass: process.env.Email_App_Password,
        },
        pool: true,
        maxConnections: 3,
        maxMessages: 50,
        rateDelta: 1000,
        rateLimit: 3,
      },
      defaults: {
        from: `"NBOL" <${process.env.Admin_Email}>`,
      },
      template: {
        // dir: './template/confirmation.hbs',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
