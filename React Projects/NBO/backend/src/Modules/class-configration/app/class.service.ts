import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from '../model/class.model';
import { ClassAssessments } from '../model/classAsessments.model';
import { ClassAssessors } from '../model/classPartAssessmAssessors.model';
import { ClassCompetencies } from '../model/classAssessmentsCompetencies';
import { ParticipantsAssessments } from '../model/participantAssessments.model';
import { Sequelize } from 'sequelize-typescript';
import { ClassAssessmentDto, CreateClass } from '../dto/createClass.dto';
import { CreationAttributes, literal, Model, Op, where } from 'sequelize';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { NbolClientCompetency } from 'src/Modules/competencies/model/nbol_client_competency.model';
import { ExpectedBehaviours } from 'src/Modules/competencies/model/expected_behaviour.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Users } from 'src/Modules/users/model/user.model';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/Modules/mail/email.service';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Rooms } from 'src/Modules/facilities/model/rooms.model';
import {
  AssessmentResponse,
  progressStatus,
} from '../model/participantsAssessmentsResponse.model';
import { ParticipantScore } from '../model/participantScore.model';
import { CreateAssessmentWithResponses } from '../dto/createAssessmentResponse.dto';
import { AutoSchedulingService } from '../scheduling/auto-scheduling.service';
import { SchedulingInput, ScheduleResult } from '../dto/scheduling.dto';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateAssessmentWithResponsesDto } from '../dto/updateAssessmentResponse.dto';
import { CreateQuessionnaireResponseDto } from '../dto/createAssessmentQuessResp.dto';
import { QuessionnaireResponse } from '../model/participantQuessionaireResponse.model';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { UpdateQuessionnaireResponseDto } from '../dto/updateAssessQuessResponse.dto';
import * as AWS from 'aws-sdk';
import { ReportService } from 'src/Modules/report/app/report.service';
import { UpdateAssessmentAISummaryDto } from '../dto/updateAI_Summary.dto';
import { GroupActivityRooms } from '../model/groupActivityRooms.model';
import { GroupActivityPart } from '../model/groupActivityParticipants.model';
import { isNotEmpty } from 'class-validator';
import { CreateQuessionnaireDto } from 'src/Modules/assessment/dto/quesionnaire.dto';
import { Transaction } from 'sequelize';
import { Projects } from 'src/Modules/client-project/project.model';
import { response } from 'express';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import axios from 'axios';
import { ClassDraft } from '../model/classDraft.model';
import { CreateDraftDto } from '../dto/createDraft.dto';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { count, log } from 'console';
import { String } from 'aws-sdk/clients/batch';
import { assessments } from 'src/Modules/assessment/dto/createClientAssessment.dto';
import { AssessorsMeetScore } from '../model/assessorsMeetScore.model';
import { CreateScheduleDraft } from '../dto/createscheduleDraft.dto';
import { ScheduleDraft } from '../model/scheduleDraft.model';
import { CompetencyService } from 'src/Modules/competencies/app/competency.service';
import { groupBy } from 'rxjs';
import { start } from 'repl';
import { UpdatePartQuessResp } from '../dto/updatePartQuessResponse.dto';
import { CreateQuessRespAssessor } from '../dto/createQuessRespAssessorView.dto';
import { UpdateQuessRespAssessor } from '../dto/updateQuessRespAssessor.dto';
import { CompetencyWeightage } from 'src/Modules/competencies/model/competency_weightage.model';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { PreClassSchedule } from '../model/preClassSchedule.model';
import { promises } from 'fs';
import { join } from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClassBreaks } from '../model/classBreaks.model';
import { Exclude } from 'class-transformer';
import { cbiProgressStatus } from 'src/Modules/ai_ques_resp/model/core_ques_resp.model';

@Injectable()
export class ClassService {
  private readonly logger = new Logger(ClassService.name);

  constructor(
    @InjectModel(Class)
    private classModel: typeof Class,

    @InjectModel(ClassAssessments)
    private classAssessmentsModel: typeof ClassAssessments,

    @InjectModel(ClassAssessors)
    private classAssessmentsAssessorsModel: typeof ClassAssessors,

    @InjectModel(ClassCompetencies)
    private classCompetenyModel: typeof ClassCompetencies,

    @InjectModel(ParticipantsAssessments)
    private participantsAssessmentsModel: typeof ParticipantsAssessments,

    @InjectModel(Competencies)
    private competencyModel: typeof Competencies,

    @InjectModel(ExpectedBehaviours)
    private expectedbehaviourModel: typeof ExpectedBehaviours,

    @InjectModel(Scenerios)
    private scenerioModel: typeof Scenerios,

    @InjectModel(ClientAssessments)
    private clientAssessmentsModel: typeof ClientAssessments,

    @InjectModel(Assessments)
    private assessmentsModel: typeof Assessments,

    @InjectModel(Participants)
    private participantModel: typeof Participants,

    @InjectModel(Users)
    private usersModel: typeof Users,

    @InjectModel(Assessros)
    private assessorsModel: typeof Assessros,

    @InjectModel(Facilities)
    private facilityModel: typeof Facilities,

    @InjectModel(Clients)
    private clientsModel: typeof Clients,

    @InjectModel(AssessmentResponse)
    private assessmentReponseModel: typeof AssessmentResponse,

    @InjectModel(ParticipantScore)
    private participantScoreModel: typeof ParticipantScore,

    @InjectModel(QuessionnaireResponse)
    private quessionnaireResponseModel: typeof QuessionnaireResponse,

    @InjectModel(GroupActivityRooms)
    private groupActivityRoomsModel: typeof GroupActivityRooms,

    @InjectModel(GroupActivityPart)
    private groupActivityPartModel: typeof GroupActivityPart,

    @InjectModel(Quessionnaires)
    private quessionnaireModel: typeof Quessionnaires,

    @InjectModel(Questions)
    private questionsModel: typeof Questions,

    @InjectModel(ClassDraft)
    private classDraftModel: typeof ClassDraft,

    @InjectModel(AssessorsMeetScore)
    private assessorMeetScoreModel: typeof AssessorsMeetScore,

    @InjectModel(ScheduleDraft)
    private scheduleDraftModel: typeof ScheduleDraft,

    @InjectModel(Cohorts)
    private cohortModel: typeof Cohorts,

    @InjectModel(Projects)
    private projectModel: typeof Projects,

    @InjectModel(Clients)
    private clientModel: typeof Clients,

    @InjectModel(Rooms)
    private roomModel: typeof Rooms,

    @InjectModel(QuessionnaireResponse)
    private quessResponseModel: typeof QuessionnaireResponse,

    @InjectModel(PreClassSchedule)
    private preClassScheduleModel: typeof PreClassSchedule,

    private emailService: EmailService,

    private sequelize: Sequelize,

    private reportService: ReportService,

    private competencyService: CompetencyService,

    private autoSchedulingService: AutoSchedulingService,
    private readonly requestParams: RequestParamsService,
  ) {}

  async checkAssessorAvailability(
    assessorId: string,
    stTime: string,
    edTime: string,
    date: Date,
    transaction: any,
  ): Promise<{ conflicts: boolean; assessorDetails?: any }> {
    // const formattedDate = date.toISOString().split('T')[0];
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const startTime = new Date(stTime)
      .toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
      })
      .split(' ')[1];
    // console.log('startTime.......................', startTime);

    const endTime = new Date(edTime)
      .toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
      })
      .split(' ')[1]; // 24/9/2025, 9:30:00 pm

    // console.log('endTime.......................', endTime);
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
      where: {
        [Op.or]: [
          {
            start_time: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            end_time: {
              [Op.between]: [startTime, endTime],
            },
          },
          {
            [Op.and]: [
              {
                start_time: {
                  [Op.lte]: startTime,
                },
              },
              {
                end_time: {
                  [Op.gte]: endTime,
                },
              },
            ],
          },
        ],
      },
      transaction,
    });

    // console.log(conflicts, '}{}{}{}{}{}{}{}');

    if (conflicts) {
      const assessorDetails = {
        name:
          conflicts.class_assessors[0]?.assessor?.assessor_name || 'Unknown',
      };
      return { conflicts: true, assessorDetails };
    }
    return { conflicts: false };
  }

  private async createUsersAndSendEmails(
    clientId: string,
    cohortId: string,
    createClass: CreateClass,
    transaction?: Transaction,
    // classDetails: Class,
  ) {
    // const transaction = await this.sequelize.transaction();
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash('1234', salt);
      // -=-=-=-==Updated=-=-=-=-=-=-

      // const participantEmails = participants.map((part) => part.email);

      // const partClasses = await this.participantModel.findAll({
      //   where: {
      //     email: participantEmails,
      //   },
      //   include: [
      //     {
      //       model: this.participantsAssessmentsModel,
      //       as: 'par_as',
      //       required: true,
      //       limit: 1,
      //       order: [['createdAt', 'DESC']],
      //       include: [
      //         {
      //           model: this.classModel,
      //           as: 'class',
      //           required: true,
      //         },
      //       ],
      //     },
      //   ],
      // });

      // for (const partClass of partClasses) {
      //   const latestAssessment = partClass.par_as[0];
      //   if (latestAssessment && latestAssessment.class.status !== 'completed') {
      //     throw new HttpException(
      //       {
      //         success: false,
      //         message: `Participant ${partClass.email} Previous Class Not Completed.`,
      //       },
      //       HttpStatus.NOT_FOUND,
      //     );
      //   }
      // }

      // -=-=-=-==Updated=-=-=-=-=-=-

      const participants = await this.participantModel.findAll({
        where: {
          cohort_id: cohortId,
        },
        transaction,
      });

      const participantsToCreate = new Set<string>();

      participants.forEach((participant) => {
        participantsToCreate.add(participant.email);
      });
      const existingParticipants = await this.usersModel.findAll({
        where: {
          role: 'participant',
          email: Array.from(participantsToCreate),
        },
        transaction,
      });

      const existingParticipantIds = new Set(
        existingParticipants.map((user) => user.email),
      );

      const newParticipants = Array.from(participantsToCreate).filter(
        (partEmail) => !existingParticipantIds.has(partEmail),
      );

      if (newParticipants.length > 0) {
        const participantDetails = await this.participantModel.findAll({
          where: { email: newParticipants },
          transaction,
        });

        const users = await this.usersModel.bulkCreate(
          participantDetails.map(
            (participant) =>
              ({
                name: participant.participant_name,
                email: participant.email,
                password: hashPassword,
                client_id: clientId,
                role: 'participant',
                participant_id: participant?.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              }) as Users,
          ),
          { validate: true, transaction },
        );
      }

      const assessorsToCreate = new Set<string>();

      // ===============================updated=========================================
      for (const assessmentData of createClass.class_assessments) {
        if (assessmentData.participant_assessment) {
          for (const participantData of assessmentData.participant_assessment) {
            for (const assessor of participantData.class_assessors) {
              assessorsToCreate.add(assessor.assessor_id);
            }
          }
        }
        if (assessmentData.part_gr_act_room) {
          for (const participantData of assessmentData.part_gr_act_room) {
            assessorsToCreate.add(participantData.assessor_id);
          }
        }
      }
      //==========================================================================
      const existingAssessors = await this.usersModel.findAll({
        where: {
          role: 'assessor',
          assessor_id: Array.from(assessorsToCreate),
        },
        transaction,
      });

      const existingAssessorIds = new Set(
        existingAssessors.map((user) => user.assessor_id),
      );

      const newAssessors = Array.from(assessorsToCreate).filter(
        (assessorId) => !existingAssessorIds.has(assessorId),
      );

      if (newAssessors.length > 0) {
        const assessorDetails = await this.assessorsModel.findAll({
          where: { id: newAssessors },
          transaction,
        });

        const assessorUsers = assessorDetails.map((assessor) => ({
          name: assessor.assessor_name,
          email: assessor.email,
          password: hashPassword,
          role: 'assessor',
          assessor_id: assessor.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await this.usersModel.bulkCreate(
          assessorUsers as CreationAttributes<Users>[],
          { transaction },
        );
      }

      const facility = await this.facilityModel.findOne({
        where: { id: createClass.facility_id },
        transaction,
      });

      const facilityName = facility?.facility_name || 'facility';

      Promise.all([
        this.sendParticipantEmails(
          Array.from(participantsToCreate),
          participants,
          createClass.start_date,
          facilityName,
        ),
        this.sendAssessorEmails(
          Array.from(assessorsToCreate),
          createClass.start_date,
          facilityName,
        ),
      ]);

      // await transaction.commit();
    } catch (error) {
      // await transaction.rollback();
      // console.error('Error creating users or sending emails:', error);
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `Failed to create users or send emails: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async sendParticipantEmails(
    users: string[],
    participants: Participants[],
    startDate: Date,
    facility_name: string,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      for (const partEmail of users) {
        const participantDetails = await this.participantModel.findOne({
          where: {
            email: partEmail,
          },
          transaction,
        });
        if (participantDetails) {
          try {
            this.emailService.sendEmailToParticipants(
              participantDetails?.email,
              'Invitation to NBOL CLASS',
              './email-templates/class-invitation-participants.hbs',
              {
                name: participantDetails.participant_name,
                date: startDate,
                email: participantDetails.email,
                // password: participantDetails.password,
                facility: facility_name,
              },
            );
          } catch (error) {
            console.error(
              `Failed To Send Email To Participant ${participantDetails?.email}:`,
              error,
            );
          }
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `Failed to send participants emails: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async sendAssessorEmails(
    assessorsToCreate: string[],
    startDate: Date,
    facility_name: string,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      for (const assessorId of assessorsToCreate) {
        const assessorDetails = await this.assessorsModel.findOne({
          where: { id: assessorId },
          transaction,
        });

        if (assessorDetails) {
          try {
            // const user = await this.usersModel.findOne({
            //   where: { email: assessorDetails.email },
            // });

            this.emailService.sendEmailToAssessors(
              assessorDetails.email,
              'Assessor Assignment for NBOL CLASS',
              './email-templates/class-invitation-assessors.hbs',
              {
                name: assessorDetails.assessor_name,
                date: startDate,
                email: assessorDetails.email,
                // password: user?.password,
                facility: facility_name,
              },
            );
          } catch (error) {
            console.error(
              `Failed To Send Email To Assessor ${assessorDetails.email}:`,
              error,
            );
          }
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      // console.error('Error creating users or sending emails:', error);
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `Failed To Send Email To Assessor: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async createClass(
  //   clientId: string,
  //   cohortId: string,
  //   createClass: CreateClass,
  // ): Promise<Class> {
  //   // const transaction = await this.sequelize.transaction();
  //   let transaction: Transaction | null = await this.sequelize.transaction();

  //   try {
  //     const existingClassOfCohort = await this.classModel.findOne({
  //       where: {
  //         cohort_id: cohortId,
  //       },
  //       transaction,
  //     });
  //     if (existingClassOfCohort) {
  //       throw new HttpException(
  //         {
  //           message:
  //             'Class already exists for this cohort use different cohort',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     if (
  //       !createClass.class_assessments ||
  //       createClass.class_assessments.length === 0
  //     ) {
  //       throw new HttpException(
  //         {
  //           status: 400,
  //           success: false,
  //           message: 'Select Assessments For Creating The NBO CLASS',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const competencyWeightage = await CompetencyWeightage.findOne({
  //       where: {
  //         cohort_id: cohortId,
  //       },
  //       transaction,
  //     });
  //     if (!competencyWeightage) {
  //       throw new HttpException(
  //         {
  //           message:
  //             'Please configure the weightages for Assessments before launching the CLASS',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const startDate = new Date(createClass.start_date);

  //     if (isNaN(startDate.getTime())) {
  //       throw new HttpException(
  //         {
  //           status: 400,
  //           success: false,
  //           message: "'Invalid Start Date Format'",
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     // ASSESSORS CONFLICT FUNCTION------------------------------------------------------------

  //     // const assessorsConflicts: Record<string, any[]> = {};
  //     // for (const assessmentData of createClass.class_assessments) {
  //     //   if (assessmentData.participant_assessment) {
  //     //     for (const participantData of assessmentData.participant_assessment) {
  //     //       for (const assessor of participantData.class_assessors) {
  //     //         const { conflicts, assessorDetails } =
  //     //           await this.checkAssessorAvailability(
  //     //             assessor.assessor_id,
  //     //             participantData.start_time,
  //     //             participantData.end_time,
  //     //             startDate,
  //     //             transaction,
  //     //           );

  //     //         if (conflicts) {
  //     //           if (!assessorsConflicts[assessmentData.assessment_id]) {
  //     //             assessorsConflicts[assessmentData.assessment_id] = [];
  //     //           }

  //     //           assessorsConflicts[assessmentData.assessment_id].push({
  //     //             assessorId: assessor.assessor_id,
  //     //             assessorName: assessorDetails?.name,
  //     //             startTime: participantData.start_time,
  //     //             endTime: participantData.end_time,
  //     //             conflictDate: startDate.toISOString().split('T')[0],
  //     //           });
  //     //         }
  //     //       }
  //     //     }
  //     //   } else {
  //     //     for (const participantData of assessmentData.part_gr_act_room) {
  //     //       const { conflicts, assessorDetails } =
  //     //         await this.checkAssessorAvailability(
  //     //           participantData.assessor_id,
  //     //           participantData.start_time,
  //     //           participantData.end_time,
  //     //           startDate,
  //     //           transaction,
  //     //         );

  //     //       if (conflicts) {
  //     //         if (!assessorsConflicts[assessmentData.assessment_id]) {
  //     //           assessorsConflicts[assessmentData.assessment_id] = [];
  //     //         }

  //     //         assessorsConflicts[assessmentData.assessment_id].push({
  //     //           assessorId: participantData.assessor_id,
  //     //           assessorName: assessorDetails?.name,
  //     //           startTime: participantData.start_time,
  //     //           endTime: participantData.end_time,
  //     //           conflictDate: startDate.toISOString().split('T')[0],
  //     //         });
  //     //       }
  //     //     }
  //     //   }
  //     // }

  //     // ============================================================
  //     // type AssessorConflict = {
  //     //   // assessorId: string;
  //     //   assessorName?: string;
  //     //   // startTime: string;
  //     //   // endTime: string;
  //     //   // conflictDate: string;
  //     // };

  //     // const assessorsConflicts: Record<string, AssessorConflict[]> = {};
  //     // const assessorsConflicts: any[] = [];
  //     // const assessorsConflicts: Set<> = new Set();
  //     // const availabilityChecks: Promise<void>[] = [];

  //     // for (const assessmentData of createClass.class_assessments) {
  //     //   const assessmentId = assessmentData.assessment_id;

  //     //   if (assessmentData.participant_assessment) {
  //     //     for (const participantData of assessmentData.participant_assessment) {
  //     //       for (const assessor of participantData.class_assessors) {
  //     //         availabilityChecks.push(
  //     //           this.checkAssessorAvailability(
  //     //             assessor.assessor_id,
  //     //             participantData.start_time,
  //     //             participantData.end_time,
  //     //             startDate,
  //     //             transaction,
  //     //           ).then(({ conflicts, assessorDetails }) => {
  //     //             if (conflicts) {
  //     //               // if (!assessorsConflicts[assessmentId]) {
  //     //               //   assessorsConflicts[assessmentId] = [];
  //     //               // }
  //     //               assessorsConflicts.push({
  //     //                  assessorName: assessorDetails?.name,
  //     //                 // assessorId: assessor.assessor_id,
  //     //                 // assessorName: assessorDetails?.name,
  //     //                 // startTime: participantData.start_time,
  //     //                 // endTime: participantData.end_time,
  //     //                 // conflictDate: startDate.toISOString().split('T')[0],
  //     //               });
  //     //             }
  //     //           }),
  //     //         );
  //     //       }
  //     //     }
  //     //   } else {
  //     //     for (const participantData of assessmentData.part_gr_act_room) {
  //     //       availabilityChecks.push(
  //     //         this.checkAssessorAvailability(
  //     //           participantData.assessor_id,
  //     //           participantData.start_time,
  //     //           participantData.end_time,
  //     //           startDate,
  //     //           transaction,
  //     //         ).then(({ conflicts, assessorDetails }) => {
  //     //           if (conflicts) {
  //     //             // if (!assessorsConflicts[assessmentId]) {
  //     //             //   assessorsConflicts[assessmentId] = [];
  //     //             // }
  //     //             assessorsConflicts.push({
  //     //               // assessorId: participantData.assessor_id,
  //     //               assessorName: assessorDetails?.name,
  //     //               // startTime: participantData.start_time,
  //     //               // endTime: participantData.end_time,
  //     //               // conflictDate: startDate.toISOString().split('T')[0],
  //     //             });
  //     //           }
  //     //         }),
  //     //       );
  //     //     }
  //     //   }
  //     // }

  //     // await Promise.all(availabilityChecks);

  //     // if (Object.keys(assessorsConflicts).length > 0) {
  //     //   throw new HttpException(
  //     //     {
  //     //       status: 400,
  //     //       success: false,
  //     //       message: 'Assessors Conflict Detected',
  //     //       assessorsConflicts: assessorsConflicts,
  //     //     },
  //     //     HttpStatus.BAD_REQUEST,
  //     //   );
  //     // }
  //     // ===============================================

  //     const assessorsConflicts = new Set<string>();
  //     const availabilityChecks: Promise<void>[] = [];

  //     for (const assessmentData of createClass.class_assessments) {
  //       if (assessmentData.participant_assessment) {
  //         for (const participantData of assessmentData.participant_assessment) {
  //           for (const assessor of participantData.class_assessors) {
  //             // console.log(assessor.assessor_id, "++++assessor+++++++");
  //             // console.log(participantData.start_time, "+++start time+++");
  //             // console.log(participantData.end_time, "+++++end time++++++");
  //             // console.log(startDate, "+++++date++++++");
  //             availabilityChecks.push(
  //               this.checkAssessorAvailability(
  //                 assessor.assessor_id,
  //                 participantData.start_time,
  //                 participantData.end_time,
  //                 startDate,
  //                 transaction,
  //               ).then(({ conflicts, assessorDetails }) => {
  //                 if (conflicts && assessorDetails?.name) {
  //                   assessorsConflicts.add(assessorDetails.name);
  //                 }
  //               }),
  //             );
  //           }
  //         }
  //       } else {
  //         for (const participantData of assessmentData.part_gr_act_room) {
  //           availabilityChecks.push(
  //             this.checkAssessorAvailability(
  //               participantData.assessor_id,
  //               participantData.start_time,
  //               participantData.end_time,
  //               startDate,
  //               transaction,
  //             ).then(({ conflicts, assessorDetails }) => {
  //               if (conflicts && assessorDetails?.name) {
  //                 assessorsConflicts.add(assessorDetails.name);
  //               }
  //             }),
  //           );
  //         }
  //       }
  //     }

  //     await Promise.all(availabilityChecks);
  //     const assessorsName = Array.from(assessorsConflicts);
  //     if (assessorsName.length > 0) {
  //       throw new HttpException(
  //         {
  //           status: 400,
  //           success: false,
  //           message: 'Assessors Conflict Detected',
  //           assessorsName,
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     //----------------------------------------------------------------------------------------

  //     // CREATE CLASS DETAILS--------------------------------------------------------------
  //     const classDetails = await this.classModel.create(
  //       {
  //         client_id: clientId,
  //         facility_id: createClass.facility_id,
  //         start_date: createClass.start_date,
  //         end_date: createClass.end_date,
  //         cohort_id: cohortId,
  //         // project_id: projectId
  //       } as Class,
  //       { transaction },
  //     );

  //     // CREATE CLASS SCENERIOS--------------------------------------------------------------

  //     const clientScenerio = await this.scenerioModel.findAll({
  //       include: [
  //         {
  //           model: this.clientAssessmentsModel,
  //           as: 'client_assessment',
  //           attributes: [],
  //           where: {
  //             client_id: clientId,
  //           },
  //         },
  //       ],
  //       transaction,
  //     });

  //     const scenerioMap = new Map<string, string>();
  //     const newScenerios = await this.scenerioModel.bulkCreate(
  //       clientScenerio.map(
  //         (scenerio) =>
  //           ({
  //             scenerio_name: scenerio.scenerio_name,
  //             description: scenerio.description,
  //             assessment_id: scenerio.assessment_id,
  //             class_id: classDetails.id,
  //             file_location: scenerio.file_location,
  //           }) as CreationAttributes<Scenerios>,
  //       ),
  //       {
  //         transaction,
  //         returning: true,
  //       },
  //     );

  //     newScenerios.forEach((newScenerio, index) => {
  //       scenerioMap.set(clientScenerio[index].id, newScenerio.id);
  //     });

  //     // CREATE CLASS COMPETENCIES--------------------------------------------------------------
  //     const allCompetencies = await this.competencyModel.findAll({
  //       where: {
  //         [Op.or]: [
  //           { client_id: clientId },
  //           {
  //             [Op.and]: [
  //               { client_id: { [Op.is]: null } },
  //               {
  //                 id: {
  //                   [Op.in]: Sequelize.literal(`
  //                         (SELECT ref_nbol_compt_id
  //                         FROM nbol_client_competencies
  //                         WHERE client_id = '${clientId}')
  //                   `),
  //                 },
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       transaction,
  //       include: [
  //         {
  //           model: NbolClientCompetency,
  //           as: 'nbol_client_competencies',
  //           required: false,
  //           attributes: [],
  //           where: {
  //             client_id: clientId,
  //           },
  //         },
  //         {
  //           model: ExpectedBehaviours,
  //           as: 'expected_behaviours',
  //         },
  //       ],
  //       order: [['createdAt', 'DESC']],
  //     });

  //     if (!allCompetencies || allCompetencies.length === 0) {
  //       throw new HttpException(
  //         {
  //           status: 400,
  //           success: false,
  //           message: 'Select Competencies For Creating The NBO CLASS',
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     const competencyMap = new Map<string, string>();

  //     const existCopyCompetency = await this.competencyModel.findAll({
  //       where: {
  //         client_id: clientId,
  //         is_copy: true,
  //       },
  //       transaction,
  //     });
  //     if (existCopyCompetency.length > 0) {
  //       existCopyCompetency.forEach((newComp) => {
  //         if (newComp.ref_nbol_id) {
  //           competencyMap.set(newComp.ref_nbol_id, newComp.id);
  //         }
  //       });
  //     } else {
  //       const newCompetencies = await this.competencyModel.bulkCreate(
  //         allCompetencies.map(
  //           (comp) =>
  //             ({
  //               competency: comp.competency,
  //               description: comp.description,
  //               nbol_id: comp.nbol_id,
  //               client_id: clientId,
  //               ref_nbol_id: comp.id,
  //               is_copy: true,
  //             }) as CreationAttributes<Competencies>,
  //         ),
  //         {
  //           transaction,
  //           returning: true,
  //         },
  //       );

  //       // const competencyMap = new Map<string, string>();

  //       newCompetencies.forEach((newComp, index) => {
  //         competencyMap.set(allCompetencies[index].id, newComp.id);
  //       });

  //       const expectedBehaviors = allCompetencies.reduce(
  //         (behaviors, comp, index) => {
  //           if (comp.expected_behaviours?.length) {
  //             const compBehaviors = comp.expected_behaviours.map(
  //               (behaviour) => ({
  //                 expected_behaviour: behaviour.expected_behaviour,
  //                 competency_id: newCompetencies[index].id,
  //                 createdAt: new Date(),
  //                 updatedAt: new Date(),
  //               }),
  //             );
  //             return [...behaviors, ...compBehaviors];
  //           }
  //           return behaviors;
  //         },
  //         [] as CreationAttributes<ExpectedBehaviours>[],
  //       );

  //       if (expectedBehaviors.length > 0) {
  //         await this.expectedbehaviourModel.bulkCreate(
  //           expectedBehaviors as CreationAttributes<ExpectedBehaviours>[],
  //           { transaction },
  //         );
  //       }
  //     }
  //     //-----------CREATE CLASS ASSESSMENTS, COMPETNCIES, PART ASSESMENTS, ASSESSOR ASSESSMENTS, GROUP ACTIVIVTY ASSESSMENT-------------------------------------
  //     for (const assessmentData of createClass.class_assessments) {
  //       const classAssessment = await this.classAssessmentsModel.create(
  //         {
  //           assessment_id: assessmentData.assessment_id,
  //           class_id: classDetails.id,
  //         } as CreationAttributes<ClassAssessments>,
  //         {
  //           transaction,
  //           returning: true,
  //         },
  //       );

  //       const classCompetencies = assessmentData.class_competencies.map(
  //         (competency) => ({
  //           competency_id:
  //             competencyMap.get(competency.competency_id) ||
  //             competency.competency_id,
  //           assessment_id: classAssessment.assessment_id,
  //           class_id: classDetails.id,
  //         }),
  //       );

  //       await this.classCompetenyModel.bulkCreate(
  //         classCompetencies as CreationAttributes<ClassCompetencies>[],
  //         {
  //           transaction,
  //           validate: true,
  //         },
  //       );

  //       if (assessmentData.participant_assessment) {
  //         for (const participantData of assessmentData.participant_assessment) {
  //           const existingAdmin = await this.usersModel.findOne({
  //             where: {
  //               email: participantData.email,
  //               role: 'admin',
  //             },
  //             transaction,
  //           });

  //           if (existingAdmin) {
  //             throw new HttpException(
  //               {
  //                 status: 400,
  //                 success: false,
  //                 message: `Email ${participantData.email} Already Registered`,
  //               },
  //               HttpStatus.BAD_REQUEST,
  //             );
  //           }

  //           const participantAssessment =
  //             await this.participantsAssessmentsModel.create(
  //               {
  //                 class_id: classDetails.id,
  //                 assessment_id: assessmentData.assessment_id,
  //                 scenerio_id: assessmentData.scenerio_id,
  //                 quessionnaire_id: assessmentData.quessionnaire_id,
  //                 participant_id: participantData.participant_id,
  //                 room_id: participantData.room_id,
  //                 start_time: participantData.start_time,
  //                 end_time: participantData.end_time,
  //                 break: participantData.break,
  //                 createdAt: new Date(),
  //                 updatedAt: new Date(),
  //               } as unknown as ParticipantsAssessments,
  //               {
  //                 transaction,
  //                 returning: true,
  //               },
  //             );

  //           await this.classAssessmentsAssessorsModel.bulkCreate(
  //             participantData.class_assessors.map(
  //               (assessor) =>
  //                 ({
  //                   participant_assessment_id: participantAssessment.id,
  //                   assessors_id: assessor.assessor_id,
  //                 }) as ClassAssessors,
  //             ),
  //             {
  //               transaction,
  //               validate: true,
  //             },
  //           );
  //         }
  //       }

  //       if (assessmentData.part_gr_act_room) {
  //         for (const groupRoomData of assessmentData.part_gr_act_room) {
  //           if (
  //             !groupRoomData.room_id ||
  //             !groupRoomData.assessor_id ||
  //             !groupRoomData.start_time ||
  //             !groupRoomData.end_time ||
  //             !Array.isArray(groupRoomData.part_gr_act) ||
  //             groupRoomData.part_gr_act.length === 0
  //           ) {
  //             throw new HttpException(
  //               {
  //                 status: 400,
  //                 success: false,
  //                 message:
  //                   'All Fields In Group Activity Room And Participants Are Required.',
  //               },
  //               HttpStatus.BAD_REQUEST,
  //             );
  //           }

  //           const groupRoom = await this.groupActivityRoomsModel.create(
  //             {
  //               class_id: classDetails.id,
  //               assessment_id: assessmentData.assessment_id,
  //               scenerio_id: assessmentData.scenerio_id,
  //               room_id: groupRoomData.room_id,
  //               assessor_id: groupRoomData.assessor_id,
  //               start_time: groupRoomData.start_time,
  //               end_time: groupRoomData.end_time,
  //             } as GroupActivityRooms,
  //             { transaction, returning: true },
  //           );

  //           for (const part of groupRoomData.part_gr_act) {
  //             // uncomment it
  //             // if (!part.participant_id || !part.email) {
  //             //   throw new HttpException(
  //             //     {
  //             //       status: 400,
  //             //       success: false,
  //             //       message: 'Each Rroup Activity Participant Must Have Email',
  //             //     },
  //             //     HttpStatus.BAD_REQUEST,
  //             //   );
  //             // }

  //             await this.groupActivityPartModel.create(
  //               {
  //                 gr_act_room_id: groupRoom.id,
  //                 part_id: part.participant_id,
  //                 createdAt: new Date(),
  //                 updatedAt: new Date(),
  //               } as GroupActivityPart,
  //               { transaction },
  //             );
  //           }
  //           await this.classAssessmentsAssessorsModel.create(
  //             {
  //               assessors_id: groupRoomData.assessor_id,
  //               gr_act_room: groupRoom.id,
  //             } as ClassAssessors,
  //             {
  //               transaction,
  //               validate: true,
  //             },
  //           );
  //         }
  //       }
  //       // =-=-=-===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  //     }

  //     const existingClassDraft = await this.classDraftModel.findOne({
  //       where: {
  //         cohort_id: cohortId,
  //       },
  //       transaction,
  //     });
  //     if (existingClassDraft) {
  //       await existingClassDraft.destroy({ transaction });
  //     }

  //     const existingScheduleDraft = await this.scheduleDraftModel.findOne({
  //       where: {
  //         cohort_id: cohortId,
  //       },
  //       transaction,
  //     });

  //     if (existingScheduleDraft) {
  //       await existingScheduleDraft.destroy({ transaction });
  //     }

  //     await this.createUsersAndSendEmails(
  //       clientId,
  //       cohortId,
  //       createClass,
  //       // classDetails,
  //     );

  //     await this.cohortModel.update(
  //       {
  //         class_exist: true,
  //       },
  //       {
  //         where: {
  //           id: cohortId,
  //         },
  //         transaction,
  //       },
  //     );

  //      if (createClass.project_id) {
  //       await this.competencyService.updateNbolCompToCompyComp(
  //         clientId,
  //         createClass.project_id,
  //         cohortId,
  //         transaction,
  //       );
  //     }

  //     if (createClass.quessionnaire_id.length > 0) {
  //       await this.updateQuessComp(
  //         clientId,
  //         createClass.quessionnaire_id,
  //         transaction,
  //       );
  //     }

  //     await transaction.commit();
  //     transaction = null;

  //     // if (createClass.project_id) {
  //     //   await this.competencyService.updateNbolCompToCompyComp(
  //     //     clientId,
  //     //     createClass.project_id,
  //     //     cohortId,
  //     //   );
  //     // }

  //     // if (createClass.quessionnaire_id.length > 0) {
  //     //   await this.updateQuessComp(
  //     //     clientId,
  //     //     createClass.quessionnaire_id,
  //     //     transaction,
  //     //   );
  //     // }

  //     if (!classDetails) {
  //       throw new HttpException('Class Not Created', HttpStatus.NOT_FOUND);
  //     }

  //     return classDetails;
  //   } catch (error) {
  //     if (transaction) {
  //       await transaction.rollback();
  //     }
  //     // if ((transaction as any).finished) {
  //     //   await transaction?.rollback();
  //     // }
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new HttpException(
  //       `Failed to create class: ${error.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async updatedCreateClass(
    clientId: string,
    cohortId: string,
    createClass: CreateClass,
  ): Promise<Class> {
    let transaction: Transaction | null = await this.sequelize.transaction();

    try {
      const existingClassOfCohort = await this.classModel.findOne({
        where: {
          cohort_id: cohortId,
        },
        transaction,
      });
      if (existingClassOfCohort) {
        throw new HttpException(
          {
            message:
              'Class already exists for this cohort use different cohort',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const preScehduleClass = await this.preClassScheduleModel.findOne({
        where: {
          cohort_id: cohortId,
        },
        transaction,
      });
      if (!preScehduleClass) {
        throw new HttpException(
          {
            message:
              'First pre-schedule the class before generating the actual class.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        !createClass.class_assessments ||
        createClass.class_assessments.length === 0
      ) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Select Assessments For Creating The NBO CLASS',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const competencyWeightage = await CompetencyWeightage.findOne({
        where: {
          cohort_id: cohortId,
        },
        transaction,
      });
      if (!competencyWeightage) {
        throw new HttpException(
          {
            message:
              'Please configure the weightages for Assessments before launching the CLASS',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingClassBreaks = await ClassBreaks.findAll({
        where: {
          cohort_id: cohortId,
        },
        transaction,
      });
      // if (existingClassBreaks.length > 0) {
      //   await existingClassBreaks.forEach((classBreak) => {
      //     classBreak.destroy({ transaction });
      //   });
      // }

      if (existingClassBreaks.length > 0) {
        await ClassBreaks.destroy({
          where: {
            cohort_id: cohortId,
          },
          transaction,
        });
      }

      const startDate = new Date(createClass.start_date);

      if (isNaN(startDate.getTime())) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: "'Invalid Start Date Format'",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // ASSESSORS CONFLICT FUNCTION------------------------------------------------------------
      const checks: Array<{
        assessor_id: string;
        start_time: string;
        end_time: string;
        date: Date;
      }> = [];

      for (const assessmentData of createClass.class_assessments) {
        if (assessmentData.participant_assessment) {
          for (const participantData of assessmentData.participant_assessment) {
            for (const assessor of participantData.class_assessors) {
              checks.push({
                assessor_id: assessor.assessor_id,
                start_time: participantData.start_time,
                end_time: participantData.end_time,
                date: startDate,
              });
            }
          }
        } else {
          for (const participantData of assessmentData.part_gr_act_room) {
            checks.push({
              assessor_id: participantData.assessor_id,
              start_time: participantData.start_time,
              end_time: participantData.end_time,
              date: startDate,
            });
          }
        }
      }

      const checkPromises = checks.map((check) =>
        this.checkAssessorAvailability(
          check.assessor_id,
          check.start_time,
          check.end_time,
          check.date,
          transaction,
        ),
      );

      const checkResults = await Promise.all(checkPromises);

      const assessorsConflicts = new Set<string>();
      checkResults.forEach(({ conflicts, assessorDetails }) => {
        if (conflicts && assessorDetails?.name) {
          assessorsConflicts.add(assessorDetails.name);
        }
      });

      const assessorsName = Array.from(assessorsConflicts);
      if (assessorsName.length > 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Assessors Conflict Detected',
            assessorsName,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // CREATE CLASS DETAILS--------------------------------------------------------------
      const classDetails = await this.classModel.create(
        {
          client_id: clientId,
          facility_id: createClass.facility_id,
          start_date: createClass.start_date,
          end_date: createClass.end_date,
          cohort_id: cohortId,
          // project_id: projectId
          normal_assess_duration: createClass.normal_assess_duration,
          grp_act_assess_duration: createClass.grp_act_assess_duration,
          cbi_assess_duration: createClass.cbi_assess_duration,
          welcome_sess_duration: createClass.welcome_sess_duration,
        } as Class,
        { transaction },
      );

      // CREATE CLASS SCENERIOS--------------------------------------------------------------

      const clientScenerio = await this.scenerioModel.findAll({
        include: [
          {
            model: this.clientAssessmentsModel,
            as: 'client_assessment',
            attributes: [],
            where: {
              client_id: clientId,
            },
          },
        ],
        transaction,
      });

      const scenerioMap = new Map<string, string>();
      const newScenerios = await this.scenerioModel.bulkCreate(
        clientScenerio.map(
          (scenerio) =>
            ({
              scenerio_name: scenerio.scenerio_name,
              description: scenerio.description,
              assessment_id: scenerio.assessment_id,
              class_id: classDetails.id,
              file_location: scenerio.file_location,
            }) as CreationAttributes<Scenerios>,
        ),
        {
          transaction,
          returning: true,
        },
      );

      newScenerios.forEach((newScenerio, index) => {
        scenerioMap.set(clientScenerio[index].id, newScenerio.id);
      });

      // CREATE CLASS COMPETENCIES--------------------------------------------------------------
      const allCompetencies = await this.competencyModel.findAll({
        where: {
          [Op.or]: [
            { client_id: clientId },
            {
              [Op.and]: [
                { client_id: { [Op.is]: null } },
                {
                  id: {
                    [Op.in]: Sequelize.literal(`
                          (SELECT ref_nbol_compt_id
                          FROM nbol_client_competencies
                          WHERE client_id = '${clientId}')
                    `),
                  },
                },
              ],
            },
          ],
        },
        transaction,
        include: [
          {
            model: NbolClientCompetency,
            as: 'nbol_client_competencies',
            required: false,
            attributes: [],
            where: {
              client_id: clientId,
            },
          },
          {
            model: ExpectedBehaviours,
            as: 'expected_behaviours',
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      if (!allCompetencies || allCompetencies.length === 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Select Competencies For Creating The NBO CLASS',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const competencyMap = new Map<string, string>();

      const existCopyCompetency = await this.competencyModel.findAll({
        where: {
          client_id: clientId,
          is_copy: true,
        },
        transaction,
      });
      if (existCopyCompetency.length > 0) {
        existCopyCompetency.forEach((newComp) => {
          if (newComp.ref_nbol_id) {
            competencyMap.set(newComp.ref_nbol_id, newComp.id);
          }
        });
      } else {
        const newCompetencies = await this.competencyModel.bulkCreate(
          allCompetencies.map(
            (comp) =>
              ({
                competency: comp.competency,
                description: comp.description,
                nbol_id: comp.nbol_id,
                client_id: clientId,
                ref_nbol_id: comp.id,
                is_copy: true,
              }) as CreationAttributes<Competencies>,
          ),
          {
            transaction,
            returning: true,
          },
        );

        // const competencyMap = new Map<string, string>();

        newCompetencies.forEach((newComp, index) => {
          competencyMap.set(allCompetencies[index].id, newComp.id);
        });

        const expectedBehaviors = allCompetencies.reduce(
          (behaviors, comp, index) => {
            if (comp.expected_behaviours?.length) {
              const compBehaviors = comp.expected_behaviours.map(
                (behaviour) => ({
                  expected_behaviour: behaviour.expected_behaviour,
                  competency_id: newCompetencies[index].id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }),
              );
              return [...behaviors, ...compBehaviors];
            }
            return behaviors;
          },
          [] as CreationAttributes<ExpectedBehaviours>[],
        );

        if (expectedBehaviors.length > 0) {
          await this.expectedbehaviourModel.bulkCreate(
            expectedBehaviors as CreationAttributes<ExpectedBehaviours>[],
            { transaction },
          );
        }
      }
      //-----------CREATE CLASS ASSESSMENTS, COMPETNCIES, PART ASSESMENTS, ASSESSOR ASSESSMENTS, GROUP ACTIVIVTY ASSESSMENT-------------------------------------

      const classAssessmentsToCreate: CreationAttributes<ClassAssessments>[] =
        [];
      const classCompetenciesToCreate: CreationAttributes<ClassCompetencies>[] =
        [];
      const participantAssessmentsToCreate: any[] = [];
      const participantAssessmentCbi: any[] = [];
      const classAssessorsToCreate: any[] = [];
      const groupRoomsToCreate: any[] = [];
      const groupActivityPartsToCreate: any[] = [];
      const groupRoomAssessorsToCreate: any[] = [];
      const classBreaksToCreate: CreationAttributes<ClassBreaks>[] = [];

      for (const breakTime of createClass.class_breaks) {
        classBreaksToCreate.push({
          first_br_st: breakTime.first_br_st,
          first_br_en: breakTime.first_br_en,
          second_br_st: breakTime.second_br_st,
          second_br_en: breakTime.second_br_en,
          lunch_br_st: breakTime.lunch_br_st,
          lunch_br_en: breakTime.lunch_br_en,
          class_date: breakTime.class_date,
          class_id: classDetails.id,
          wlc_sess_st: breakTime.wlc_sess_st,
          wlc_sess_en: breakTime.wlc_sess_en,
          ending_sess_st: breakTime.ending_sess_st,
          ending_sess_en: breakTime.ending_sess_en,
          cohort_id: cohortId,
        } as any);
      }

      // Collect all data with tempKey
      for (const assessmentData of createClass.class_assessments) {
        classAssessmentsToCreate.push({
          assessment_id: assessmentData.assessment_id,
          class_id: classDetails.id,
        } as any);

        classCompetenciesToCreate.push(
          ...assessmentData.class_competencies.map(
            (competency) =>
              ({
                competency_id:
                  competencyMap.get(competency.competency_id) ||
                  competency.competency_id,
                assessment_id: assessmentData.assessment_id,
                class_id: classDetails.id,
              }) as any,
          ),
        );

        // Participant Assessments and their assessors
        if (assessmentData.participant_assessment) {
          for (const participantData of assessmentData.participant_assessment) {
            const tempKey = `${participantData.participant_id}_${assessmentData.assessment_id}_${participantData.start_time}_${participantData.end_time}`;
            participantAssessmentsToCreate.push({
              class_id: classDetails.id,
              assessment_id: assessmentData.assessment_id,
              scenerio_id: assessmentData.scenerio_id,
              quessionnaire_id: assessmentData.quessionnaire_id,
              participant_id: participantData.participant_id,
              room_id: participantData.room_id,
              start_time: participantData.start_time,
              end_time: participantData.end_time,
              break: participantData.break,
              createdAt: new Date(),
              updatedAt: new Date(),
              tempKey,
            });

            classAssessorsToCreate.push(
              ...participantData.class_assessors.map((assessor) => ({
                assessors_id: assessor.assessor_id,
                tempKey,
              })),
            );
          }
        }

        // Group Activity Rooms and their assessors/participants
        if (assessmentData.part_gr_act_room) {
          for (const groupRoomData of assessmentData.part_gr_act_room) {
            const tempKey = `${groupRoomData.room_id}_${groupRoomData.assessor_id}_${groupRoomData.start_time}_${groupRoomData.end_time}`;
            groupRoomsToCreate.push({
              class_id: classDetails.id,
              assessment_id: assessmentData.assessment_id,
              scenerio_id: assessmentData.scenerio_id,
              room_id: groupRoomData.room_id,
              assessor_id: groupRoomData.assessor_id,
              start_time: groupRoomData.start_time,
              end_time: groupRoomData.end_time,
              tempKey,
            });

            groupActivityPartsToCreate.push(
              ...groupRoomData.part_gr_act.map((part) => ({
                part_id: part.participant_id,
                createdAt: new Date(),
                updatedAt: new Date(),
                tempKey,
              })),
            );

            groupRoomAssessorsToCreate.push({
              assessors_id: groupRoomData.assessor_id,
              tempKey,
            });
          }
        }
      }

      // for cbi assessment
      const particepentData: ClassAssessmentDto | undefined =
        createClass.class_assessments.find(
          (item) =>
            item.participant_assessment && item.participant_assessment.length,
        );
      if (particepentData) {
        for (let participantData of particepentData.participant_assessment!) {
          participantAssessmentCbi.push({
            class_id: classDetails.id,
            assessment_id: createClass.cbi_assessment_id,
            quessionnaire_id: createClass.cbi_quessionnaire_id,
            participant_id: participantData.participant_id,
            assessor_status: 'completed' as progressStatus,
            participant_status: 'completed' as progressStatus,
            createdAt: new Date(),
            updatedAt: new Date(),
            // tempKey,
          });
        }
      }
      // Bulk create records
      const createdClassBreaks = await ClassBreaks.bulkCreate(
        classBreaksToCreate,
        {
          transaction,
          returning: true,
        },
      );
      const createdClassAssessments =
        await this.classAssessmentsModel.bulkCreate(classAssessmentsToCreate, {
          transaction,
          returning: true,
        });

      if (
        createClass.cbi_assessment_id &&
        createClass.cbi_assessment_id !== '' &&
        createClass.cbi_assessment_id !== null
      ) {
        await this.classAssessmentsModel.create(
          {
            assessment_id: createClass.cbi_assessment_id,
            class_id: classDetails.id,
          } as any,
          {
            transaction,
          },
        );
      }

      await this.classCompetenyModel.bulkCreate(classCompetenciesToCreate, {
        transaction,
        validate: true,
      });
      const createdParticipantAssessments =
        await this.participantsAssessmentsModel.bulkCreate(
          participantAssessmentsToCreate,
          { transaction, returning: true },
        );

      // cbi participant assessments bulk create
      if (
        createClass.cbi_assessment_id &&
        createClass.cbi_assessment_id !== '' &&
        createClass.cbi_assessment_id !== null
      ) {
        await this.participantsAssessmentsModel.bulkCreate(
          participantAssessmentCbi,
          { transaction, returning: true },
        );
      }
      const createdGroupRooms = await this.groupActivityRoomsModel.bulkCreate(
        groupRoomsToCreate,
        { transaction, returning: true },
      );

      // Build maps for safe ID assignment
      const participantAssessmentIdMap = new Map<string, string>();
      createdParticipantAssessments.forEach((pa) => {
        console.log(pa.id, '+++++pa id++++++');
        participantAssessmentIdMap.set(
          `${pa.participant_id}_${pa.assessment_id}_${pa.start_time}_${pa.end_time}`,
          pa.id,
        );
        // participantAssessmentIdMap.set((pa as any).tempKey, pa.id);
      });

      const groupRoomIdMap = new Map<string, string>();
      createdGroupRooms.forEach((gr) => {
        console.log(gr.id, '+++++gr id++++++');
        groupRoomIdMap.set(
          `${gr?.room_id}_${gr?.assessor_id}_${gr?.start_time}_${gr?.end_time}`,
          gr.id,
        );
        // groupRoomIdMap.set((gr as any).tempKey, gr.id);
      });

      // Assign IDs to ClassAssessors
      classAssessorsToCreate.forEach((assessor) => {
        assessor.participant_assessment_id = participantAssessmentIdMap.get(
          assessor.tempKey,
        );
        delete assessor.tempKey;
      });
      groupRoomAssessorsToCreate.forEach((assessor) => {
        assessor.gr_act_room = groupRoomIdMap.get(assessor.tempKey);
        delete assessor.tempKey;
      });

      // Assign gr_act_room_id to GroupActivityParts
      groupActivityPartsToCreate.forEach((part) => {
        part.gr_act_room_id = groupRoomIdMap.get(part.tempKey);
        delete part.tempKey;
      });

      // Bulk create ClassAssessors and GroupActivityParts
      await this.classAssessmentsAssessorsModel.bulkCreate(
        [...classAssessorsToCreate, ...groupRoomAssessorsToCreate],
        { transaction, validate: true },
      );
      await this.groupActivityPartModel.bulkCreate(groupActivityPartsToCreate, {
        transaction,
      });

      //================================================================================================================================

      const existingClassDraft = await this.classDraftModel.findOne({
        where: {
          cohort_id: cohortId,
        },
        transaction,
      });
      if (existingClassDraft) {
        await existingClassDraft.destroy({ transaction });
      }

      const existingScheduleDraft = await this.scheduleDraftModel.findOne({
        where: {
          cohort_id: cohortId,
        },
        transaction,
      });
      log(existingScheduleDraft, 'DRAFT SCHEDULE_________________');
      if (existingScheduleDraft) {
        await existingScheduleDraft.destroy({ transaction });
      }

      await this.createUsersAndSendEmails(
        clientId,
        cohortId,
        createClass,
        transaction,
        // classDetails,
      );

      await this.cohortModel.update(
        {
          class_exist: true,
        },
        {
          where: {
            id: cohortId,
          },
          transaction,
        },
      );

      if (createClass.project_id) {
        await this.competencyService.updateNbolCompToCompyComp(
          clientId,
          createClass.project_id,
          cohortId,
          transaction,
        );
      }

      if (createClass.quessionnaire_id?.length > 0) {
        await this.updateQuessComp(
          clientId,
          createClass.quessionnaire_id,
          transaction,
        );
      }

      await transaction.commit();
      transaction = null;

      // if (createClass.project_id) {
      //   await this.competencyService.updateNbolCompToCompyComp(
      //     clientId,
      //     createClass.project_id,
      //     cohortId,
      //     // transaction,
      //   );
      // }

      // if (createClass.quessionnaire_id?.length > 0) {
      //   await this.updateQuessComp(
      //     clientId,
      //     createClass.quessionnaire_id,
      //     transaction,
      //   );
      // }

      if (!classDetails) {
        throw new HttpException('Class Not Created', HttpStatus.NOT_FOUND);
      }

      return classDetails;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      // if ((transaction as any)?.finished) {
      //   await transaction?.rollback();
      // }

      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create class: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async preClassSchedule(
    clientId: string,
    cohortId: string,
    createClass: CreateClass,
  ): Promise<any> {
    let transaction: Transaction | null = await this.sequelize.transaction();
    try {
      const existingScheduleDraft = await this.scheduleDraftModel.findOne({
        where: {
          cohort_id: cohortId,
        },
      });
      if (existingScheduleDraft) {
        throw new HttpException(
          {
            message:
              'Schedule already exists for this cohort in drafat schedule',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const existingClassOfCohort = await this.classModel.findOne({
        where: {
          cohort_id: cohortId,
        },
      });
      if (existingClassOfCohort) {
        throw new HttpException(
          {
            message:
              'Class already exists for this cohort use different cohort',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const existingPreClassSchedule = await this.preClassScheduleModel.findOne(
        {
          where: {
            cohort_id: cohortId,
          },
        },
      );
      if (existingPreClassSchedule) {
        throw new HttpException(
          {
            message:
              'Pre class scehdule already exists for this cohort use different cohort',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        !createClass.class_assessments ||
        createClass.class_assessments.length === 0
      ) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Select Assessments For Creating The NBO CLASS',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const competencyWeightage = await CompetencyWeightage.findOne({
        where: {
          cohort_id: cohortId,
        },
      });
      if (!competencyWeightage) {
        throw new HttpException(
          {
            message:
              'Please configure the weightages for Assessments before launching the CLASS',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingClassBreaks = await ClassBreaks.findAll({
        where: {
          cohort_id: cohortId,
        },
      });
      if (existingClassBreaks.length > 0) {
        await ClassBreaks.destroy({
          where: {
            cohort_id: cohortId,
          },
          transaction,
        });
      }

      const startDate = new Date(createClass.start_date);

      if (isNaN(startDate.getTime())) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: "'Invalid Start Date Format'",
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      // ASSESSORS CONFLICT FUNCTION------------------------------------------------------------
      const checks: Array<{
        assessor_id: string;
        start_time: string;
        end_time: string;
        date: Date;
      }> = [];

      for (const assessmentData of createClass.class_assessments) {
        if (assessmentData.participant_assessment) {
          for (const participantData of assessmentData.participant_assessment) {
            for (const assessor of participantData.class_assessors) {
              checks.push({
                assessor_id: assessor.assessor_id,
                start_time: participantData.start_time,
                end_time: participantData.end_time,
                date: startDate,
              });
            }
          }
        } else {
          for (const participantData of assessmentData.part_gr_act_room) {
            checks.push({
              assessor_id: participantData.assessor_id,
              start_time: participantData.start_time,
              end_time: participantData.end_time,
              date: startDate,
            });
          }
        }
      }

      const checkPromises = checks.map((check) =>
        this.checkAssessorAvailability(
          check.assessor_id,
          check.start_time,
          check.end_time,
          check.date,
          transaction,
        ),
      );

      const checkResults = await Promise.all(checkPromises);

      const assessorsConflicts = new Set<string>();
      checkResults.forEach(({ conflicts, assessorDetails }) => {
        if (conflicts && assessorDetails?.name) {
          assessorsConflicts.add(assessorDetails.name);
        }
      });

      const assessorsName = Array.from(assessorsConflicts);
      if (assessorsName.length > 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Assessors Conflict Detected',
            assessorsName,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const participantAssessmentsToCreate: any[] = [];
      for (const assessmentData of createClass.class_assessments) {
        if (assessmentData.participant_assessment) {
          for (const participantData of assessmentData.participant_assessment) {
            // const tempKey = `${participantData.participant_id}_${assessmentData.assessment_id}_${participantData.start_time}_${participantData.end_time}`;
            participantAssessmentsToCreate.push({
              cohort_id: cohortId,
              assessment_id: assessmentData.assessment_id,
              scenerio_id: assessmentData.scenerio_id,
              quessionnaire_id: assessmentData.quessionnaire_id,
              participant_id: participantData.participant_id,
              room_id: participantData.room_id,
              start_time: participantData.start_time,
              end_time: participantData.end_time,
              break: participantData.break,
              class_date: createClass.start_date,
              createdAt: new Date(),
              updatedAt: new Date(),
              // tempKey,
            });
          }
        }
      }
      await this.preClassScheduleModel.bulkCreate(
        participantAssessmentsToCreate,
        { transaction, returning: true },
      );

      const classBreaksToCreate: CreationAttributes<ClassBreaks>[] = [];

      for (const breakTime of createClass.class_breaks) {
        classBreaksToCreate.push({
          first_br_st: breakTime.first_br_st,
          first_br_en: breakTime.first_br_en,
          second_br_st: breakTime.second_br_st,
          second_br_en: breakTime.second_br_en,
          lunch_br_st: breakTime.lunch_br_st,
          lunch_br_en: breakTime.lunch_br_en,
          class_date: breakTime.class_date,
          wlc_sess_st: breakTime.wlc_sess_st,
          wlc_sess_en: breakTime.wlc_sess_en,
          ending_sess_st: breakTime.ending_sess_st,
          ending_sess_en: breakTime.ending_sess_en,
          // class_id: classDetails.id,
          cohort_id: cohortId,
        } as any);
      }

      const createdClassBreaks = await ClassBreaks.bulkCreate(
        classBreaksToCreate,
        {
          transaction,
          returning: true,
        },
      );

      //================================================================================================================================

      const existingClassDraft = await this.classDraftModel.findOne({
        where: {
          cohort_id: cohortId,
        },
        transaction,
      });
      if (existingClassDraft) {
        await existingClassDraft.destroy({ transaction });
      }

      await this.createUsersAndSendEmails(
        clientId,
        cohortId,
        createClass,
        transaction,
        // classDetails,
      );
      await transaction.commit();
      transaction = null;

      return 'Schedule Created Successfully';
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      // if ((transaction as any).finished) {
      //   await transaction?.rollback();
      // }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create class: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuessComp(
    clientId: string,
    quessionnaire_id: string[],
    transaction?: Transaction,
  ): Promise<any> {
    const quessComp = await this.questionsModel.findAll({
      where: {
        quesionnaire_id: {
          [Op.in]: quessionnaire_id,
        },
      },
      transaction,
    });

    if (!quessComp.length)
      return { status: false, message: 'No questions found' };

    const firstCompId = quessComp[0]?.competency_id;
    if (!firstCompId)
      return { status: false, message: 'No competency_id found in questions' };

    const originalComp = await this.competencyModel.findOne({
      where: { id: firstCompId },
      transaction,
    });

    if (!originalComp)
      return { status: false, message: 'Original competency not found' };

    const clientCopiedCompetencies = await this.competencyModel.findAll({
      where: {
        client_id: clientId,
        is_copy: true,
      },
      transaction,
    });

    const refToClientCompId: Record<string, string> = {};
    clientCopiedCompetencies.forEach((comp) => {
      if (comp.ref_nbol_id) {
        refToClientCompId[comp.ref_nbol_id.trim()] = comp.id;
      }
    });

    let updatedCount = 0;
    for (const question of quessComp) {
      const newCompId = refToClientCompId[question.competency_id.trim()];
      if (newCompId && question.competency_id !== newCompId) {
        await question.update({ competency_id: newCompId }, { transaction });
        updatedCount++;
      }
    }

    return {
      status: true,
      updated: updatedCount,
      message: 'Questions updated with client competency ids',
    };
  }

  async classDetails(cohortId: string, date: string): Promise<any> {
    const where: any = {};
    const breakWhere: any = {};
    // let convertedDate = `${date} 05:30:00.000 +0530`;
    if (date) {
      where.start_time = { [Op.like]: `%${date}%` };
      breakWhere.first_br_st = { [Op.like]: `%${date}%` };
      breakWhere.cohort_id = cohortId;
    }
    const breaks = await ClassBreaks.findAll({
      // where: {
      //   cohort_id: cohortId,

      // },
      where: breakWhere,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    const classConfigAssmRaw = await this.scenerioModel.findAll({
      attributes: ['id', 'scenerio_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'part_assessment',
          required: true,
          where,
          attributes: [
            'id',
            'start_time',
            'end_time',
            'break',
            'participant_id',
            'room_id',
          ],
          include: [
            {
              model: Participants,
              as: 'participant',
              attributes: ['id', 'participant_name'],
              // required: true,
            },
            {
              model: Rooms,
              as: 'room',
              attributes: ['id', 'room'],
            },
            {
              model: Assessros,
              as: 'assessors',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              where: { cohort_id: cohortId },
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                },
              ],
            },
          ],
        },
      ],
      order: [
        // Sequelize.literal(`CASE
        //     WHEN "assessment".assessment_name = 'Think On Your Feet' THEN 2
        //     WHEN "assessment".assessment_name  = 'Role Play' THEN 1
        //     WHEN "assessment".assessment_name  = 'Business Case' THEN 3
        //     WHEN "assessment".assessment_name  = 'Group Activity' THEN 4
        //     WHEN "assessment".assessment_name  = 'Leadership Questionnaire' THEN 5
        //     ELSE 6
        //   END`),
        [
          { model: ParticipantsAssessments, as: 'part_assessment' },
          'start_time',
          'ASC',
        ],
      ],
    });
    const classConfigAssmRawJson = classConfigAssmRaw.map((item: any) =>
      item.toJSON(),
    );
    const classConfigAssm = classConfigAssmRawJson.map((scenerio: any) => {
      const updatedPartAssessments = (scenerio.part_assessment || []).map(
        (assessment: any) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(
            `${today}T${assessment.start_time}:00.000Z`,
          );
          const endTimeISO = new Date(
            `${today}T${assessment.end_time}:00.000Z`,
          );
          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );
          return {
            ...assessment,
            duration: `${durationMinutes} minutes`,
          };
        },
      );
      return {
        ...scenerio,
        part_assessment: updatedPartAssessments,
      };
    });

    const classConfigQuessRaw = await this.quessionnaireModel.findAll({
      attributes: ['id', 'quesionnaire_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'part_assessment',
          required: true,
          attributes: [
            'id',
            'start_time',
            'end_time',
            'break',
            'participant_id',
            'room_id',
          ],
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: ['id', 'assessment_name'],
            },
            {
              model: Participants,
              as: 'participant',
              attributes: ['id', 'participant_name'],
            },
            { model: Rooms, as: 'room', attributes: ['id', 'room'] },
            {
              model: Assessros,
              as: 'assessors',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              attributes: [
                'id',
                'start_date',
                'end_date',
                'cohort_id',
                'client_id',
              ],
              where: {
                cohort_id: cohortId,
                // [Op.and]: [
                //   { start_date: { [Op.gte]: convertedDate } },
                //   { end_date: { [Op.lte]: convertedDate } },
                // ],

                // start_date: { [Op.lte]: convertedDate },
                // end_date: { [Op.gte]: convertedDate },
              },
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                  attributes: ['id', 'client_name'],
                },
              ],
            },
          ],
        },
      ],
    });
    const classConfigQuessRawJson = classConfigQuessRaw.map((item: any) =>
      item.toJSON(),
    );
    const classConfigQuess = classConfigQuessRawJson.map((ques: any) => {
      const updatedPartAssessments = (ques.part_assessment || []).map(
        (assessment: any) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(
            `${today}T${assessment.start_time}:00.000Z`,
          );
          const endTimeISO = new Date(
            `${today}T${assessment.end_time}:00.000Z`,
          );
          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );
          return {
            ...assessment,
            duration: `${durationMinutes} minutes`,
          };
        },
      );
      return {
        ...ques,
        part_assessment: updatedPartAssessments,
      };
    });

    const classConfigGrpRaw = await this.scenerioModel.findAll({
      attributes: ['id', 'scenerio_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.groupActivityRoomsModel,
          as: 'gr_act_rooms',
          where,
          required: true,
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: ['id', 'assessment_name'],
            },
            {
              model: this.groupActivityPartModel,
              as: 'gr_act_part',
              include: [
                {
                  model: Participants,
                  as: 'participants',
                  attributes: ['id', 'participant_name'],
                },
              ],
            },
            { model: Rooms, as: 'room', attributes: ['id', 'room'] },
            {
              model: Assessros,
              as: 'assessor',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              where: { cohort_id: cohortId },
              attributes: [
                'id',
                'start_date',
                'end_date',
                'cohort_id',
                'client_id',
              ],
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                  attributes: ['id', 'client_name'],
                },
              ],
            },
          ],
        },
      ],
    });
    const classConfigGrpRawJson = classConfigGrpRaw.map((item: any) =>
      item.toJSON(),
    );
    const classConfigGrp = classConfigGrpRawJson.map((scenerio: any) => {
      const updatedGrActRooms = (scenerio.gr_act_rooms || []).map(
        (room: any) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(`${today}T${room.start_time}:00.000Z`);
          const endTimeISO = new Date(`${today}T${room.end_time}:00.000Z`);
          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );
          return {
            ...room,
            duration: `${durationMinutes} minutes`,
          };
        },
      );
      return {
        ...scenerio,
        gr_act_rooms: updatedGrActRooms,
      };
    });
    const classWelcomeSessionDuration = await this.classModel.findOne({
      where: {
        cohort_id: cohortId,
      },
      attributes: ['welcome_sess_duration'],
    });
    return {
      welcome_sess_duration: classWelcomeSessionDuration?.welcome_sess_duration,
      breaks,
      classConfigAssm,
      classConfigGrp,
      classConfigQuess,
    };
  }

  async assessorSchedule(
    cohortId: string,
    assessorId: string,
    date: string,
  ): Promise<any> {
    const where: any = {};
    const breakWhere: any = {};
    if (date) {
      where.start_time = { [Op.like]: `%${date}%` };
      breakWhere.first_br_st = { [Op.like]: `%${date}%` };
      breakWhere.cohort_id = cohortId;
    }
    const breaks = await ClassBreaks.findAll({
      // where: {
      //   cohort_id: cohortId,
      // },
      where: breakWhere,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    const classConfigAssmRaw = await this.scenerioModel.findAll({
      attributes: ['id', 'scenerio_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'part_assessment',
          required: true,
          where,
          attributes: [
            'id',
            'start_time',
            'end_time',
            'break',
            'participant_id',
            'room_id',
          ],
          include: [
            {
              model: Participants,
              as: 'participant',
              attributes: ['id', 'participant_name'],
              // required: true,
            },
            {
              model: Rooms,
              as: 'room',
              attributes: ['id', 'room'],
            },
            {
              model: Assessros,
              as: 'assessors',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              where: { cohort_id: cohortId },
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                },
              ],
            },
            {
              model: this.classAssessmentsAssessorsModel,
              as: 'class_assessors',
              where: {
                assessors_id: assessorId,
              },
            },
          ],
        },
      ],
      order: [
        [
          { model: ParticipantsAssessments, as: 'part_assessment' },
          'start_time',
          'ASC',
        ],
      ],
    });
    const classConfigAssmRawJson = classConfigAssmRaw.map((item: any) =>
      item.toJSON(),
    );
    const classConfigAssm = classConfigAssmRawJson.map((scenerio: any) => {
      const updatedPartAssessments = (scenerio.part_assessment || []).map(
        (assessment: any) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(
            `${today}T${assessment.start_time}:00.000Z`,
          );
          const endTimeISO = new Date(
            `${today}T${assessment.end_time}:00.000Z`,
          );
          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );
          return {
            ...assessment,
            duration: `${durationMinutes} minutes`,
          };
        },
      );
      return {
        ...scenerio,
        part_assessment: updatedPartAssessments,
      };
    });

    const classConfigQuessRaw = await this.quessionnaireModel.findAll({
      attributes: ['id', 'quesionnaire_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'part_assessment',
          required: true,
          attributes: [
            'id',
            'start_time',
            'end_time',
            'break',
            'participant_id',
            'room_id',
          ],
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: ['id', 'assessment_name'],
            },
            {
              model: Participants,
              as: 'participant',
              attributes: ['id', 'participant_name'],
            },
            { model: Rooms, as: 'room', attributes: ['id', 'room'] },
            {
              model: Assessros,
              as: 'assessors',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              attributes: [
                'id',
                'start_date',
                'end_date',
                'cohort_id',
                'client_id',
              ],
              where: {
                cohort_id: cohortId,
              },
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                  attributes: ['id', 'client_name'],
                },
              ],
            },
          ],
        },
      ],
    });
    const classConfigQuessRawJson = classConfigQuessRaw.map((item: any) =>
      item.toJSON(),
    );
    const classConfigQuess = classConfigQuessRawJson.map((ques: any) => {
      const updatedPartAssessments = (ques.part_assessment || []).map(
        (assessment: any) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(
            `${today}T${assessment.start_time}:00.000Z`,
          );
          const endTimeISO = new Date(
            `${today}T${assessment.end_time}:00.000Z`,
          );
          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );
          return {
            ...assessment,
            duration: `${durationMinutes} minutes`,
          };
        },
      );
      return {
        ...ques,
        part_assessment: updatedPartAssessments,
      };
    });

    const classConfigGrpRaw = await this.scenerioModel.findAll({
      attributes: ['id', 'scenerio_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.groupActivityRoomsModel,
          as: 'gr_act_rooms',
          where,
          required: true,
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: ['id', 'assessment_name'],
            },
            {
              model: this.groupActivityPartModel,
              as: 'gr_act_part',
              include: [
                {
                  model: Participants,
                  as: 'participants',
                  attributes: ['id', 'participant_name'],
                },
              ],
            },
            { model: Rooms, as: 'room', attributes: ['id', 'room'] },
            {
              model: Assessros,
              as: 'assessor',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              where: { cohort_id: cohortId },
              attributes: [
                'id',
                'start_date',
                'end_date',
                'cohort_id',
                'client_id',
              ],
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                  attributes: ['id', 'client_name'],
                },
              ],
            },
          ],
        },
      ],
    });
    const classConfigGrpRawJson = classConfigGrpRaw.map((item: any) =>
      item.toJSON(),
    );
    const classConfigGrp = classConfigGrpRawJson.map((scenerio: any) => {
      const updatedGrActRooms = (scenerio.gr_act_rooms || []).map(
        (room: any) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(`${today}T${room.start_time}:00.000Z`);
          const endTimeISO = new Date(`${today}T${room.end_time}:00.000Z`);
          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );
          return {
            ...room,
            duration: `${durationMinutes} minutes`,
          };
        },
      );
      return {
        ...scenerio,
        gr_act_rooms: updatedGrActRooms,
      };
    });

    const classWelcomeSessionDuration = await this.classModel.findOne({
      where: {
        cohort_id: cohortId,
      },
      attributes: ['welcome_sess_duration'],
    });
    return {
      welcome_sess_duration: classWelcomeSessionDuration?.welcome_sess_duration,
      breaks,
      classConfigAssm,
      classConfigGrp,
      classConfigQuess,
    };
  }

  async participantSchedule(
    cohortId: string,
    partId: string,
    classId: string,
    date: string,
  ): Promise<any> {
    const where: any = {};
    const breakWhere: any = {};

    if (date) {
      where.start_time = { [Op.like]: `%${date}%` };
      where.participant_id = partId;
      breakWhere.first_br_st = { [Op.like]: `%${date}%` };
      breakWhere.cohort_id = cohortId;
    }
    const whereTwo: any = {};
    if (date) {
      whereTwo.start_time = { [Op.like]: `%${date}%` };
    }
    const breaks = await ClassBreaks.findAll({
      where: breakWhere,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    const classConfigAssmRaw = await this.scenerioModel.findAll({
      attributes: ['id', 'scenerio_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'part_assessment',
          required: true,
          where,
          attributes: [
            'id',
            'start_time',
            'end_time',
            'break',
            'participant_id',
            'room_id',
          ],
          include: [
            {
              model: Participants,
              as: 'participant',
              attributes: ['id', 'participant_name'],
              required: true,
            },
            {
              model: Rooms,
              as: 'room',
              attributes: ['id', 'room'],
            },
            {
              model: Assessros,
              as: 'assessors',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              where: { cohort_id: cohortId },
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                },
              ],
            },
          ],
        },
      ],
      order: [
        // Sequelize.literal(`CASE
        //     WHEN "assessment".assessment_name = 'Think On Your Feet' THEN 2
        //     WHEN "assessment".assessment_name  = 'Role Play' THEN 1
        //     WHEN "assessment".assessment_name  = 'Business Case' THEN 3
        //     WHEN "assessment".assessment_name  = 'Group Activity' THEN 4
        //     WHEN "assessment".assessment_name  = 'Leadership Questionnaire' THEN 5
        //     ELSE 6
        //   END`),
        [
          { model: ParticipantsAssessments, as: 'part_assessment' },
          'start_time',
          'ASC',
        ],
      ],
    });

    const classConfigAssmRawJson = classConfigAssmRaw.map((item: any) =>
      item.toJSON(),
    );

    const classConfigAssm = classConfigAssmRawJson.map((scenerio: any) => {
      const updatedPartAssessments = (scenerio.part_assessment || []).map(
        (assessment: any) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(
            `${today}T${assessment.start_time}:00.000Z`,
          );
          const endTimeISO = new Date(
            `${today}T${assessment.end_time}:00.000Z`,
          );
          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );
          return {
            ...assessment,
            duration: `${durationMinutes} minutes`,
          };
        },
      );
      return {
        ...scenerio,
        part_assessment: updatedPartAssessments,
      };
    });

    const classConfigQuessRaw = await this.quessionnaireModel.findAll({
      attributes: ['id', 'quesionnaire_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'part_assessment',
          where: { participant_id: partId },
          // required: true,
          attributes: [
            'id',
            'start_time',
            'end_time',
            'break',
            'participant_id',
            'room_id',
          ],
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: ['id', 'assessment_name'],
            },
            {
              model: Participants,
              as: 'participant',
              attributes: ['id', 'participant_name'],
            },
            { model: Rooms, as: 'room', attributes: ['id', 'room'] },
            {
              model: Assessros,
              as: 'assessors',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              attributes: [
                'id',
                'start_date',
                'end_date',
                'cohort_id',
                'client_id',
              ],
              // where: {
              //  [Op.and]:[
              //   { cohort_id: cohortId},
              //   {[Op.and]: [
              //     { start_date: { [Op.gte]: date } },
              //     { end_date: { [Op.lte]: date } },
              //   ],}
              //  ]
              // },
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                  attributes: ['id', 'client_name'],
                },
              ],
            },
          ],
        },
      ],
    });

    const classConfigQuessRawJson = classConfigQuessRaw.map((item: any) =>
      item.toJSON(),
    );
    const classConfigQuess = classConfigQuessRawJson.map((ques: any) => {
      const updatedPartAssessments = (ques.part_assessment || []).map(
        (assessment: any) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(
            `${today}T${assessment.start_time}:00.000Z`,
          );
          const endTimeISO = new Date(
            `${today}T${assessment.end_time}:00.000Z`,
          );
          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );
          return {
            ...assessment,
            duration: `${durationMinutes} minutes`,
          };
        },
      );
      return {
        ...ques,
        part_assessment: updatedPartAssessments,
      };
    });

    const classConfigGrpRaw = await this.scenerioModel.findAll({
      attributes: ['id', 'scenerio_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.groupActivityRoomsModel,
          as: 'gr_act_rooms',
          where: whereTwo,
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: ['id', 'assessment_name'],
            },
            {
              model: this.groupActivityPartModel,
              as: 'gr_act_part',
              where: { part_id: partId },
              required: true,
              include: [
                {
                  model: Participants,
                  as: 'participants',
                  attributes: ['id', 'participant_name'],
                },
              ],
            },
            { model: Rooms, as: 'room', attributes: ['id', 'room'] },
            {
              model: Assessros,
              as: 'assessor',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              where: { cohort_id: cohortId },
              attributes: [
                'id',
                'start_date',
                'end_date',
                'cohort_id',
                'client_id',
              ],
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                  attributes: ['id', 'client_name'],
                },
              ],
            },
          ],
        },
      ],
    });

    const classConfigGrpRawJson = classConfigGrpRaw.map((item: any) =>
      item.toJSON(),
    );
    const classConfigGrp = classConfigGrpRawJson.map((scenerio: any) => {
      const updatedGrActRooms = (scenerio.gr_act_rooms || []).map(
        (room: any) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(`${today}T${room.start_time}:00.000Z`);
          const endTimeISO = new Date(`${today}T${room.end_time}:00.000Z`);
          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );
          return {
            ...room,
            duration: `${durationMinutes} minutes`,
          };
        },
      );
      return {
        ...scenerio,
        gr_act_rooms: updatedGrActRooms,
      };
    });
    return { breaks, classConfigAssm, classConfigGrp, classConfigQuess };
  }

  async classDetailsParticipant(
    clientId: string,
    participantId: string,
  ): Promise<any> {
    const classConfig = await this.clientsModel.findOne({
      include: [
        {
          model: Class,
          as: 'classes',
          where: {
            client_id: clientId,
          },
          include: [
            {
              model: ParticipantsAssessments,
              as: 'participant_assessments',
              where: {
                participant_id: participantId,
              },
              include: [
                {
                  model: Participants,
                  as: 'participant',
                },
                {
                  model: Rooms,
                  as: 'room',
                },
                {
                  model: Assessments,
                  as: 'assessment',
                  order: [
                    Sequelize.literal(`CASE 
                      WHEN "assessment".assessment_name = 'Think On Your Feet' THEN 2
                      WHEN "assessment".assessment_name  = 'Role Play' THEN 1
                      WHEN "assessment".assessment_name  = 'Business Case' THEN 3
                      WHEN "assessment".assessment_name  = 'Group Activity' THEN 4
                      WHEN "assessment".assessment_name  = 'Leadership Questionnaire' THEN 5
                      ELSE 6
                    END`),
                  ],
                },
                {
                  model: Assessros,
                  as: 'assessors',
                },
              ],
            },
            {
              model: this.groupActivityRoomsModel,
              as: 'grp_act_rooms',
              include: [
                {
                  model: this.groupActivityPartModel,
                  as: 'gr_act_part',
                  where: { part_id: participantId },
                  required: true,
                  include: [
                    {
                      model: Participants,
                      as: 'participants',
                      attributes: ['id', 'participant_name'],
                    },
                  ],
                },
                {
                  model: this.assessmentsModel,
                  as: 'assessment',
                  attributes: ['id', 'assessment_name'],
                },
                { model: Rooms, as: 'room', attributes: ['id', 'room'] },
                {
                  model: Assessros,
                  as: 'assessor',
                  attributes: ['id', 'assessor_name'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!classConfig) {
      throw new HttpException('client/class not found', HttpStatus.NOT_FOUND);
    }

    //============updated=================

    const classConfigJson = classConfig.toJSON();

    const classes = classConfigJson.classes.map((classItem) => {
      const participantAssessments = classItem.participant_assessments.map(
        (assessment) => {
          const today = new Date().toISOString().split('T')[0];
          const startTimeISO = new Date(
            `${today}T${assessment.start_time}:00.000Z`,
          );
          const endTimeISO = new Date(
            `${today}T${assessment.end_time}:00.000Z`,
          );

          const durationMinutes = Math.floor(
            (endTimeISO.getTime() - startTimeISO.getTime()) / (1000 * 60),
          );

          return {
            ...assessment,
            // start_time: startTimeISO.toISOString(),
            // end_time: endTimeISO.toISOString(),
            duration: `${durationMinutes} minutes`,
          };
        },
      );

      return {
        ...classItem,
        participant_assessments: participantAssessments,
      };
    });

    const classBreaks = await ClassBreaks.findAll({
      where: {
        cohort_id: classConfigJson.classes[0].cohort_id,
      },
    });

    return {
      ...classConfigJson,
      classes,
      breaks: classBreaks,
    };

    // return classConfig;
  }

  async partClass(partId: string): Promise<any> {
    const partClass = await this.participantModel.findOne({
      where: {
        id: partId,
      },
      attributes: ['id', 'client_id', 'project_id', 'cohort_id'],
      include: [
        {
          model: Cohorts,
          as: 'cohorts',
          required: true,
          attributes: ['cohort_name'],
          include: [
            {
              model: Projects,
              as: 'project',
              attributes: ['project_name'],
            },
            {
              model: this.classModel,
              as: 'class',
              required: true,
            },
          ],
        },
      ],
    });
    return partClass;
  }

  async assessorClassesDetails(assessorId: String): Promise<any> {
    const classess = await this.classModel.findAll({
      // attributes:['id', 'client_id', 'cohort_id'],
      include: [
        {
          model: Cohorts,
          as: 'cohort',
          attributes: ['id', 'cohort_name', 'project_id'],
          required: true,
          include: [
            {
              model: Projects,
              as: 'project',
              include: [
                {
                  model: this.clientsModel,
                  as: 'client',
                  attributes: ['id', 'client_name'],
                },
              ],
            },
          ],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'participant_assessments',
          required: true,
          include: [
            {
              model: this.classAssessmentsAssessorsModel,
              as: 'class_assessors',
              where: {
                assessors_id: assessorId,
              },
              required: true,
            },
          ],
        },
      ],
    });
    return classess;
  }

  async classAssessmentsScenerio(
    clientId: string,
    classId: string,
  ): Promise<Assessments[]> {
    const assessments = await this.assessmentsModel.findAll({
      include: [
        {
          model: Scenerios,
          as: 'scenerios',
          where: {
            class_id: classId,
          },
        },
        {
          model: ClientAssessments,
          as: 'client_assessments',
          attributes: [],
          where: {
            client_id: clientId,
          },
        },
      ],
    });
    if (!assessments) {
      throw new HttpException('Assessments Not Found', HttpStatus.NOT_FOUND);
    }
    return assessments;
  }

  async classCompetencyExpected(classId: string): Promise<Competencies[]> {
    const classCompetency = await this.competencyModel.findAll({
      include: [
        {
          model: ClassCompetencies,
          as: 'class_competencies',
          attributes: [],
          where: {
            class_id: classId,
          },
        },
        {
          model: ExpectedBehaviours,
          as: 'expected_behaviours',
        },
        // {
        //   model: ParticipantScore,
        //   as: 'participant_score',
        //   required:false,
        // },
      ],
    });
    if (!classCompetency) {
      throw new HttpException('Competency Not Found', HttpStatus.NOT_FOUND);
    }
    return classCompetency;
  }

  async allClassSchedule(): Promise<any> {
    const Allclass = await this.classModel.findAll({
      include: [
        {
          model: Clients,
          as: 'client',
          include: [
            {
              model: Projects,
              as: 'projects',
            },
          ],
        },
      ],
      //  include: [
      //   {
      //     model: Cohorts,
      //     as: 'cohort',
      //     include: [
      //       {
      //         model: Projects,
      //         as: 'project',
      //         include:[
      //           {
      //             model:Clients,
      //             as:'client'
      //           }
      //         ]
      //       },
      //     ],
      //   },
      // ],
    });

    return Allclass;
  }

  async participantAssessments(
    assesorId: string,
    clientId?: string,
    projectId?: string,
    cohortId?: string,
    page?: number,
    limit?: number,
  ): Promise<any> {
    const offset = (page || 0) * (limit || 10);

    const participantWhere: any = {};
    if (clientId) participantWhere.client_id = clientId;
    if (projectId) participantWhere.project_id = projectId;
    if (cohortId) participantWhere.cohort_id = cohortId;

    const partiAssessments = await this.participantsAssessmentsModel.findAll({
      // offset,
      // limit,
      // attributes: ['id', 'assessor_status', 'participant_status'],
      include: [
        {
          model: this.assessmentReponseModel,
          as: 'as_res',
          attributes: ['id'],
          required: false,
        },
        {
          model: this.participantModel,
          as: 'participant',
          attributes: [
            'id',
            'participant_name',
            'cohort_id',
            'client_id',
            'project_id',
          ],
          // where: Object.keys(participantWhere).length
          //   ? participantWhere
          //   : undefined,
          where: {
            ...(Object.keys(participantWhere).length ? participantWhere : {}),
            ...getSearchObject(this.requestParams.query, ['participant_name']),
          },

          required: true,
          include: [
            {
              model: this.cohortModel,
              as: 'cohorts',
              include: [
                {
                  model: this.classModel,
                  as: 'class',
                  required: true,
                  include: [
                    {
                      model: this.clientModel,
                      as: 'client',
                      // where: {
                      //   ...getSearchObject(this.requestParams.query, [
                      //     'client_name',
                      //   ]),
                      // },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: this.assessmentsModel,
          as: 'assessment',
          required: true,
        },
        {
          model: this.scenerioModel,
          as: 'scenerio',
          attributes: ['id', 'scenerio_name'],
        },
        {
          model: this.quessionnaireModel,
          as: 'quessionnaire',
          attributes: ['id', 'quesionnaire_name'],
        },
        {
          model: this.roomModel,
          as: 'room',
        },
        {
          model: this.classAssessmentsAssessorsModel,
          as: 'class_assessors',
          where: {
            assessors_id: assesorId,
          },
          include: [
            {
              model: this.assessorsModel,
              as: 'assessor',
              // required: true,
            },
          ],
        },
      ],
      // order: [
      //   [
      //     { model: this.classAssessmentsAssessorsModel, as: 'class_assessors' },
      //     'assessor_status',
      //     'ASC',
      //   ],
      // ],
      order: [['updatedAt', 'DESC']],
    });

    const grp_act_part = await this.groupActivityRoomsModel.findAll({
      where: {
        assessor_id: assesorId,
      },
      include: [
        {
          model: this.assessmentReponseModel,
          as: 'as_res',
          required: false,
        },
        {
          model: this.roomModel,
          as: 'room',
        },
        {
          model: this.assessmentsModel,
          as: 'assessment',
        },
        {
          model: this.scenerioModel,
          as: 'scenerio',
          attributes: ['id', 'scenerio_name'],
        },
        {
          model: this.classAssessmentsAssessorsModel,
          as: 'class_assessors',
          where: {
            assessors_id: assesorId,
          },
          include: [
            {
              model: this.assessorsModel,
              as: 'assessor',
              // required: true,
            },
          ],
        },
        {
          model: this.groupActivityPartModel,
          as: 'gr_act_part',
          required: true,
          include: [
            {
              model: this.participantModel,
              as: 'participants',
              where: Object.keys(participantWhere).length
                ? participantWhere
                : undefined,
              required: true,
              include: [
                {
                  model: this.cohortModel,
                  as: 'cohorts',
                  include: [
                    {
                      model: this.classModel,
                      as: 'class',
                      include: [
                        {
                          model: this.clientModel,
                          as: 'client',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: this.groupActivityRoomsModel,
              as: 'gr_act_rooms',
            },
          ],
        },
      ],
      order: [
        [
          { model: this.classAssessmentsAssessorsModel, as: 'class_assessors' },
          'assessor_status',
          'ASC',
        ],
      ],
    });

    const merged = [
      ...partiAssessments.map((item) => ({
        type: 'individual',
        ...item.toJSON(),
      })),
      ...grp_act_part.map((item) => ({
        type: 'group',
        ...item.toJSON(),
      })),
    ];
    // console.log(merged, "MERGED");

    const paginated = merged.slice(offset, offset + (limit || 10));

    return {
      rows: paginated,
      count: merged.length,
    };
  }

  async participantAssessmentsUpdated(
    assesorId: string,
    clientId?: string,
    projectId?: string,
    cohortId?: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;

    const participantWhere: any = {};
    if (clientId) participantWhere.client_id = clientId;
    if (projectId) participantWhere.project_id = projectId;
    if (cohortId) participantWhere.cohort_id = cohortId;

    const partiAssessments = await this.assessmentsModel.findAll({
      include: [
        {
          model: this.clientAssessmentsModel,
          as: 'client_assessments',
          // required: true,
          where: {
            cohort_id: cohortId,
          },
          // separate: true,
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
            },
            {
              model: this.scenerioModel,
              as: 'scenerio',
              attributes: ['id', 'scenerio_name'],
            },
            {
              model: this.quessionnaireModel,
              as: 'question',
            },
          ],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'participant_assessments',
          include: [
            {
              model: Participants,
              as: 'participant',
              where: Object.keys(participantWhere).length
                ? participantWhere
                : undefined,
              required: true,
              include: [
                {
                  model: Cohorts,
                  as: 'cohorts',
                  include: [
                    {
                      model: this.classModel,
                      as: 'class',
                      include: [
                        {
                          model: Clients,
                          as: 'client',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: Rooms,
              as: 'room',
            },

            {
              model: Assessros,
              as: 'assessors',
              include: [
                {
                  model: ClassAssessors,
                  as: 'class_assessors',
                  attributes: [],
                  where: {
                    assessors_id: assesorId,
                  },
                },
              ],
            },
          ],
        },
        {
          model: this.groupActivityRoomsModel,
          as: 'gr_act_rooms',
          where: {
            assessor_id: assesorId,
          },
          required: false,
          include: [
            {
              model: Rooms,
              as: 'room',
            },
            {
              model: Assessments,
              as: 'assessment',
            },
            {
              model: Assessros,
              as: 'assessor',
              include: [
                {
                  model: ClassAssessors,
                  as: 'class_assessors',
                  attributes: [],
                },
              ],
            },
            {
              model: this.groupActivityPartModel,
              as: 'gr_act_part',
              required: true,
              include: [
                {
                  model: Participants,
                  as: 'participants',
                  where: Object.keys(participantWhere).length
                    ? participantWhere
                    : undefined,
                  required: true,
                  include: [
                    {
                      model: Cohorts,
                      as: 'cohorts',
                      include: [
                        {
                          model: this.classModel,
                          as: 'class',
                          include: [
                            {
                              model: Clients,
                              as: 'client',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  model: this.groupActivityRoomsModel,
                  as: 'gr_act_rooms',
                },
              ],
            },
          ],
        },
      ],
    });
    const grp_act_part = await this.groupActivityRoomsModel.findAll({
      where: {
        assessor_id: assesorId,
      },
      include: [
        {
          model: Rooms,
          as: 'room',
        },
        {
          model: Assessments,
          as: 'assessment',
        },
        {
          model: Assessros,
          as: 'assessor',
          // required: true,
          include: [
            {
              model: ClassAssessors,
              as: 'class_assessors',
              attributes: [],
            },
          ],
        },
        {
          model: this.groupActivityPartModel,
          as: 'gr_act_part',
          required: true,
          include: [
            {
              model: Participants,
              as: 'participants',
              where: Object.keys(participantWhere).length
                ? participantWhere
                : undefined,
              required: true,
              include: [
                {
                  model: Cohorts,
                  as: 'cohorts',
                  include: [
                    {
                      model: this.classModel,
                      as: 'class',
                      include: [
                        {
                          model: Clients,
                          as: 'client',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: this.groupActivityRoomsModel,
              as: 'gr_act_rooms',
            },
          ],
        },
      ],
    });

    // const partiAssessmentsArr = Array.isArray(partiAssessments) ? partiAssessments : [];
    // const grpActPartArr = Array.isArray(grp_act_part) ? grp_act_part : [];

    const merged = [
      ...partiAssessments.map((item) => ({
        type: 'individual',
        ...item.toJSON(),
      })),
      ...grp_act_part.map((item) => ({
        type: 'group',
        ...item.toJSON(),
      })),
    ];

    return {
      // rows: merged,
      // count: merged.length,
      rows: partiAssessments,
      count: partiAssessments.length,
    };
  }

  // async uploadFile(
  //   audioFile: Express.Multer.File,
  //   responseId: string,
  //   assessment_id: string,
  // ): Promise<string> {
  //   try {
  //     const directory = path.join(
  //       __dirname,
  //       '..',
  //       '..',
  //       '..',
  //       '..',
  //       'public',
  //       'uploads',
  //       'audio',
  //     );
  //     if (!fs.existsSync(directory)) {
  //       fs.mkdirSync(directory, { recursive: true });
  //     }

  //     const fileName = `${assessment_id}-${audioFile.originalname}`;
  //     const filePath = path.join(directory, fileName);

  //     fs.writeFileSync(filePath, audioFile.buffer);

  //     const assessmentResponse =
  //       await this.assessmentReponseModel.findByPk(responseId);

  //     if (!assessmentResponse) {
  //       throw new HttpException(
  //         `Assessment response ID not found`,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     assessmentResponse.audio_file = filePath;
  //     await assessmentResponse.save();

  //     return filePath;
  //   } catch (error) {
  //     throw new HttpException(
  //       `Failed to upload file: ${error.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async uploadFile(
    audioFile: Express.Multer.File,
    responseId: string,
  ): Promise<string> {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
      throw new HttpException(
        'S3 bucket name is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const fileName = `${responseId}-${audioFile.originalname}`;
    const fileKey = `audio/${fileName}`;

    try {
      const uploadResult = await s3
        .upload({
          Bucket: bucketName,
          Key: fileKey,
          Body: audioFile.buffer,
          ContentType: audioFile.mimetype,
          // ACL: 'public-read',
        })
        .promise();

      const assessmentResponse =
        await this.assessmentReponseModel.findByPk(responseId);

      if (!assessmentResponse) {
        throw new HttpException(
          `Assessment response ID not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      assessmentResponse.audio_file = uploadResult.Location;
      await assessmentResponse.save();

      // const nullaudio = await this.assessmentReponseModel.findOne({
      //  where:{
      //   id: responseId,
      //   audio_file: {
      //     [Op.is]: null
      //   }
      //  } as any
      // });

      // if (nullaudio) {
      //   await nullaudio.destroy();
      // }

      return uploadResult.Location;
    } catch (error) {
      // const assessmentResponse =
      //   await this.assessmentReponseModel.findByPk(responseId);

      // if (assessmentResponse) {
      //   await assessmentResponse.destroy();
      // }
      throw new HttpException(
        `Failed to upload file to S3: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async callPostLambda(
    assessment_id: string,
    commentary: string,
  ): Promise<any> {
    if (commentary == '' || commentary == null || commentary == undefined) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Commentary is empty',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      assessment_id == '' ||
      assessment_id == null ||
      assessment_id == undefined
    ) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Assessment ID is empty',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let data = {
      assessment_id: assessment_id,
      commentary: commentary,
    };
    try {
      await axios.post(
        'https://sxg25xbl5u2tz3xoekm3fgsxwe0tjeth.lambda-url.us-east-1.on.aws/analyze',
        data,
      );
    } catch (error) {
      // console.error(error)
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: error.response.data.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Assessors view..
  async createAssessmentWithResponses(
    data: CreateAssessmentWithResponses,
  ): Promise<any> {
    // const transaction = await this.sequelize.transaction();
    let transaction: Transaction | null = await this.sequelize.transaction();

    try {
      const existingPart = await this.assessmentReponseModel.findOne({
        where: {
          [Op.and]: [
            { participant_id: data.participant_id },
            { assessment_id: data.assessment_id },
            { par_ass_id: data.par_ass_id },
          ],
        },
      });

      if (existingPart) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Particiapnt Score Already Exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const assResponse = await this.assessmentReponseModel.create(
        {
          commentary: data.commentary,
          class_id: data.class_id,
          participant_id: data.participant_id,
          assessor_id: data.assessor_id,
          assessment_id: data.assessment_id,
          status: data.is_draft,
          par_ass_id: data.par_ass_id,
        } as AssessmentResponse,
        { transaction, returning: true },
      );

      const score = data.response_score.map(
        (res) =>
          ({
            observation: res.observation,
            summary: res.summary,
            // score: res.score,
            competency_id: res.competency_id,
            assessment_response: assResponse.id,
          }) as unknown as ParticipantScore,
      );

      const insertedScores = await this.participantScoreModel.bulkCreate(
        score,
        { transaction, returning: true },
      );

      const assessorMeetScore = insertedScores.map(
        (inserted, index) =>
          ({
            observation: inserted.observation,
            score: data.response_score[index].score,
            assessor_id: data.assessor_id,
            assem_resp_id: assResponse.id,
            part_score_id: inserted.id,
          }) as unknown as AssessorsMeetScore,
      );

      await this.assessorMeetScoreModel.bulkCreate(assessorMeetScore, {
        transaction,
      });

      const assessmAssessor = await this.classAssessmentsAssessorsModel.findOne(
        {
          where: {
            [Op.and]: [
              { participant_assessment_id: data.par_ass_id },
              { assessors_id: data.assessor_id },
            ],
          },
        },
      );

      assessmAssessor?.update({
        over_all_obs: data.over_all_obs,
      });

      if (data.is_draft == 'completed') {
        if (assessmAssessor?.assessor_status) {
          assessmAssessor.assessor_status = 'completed' as progressStatus;
          await assessmAssessor.save({ transaction });
        } else {
          throw new HttpException(
            'Participant Assessment Assessor not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      if (data.is_draft == 'inprogress') {
        if (assessmAssessor?.assessor_status) {
          assessmAssessor.assessor_status = 'inprogress' as progressStatus;
          await assessmAssessor.save({ transaction });
        } else {
          throw new HttpException(
            'Participant Assessment Assessor not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      const partAssessments = await this.participantsAssessmentsModel.findOne({
        where: {
          id: data.par_ass_id,
        },
      });

      if (!partAssessments) {
        throw new HttpException(
          {
            message: 'Participant Assessment Not Found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (data.is_draft == 'completed') {
        if (partAssessments?.assessor_status) {
          partAssessments.assessor_status = 'completed' as progressStatus;
          await partAssessments.save({ transaction });
        } else {
          throw new HttpException(
            'Participant Assessment Assessor not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      if (data.is_draft == 'inprogress') {
        if (partAssessments?.assessor_status) {
          partAssessments.assessor_status = 'inprogress' as progressStatus;
          await partAssessments.save({ transaction });
        } else {
          throw new HttpException(
            'Participant Assessment Assessor not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      // const assessmAllAssessor =
      //   await this.classAssessmentsAssessorsModel.findAll({
      //     where: {
      //       participant_assessment_id: data.par_ass_id,
      //     },
      //     transaction,
      //   });

      // const scoredAssessors = assessmAllAssessor.some((assessor) => {
      //   return assessor.assessor_status === ('completed' as progressStatus);
      // });

      // if (scoredAssessors) {
      //   const partAssessments = await this.participantsAssessmentsModel.findOne(
      //     {
      //       where: {
      //         id: data.par_ass_id,
      //       },
      //     },
      //   );

      //   if (!partAssessments) {
      //     throw new HttpException(
      //       {
      //         message: 'Participant Assessment Not Found',
      //       },
      //       HttpStatus.BAD_REQUEST,
      //     );
      //   }

      //   partAssessments.assessor_status = 'completed' as progressStatus;
      //   await partAssessments.save({ transaction });
      // }

      await transaction.commit();
      transaction = null;

      // **************************************************************************************

      // const participant = await this.participantModel.findOne({
      //   include: [
      //     {
      //       model: this.participantsAssessmentsModel,
      //       as: 'par_as',
      //       where: {
      //         class_id: data.class_id,
      //         participant_id: data.participant_id,
      //       },
      //     },
      //   ],
      // });

      // if (!participant) {
      //   throw new HttpException(
      //     {
      //       status: 400,
      //       success: false,
      //       message: 'Participant Not found',
      //     },
      //     HttpStatus.BAD_GATEWAY,
      //   );
      // }

      // const partAllAssessments =
      //   await this.participantsAssessmentsModel.findAll({
      //     where: {
      //       class_id: data.class_id,
      //       participant_id: participant.id,
      //     },
      //   });

      // const allCompletedAssm = partAllAssessments.every(
      //   (assessment) =>
      //     assessment.assessor_status === ('completed' as progressStatus),
      // );

      // const partGroupAct = await this.groupActivityRoomsModel.findAll({
      //   where: {
      //     class_id: data.class_id,
      //   },
      //   include: [
      //     {
      //       model: this.groupActivityPartModel,
      //       as: 'gr_act_part',
      //       where: { part_id: participant.id },
      //     },
      //   ],
      // });
      // const allCompletedGrpAssm = partGroupAct.every(
      //   (assessment) =>
      //     assessment.assessor_status === ('completed' as progressStatus),
      // );
      // if (allCompletedAssm && allCompletedGrpAssm) {
      //   await this.reportService.averageCompScore(
      //     participant.id,
      //     data.class_id,
      //   );
      //   try {
      //     axios.get(
      //       `https://t7ttysqf4dbv5xnzfmzd5uc4kq0zkzqe.lambda-url.us-east-1.on.aws/?participant_id=${participant.id}`,
      //     );
      //   } catch (err) {
      //     console.error('Failed to call Lambda URL:', err);
      //   }
      // }

      // class status update

      const allPartAssessments =
        await this.participantsAssessmentsModel.findAll({
          where: {
            class_id: data.class_id,
          },
        });

      const allParCompletedAssm = allPartAssessments.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      const allPartGroupAct = await this.groupActivityRoomsModel.findAll({
        where: {
          class_id: data.class_id,
        },
      });
      const allParCompletedGrpAssm = allPartGroupAct.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      if (allParCompletedAssm && allParCompletedGrpAssm) {
        const classInstance = await this.classModel.findByPk(data.class_id);
        if (classInstance) {
          await classInstance.update({
            status: 'completed' as progressStatus,
          });
        }
      }
      // part pdf status update
      const partAssessment = await this.participantsAssessmentsModel.findOne({
        where: {
          [Op.and]: {
            participant_id: data.participant_id,
            assessment_id: data.assessment_id,
          },
        },
      });
      if (partAssessment) {
        partAssessment.assess_now = false;
      }
      await partAssessment?.save();

      return { assResponse, score };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new HttpException(
        `Failed to create assessment with responses: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Assessors view..
  async updateAssessmentWithResponses(
    assessmentResponseId: string,
    data: UpdateAssessmentWithResponsesDto,
  ): Promise<any> {
    // const transaction = await this.sequelize.transaction();
    let transaction: Transaction | null = await this.sequelize.transaction();

    try {
      const assessmentResponse =
        await this.assessmentReponseModel.findByPk(assessmentResponseId);

      if (!assessmentResponse) {
        throw new HttpException(
          `Assessment response with ID ${assessmentResponseId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const existingAssessorScore = await this.assessorMeetScoreModel.findOne({
        where: {
          [Op.and]: [
            { assessor_id: data.assessor_id },
            { assem_resp_id: assessmentResponseId },
          ],
        },
      });

      if (!existingAssessorScore) {
        const assessorMeetScore = data.response_score.map(
          (inserted, index) =>
            ({
              observation: inserted.observation,
              score: inserted.score,
              assessor_id: data.assessor_id,
              assem_resp_id: assessmentResponseId,
              part_score_id: inserted.id,
            }) as unknown as AssessorsMeetScore,
        );

        await this.assessorMeetScoreModel.bulkCreate(assessorMeetScore, {
          transaction,
        });
      }

      for (const score of data.response_score) {
        if (data.is_draft === ('completed' as progressStatus)) {
          if (
            score.score === '' ||
            score.score === null ||
            score.score === undefined
          ) {
            throw new HttpException(
              {
                status: 400,
                success: false,
                message: 'Score Should not be Empty',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }

        if (existingAssessorScore) {
          const assessorScore = await this.assessorMeetScoreModel.findOne({
            where: {
              part_score_id: score.id,
              assessor_id: data.assessor_id,
            },
          });

          if (!assessorScore) {
            throw new HttpException(
              `Participant score with ID ${score.id} not found`,
              HttpStatus.NOT_FOUND,
            );
          }

          await assessorScore.update(
            {
              observation: score.observation,
              score: score.score,
            },
            { transaction },
          );
        }
        // Multi Assessor-----------------
      }

      const assessmAssessor = await this.classAssessmentsAssessorsModel.findOne(
        {
          where: {
            [Op.and]: [
              { participant_assessment_id: data.par_ass_id },
              { assessors_id: data.assessor_id },
            ],
          },
        },
      );

      assessmAssessor?.update({
        over_all_obs: data.over_all_obs,
      });

      if (data.is_draft == 'completed') {
        if (assessmAssessor?.assessor_status) {
          assessmAssessor.assessor_status = 'completed' as progressStatus;
          await assessmAssessor.save({ transaction });
        } else {
          throw new HttpException(
            'Participant assessment not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      if (data.is_draft == 'inprogress') {
        if (assessmAssessor?.assessor_status) {
          assessmAssessor.assessor_status = 'inprogress' as progressStatus;
          await assessmAssessor.save({ transaction });
        } else {
          throw new HttpException(
            'Participant assessment not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      const partAssessments = await this.participantsAssessmentsModel.findOne({
        where: {
          id: data.par_ass_id,
        },
      });

      if (!partAssessments) {
        throw new HttpException(
          {
            message: 'Participant Assessment Not Found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (data.is_draft == 'completed') {
        if (partAssessments?.assessor_status) {
          partAssessments.assessor_status = 'completed' as progressStatus;
          await partAssessments.save({ transaction });
        } else {
          throw new HttpException(
            'Participant Assessment Assessor not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      if (data.is_draft == 'inprogress') {
        if (partAssessments?.assessor_status) {
          partAssessments.assessor_status = 'inprogress' as progressStatus;
          await partAssessments.save({ transaction });
        } else {
          throw new HttpException(
            'Participant Assessment Assessor not found',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      // const assessmAllAssessor =
      //   await this.classAssessmentsAssessorsModel.findAll({
      //     where: {
      //       participant_assessment_id: data.par_ass_id,
      //     },
      //     transaction,
      //   });

      // const scoredAssessors = assessmAllAssessor.some((assessor) => {
      //   return assessor.assessor_status === 'completed';
      // });

      // if (scoredAssessors) {
      //   const partAssessments = await this.participantsAssessmentsModel.findOne(
      //     {
      //       where: {
      //         id: data.par_ass_id,
      //       },
      //     },
      //   );

      //   if (!partAssessments) {
      //     throw new HttpException(
      //       {
      //         message: 'Participant Assessment Not Found',
      //       },
      //       HttpStatus.BAD_REQUEST,
      //     );
      //   }

      //   partAssessments.assessor_status = 'completed' as progressStatus;
      //   partAssessments.participant_status = progressStatus.COMPLETED;
      //   await partAssessments.save({ transaction });
      //   console.log(partAssessments);
      // }

      await transaction.commit();
      transaction = null;

      // ******************************************************************************************
      // const participant = await this.participantModel.findOne({
      //   include: [
      //     {
      //       model: this.participantsAssessmentsModel,
      //       as: 'par_as',
      //       where: {
      //         class_id: data.class_id,
      //         participant_id: data.participant_id,
      //       },
      //     },
      //   ],
      // });

      // if (!participant) {
      //   throw new HttpException(
      //     {
      //       status: 400,
      //       success: false,
      //       message: 'Participant Not found',
      //     },
      //     HttpStatus.BAD_GATEWAY,
      //   );
      // }

      // const partAllAssessments =
      //   await this.participantsAssessmentsModel.findAll({
      //     where: {
      //       class_id: data.class_id,
      //       participant_id: participant.id,
      //     },
      //   });

      // const allCompletedAssm = partAllAssessments.every(
      //   (assessment) =>
      //     assessment.assessor_status === ('completed' as progressStatus),
      // );

      // const partGroupAct = await this.groupActivityRoomsModel.findAll({
      //   where: {
      //     class_id: data.class_id,
      //   },
      //   include: [
      //     {
      //       model: this.groupActivityPartModel,
      //       as: 'gr_act_part',
      //       where: { part_id: participant.id },
      //     },
      //   ],
      // });
      // const allCompletedGrpAssm = partGroupAct.every(
      //   (assessment) =>
      //     assessment.assessor_status === ('completed' as progressStatus),
      // );
      // if (allCompletedAssm && allCompletedGrpAssm) {
      //   await this.reportService.averageCompScore(
      //     participant.id,
      //     data.class_id,
      //   );
      //   try {
      //     axios.get(
      //       `https://t7ttysqf4dbv5xnzfmzd5uc4kq0zkzqe.lambda-url.us-east-1.on.aws/?participant_id=${participant.id}`,
      //     );
      //   } catch (err) {
      //     console.error('Failed to call Lambda URL:', err);
      //   }
      // }

      // class status update
      const allPartAssessments =
        await this.participantsAssessmentsModel.findAll({
          where: {
            class_id: data.class_id,
          },
        });

      const allParCompletedAssm = allPartAssessments.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      const allPartGroupAct = await this.groupActivityRoomsModel.findAll({
        where: {
          class_id: data.class_id,
        },
      });
      const allParCompletedGrpAssm = allPartGroupAct.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      if (allParCompletedAssm && allParCompletedGrpAssm) {
        const classInstance = await this.classModel.findByPk(data.class_id);
        if (classInstance) {
          await classInstance.update({
            status: 'completed' as progressStatus,
          });
        }
      }

      //-=-=- new=-=-=-=
      // part pdf status update
      const partAssessment = await this.participantsAssessmentsModel.findOne({
        where: {
          [Op.and]: {
            participant_id: data.participant_id,
            assessment_id: data.assessment_id,
          },
        },
      });
      if (partAssessment) {
        partAssessment.assess_now = false;
      }
      await partAssessment?.save();

      // ===============================================================

      return {
        success: true,
        message: 'Assessment scores updated successfully',
      };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new HttpException(
        `Failed to update assessment scores: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAssessmentAiSummary(
    assessmentResponseId: string,
    commentary: string,
    data: UpdateAssessmentAISummaryDto,
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try {
      const assessmentResponse =
        await this.assessmentReponseModel.findByPk(assessmentResponseId);

      if (!assessmentResponse) {
        throw new HttpException(
          `Assessment response with ID ${data.assessment_response_id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      await assessmentResponse.update(
        {
          commentary: commentary,
        },
        { transaction },
      );

      for (const score of data.response_score) {
        const participantScore = await this.participantScoreModel.findByPk(
          score.id,
          { transaction },
        );

        if (!participantScore) {
          throw new HttpException(
            `Participant score with ID ${score.id} not found`,
            HttpStatus.NOT_FOUND,
          );
        }

        await participantScore.update(
          {
            summary: score.summary,
          },
          { transaction },
        );
      }

      // await this.participantScoreModel.bulkCreate(data.response_score.map((sc)=>({
      //   id: sc.id,
      //   summary: sc.summary,
      //   competency_id: sc.competency_id,
      //   // assessment_response: "eeb5f5f8-8a5b-4da6-bd47-9cbaa3712c79"
      // })) as  CreationAttributes<ParticipantScore>[]),
      //  {
      //       updateOnDuplicate: ['summary'],
      //       transaction,
      //     },

      await transaction.commit();
      return {
        success: true,
        message: 'Assessment AI Summary updated successfully',
      };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new HttpException(
        `Failed to update assessment AI Summary: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Assessors view..
  async createAssessmentWithResponsesGrpAct(
    // grpActRoomId:string,
    // observation: string,
    data: CreateAssessmentWithResponses[],
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try {
      const results: {
        assResponse: AssessmentResponse;
        score: ParticipantScore[];
      }[] = [];
      let classIdForCheck: string | undefined = undefined;

      for (const item of data) {
        const existingPart = await this.assessmentReponseModel.findOne({
          where: {
            [Op.and]: [
              { participant_id: item.participant_id },
              { assessment_id: item.assessment_id },
              { gr_act_room_id: item.gr_act_room_id },
            ],
          },
        });
        if (existingPart) {
          throw new HttpException(
            {
              status: 400,
              success: false,
              message: 'Particiapnt Record Already Exists.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        const assResponse = await this.assessmentReponseModel.create(
          {
            class_id: item.class_id,
            participant_id: item.participant_id,
            assessor_id: item.assessor_id,
            assessment_id: item.assessment_id,
            status: item.is_draft,
            par_ass_id: item.par_ass_id,
            grp_act_remark: item.grp_act_remark,
            gr_act_room_id: item.gr_act_room_id,
          } as AssessmentResponse,
          { transaction },
        );

        const score = item.response_score.map(
          (res) =>
            ({
              // score: res.score,
              competency_id: res.competency_id,
              assessment_response: assResponse.id,
            }) as ParticipantScore,
        );

        const insertedScores = await this.participantScoreModel.bulkCreate(
          score,
          { transaction, returning: true },
        );

        const assessorMeetScore = insertedScores.map(
          (inserted, index) =>
            ({
              observation: item.response_score[index].observation,
              score: item.response_score[index].score,
              assessor_id: item.assessor_id,
              assem_resp_id: assResponse.id,
              part_score_id: inserted.id,
            }) as unknown as AssessorsMeetScore,
        );

        await this.assessorMeetScoreModel.bulkCreate(assessorMeetScore, {
          transaction,
        });

        const partAssessments = await this.groupActivityRoomsModel.findOne({
          where: {
            class_id: item.class_id,
            scenerio_id: item.scenerio_id,
          },
        });

        if (!partAssessments) {
          throw new HttpException(
            'Participant Group Activity assessment not found',
            HttpStatus.NOT_FOUND,
          );
        }
        // ************************************************************************************************
        // if (item.is_draft == 'completed') {
        //   partAssessments.assessor_status = 'completed' as progressStatus;
        // } else if (item.is_draft == 'inprogress') {
        //   partAssessments.assessor_status = 'inprogress' as progressStatus;
        // } else if (item.is_draft == 'pending') {
        //   partAssessments.assessor_status = 'pending' as progressStatus;
        // }

        if (!partAssessments) {
          throw new HttpException(
            {
              message: 'Participant Assessment Not Found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (item.is_draft == 'completed') {
          if (partAssessments?.assessor_status) {
            partAssessments.assessor_status = 'completed' as progressStatus;
            await partAssessments.save({ transaction });
          } else {
            throw new HttpException(
              'Participant Assessment Assessor not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (item.is_draft == 'inprogress') {
          if (partAssessments?.assessor_status) {
            partAssessments.assessor_status = 'inprogress' as progressStatus;
            await partAssessments.save({ transaction });
          } else {
            throw new HttpException(
              'Participant Assessment Assessor not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        const assessmAssessor =
          await this.classAssessmentsAssessorsModel.findOne({
            where: {
              [Op.and]: [
                { gr_act_room: item.gr_act_room_id },
                { assessors_id: item.assessor_id },
              ],
            },
          });

        // assessmAssessor?.update({
        //   over_all_obs: observation
        // })

        if (item.is_draft == 'completed') {
          if (assessmAssessor?.assessor_status) {
            assessmAssessor.assessor_status = 'completed' as progressStatus;
            await assessmAssessor.save({ transaction });
          } else {
            throw new HttpException(
              'Participant assessment not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (item.is_draft == 'inprogress') {
          if (assessmAssessor?.assessor_status) {
            assessmAssessor.assessor_status = 'inprogress' as progressStatus;
            await assessmAssessor.save({ transaction });
          } else {
            throw new HttpException(
              'Participant assessment not found ----inprogress',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        // const assessmAllAssessor =
        //   await this.classAssessmentsAssessorsModel.findAll({
        //     where: {
        //       gr_act_room: item.gr_act_room_id,
        //     },
        //     transaction,
        //   });

        // const scoredAssessors = assessmAllAssessor.some((assessor) => {
        //   return assessor.assessor_status === ('completed' as progressStatus);
        // });

        // if (scoredAssessors) {
        //   const partAssessments = await this.groupActivityRoomsModel.findOne({
        //     where: {
        //       // class_id: item.class_id,
        //       // scenerio_id: item.scenerio_id,
        //       id: item.gr_act_room_id,
        //     },
        //   });

        //   if (!partAssessments) {
        //     throw new HttpException(
        //       {
        //         message: 'Participant Assessment Not Found',
        //       },
        //       HttpStatus.BAD_REQUEST,
        //     );
        //   }

        //   partAssessments.assessor_status = 'completed' as progressStatus;
        //   await partAssessments.save({ transaction });
        // }
        // ************************************************************************************************

        partAssessments.participant_status = progressStatus.COMPLETED;
        await partAssessments.save({ transaction });

        results.push({ assResponse, score });
      }

      await transaction.commit();

      // ===============================================================
      // const participants = await this.groupActivityPartModel.findAll({
      //   include: [
      //     {
      //       model: this.groupActivityRoomsModel,
      //       as: 'gr_act_rooms',
      //       where: {
      //         class_id: data[0].class_id,
      //       },
      //     },
      //   ],
      // });

      // for (const participant of participants) {
      //   const partAllAssessments =
      //     await this.participantsAssessmentsModel.findAll({
      //       where: {
      //         class_id: data[0].class_id,
      //         participant_id: participant.part_id,
      //       },
      //     });

      //   const allCompletedAssm = partAllAssessments.every(
      //     (assessment) =>
      //       assessment.assessor_status === ('completed' as progressStatus),
      //   );

      //   const partGroupAct = await this.groupActivityRoomsModel.findAll({
      //     where: {
      //       class_id: data[0].class_id,
      //     },
      //     include: [
      //       {
      //         model: this.groupActivityPartModel,
      //         as: 'gr_act_part',
      //         where: { part_id: participant.part_id },
      //       },
      //     ],
      //   });
      //   const allCompletedGrpAssm = partGroupAct.every(
      //     (assessment) =>
      //       assessment.assessor_status === ('completed' as progressStatus),
      //   );
      //   if (allCompletedAssm && allCompletedGrpAssm) {
      //     await this.reportService.averageCompScore(
      //       participant.part_id,
      //       data[0].class_id,
      //     );
      //     try {
      //       axios.get(
      //         `https://t7ttysqf4dbv5xnzfmzd5uc4kq0zkzqe.lambda-url.us-east-1.on.aws/?participant_id=${participant.part_id}`,
      //       );
      //     } catch (err) {
      //       console.error('Failed to call Lambda URL:', err);
      //     }
      //   }
      // }

      // class status update

      const allPartAssessments =
        await this.participantsAssessmentsModel.findAll({
          where: {
            class_id: data[0].class_id,
          },
        });

      const allPartCompletedAssm = allPartAssessments.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      const allPartGroupAct = await this.groupActivityRoomsModel.findAll({
        where: {
          class_id: data[0].class_id,
        },
      });
      const allPartCompletedGrpAssm = allPartGroupAct.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      if (allPartCompletedAssm && allPartCompletedGrpAssm) {
        const classInstance = await this.classModel.findByPk(data[0].class_id);
        if (classInstance) {
          await classInstance.update({
            status: 'completed' as progressStatus,
          });
        }
      }

      // part pdf status update
      const partAssessment = await this.participantsAssessmentsModel.findOne({
        where: {
          [Op.and]: {
            participant_id: data.map((item) => item.participant_id),
            assessment_id: data[0].assessment_id,
          },
        },
      });
      if (partAssessment) {
        partAssessment.assess_now = false;
      }
      await partAssessment?.save();

      // ===============================================================

      return {
        data: results,
      };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(
        `Failed to create bulk group assessment responses: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Assessors view..
  async updateAssessmentWithResponsesGrpAct(
    grpActRoom: string,
    // observation: string,
    data: UpdateAssessmentWithResponsesDto[],
  ): Promise<any> {
    // const transaction = await this.sequelize.transaction();

    let transaction: Transaction | null = await this.sequelize.transaction();
    try {
      const existingAssessorScore = await this.assessorMeetScoreModel.findAll({
        where: {
          [Op.and]: [
            { assessor_id: data[0].assessor_id },
            { assem_resp_id: data[0].assessment_response },
          ],
        },
      });

      for (const item of data) {
        if (existingAssessorScore.length < 0) {
          const assessorMeetScore = existingAssessorScore.map(
            (inserted, index) =>
              ({
                observation: item.response_score[index].observation,
                score: item.response_score[index].score,
                assessor_id: item.assessor_id,
                assem_resp_id: data[0].assessment_response,
                part_score_id: inserted.part_score_id,
              }) as unknown as AssessorsMeetScore,
          );

          await this.assessorMeetScoreModel.bulkCreate(assessorMeetScore, {
            transaction,
          });
        }
        const assessmentResponse = await this.assessmentReponseModel.findByPk(
          item.assessment_response,
          { transaction },
        );
        if (!assessmentResponse) {
          throw new HttpException(
            `Assessment response with ID ${item.assessment_response} not found`,
            HttpStatus.NOT_FOUND,
          );
        }
        await assessmentResponse.update(
          {
            grp_act_remark: item.grp_act_remark,
          },
          { transaction },
        );

        for (const score of item.response_score) {
          if (item.is_draft === ('completed' as progressStatus)) {
            if (
              score.score === '' ||
              score.score === null ||
              score.score === undefined
            ) {
              throw new HttpException(
                {
                  status: 400,
                  success: false,
                  message: 'Score Should not be Empty',
                },
                HttpStatus.BAD_REQUEST,
              );
            }
          }
          // const participantScore = await this.participantScoreModel.findByPk(
          //   score.id,
          //   { transaction },
          // );
          // if (!participantScore) {
          //   throw new HttpException(
          //     `Participant score with ID ${score.id} not found`,
          //     HttpStatus.NOT_FOUND,
          //   );
          // }
          // await participantScore.update(
          //   {
          //     score: score.score,
          //   },
          //   { transaction },
          // );

          if (existingAssessorScore.length > 0) {
            const assessorScore = await this.assessorMeetScoreModel.findOne({
              where: {
                part_score_id: score.id,
                assessor_id: data[0].assessor_id,
              },
            });

            if (!assessorScore) {
              throw new HttpException(
                `Participant score with ID ${score.id} not found`,
                HttpStatus.NOT_FOUND,
              );
            }

            await assessorScore.update(
              {
                observation: score.observation,
                score: score.score,
              },
              { transaction },
            );
          }
        }

        const partAssessments = await this.groupActivityRoomsModel.findOne({
          where: {
            [Op.and]: [
              { class_id: item.class_id },
              { id: grpActRoom },
              { scenerio_id: item.scenerio_id },
            ],
          },
        });

        if (!partAssessments) {
          throw new HttpException(
            'Participant assessment not found',
            HttpStatus.NOT_FOUND,
          );
        }
        // ************************************************************************************************
        // if (item.is_draft == 'completed') {
        //   partAssessments.assessor_status = 'completed' as progressStatus;
        // } else if (item.is_draft == 'inprogress') {
        //   partAssessments.assessor_status = 'inprogress' as progressStatus;
        // } else if (item.is_draft == 'pending') {
        //   partAssessments.assessor_status = 'pending' as progressStatus;
        // }

        if (!partAssessments) {
          throw new HttpException(
            {
              message: 'Participant Assessment Not Found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (item.is_draft == 'completed') {
          if (partAssessments?.assessor_status) {
            partAssessments.assessor_status = 'completed' as progressStatus;
            await partAssessments.save({ transaction });
          } else {
            throw new HttpException(
              'Participant Assessment Assessor not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (item.is_draft == 'inprogress') {
          if (partAssessments?.assessor_status) {
            partAssessments.assessor_status = 'inprogress' as progressStatus;
            await partAssessments.save({ transaction });
          } else {
            throw new HttpException(
              'Participant Assessment Assessor not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        const assessmAssessor =
          await this.classAssessmentsAssessorsModel.findOne({
            where: {
              [Op.and]: [
                { gr_act_room: grpActRoom },
                { assessors_id: item.assessor_id },
              ],
            },
          });

        // assessmAssessor?.update({
        //   over_all_obs: observation
        // })

        if (item.is_draft == 'completed') {
          if (assessmAssessor?.assessor_status) {
            assessmAssessor.assessor_status = 'completed' as progressStatus;
            await assessmAssessor.save({ transaction });
          } else {
            throw new HttpException(
              'Participant assessment not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (item.is_draft == 'inprogress') {
          if (assessmAssessor?.assessor_status) {
            assessmAssessor.assessor_status = 'inprogress' as progressStatus;
            await assessmAssessor.save({ transaction });
          } else {
            throw new HttpException(
              'Participant assessment not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        await transaction?.commit();
        transaction = null;

        //   const assessmAllAssessor =
        //     await this.classAssessmentsAssessorsModel.findAll({
        //       where: {
        //         gr_act_room: grpActRoom,
        //       },
        //       transaction,
        //     });

        //   const scoredAssessors = assessmAllAssessor.some((assessor) => {
        //     return assessor.assessor_status === ('completed' as progressStatus);
        //   });

        //   if (scoredAssessors) {
        //     const partAssessments = await this.groupActivityRoomsModel.findOne({
        //       where: {
        //         // class_id: item.class_id,
        //         // scenerio_id: item.scenerio_id,
        //         id: grpActRoom,
        //       },
        //     });

        //     if (!partAssessments) {
        //       throw new HttpException(
        //         {
        //           message: 'Participant Assessment Not Found',
        //         },
        //         HttpStatus.BAD_REQUEST,
        //       );
        //     }

        //     partAssessments.assessor_status = 'completed' as progressStatus;
        //     await partAssessments.save({ transaction });
        //   }

        partAssessments.participant_status = progressStatus.COMPLETED;
        await partAssessments.save({ transaction });
      }
      await transaction?.commit();

      // class status update
      const allPartAssessments =
        await this.participantsAssessmentsModel.findAll({
          where: {
            class_id: data[0].class_id,
          },
        });

      const allPartCompletedAssm = allPartAssessments.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      const allPartGroupAct = await this.groupActivityRoomsModel.findAll({
        where: {
          class_id: data[0].class_id,
        },
      });
      const allPartCompletedGrpAssm = allPartGroupAct.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      if (allPartCompletedAssm && allPartCompletedGrpAssm) {
        const classInstance = await this.classModel.findByPk(data[0].class_id);
        if (classInstance) {
          await classInstance.update({
            status: 'completed' as progressStatus,
          });
        }
      }

      // part pdf status update
      const partAssessment = await this.participantsAssessmentsModel.findOne({
        where: {
          [Op.and]: {
            participant_id: data.map((item) => item.participant_id),
            assessment_id: data[0].assessment_id,
          },
        },
      });
      if (partAssessment) {
        partAssessment.assess_now = false;
      }
      await partAssessment?.save();
      // ===============================================================

      return {
        success: true,
        message:
          'Assessment scores and group activity remarks updated successfully',
      };
    } catch (error) {
      await transaction?.rollback();
      throw new HttpException(
        `Failed to update assessment scores: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // part view
  async createQuessionnaireResponsesPart(
    data: CreateAssessmentWithResponses,
  ): Promise<any> {
    // const transaction = await this.sequelize.transaction();
    let transaction: Transaction | null = await this.sequelize.transaction();

    try {
      const assResponse = await this.assessmentReponseModel.create(
        {
          class_id: data.class_id,
          participant_id: data.participant_id,
          assessor_id: data.assessor_id,
          assessment_id: data.assessment_id,
          status: data.is_draft,
          par_ass_id: data.par_ass_id,
        } as AssessmentResponse,
        { transaction, returning: true },
      );

      const partResp = data.response_score.map(
        (res) =>
          ({
            // score: res.score,
            competency_id: res.competency_id,
            assessm_resp_id: assResponse.id,
            response: res.response,
            question_id: res.question_id,
            quessionaire_id: res.quessionaire_id,
          }) as QuessionnaireResponse,
      );
      const insertedResp = await this.quessResponseModel.bulkCreate(
        partResp as any,
        { transaction, returning: true },
      );

      const uniqueScoresMap = new Map();

      for (const res of data.response_score) {
        if (!uniqueScoresMap.has(res.competency_id)) {
          uniqueScoresMap.set(res.competency_id, {
            competency_id: res.competency_id,
            assessment_response: assResponse.id,
            // quess_response: res.quess_response,
            // question_id: res.question_id,
            // quessionaire_id: res.quessionaire_id,
          } as ParticipantScore);
        }
      }

      const score = Array.from(uniqueScoresMap.values());

      const insertedUniqueCompScores =
        await this.participantScoreModel.bulkCreate(score, {
          transaction,
          returning: true,
        });

      const partAssessments = await this.participantsAssessmentsModel.findOne({
        where: {
          [Op.and]: [
            { assessment_id: data.assessment_id },
            { participant_id: data.participant_id },
            {
              quessionnaire_id: data.quessionnaire_id,
            },
          ],
        },
      });

      if (!partAssessments) {
        throw new HttpException(
          'Participant assessment not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (data.role === 'participant') {
        if (data.is_draft == 'completed') {
          partAssessments.participant_status = 'completed' as progressStatus;
        } else if (data.is_draft == 'inprogress') {
          partAssessments.participant_status = 'inprogress' as progressStatus;
        } else if (data.is_draft == 'pending') {
          partAssessments.participant_status = 'pending' as progressStatus;
        }
      }

      await partAssessments.save({ transaction });
      await transaction.commit();
      transaction = null;
      return { assResponse, score, insertedResp };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new HttpException(
        `Failed to create assessment with responses: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // part view
  async updatePartRersp(data: UpdatePartQuessResp): Promise<any> {
    let transaction: Transaction | null = await this.sequelize.transaction();

    try {
      const updateResp = await this.quessResponseModel.bulkCreate(
        data.response.map((rs) => ({
          id: rs.id,
          response: rs.response,
          question_id: rs.quessionaire_id,
          quessionaire_id: rs.quessionaire_id,
          assessm_resp_id: rs.assessm_resp_id,
          competency_id: rs.competency_id,
        })) as CreationAttributes<QuessionnaireResponse>[],
        {
          updateOnDuplicate: ['response'],
        },
      );

      const partAssessments = await this.participantsAssessmentsModel.findOne({
        where: {
          [Op.and]: [
            { assessment_id: data.assessment_id },
            { participant_id: data.participant_id },
            {
              quessionnaire_id: data.response[0].quessionaire_id,
            },
          ],
        },
      });

      if (!partAssessments) {
        throw new HttpException(
          'Participant assessment not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (data.role === 'participant') {
        if (data.is_draft == 'completed') {
          partAssessments.participant_status = 'completed' as progressStatus;
        } else if (data.is_draft == 'inprogress') {
          partAssessments.participant_status = 'inprogress' as progressStatus;
        } else if (data.is_draft == 'pending') {
          partAssessments.participant_status = 'pending' as progressStatus;
        }
      }

      await partAssessments.save({ transaction });
      await transaction.commit();
      transaction = null;
      return updateResp;
    } catch (error) {
      await transaction?.rollback();
      throw new HttpException(
        `Failed to update assessment scores: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // part view
  async getPartQuessReponse(assessment_resp: string): Promise<any> {
    const resp = await this.quessResponseModel.findAll({
      where: {
        assessm_resp_id: assessment_resp,
      },
      include: [
        {
          model: this.questionsModel,
          as: 'questions',
          attributes: ['id', 'question', 'quesionnaire_id'],
        },
        {
          model: this.competencyModel,
          as: 'competency',
          attributes: ['id', 'competency'],
        },
      ],
    });
    return resp;
  }

  // assessor view
  async createQuessionnaireResponses(
    data: CreateQuessRespAssessor,
  ): Promise<any> {
    // const transaction = await this.sequelize.transaction();
    let transaction: Transaction | null = await this.sequelize.transaction();

    try {
      // const assResponse = await this.assessmentReponseModel.create(
      //   {
      //     class_id: data.class_id,
      //     participant_id: data.participant_id,
      //     assessor_id: data.assessor_id,
      //     assessment_id: data.assessment_id,
      //     status: data.is_draft,
      //     par_ass_id: data.par_ass_id,
      //   } as AssessmentResponse,
      //   { transaction, returning: true },
      // );

      // const partResp = data.response_score.map(
      //   (res) =>
      //     ({
      //       // score: res.score,
      //       competency_id: res.competency_id,
      //       assessm_resp_id: assResponse.id,
      //       response: res.quess_response,
      //       question_id: res.question_id,
      //       quessionaire_id: res.quessionaire_id,
      //     }) as QuessionnaireResponse,
      // );
      // const insertedResp = await this.quessResponseModel.bulkCreate(
      //   partResp as any,
      //   { transaction, returning: true },
      // );

      // const uniqueScoresMap = new Map();

      // for (const res of data.response_score) {
      //   if (!uniqueScoresMap.has(res.competency_id)) {
      //     uniqueScoresMap.set(res.competency_id, {
      //       competency_id: res.competency_id,
      //       assessment_response: assResponse.id,
      //       // quess_response: res.quess_response,
      //       // question_id: res.question_id,
      //       // quessionaire_id: res.quessionaire_id,
      //     } as ParticipantScore);
      //   }
      // }

      // const score = Array.from(uniqueScoresMap.values());

      // const insertedUniqueCompScores =
      //   await this.participantScoreModel.bulkCreate(score, {
      //     transaction,
      //     returning: true,
      //   });

      const assessorMeetScore = data.score.map(
        (inserted, index) =>
          ({
            score: inserted.score,
            assessor_id: data.assessor_id,
            assem_resp_id: data.assm_resp_id,
            quess_resp: inserted.quess_resp_id,
          }) as unknown as AssessorsMeetScore,
      );

      await this.assessorMeetScoreModel.bulkCreate(assessorMeetScore, {
        transaction,
      });

      const partAssessments = await this.participantsAssessmentsModel.findOne({
        where: {
          [Op.and]: [
            { assessment_id: data.assessment_id },
            { participant_id: data.participant_id },
            {
              quessionnaire_id: data.quessionnaire_id,
            },
          ],
        },
      });

      if (!partAssessments) {
        throw new HttpException(
          'Participant assessment not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (data.role === 'assessor') {
        const assessmAssessor =
          await this.classAssessmentsAssessorsModel.findOne({
            where: {
              [Op.and]: [
                { participant_assessment_id: data.par_ass_id },
                { assessors_id: data.assessor_id },
              ],
            },
          });

        //     if (assessmAssessor?.over_all_obs) {
        //    assessmAssessor.over_all_obs = data.over_all_obs
        // await assessmAssessor.save({ transaction });
        // }

        if (data.is_draft == 'completed') {
          if (assessmAssessor?.assessor_status) {
            assessmAssessor.assessor_status = 'completed' as progressStatus;
            await assessmAssessor.save({ transaction });
          } else {
            throw new HttpException(
              'Participant assessment not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (data.is_draft == 'inprogress') {
          if (assessmAssessor?.assessor_status) {
            assessmAssessor.assessor_status = 'inprogress' as progressStatus;
            await assessmAssessor.save({ transaction });
          } else {
            throw new HttpException(
              'Participant assessment not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        const partAssessments = await this.participantsAssessmentsModel.findOne(
          {
            where: {
              id: data.par_ass_id,
            },
          },
        );

        if (!partAssessments) {
          throw new HttpException(
            {
              message: 'Participant Assessment Not Found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (data.is_draft == 'completed') {
          if (partAssessments?.assessor_status) {
            partAssessments.assessor_status = 'completed' as progressStatus;
            await partAssessments.save({ transaction });
          } else {
            throw new HttpException(
              'Participant Assessment Assessor not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (data.is_draft == 'inprogress') {
          if (partAssessments?.assessor_status) {
            partAssessments.assessor_status = 'inprogress' as progressStatus;
            await partAssessments.save({ transaction });
          } else {
            throw new HttpException(
              'Participant Assessment Assessor not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        // const assessmAllAssessor =
        //   await this.classAssessmentsAssessorsModel.findAll({
        //     where: {
        //       participant_assessment_id: data.par_ass_id,
        //     },
        //     transaction,
        //   });

        // const scoredAssessors = assessmAllAssessor.some((assessor) => {
        //   return assessor.assessor_status === ('completed' as progressStatus);
        // });

        // if (scoredAssessors) {
        //   const partAssessments =
        //     await this.participantsAssessmentsModel.findOne({
        //       where: {
        //         // [Op.and]: [
        //         //   { assessment_id: data.assessment_id },
        //         //   { participant_id: data.participant_id },
        //         //   { quessionnaire_id: data.quessionnaire_id },
        //         // ],
        //         id: data.par_ass_id,
        //       },
        //     });

        //   if (!partAssessments) {
        //     throw new HttpException(
        //       {
        //         message: 'Participant Assessment Not Found',
        //       },
        //       HttpStatus.BAD_REQUEST,
        //     );
        //   }

        //   partAssessments.assessor_status = 'completed' as progressStatus;
        //   await partAssessments.save({ transaction });
        // }
      }

      await partAssessments.save({ transaction });
      await transaction.commit();
      transaction = null;

      // ===============================================================

      // const participant = await this.participantModel.findOne({
      //   include: [
      //     {
      //       model: this.participantsAssessmentsModel,
      //       as: 'par_as',
      //       where: {
      //         class_id: data.class_id,
      //         participant_id: data.participant_id,
      //       },
      //     },
      //   ],
      // });

      // if (!participant) {
      //   throw new HttpException(
      //     {
      //       status: 400,
      //       success: false,
      //       message: 'Participant Not found',
      //     },
      //     HttpStatus.BAD_GATEWAY,
      //   );
      // }

      // const partAllAssessments =
      //   await this.participantsAssessmentsModel.findAll({
      //     where: {
      //       class_id: data.class_id,
      //       participant_id: participant.id,
      //     },
      //   });

      // const allCompletedAssm = partAllAssessments.every(
      //   (assessment) =>
      //     assessment.assessor_status === ('completed' as progressStatus),
      // );

      // const partGroupAct = await this.groupActivityRoomsModel.findAll({
      //   where: {
      //     class_id: data.class_id,
      //   },
      //   include: [
      //     {
      //       model: this.groupActivityPartModel,
      //       as: 'gr_act_part',
      //       where: { part_id: participant.id },
      //     },
      //   ],
      // });
      // const allCompletedGrpAssm = partGroupAct.every(
      //   (assessment) =>
      //     assessment.assessor_status === ('completed' as progressStatus),
      // );
      // if (allCompletedAssm && allCompletedGrpAssm) {
      //   await this.reportService.averageCompScore(
      //     participant.id,
      //     data.class_id,
      //   );
      //   try {
      //     axios.get(
      //       `https://t7ttysqf4dbv5xnzfmzd5uc4kq0zkzqe.lambda-url.us-east-1.on.aws/?participant_id=${participant.id}`,
      //     );
      //   } catch (err) {
      //     console.error('Failed to call Lambda URL:', err);
      //   }
      // }

      // class status update
      const allPartAssessments =
        await this.participantsAssessmentsModel.findAll({
          where: {
            class_id: data.class_id,
          },
        });

      const allParCompletedAssm = allPartAssessments.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      const allPartGroupAct = await this.groupActivityRoomsModel.findAll({
        where: {
          class_id: data.class_id,
        },
      });
      const allParCompletedGrpAssm = allPartGroupAct.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      if (allParCompletedAssm && allParCompletedGrpAssm) {
        const classInstance = await this.classModel.findByPk(data.class_id);
        if (classInstance) {
          await classInstance.update({
            status: 'completed' as progressStatus,
          });
        }
      }
      // ===============================================================
      return { assessorMeetScore };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new HttpException(
        `Failed to create assessment with responses: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuessionnaireResponses(
    data: UpdateQuessRespAssessor,
  ): Promise<any> {
    // let transaction = await this.sequelize.transaction();
    let transaction: Transaction | null = await this.sequelize.transaction();
    try {
      const updateAssmScore = await this.assessorMeetScoreModel.bulkCreate(
        data.response_score.map((rs) => ({
          id: rs.id,
          quess_resp: rs.quess_resp_id,
          score: rs.score,
          assessor_id: data.assessor_id,
          assem_resp_id: data.assm_resp_id,
        })) as CreationAttributes<AssessorsMeetScore>[],
        {
          updateOnDuplicate: ['score'],
        },
      );
      // --------------------------------------------------------------
      // const assessmentResponse = await this.assessmentReponseModel.findByPk(
      //   data.assessment_response,
      // );

      // if (!assessmentResponse) {
      //   throw new HttpException(
      //     `Assessment response with ID ${data.assessment_response} not found`,
      //     HttpStatus.NOT_FOUND,
      //   );
      // }

      // const existingAssessorScore = await this.assessorMeetScoreModel.findOne({
      //   where: {
      //     [Op.and]: [
      //       { assessor_id: data.assessor_id },
      //       { assem_resp_id: data.assessment_response },
      //     ],
      //   },
      // });

      // if (!existingAssessorScore) {
      //   const assessorMeetScore = data.response_score.map(
      //     (inserted, index) =>
      //       ({
      //         score: inserted.score,
      //         assessor_id: data.assessor_id,
      //         assem_resp_id: data.assessment_response,
      //         quess_resp: inserted.quess_resp_id
      //       }) as unknown as AssessorsMeetScore,
      //   );

      //   await this.assessorMeetScoreModel.bulkCreate(assessorMeetScore, {
      //     transaction,
      //   });
      // }

      // for (const score of data.response_score) {
      //   if (data.role === 'assessor') {
      //     // if (data.is_draft === ('completed' as progressStatus)) {
      //     //   if (
      //     //     score.score === '' ||
      //     //     score.score === null ||
      //     //     score.score === undefined
      //     //   ) {
      //     //     throw new HttpException(
      //     //       {
      //     //         status: 400,
      //     //         success: false,
      //     //         message: 'Score should not be empty',
      //     //       },
      //     //       HttpStatus.BAD_REQUEST,
      //     //     );
      //     //   }
      //     // }
      //   }
      //   if (existingAssessorScore) {
      //     const assessorScore = await this.assessorMeetScoreModel.findOne({
      //       where: {
      //         part_score_id: score.id,
      //         assessor_id: data.assessor_id,
      //       },
      //     });

      //     if (!assessorScore) {
      //       throw new HttpException(
      //         `Participant score with ID ${score.id} not found`,
      //         HttpStatus.NOT_FOUND,
      //       );
      //     }

      //     await assessorScore.update(
      //       {
      //         observation: score.observation,
      //         score: score.score,
      //       },
      //       { transaction },
      //     );
      //   }
      // }

      // -----------------------------------------------------------------

      const partAssessments = await this.participantsAssessmentsModel.findOne({
        where: {
          [Op.and]: [
            { assessment_id: data.assessment_id },
            { participant_id: data.participant_id },
            { quessionnaire_id: data.quessionnaire_id },
          ],
        },
      });

      if (!partAssessments) {
        throw new HttpException(
          'Participant assessment not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (data.role === 'assessor') {
        const assessmAssessor =
          await this.classAssessmentsAssessorsModel.findOne({
            where: {
              [Op.and]: [
                { participant_assessment_id: data.par_ass_id },
                { assessors_id: data.assessor_id },
              ],
            },
          });
        //       if (assessmAssessor?.over_all_obs) {
        //    assessmAssessor.over_all_obs = data.over_all_obs
        // await assessmAssessor.save({ transaction });
        // }

        if (data.is_draft == 'completed') {
          if (assessmAssessor?.assessor_status) {
            assessmAssessor.assessor_status = 'completed' as progressStatus;
            await assessmAssessor.save({ transaction });
          } else {
            throw new HttpException(
              'Participant assessment not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (data.is_draft == 'inprogress') {
          if (assessmAssessor?.assessor_status) {
            assessmAssessor.assessor_status = 'inprogress' as progressStatus;
            await assessmAssessor.save({ transaction });
          } else {
            throw new HttpException(
              'Participant assessment not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        const partAssessments = await this.participantsAssessmentsModel.findOne(
          {
            where: {
              id: data.par_ass_id,
            },
          },
        );

        if (!partAssessments) {
          throw new HttpException(
            {
              message: 'Participant Assessment Not Found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (data.is_draft == 'completed') {
          if (partAssessments?.assessor_status) {
            partAssessments.assessor_status = 'completed' as progressStatus;
            await partAssessments.save({ transaction });
          } else {
            throw new HttpException(
              'Participant Assessment Assessor not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        if (data.is_draft == 'inprogress') {
          if (partAssessments?.assessor_status) {
            partAssessments.assessor_status = 'inprogress' as progressStatus;
            await partAssessments.save({ transaction });
          } else {
            throw new HttpException(
              'Participant Assessment Assessor not found',
              HttpStatus.NOT_FOUND,
            );
          }
        }

        // const assessmAllAssessor =
        //   await this.classAssessmentsAssessorsModel.findAll({
        //     where: {
        //       participant_assessment_id: data.par_ass_id,
        //     },
        //     transaction,
        //   });

        // const scoredAssessors = assessmAllAssessor.some((assessor) => {
        //   return assessor.assessor_status === ('completed' as progressStatus);
        // });

        // if (scoredAssessors) {
        //   const partAssessments =
        //     await this.participantsAssessmentsModel.findOne({
        //       where: {
        //         // [Op.and]: [
        //         //   { assessment_id: data.assessment_id },
        //         //   { participant_id: data.participant_id },
        //         //   { scenerio_id: data.quessionnaire_id },
        //         // ],
        //         id: data.par_ass_id,
        //       },
        //     });

        //   if (!partAssessments) {
        //     throw new HttpException(
        //       {
        //         message: 'Participant Assessment Not Found',
        //       },
        //       HttpStatus.BAD_REQUEST,
        //     );
        //   }

        //   partAssessments.assessor_status = 'completed' as progressStatus;
        //   await partAssessments.save({ transaction });
        // }
      }

      await partAssessments.save({ transaction });

      await transaction.commit();
      transaction = null;

      // ===============================================================

      // const participant = await this.participantModel.findOne({
      //   include: [
      //     {
      //       model: this.participantsAssessmentsModel,
      //       as: 'par_as',
      //       where: {
      //         class_id: data.class_id,
      //         participant_id: data.participant_id,
      //       },
      //     },
      //   ],
      // });

      // if (!participant) {
      //   throw new HttpException(
      //     {
      //       status: 400,
      //       success: false,
      //       message: 'Participant Not found',
      //     },
      //     HttpStatus.BAD_GATEWAY,
      //   );
      // }

      // const partAllAssessments =
      //   await this.participantsAssessmentsModel.findAll({
      //     where: {
      //       class_id: data.class_id,
      //       participant_id: participant.id,
      //     },
      //   });

      // const allCompletedAssm = partAllAssessments.every(
      //   (assessment) =>
      //     assessment.assessor_status === ('completed' as progressStatus),
      // );

      // const partGroupAct = await this.groupActivityRoomsModel.findAll({
      //   where: {
      //     class_id: data.class_id,
      //   },
      //   include: [
      //     {
      //       model: this.groupActivityPartModel,
      //       as: 'gr_act_part',
      //       where: { part_id: participant.id },
      //     },
      //   ],
      // });
      // const allCompletedGrpAssm = partGroupAct.every(
      //   (assessment) =>
      //     assessment.assessor_status === ('completed' as progressStatus),
      // );
      // if (allCompletedAssm && allCompletedGrpAssm) {
      //   await this.reportService.averageCompScore(
      //     participant.id,
      //     data.class_id,
      //   );
      //   try {
      //     axios.get(
      //       `https://t7ttysqf4dbv5xnzfmzd5uc4kq0zkzqe.lambda-url.us-east-1.on.aws/?participant_id=${participant.id}`,
      //     );
      //   } catch (err) {
      //     console.error('Failed to call Lambda URL:', err);
      //   }
      // }

      // class status update
      const allPartAssessments =
        await this.participantsAssessmentsModel.findAll({
          where: {
            class_id: data.class_id,
          },
        });

      const allParCompletedAssm = allPartAssessments.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      const allPartGroupAct = await this.groupActivityRoomsModel.findAll({
        where: {
          class_id: data.class_id,
        },
      });
      const allParCompletedGrpAssm = allPartGroupAct.every(
        (assessment) =>
          assessment.assessor_status === ('completed' as progressStatus),
      );

      if (allParCompletedAssm && allParCompletedGrpAssm) {
        const classInstance = await this.classModel.findByPk(data.class_id);
        if (classInstance) {
          await classInstance.update({
            status: 'completed' as progressStatus,
          });
        }
      }
      // ===============================================================

      return {
        success: true,
        message: 'Assessment scores updated successfully',
        updateAssmScore,
      };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new HttpException(
        `Failed to update assessment scores: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // assessor view..
  // async assessorQuessResponse(
  //   updateDto: UpdateQuessionnaireResponseDto,
  // ): Promise<any> {
  //   const { is_draft, data } = updateDto;
  //   const transaction = await this.sequelize.transaction();

  //   try {
  //     for (const item of data) {
  //       const existingResponse = await this.quessionnaireResponseModel.findByPk(
  //         item.id,
  //         { transaction },
  //       );

  //       if (!existingResponse) {
  //         throw new HttpException(
  //           `Quessionnaire response with ID ${item.id} not found. Cannot update a non-existent record.`,
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }

  //       const participant = await this.participantModel.findByPk(
  //         item.participant_id,
  //       );
  //       if (!participant) {
  //         throw new HttpException(
  //           `Participant with ID ${item.participant_id} not found`,
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }

  //       const classInstance = await this.classModel.findByPk(item.class_id);
  //       if (!classInstance) {
  //         throw new HttpException(
  //           `Class with ID ${item.class_id} not found`,
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }

  //       const partAssessments = await this.participantsAssessmentsModel.findOne(
  //         {
  //           where: {
  //             [Op.and]: [
  //               { assessment_id: item.assessment_id },
  //               { participant_id: item.participant_id },
  //             ],
  //           },
  //         },
  //       );

  //       if (!partAssessments) {
  //         throw new HttpException(
  //           'Participant assessment not found',
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }

  //       partAssessments.assessor_status = is_draft as progressStatus; ////=-==-=-=-=UPDATE-=-=-=-=--////
  //       await partAssessments.save({ transaction });

  //       // partAssessments.participant_status = is_draft as progressStatus;
  //       // await partAssessments.save({ transaction });
  //     }

  //     const updatedResponses = await this.quessionnaireResponseModel.bulkCreate(
  //       data.map(
  //         (item) =>
  //           ({
  //             id: item.id,
  //             response: item.response,
  //             question_id: item.question_id,
  //             quessionaire_id: item.quessionaire_id,
  //             participant_id: item.participant_id,
  //             class_id: item.class_id,
  //             assessment_id: item.assessment_id,
  //             status: is_draft,
  //             remark: item.remark,
  //             score: item.score,
  //             assessor_id: item.assessor_id,
  //           }) as unknown as CreationAttributes<QuessionnaireResponse>,
  //       ),
  //       {
  //         transaction,
  //         updateOnDuplicate: [
  //           'response',
  //           'question_id',
  //           'quessionaire_id',
  //           'participant_id',
  //           'class_id',
  //           'assessment_id',
  //           'status',
  //           'score',
  //           'remark',
  //           'assessor_id',
  //         ],
  //       },
  //     );

  //     await transaction.commit();

  //     // ===============================================================

  //     const allPartAssessments =
  //       await this.participantsAssessmentsModel.findAll({
  //         where: {
  //           class_id: updateDto.data[0]?.class_id,
  //         },
  //       });

  //     const allCompleted = allPartAssessments.every(
  //       (assessment) =>
  //         assessment.assessor_status === ('completed' as progressStatus),
  //     );

  //     if (allCompleted) {
  //       const classInstance = await this.classModel.findByPk(
  //         updateDto.data[0]?.class_id,
  //       );
  //       if (classInstance) {
  //         await classInstance.update({
  //           status: 'completed' as progressStatus,
  //         });
  //       } else {
  //         throw new HttpException(
  //           `Class with ID ${updateDto.data[0]?.class_id} not found`,
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }
  //     }
  //     // ===============================================================

  //     return {
  //       success: true,
  //       message: 'Quessionnaire responses updated successfully',
  //       data: updatedResponses,
  //     };
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw new HttpException(
  //       `Failed to update quessionnaire responses: ${error.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async getQuessionnaireResponses(particiapntId: string): Promise<any> {
  //   const responses = await this.quessionnaireResponseModel.findAll({
  //     where: {
  //       participant_id: particiapntId,
  //     },
  //     include: [
  //       {
  //         model: Questions,
  //         as: 'questions',
  //       },
  //     ],
  //   });
  //   return responses;
  // }

  async getAssessmentWithResponses(
    participantId: string,
    assessmentId: string,
    classId: string,
    par_ass_id: string,
    assessor_id: string,
    assem_resp_id?: string,
  ): Promise<any> {
    let assem_resp_where = {};

    if (assem_resp_id) {
      assem_resp_where = {
        [Op.and]: [
          { assessor_id: assessor_id },
          { assem_resp_id: assem_resp_id },
        ],
      };
    } else {
      assem_resp_where = {
        [Op.and]: [{ assessor_id }],
      };
    }

    const response = await this.competencyModel.findAll({
      // attributes:['id','competency'],
      include: [
        {
          model: ClassCompetencies,
          as: 'class_competencies',
          attributes: [],
          where: {
            class_id: classId,
          },
        },
        {
          model: ExpectedBehaviours,
          as: 'expected_behaviours',
          // attributes:["expected_behaviour"]
        },
        {
          model: this.participantScoreModel,
          as: 'participant_score',
          include: [
            {
              model: this.assessorMeetScoreModel,
              as: 'sc_pa',
              where: assem_resp_where,
              required: false,
            },
            {
              model: this.assessmentReponseModel,
              as: 'response',
              attributes: ['id', 'commentary', 'audio_file'],
              where: {
                participant_id: participantId,
                assessment_id: assessmentId,
                par_ass_id: par_ass_id,
              },
              include: [
                {
                  model: this.participantsAssessmentsModel,
                  as: 'par_as',
                  attributes: ['id'],
                  include: [
                    {
                      model: this.classAssessmentsAssessorsModel,
                      as: 'class_assessors',
                      attributes: ['over_all_obs'],
                      required: false,
                      where: {
                        assessors_id: assessor_id,
                        participant_assessment_id: par_ass_id,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    return response;
  }

  async getAssessmentOnlySummary(
    participantId: string,
    assessmentId: string,
    par_ass_id: string,
  ): Promise<any> {
    const response = await this.competencyModel.findAll({
      attributes: ['id', 'competency'],
      include: [
        {
          model: this.participantScoreModel,
          as: 'participant_score',
          attributes: ['id', 'summary'],
          required: true,
          include: [
            {
              model: this.assessmentReponseModel,
              as: 'response',
              attributes: [],
              where: {
                participant_id: participantId,
                assessment_id: assessmentId,
                par_ass_id: par_ass_id,
              },
            },
          ],
        },
      ],
    });
    return response;
  }

  async getAssessmentWithResponsesGrp(
    groupActRoomId: string,
    assessmentId: string,
    classId: string,
  ): Promise<any> {
    const participants = await this.participantModel.findAll({
      include: [
        {
          model: this.groupActivityPartModel,
          as: 'gr_act_part',
          required: true,
          include: [
            {
              model: this.groupActivityRoomsModel,
              as: 'gr_act_rooms',
              required: true,
              where: { id: groupActRoomId },
            },
          ],
        },
        {
          model: this.assessmentReponseModel,
          as: 'assessment_response',
          where: {
            assessment_id: assessmentId,
            gr_act_room_id: groupActRoomId,
          },
          required: false,
          include: [
            {
              model: this.participantScoreModel,
              as: 'scores',
              required: false,
              separate: true,

              include: [
                {
                  model: this.competencyModel,
                  as: 'competency',
                  attributes: ['id', 'createdAt', 'competency'],
                },
                {
                  model: this.assessorMeetScoreModel,
                  as: 'sc_pa',
                  required: false,
                },
              ],
              order: [
                [
                  { model: this.competencyModel, as: 'competency' },
                  'competency',
                  'ASC',
                ],
              ],
            },
          ],
        },
      ],
      // order: [
      //   [
      //     { model: this.assessmentReponseModel, as: 'assessment_response' },
      //     { model: this.participantScoreModel, as: 'scores' },
      //     { model: this.competencyModel, as: 'competency' },
      //     'createdAt',
      //     'ASC',
      //   ],
      // ],
      // order: [[Sequelize.col('assessment_response->scores->competency.createdAt'), 'ASC']]
    });

    const competencies = await this.competencyModel.findAll({
      include: [
        {
          model: ClassCompetencies,
          as: 'class_competencies',
          attributes: [],
          where: { class_id: classId },
        },
        {
          model: ExpectedBehaviours,
          as: 'expected_behaviours',
        },
      ],
      order: [['competency', 'ASC']],
    });

    const participantsWithCompetencies = participants.map((participant) => {
      const participantJson = participant.toJSON();
      return {
        ...participantJson,
        competencies: competencies,
      };
    });
    return participantsWithCompetencies;
  }

  async getClientSelectedAssessment(
    participantId: string,
    email: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;
    const partiAssessments = await this.participantsAssessmentsModel.findAll({
      offset: offset,
      limit: limit,
      // order: [['createdAt', 'DESC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: this.assessmentReponseModel,
          as: 'as_res',
          attributes: ['id', 'par_ass_id'],
        },
        {
          model: Participants,
          as: 'participant',
          where: {
            // id: participantId,
            email,
          },
          attributes: [
            'id',
            'email',
            'admin_score',
            'cbi_score_submitted',
            'cbi_status',
          ],
          include: [
            {
              model: Cohorts,
              as: 'cohorts',
              required: true,
              attributes: ['id', 'cohort_name'],
              include: [
                {
                  model: this.classModel,
                  as: 'class',
                  attributes: ['id', 'client_id', 'cohort_id', 'status'],
                  include: [
                    {
                      model: Clients,
                      as: 'client',
                      attributes: ['id', 'client_name'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Rooms,
          as: 'room',
          attributes: ['id', 'room'],
        },
        {
          model: Assessments,
          as: 'assessment',
          where: {
            assessment_name: {
              [Op.ne]: 'Business Case',
            },
          },
          order: [
            Sequelize.literal(`CASE 
            WHEN "assessment".assessment_name = 'Think On Your Feet' THEN 2
            WHEN "assessment".assessment_name  = 'Role Play' THEN 1
            WHEN "assessment".assessment_name  = 'Business Case' THEN 3
            WHEN "assessment".assessment_name  = 'Group Activity' THEN 4
            WHEN "assessment".assessment_name  = 'Leadership Questionnaire' THEN 5
            ELSE 6
          END`),
          ],
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: this.scenerioModel,
          as: 'scenerio',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: Quessionnaires,
          as: 'quessionnaire',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: ClassAssessors,
          as: 'class_assessors',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
    });

    const grpactAssessment = await this.groupActivityPartModel.findAll({
      where: {
        part_id: participantId,
      },
      include: [
        {
          model: Participants,
          as: 'participants',
          where: {
            email,
          },
          attributes: [
            'id',
            'email',
            'admin_score',
            'cbi_score_submitted',
            'cbi_status',
          ],
          include: [
            {
              model: Cohorts,
              as: 'cohorts',
              required: true,
              attributes: ['id', 'cohort_name'],
              include: [
                {
                  model: this.classModel,
                  as: 'class',
                  attributes: ['id', 'client_id', 'cohort_id', 'status'],
                  include: [
                    {
                      model: Clients,
                      as: 'client',
                      attributes: ['id', 'client_name'],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: this.groupActivityRoomsModel,
          as: 'gr_act_rooms',
          include: [
            {
              model: this.assessmentReponseModel,
              as: 'as_res',
              attributes: ['id', 'par_ass_id'],
            },
            {
              model: Rooms,
              as: 'room',
              attributes: ['id', 'room'],
            },
            {
              model: Assessments,
              as: 'assessment',
              where: {
                assessment_name: {
                  [Op.ne]: 'Business Case',
                },
              },
              order: [
                Sequelize.literal(`CASE 
            WHEN "assessment".assessment_name = 'Think On Your Feet' THEN 2
            WHEN "assessment".assessment_name  = 'Role Play' THEN 1
            WHEN "assessment".assessment_name  = 'Business Case' THEN 3
            WHEN "assessment".assessment_name  = 'Group Activity' THEN 4
            WHEN "assessment".assessment_name  = 'Leadership Questionnaire' THEN 5
            ELSE 6
          END`),
              ],
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            {
              model: this.scenerioModel,
              as: 'scenerio',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            {
              model: ClassAssessors,
              as: 'class_assessors',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      ],
    });

    const businessCaseAssessments = await this.preClassScheduleModel.findAll({
      offset: offset,
      limit: limit,
      where: {
        participant_id: participantId,
      },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'ppt_path'],
      include: [
        {
          model: Participants,
          as: 'participant',
          attributes: [
            'id',
            'participant_name',
            'email',
            'client_id',
            'project_id',
            'cohort_id',
          ],
        },
        {
          model: Assessments,
          as: 'assessment',
          where: {
            assessment_name: 'Business Case',
          },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: this.scenerioModel,
          as: 'scenerio',
          attributes: {
            exclude: ['assessment_id', 'class_id', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });

    if (!partiAssessments) {
      throw new HttpException(
        {
          message: 'Participant assessments not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!grpactAssessment) {
      throw new HttpException(
        {
          message: 'Participant assessments not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const merged = [
      ...partiAssessments.map((item) => ({
        ...item.toJSON(),
      })),
      ...businessCaseAssessments.map((item) => ({
        ...item.toJSON(),
      })),
      ...grpactAssessment.map((item) => ({
        ...item.toJSON(),
      })),
    ];

    const paginated = merged.slice(offset, offset + (limit || 10));
    return {
      rows: paginated,
    };
  }

  async uploadPpt(
    id: string,
    path: string | null,
    is_uploaded: string,
  ): Promise<any> {
    try {
      const assessment = await this.preClassScheduleModel.findByPk(id, {
        attributes: ['id', 'ppt_path', 'participant_status'],
      });
      if (!assessment) {
        throw new HttpException(
          {
            message: 'Assessment not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (assessment.ppt_path != null && assessment.ppt_path !== path) {
        try {
          const publicFolder = join(__dirname, '..', '..', '..', '..');
          const filePath = join(publicFolder, assessment.ppt_path);
          fs.unlink(filePath, (err) => {
            if (err) throw err;
            console.log(`Deleted old file: ${assessment.ppt_path}`);
          });
        } catch (err) {
          if (err.code !== 'ENOENT') {
            throw new HttpException(
              { message: 'Error deleting file', error: err.message },
              HttpStatus.BAD_REQUEST,
            );
          } else {
            console.warn('Old file not found, skipping delete.');
          }
        }
      }
      await assessment?.update({
        ppt_path: path,
        participant_status: is_uploaded,
      } as any);
      return 'File uploaded successfully';
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error while uploading the file',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async startAssessment(
    participantId: string,
    assessmentId: string,
  ): Promise<any> {
    const partAssessment = await this.participantsAssessmentsModel.findOne({
      where: {
        [Op.and]: {
          participant_id: participantId,
          assessment_id: assessmentId,
        },
      },
    });
    if (partAssessment) {
      partAssessment.assess_now = true;
      partAssessment.participant_status = progressStatus.COMPLETED;
    }
    await partAssessment?.save();
    return partAssessment;
  }

  async getPartCompExpBehaviours(responseId: string): Promise<any> {
    const classCompetency = await this.assessmentReponseModel.findOne({
      where: {
        id: responseId,
      },
      include: [
        {
          model: Participants,
          as: 'participant',
        },
        {
          model: ParticipantScore,
          as: 'scores',
          include: [
            {
              model: this.competencyModel,
              as: 'competency',
              include: [
                {
                  model: this.expectedbehaviourModel,
                  as: 'expected_behaviours',
                },
              ],
            },
          ],
        },
      ],
    });
    return classCompetency;
  }

  async draftClass(draftData: CreateDraftDto): Promise<any> {
    if (
      !draftData.client_id ||
      !draftData.cohort_id ||
      !draftData.project_id ||
      !draftData.facility_id ||
      !draftData.start_date ||
      !draftData.end_date ||
      !draftData.class_data
    ) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          mesage: 'Add some data in Assessment to save the class',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingClassDraft = await this.classDraftModel.findOne({
      where: {
        cohort_id: draftData.cohort_id,
      },
    });

    if (existingClassDraft) {
      await existingClassDraft.destroy();
    }
    const classDraft = await this.classDraftModel.create({
      client_id: draftData.client_id,
      project_id: draftData.project_id,
      cohort_id: draftData.cohort_id,
      facility_id: draftData.facility_id,
      start_date: draftData.start_date,
      end_date: draftData.end_date,
      class_data: draftData.class_data,
    } as unknown as ClassDraft);

    return classDraft;
  }

  async getAllDraftClass(
    clientId?: string,
    projectId?: string,
    cohortId?: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;
    const where: any = {};
    if (clientId) where.client_id = clientId;
    if (cohortId) where.cohort_id = cohortId;
    if (projectId) where.project_id = projectId;

    const allDraftClass = await this.classDraftModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      include: [
        {
          model: Clients,
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
          model: this.facilityModel,
          as: 'facility',
        },
      ],
    });

    // const launchClasses = await this.classModel.findAll({
    //   where,
    //   include: [
    //     {
    //       model: this.clientsModel,
    //       as: 'client',
    //     },
    //     {
    //       model: Projects,
    //       as: 'project',
    //     },
    //     {
    //       model: Cohorts,
    //       as: 'cohort',
    //     },
    //     {
    //       model: this.facilityModel,
    //       as: 'facility',
    //     },
    //   ],
    // });
    return {
      rows: allDraftClass,
      // launchClasses,
      count: await this.classDraftModel.count({
        where,
      }),
    };
  }

  async getdraftClass(id: string): Promise<any> {
    const draftClass = await this.classDraftModel.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Clients,
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
          model: this.facilityModel,
          as: 'facility',
        },
      ],
    });
    if (!draftClass) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          mesage: 'Class Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return draftClass;
  }

  async deleteDraftClass(
    id: string,
    delete_business_case: boolean,
  ): Promise<any> {
    const draftClass = await this.scheduleDraftModel.findByPk(id);
    if (draftClass) {
      await draftClass.destroy();
      if (delete_business_case === true) {
        await PreClassSchedule.destroy({
          where: {
            cohort_id: draftClass.cohort_id,
          },
        });
      }
      if (delete_business_case === true) {
        return {
          status: 200,
          success: true,
          mesage:
            'Draft Class and Business Case Assessments Deleted Successfully',
        };
      } else {
        return {
          status: 200,
          success: true,
          mesage: 'Draft Class Deleted Successfully',
        };
      }
    } else {
      throw new HttpException(
        {
          status: 400,
          success: false,
          mesage: 'Draft Class Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async cohortAssessments(cohortId: string): Promise<any> {
    const assessments = await this.clientAssessmentsModel.findAll({
      where: {
        cohort_id: cohortId,
      },
      attributes: [],
      include: [
        {
          model: this.scenerioModel,
          as: 'scenerio',
          attributes: ['id', 'scenerio_name', 'assessment_id'],
        },
        {
          model: this.quessionnaireModel,
          as: 'question',
          attributes: ['id', 'quesionnaire_name', 'assessment_id'],
        },
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: [
            'assessment_name',
            'is_quesionnaire',
            'is_group_activity',
          ],
        },
      ],
    });
    return assessments;
  }

  async cohortAssessmScenerio(cohortId: string): Promise<any> {
    const assessments = await this.assessmentsModel.findAll({
      attributes: [
        'id',
        'assessment_name',
        'is_quesionnaire',
        'is_group_activity',
        'is_cbi',
      ],
      include: [
        {
          model: this.clientAssessmentsModel,
          as: 'client_assessments',
          where: {
            cohort_id: cohortId,
          },
          attributes: ['scenerio_id', 'quesionnaire_id'],
        },
      ],
      order: [
        Sequelize.literal(`CASE 
            WHEN "Assessments".assessment_name = 'Think On Your Feet' THEN 2
            WHEN "Assessments".assessment_name  = 'Role Play' THEN 1
            WHEN "Assessments".assessment_name  = 'Business Case' THEN 3
            WHEN "Assessments".assessment_name  = 'Group Activity' THEN 4
            WHEN "Assessments".assessment_name  = 'Leadership Questionnaire' THEN 5
            ELSE 6
          END`),
      ],
    });
    return assessments;
  }

  async scheduledraft(data: CreateScheduleDraft): Promise<any> {
    const existingdraft = await this.scheduleDraftModel.findOne({
      where: {
        cohort_id: data.cohort_id,
      },
    });
    if (existingdraft) {
      await existingdraft.destroy();
    }
    const draft = await this.scheduleDraftModel.create({
      client_id: data.client_id,
      project_id: data.project_id,
      cohort_id: data.cohort_id,
      facility_id: data.facility_id,
      start_date: data.start_date,
      end_date: data.end_date,
      schedule_data: data.schedule_data,
      normal_assess_duration: data.normal_assess_duration,
      grp_act_assess_duration: data.grp_act_assess_duration,
      cbi_assessment_id: data.cbi_assessment_id,
      cbi_quessionnaire_id: data.cbi_quessionnaire_id,
      cbi_assess_duration: data.cbi_assess_duration,
      welcome_sess_duration: data.welcome_sess_duration,
    } as ScheduleDraft);
    return draft;
  }

  async getAllscheduleDraft(
    clientId?: string,
    projectId?: string,
    cohortId?: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;
    const where: any = {};
    if (clientId) where.client_id = clientId;
    if (cohortId) where.cohort_id = cohortId;
    if (projectId) where.project_id = projectId;

    const allDraftClass = await this.scheduleDraftModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Clients,
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
          model: this.facilityModel,
          as: 'facility',
          attributes: ['id', 'facility_name'],
        },
      ],
    });

    return {
      rows: allDraftClass,
      count: await this.scheduleDraftModel.count({
        where,
      }),
    };
  }

  async getdraftSchedule(cohortId: string): Promise<any> {
    const draftSchedule = await this.scheduleDraftModel.findOne({
      where: {
        cohort_id: cohortId,
      },
      include: [
        {
          model: Clients,
          as: 'client',
        },
        {
          model: Projects,
          as: 'project',
        },
        {
          model: Cohorts,
          as: 'cohort',
          include: [
            {
              model: ClassBreaks,
              as: 'class_breaks',
            },
          ],
        },
        {
          model: this.facilityModel,
          as: 'facility',
        },
      ],
    });
    return draftSchedule;
  }

  async generateAutomaticSchedule(
    clientId: string,
    cohortId: string,
    schedulingInput: SchedulingInput,
  ): Promise<ScheduleResult> {
    try {
      // Generate the optimal schedule
      const scheduleResult =
        await this.autoSchedulingService.generateOptimalSchedule(
          schedulingInput,
        );

      // if (scheduleResult.success) {
      //   // Persist to database
      //   const classId =
      //     await this.autoSchedulingService.persistScheduleToDatabase(
      //       scheduleResult,
      //       schedulingInput,
      //     );

      //   scheduleResult.classId = classId;

      //   // Send email notifications (optional - can be implemented later)
      //   // await this.sendScheduleNotifications(scheduleResult, schedulingInput);
      // }

      return scheduleResult;
    } catch (error) {
      // If it's already an HttpException (like capacity validation errors), re-throw as-is
      if (error instanceof HttpException) {
        throw error;
      }

      // For other errors, wrap in HttpException with 500 status
      throw new HttpException(
        `Failed to generate automatic schedule: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findDayWiseAssessm(date: string): Promise<any> {
    const assessm = await this.participantsAssessmentsModel.findAll({
      where: {
        start_time: {
          [Op.like]: `%${date}%`,
        },
      },
    });
    return assessm;
  }

  async dayFilterSchedule(cohortId: string, date: string): Promise<any> {
    const classConfigAssmRaw = await this.scenerioModel.findAll({
      attributes: ['id', 'scenerio_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'part_assessment',
          required: true,
          where: {
            start_time: {
              [Op.like]: `%${date}%`,
            },
          },
          attributes: [
            'id',
            'start_time',
            'end_time',
            'break',
            'participant_id',
            'room_id',
          ],
          include: [
            {
              model: Participants,
              as: 'participant',
              attributes: ['id', 'participant_name'],
            },
            {
              model: Rooms,
              as: 'room',
              attributes: ['id', 'room'],
            },
            {
              model: Assessros,
              as: 'assessors',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              where: { cohort_id: cohortId },
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                },
              ],
            },
          ],
        },
      ],
    });

    const classConfigQuessRaw = await this.quessionnaireModel.findAll({
      attributes: ['id', 'quesionnaire_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'part_assessment',
          required: true,
          // where: {
          //   start_time: {
          //     [Op.like]: `%${date}%`,
          //   },
          // },
          attributes: [
            'id',
            'start_time',
            'end_time',
            'break',
            'participant_id',
            'room_id',
          ],
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: ['id', 'assessment_name'],
            },
            {
              model: Participants,
              as: 'participant',
              attributes: ['id', 'participant_name'],
            },
            { model: Rooms, as: 'room', attributes: ['id', 'room'] },
            {
              model: Assessros,
              as: 'assessors',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              attributes: [
                'id',
                'start_date',
                'end_date',
                'cohort_id',
                'client_id',
              ],
              where: { cohort_id: cohortId },
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                  attributes: ['id', 'client_name'],
                },
              ],
            },
          ],
        },
      ],
    });

    const classConfigGrpRaw = await this.scenerioModel.findAll({
      attributes: ['id', 'scenerio_name'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.groupActivityRoomsModel,
          as: 'gr_act_rooms',
          where: {
            start_time: {
              [Op.like]: `%${date}%`,
            },
          },
          required: true,
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: ['id', 'assessment_name'],
            },
            {
              model: this.groupActivityPartModel,
              as: 'gr_act_part',
              include: [
                {
                  model: Participants,
                  as: 'participants',
                  attributes: ['id', 'participant_name'],
                },
              ],
            },
            { model: Rooms, as: 'room', attributes: ['id', 'room'] },
            {
              model: Assessros,
              as: 'assessor',
              attributes: ['id', 'assessor_name'],
            },
            {
              model: Class,
              as: 'class',
              where: { cohort_id: cohortId },
              attributes: [
                'id',
                'start_date',
                'end_date',
                'cohort_id',
                'client_id',
              ],
              include: [
                {
                  model: this.clientModel,
                  as: 'client',
                  attributes: ['id', 'client_name'],
                },
              ],
            },
          ],
        },
      ],
    });

    return {
      classConfigAssmRaw,
      classConfigQuessRaw,
      classConfigGrpRaw,
    };
  }

  async testing(): Promise<any> {
    console.log('Sohaib');
  }
}
