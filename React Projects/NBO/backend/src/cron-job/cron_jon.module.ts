import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobService } from './cron_job.service';
import { ClassService } from 'src/Modules/class-configration/app/class.service';
import { ClassConfigrationModule } from 'src/Modules/class-configration/app/class.module';
import { EmailService } from 'src/Modules/mail/email.service';

@Module({
  imports: [ScheduleModule.forRoot(),
    // ClassConfigrationModule,
  ],
  providers: [CronjobService, EmailService],
})
export class CronjobModule {}
