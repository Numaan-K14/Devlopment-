import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailToAssessors(
    to: string | string[],
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.Admin_Email,
        subject,
        // template,
        template: 'src/public/email-templates/class-invitation-assessors.hbs',
        context,
        attachments: [
          {
            filename: 'nboleadership-logo.png',
            path: 'src/public/media/images/nboleadership-logo.png',
            cid: 'nbol-logo',
          },
        ],
      });
    } catch (err) {
      console.error(`Error sending email to ${to}:`, err);
    }
  }

  async sendEmailToParticipants(
    to: string | string[],
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.Admin_Email,
        subject,
        template:
          'src/public/email-templates/class-invitation-participants.hbs',
        context,
        attachments: [
          {
            filename: 'nboleadership-logo.png',
            path: 'src/public/media/images/nboleadership-logo.png',
            cid: 'nbol-logo',
          },
        ],
      });
    } catch (err) {
      console.error(`Error sending email to ${to}:`, err);
    }
  }

  async sendEmailToActiveAssessors(
    to: string | string[],
    subject: string,
    // body: string,
    template: string,
    context: Record<string, any>,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.Admin_Email,
        subject,
        // html: body,
        template: 'src/public/email-templates/test.hbs',
        context,
        attachments: [
          {
            filename: 'nboleadership-logo.png',
            path: 'src/public/media/images/nboleadership-logo.png',
            cid: 'nbol-logo',
          },
        ],
      });
    } catch (err) {      
      throw new HttpException(
        {
          status: 500,
          success: false,
          message: `Error sending email to ${to}`,
        },

        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendSessionEmailAssesors(
    to: string | string[],
    subject: string,
    // body: string,
    template: string,
    context: Record<string, any>,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.Admin_Email,
        subject,
        template: 'src/public/email-templates/session-invitation-Assessors.hbs',
        context,
        attachments: [
          {
            filename: 'nboleadership-logo.png',
            path: 'src/public/media/images/nboleadership-logo.png',
            cid: 'nbol-logo',
          },
        ],
      });
    } catch (err) {
      throw new HttpException(
        {
          status: 500,
          success: false,
          message: `Error sending email to ${to}`,
        },

        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendSessionEmailParticipant(
    to: string | string[],
    subject: string,
    // body: string,
    template: string,
    context: Record<string, any>,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.Admin_Email,
        subject,
        template:
          'src/public/email-templates/session-invitation-Participant.hbs',
        context,
        attachments: [
          {
            filename: 'nboleadership-logo.png',
            path: 'src/public/media/images/nboleadership-logo.png',
            cid: 'nbol-logo',
          },
        ],
      });
    } catch (err) {
      throw new HttpException(
        {
          status: 500,
          success: false,
          message: `Error sending email to ${to}`,
        },

        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendOtpToUser(
    to: string | string[],
    subject: string,
    // template: string,
    context: Record<string, any>,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.Admin_Email,
        subject,
        template: 'src/public/email-templates/otp.hbs',
        context,
        attachments: [
          {
            filename: 'nboleadership-logo.png',
            path: 'src/public/media/images/nboleadership-logo.png',
            cid: 'nbol-logo',
          },
        ],
      });
    } catch (err) {
      throw new HttpException(
        {
          status: 500,
          success: false,
          message: `Error while sending email to ${to}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}