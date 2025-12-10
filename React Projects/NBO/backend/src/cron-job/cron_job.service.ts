import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op, where } from 'sequelize';
import { progressStatus } from 'src/Modules/class-configration/model/groupActivityParticipants.model';
import { PreClassSchedule } from 'src/Modules/class-configration/model/preClassSchedule.model';
import { EmailService } from 'src/Modules/mail/email.service';
import { Participants } from 'src/Modules/participants/model/participants.model';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);
  constructor(private emailService: EmailService) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const crDate = new Date();
    // console.log(crDate.toLocaleDateString(), 'TODAY');
    const tommarowdate = new Date(crDate);
    tommarowdate.setDate(crDate.getDate() + 1);
    // console.log(tommarowdate.toLocaleDateString(), 'TOMORROW');
    // const tomorrowDateString = tommarowdate.toISOString().split('T')[0];
    const tomorrowDateString = this.formatDateForDB(tommarowdate);
    console.log(tomorrowDateString, 'DATEEEEEEEEEEEEE');

    const nextClass = await PreClassSchedule.findAll({
      attributes: ['cohort_id'],
      where: {
        class_date: {
          // [Op.eq]: '2025-11-06 05:30:00.000 +0530',
          [Op.eq]: tomorrowDateString,
        },
      },
    });
    const cohortIds = new Set<string>();

    nextClass.map((id) => {
      cohortIds.add(id.cohort_id);
    });
    // console.log(cohortIds);

    const participants = await Participants.findAll({
      attributes: ['participant_name', 'email'],
      where: {
        cohort_id: {
          [Op.in]: Array.from(cohortIds),
        },
      },
    });

    for (const part of participants) {
      this.emailService.sendEmailToParticipants(
        part.email,
        'Business Case Assessment for NBOL CLASS',
        './email-templates/class-invitation-assessors.hbs',
        {
          name: part.participant_name,
          date: '12/12/2000',
          email: 'admin@gmail.com',
          facility: 'abcdef',
        },
      );
    }
  }

  formatDateForDB(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day} 05:30:00.000 +0530`;
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async pptUploadMarkedAsCompleted() {
    const crDate = new Date();
    const formattedDate = this.formatDateForDB(crDate);

    // console.log(formattedDate, 'Dateeeeeeeeeeee');

    await PreClassSchedule.update(
      {
        participant_status: 'completed' as progressStatus,
      },
      {
        where: {
          // class_date: "2025-11-06 05:30:00.000 +0530",
          class_date: formattedDate,
          assessment_id: 'b67acc4e-1b4e-4db8-a2b6-3dac86f1415d',
        },
      } as any,
    );
  }
}
