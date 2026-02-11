import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Coaching,
  commentStatus,
  sessionstatus,
} from '../model/coaching.model';
import { createCoachingSessions } from '../dto/createCoachingDto';
import { InjectModel } from '@nestjs/sequelize';
import { RequestParamsService } from 'src/Modules/requestParams';
import { EmailService } from 'src/Modules/mail/email.service';
import { Sequelize } from 'sequelize-typescript';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { of } from 'rxjs';
import { text } from 'aws-sdk/clients/customerprofiles';
import { ClassService } from 'src/Modules/class-configration/app/class.service';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ClassAssessors } from 'src/Modules/class-configration/model/classPartAssessmAssessors.model';
import { Op } from 'sequelize';
import { ClassPartReport } from 'src/Modules/report/model/class_part_report.model';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';

@Injectable()
export class CoachingService {
  constructor(
    @InjectModel(Coaching)
    private coachingModel: typeof Coaching,

    @InjectModel(Clients)
    private clientModel: typeof Clients,

    @InjectModel(Projects)
    private projectModel: typeof Projects,

    @InjectModel(Cohorts)
    private cohortModel: typeof Cohorts,

    @InjectModel(Participants)
    private partModel: typeof Participants,

    @InjectModel(Assessros)
    private assessorModel: typeof Assessros,

    @InjectModel(ParticipantsAssessments)
    private participantsAssessmentsModel: typeof ParticipantsAssessments,

    @InjectModel(Class)
    private classModel: typeof Class,

    @InjectModel(ClassAssessors)
    private classAssessmentsAssessorsModel: typeof ClassAssessors,

    @InjectModel(ClassPartReport)
    private classPartModel: typeof ClassPartReport,

    private readonly requestParams: RequestParamsService,
    private readonly classService: ClassService,
    private emailService: EmailService,
    private sequelize: Sequelize,
  ) {}

  async getAllRepoGenParticipants(cohortId: string): Promise<any> {
    const participant = await this.partModel.findAll({
      where: {
        cohort_id: cohortId,
      },
      attributes: ['id', 'participant_name', 'email'],
      include: [
        {
          model: this.classPartModel,
          as: 'class_part_report',
          attributes: [],
          required: true,
        },
      ],
    });
    return participant;
  }

  async checkAssessorAvailability(
    assessorId: string,
    // startTime: string,
    // endTime: string,
    date: Date,
    transaction: any,
  ): Promise<any> {
    const formattedDate = date.toISOString().split('T')[0];
    const conflicts = await this.participantsAssessmentsModel.findOne({
      include: [
        {
          model: ClassAssessors,
          as: 'class_assessors',
          where: { assessors_id: assessorId },
          required: true,
          include: [
            {
              model: Assessros,
              as: 'assessor',
              attributes: ['assessor_name'],
            },
          ],
        },
        {
          model: Class,
          as: 'class',
          // where: Sequelize.where(
          //   Sequelize.fn('DATE', Sequelize.col('class.start_date')),
          //   formattedDate,
          // ),

          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('class.start_date')),
                { [Op.lte]: formattedDate },
              ),
              Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('class.end_date')),
                { [Op.gte]: formattedDate },
              ),
            ],
          },
          required: true,
        },
      ],
      transaction,
    });

    if (conflicts) {
      // const assessorDetails = {
      //   name:
      //     conflicts.class_assessors[0]?.assessor?.assessor_name || 'Unknown',
      // };
      // return { conflicts: true, assessorDetails };
      return true;
    }
    // return { conflicts: false };
    return false;
  }

  async checkParticipantAvailability(
    partId: string,
    date: Date,
    transaction: any,
  ): Promise<any> {
    const formattedDate = date.toISOString().split('T')[0];
    const conflicts = await this.participantsAssessmentsModel.findOne({
      where: {
        participant_id: partId,
      },
      include: [
        {
          model: Class,
          as: 'class',
          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('class.start_date')),
                { [Op.lte]: formattedDate },
              ),
              Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('class.end_date')),
                { [Op.gte]: formattedDate },
              ),
            ],
          },
          required: true,
        },
      ],
      transaction,
    });

    if (conflicts) {
      return true;
    }
    return false;
  }

  async createCoachingSession(
    createCoaching: createCoachingSessions,
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();
    const date = new Date(createCoaching.date);

    const AssesorConflicts = await this.checkAssessorAvailability(
      createCoaching.assessor_id,
      // createCoaching.start_time,
      // createCoaching.end_time,
      date,
      transaction,
    );
    if (AssesorConflicts) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Assessor Is Busy... Select Different Date',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const ParticipantConflicts = await this.checkParticipantAvailability(
      createCoaching.part_id,
      // createCoaching.start_time,
      // createCoaching.end_time,
      date,
      transaction,
    );
    if (ParticipantConflicts) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Particpant Is Busy in Class Assessments',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingPart = await this.coachingModel.findOne({
      where: {
        part_id: createCoaching.part_id,
      },
    });
    if (existingPart) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Participant Session Already Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const coachingSess = await this.coachingModel.create({
      client_id: createCoaching.client_id,
      project_id: createCoaching.project_id,
      cohort_id: createCoaching.cohort_id,
      part_id: createCoaching.part_id,
      assessor_id: createCoaching.assessor_id,
      date: createCoaching.date,
      start_time: createCoaching.start_time,
      end_time: createCoaching.end_time,
      session: createCoaching.session as sessionstatus,
      vanue: createCoaching.vanue,
    } as unknown as Coaching);

    if (coachingSess) {
      this.emailService.sendSessionEmailAssesors(
        createCoaching.assessor_email,
        'Assessor Assigned for Coaching Session',
        '/backend/src/public/email-templates/session-invitation-Assessors.hbs',
        {
          name: createCoaching.assessor_name,
          email: createCoaching.assessor_email,
          Date: createCoaching.date,
          start_time: createCoaching.start_time,
          end_time: createCoaching.end_time,
          venue: createCoaching.vanue,
          // password: user?.password,
        },
      );

      this.emailService.sendSessionEmailParticipant(
        createCoaching.part_email,
        'Invitation for NBOL Class Coaching Sesion',
        '/backend/src/public/email-templates/session-invitation-Participant.hbs',
        {
          name: createCoaching.part_name,
          email: createCoaching.part_email,
          Date: createCoaching.date,
          start_time: createCoaching.start_time,
          end_time: createCoaching.end_time,
          venue: createCoaching.vanue,
          // password: user?.password,
        },
      );
    } else {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Session Not Created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await transaction.commit();
    return coachingSess;
  }

  async getAllCoschingSessions(
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;

    const sessions = await this.coachingModel.findAll({
      limit,
      offset,
      where: {
        ...getSearchObject(this.requestParams.query, ['vanue','participant_name','assessor_name']),
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: this.clientModel,
          as: 'client',
        },
        {
          model: Projects,
          as: 'project',
        },
        {
          model: Cohorts,
          as: 'cohort',
        },
        {
          model: Participants,
          as: 'participant',
        },
        {
          model: Assessros,
          as: 'assessor',
        },
      ],
    });

    if (sessions.length <= 0) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Sessions Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      rows: sessions,
      count: await this.coachingModel.count(),
    };
  }

  async getSingleSession(id: string): Promise<any> {
    const session = await this.coachingModel.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: this.clientModel,
          as: 'client',
          attributes: ['id', 'client_name'],
        },
        {
          model: Projects,
          as: 'project',
          attributes: ['id', 'project_name'],
        },
        {
          model: Cohorts,
          as: 'cohort',
          attributes: ['id', 'cohort_name'],
        },
        {
          model: Participants,
          as: 'participant',
          attributes: ['id', 'participant_name'],
        },
        {
          model: Assessros,
          as: 'assessor',
          attributes: ['id', 'assessor_name'],
        },
      ],
    });

    if (!session) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Session Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return session;
  }

  async updateCoachingSession(
    id: string,
    updateData: Partial<createCoachingSessions>,
  ): Promise<any> {
    const session = await this.coachingModel.findByPk(id);
    if (!session) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Session Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedSession = await session.update({
      client_id: updateData.client_id,
      project_id: updateData.project_id,
      cohort_id: updateData.cohort_id,
      part_id: updateData.part_id,
      assessor_id: updateData.assessor_id,
      date: updateData.date ? new Date(updateData.date) : undefined,
      start_time: updateData.start_time,
      end_time: updateData.end_time,
      session: updateData.session as sessionstatus,
      vanue: updateData.vanue,
    });

    if (updateData.session === 'virtual') {
      session.vanue = '';
      session.save();
    }

    if (updatedSession) {
      if (updateData.assessor_email) {
        this.emailService.sendSessionEmailAssesors(
          updateData.assessor_email,
          'Assessor Coaching Session Schedule Updated',
          '/backend/src/public/email-templates/session-invitation-Assessors.hbs',
          {
            name: updateData.assessor_name,
            email: updateData.assessor_email,
            Date: updateData.date,
            start_time: updateData.start_time,
            end_time: updateData.end_time,
            venue: updateData.vanue,
            // password: user?.password,
          },
        );
      }

      if (updateData.part_email) {
        this.emailService.sendSessionEmailParticipant(
          updateData.part_email,
          'Coaching Session Schedule Updated',
          '/backend/src/public/email-templates/session-invitation-Participant.hbs',
          {
            name: updateData.part_name,
            email: updateData.part_email,
            Date: updateData.date,
            start_time: updateData.start_time,
            end_time: updateData.end_time,
            venue: updateData.vanue,
            // password: user?.password,
          },
        );
      }
    } else {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Session Not Created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return updatedSession;
  }

  async deleteSession(id: string): Promise<any> {
    const session = await this.coachingModel.findByPk(id);

    if (session) {
      await session.destroy();
      return {
        status: 200,
        success: true,
        message: 'Coaching session deleted successfully.',
      };
    } else {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Session Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async assessorSessions(
    assessorId: string,
    clientId?: string,
    projectId?: string,
    cohortId?: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const where: any = {};
    if (clientId) where.client_id = clientId;
    if (cohortId) where.cohort_id = cohortId;
    if (projectId) where.project_id = projectId;
    const offset = page * limit;
    const sessions = await this.partModel.findAll({
      offset,
      limit,
      where,
      attributes: [
        'id',
        'client_id',
        'project_id',
        'cohort_id',
        'participant_name',
        'email',
      ],
      include: [
        {
          model: this.coachingModel,
          as: 'coaching',
          attributes: ['id', 'commentStatus'],
          where: {
            assessor_id: assessorId,
          },
        },
        {
          model: this.clientModel,
          as: 'client',
          attributes: ['id', 'client_name'],
        },
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'project_name'],
        },
        {
          model: this.cohortModel,
          as: 'cohorts',
          attributes: ['id', 'cohort_name'],
        },
      ],
    });
    return {
      rows: sessions,
      count: await this.coachingModel.count({
        where: {
          assessor_id: assessorId,
        },
      }),
    };
  }

  async addComment(
    id: string,
    comment: text,
    isDraft: commentStatus,
  ): Promise<any> {
    const partSession = await this.coachingModel.findOne({
      where: {
        part_id: id,
      },
    });
    if (!partSession) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Participant Session Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    (partSession.comment = comment),
      (partSession.commentStatus = isDraft as commentStatus);
    partSession.save();

    return 'Comment Added Successfully';
  }

  async partSessionCommView(participantId: string): Promise<any> {
    const sessionComment = await this.coachingModel.findOne({
      where: {
        part_id: participantId,
        commentStatus: 'completed' as commentStatus,
      },
      attributes: ['id', 'comment', 'commentStatus', 'date'],
      include: [
        {
          model: this.assessorModel,
          as: 'assessor',
        },
      ],
    });
    return sessionComment;
  }
}
