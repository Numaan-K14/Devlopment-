import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ClassAssessments } from 'src/Modules/class-configration/model/classAsessments.model';
import { ClassCompetencies } from 'src/Modules/class-configration/model/classAssessmentsCompetencies';
import { ClassAssessors } from 'src/Modules/class-configration/model/classPartAssessmAssessors.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { ParticipantScore } from 'src/Modules/class-configration/model/participantScore.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { ExpectedBehaviours } from 'src/Modules/competencies/model/expected_behaviour.model';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Users } from 'src/Modules/users/model/user.model';
import { ParticipantAvgComp } from '../model/part_average_comp_score.model';
import {
  adminProgress,
  ClassPartReport,
  progressStatus,
} from '../model/class_part_report.model';
import { Sequelize } from 'sequelize-typescript';
import { count, group, log } from 'console';
import { UpdateClassPartReportAndAvgCompDto } from '../dto/updateReportAIData.dto';
import { CreationAttributes, Model, Op, col, literal, where } from 'sequelize';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import * as puppeteer from 'puppeteer';
import { existsSync, writeFileSync } from 'fs';
import { EmailService } from 'src/Modules/mail/email.service';
import { Projects } from 'src/Modules/client-project/project.model';
import { AssessorsMeetScore } from 'src/Modules/class-configration/model/assessorsMeetScore.model';
import { GroupActivityRooms } from 'src/Modules/class-configration/model/groupActivityRooms.model';
import { GroupActivityPart } from 'src/Modules/class-configration/model/groupActivityParticipants.model';
import { UpdateFinalScore } from '../dto/updateFinalScore.dto';
import { NbolClientCompetency } from 'src/Modules/competencies/model/nbol_client_competency.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { CompetencyWeightage } from 'src/Modules/competencies/model/competency_weightage.model';
import axios from 'axios';
import { AdminScore } from 'src/Modules/class-configration/model/adminFinalScore.model';
import { updateScenerioSummary } from '../dto/updateScenerioSummary.dto';
import { CreationAttributeBrand } from '@sequelize/core';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ReportService {
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

    @InjectModel(ParticipantAvgComp)
    private partAvgCompModel: typeof ParticipantAvgComp,

    @InjectModel(ClassPartReport)
    private classPartReportModel: typeof ClassPartReport,

    @InjectModel(Cohorts)
    private cohortModel: typeof Cohorts,

    @InjectModel(NbolClientCompetency)
    private NbolClientCompetencyModel: typeof NbolClientCompetency,

    @InjectModel(Quessionnaires)
    private quessionnaireModel: typeof Quessionnaires,

    @InjectModel(QuessionnaireResponse)
    private quessRespModel: typeof QuessionnaireResponse,

    @InjectModel(AssessorsMeetScore)
    private assessorsMeetScoreModel: typeof AssessorsMeetScore,

    private emailService: EmailService,
    private sequelize: Sequelize,
    private readonly requestParams: RequestParamsService,
  ) {}

  // single participant report
  async participantAI(participantId: string) {
    const participant = await this.participantModel.findOne({
      where: {
        id: participantId,
      },
      include: [
        {
          model: this.clientsModel,
          as: 'client',
        },
        {
          model: this.classPartReportModel,
          as: 'class_part_report',
          required: true,
          where: {
            part_id: participantId,
          },
          include: [
            {
              model: this.partAvgCompModel,
              as: 'par_avg_comp',
              required: true,
              include: [
                {
                  model: Competencies,
                  as: 'competency',
                  required: true,
                  include: [
                    {
                      model: ParticipantScore,
                      as: 'participant_score',
                      required: true,
                      include: [
                        {
                          model: AssessmentResponse,
                          as: 'response',
                          where: {
                            participant_id: participantId,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!participant) {
      return {
        status: false,
        message: 'Participant not found',
      };
    }

    const avgScore = participant.class_part_report?.par_avg_comp
      ? participant.class_part_report.par_avg_comp.map((avgComp) =>
          parseFloat(avgComp.average_score),
        )
      : [];

    const overallScore = avgScore.length
      ? avgScore.reduce((sum, score) => sum + score, 0) / avgScore.length
      : 0;

    return {
      over_all_score: overallScore,
      participant,
    };
  }

  async singleParticipantReport(participantId: string) {
    const participant = await this.participantModel.findOne({
      where: {
        id: participantId,
      },
      include: [
        {
          model: this.clientsModel,
          as: 'client',
        },
        {
          model: this.classPartReportModel,
          as: 'class_part_report',
          required: true,
          where: {
            part_id: participantId,
          },
          include: [
            {
              model: this.partAvgCompModel,
              as: 'par_avg_comp',
              required: true,
              include: [
                {
                  model: Competencies,
                  as: 'competency',
                  required: true,
                  // include: [
                  //   {
                  //     model: ParticipantScore,
                  //     as: 'participant_score',
                  //     required: true,
                  //     // attributes: [
                  //     //   ['id', 'id'],
                  //     //   ['observation', 'observation'],
                  //     //   ['summary', 'summary'],
                  //     //   ['score', 'score'],
                  //     //   ['quess_response', 'quess_response'],
                  //     //   ['question_id', 'question_id'],
                  //     //   ['quessionaire_id', 'quessionaire_id'],
                  //     //   ['competency_id', 'competency_id'],
                  //     //   ['assessment_response', 'assessment_response'],
                  //     //   ['createdAt', 'createdAt'],
                  //     //   ['updatedAt', 'updatedAt'],
                  //     // ],
                  //     // include:[
                  //     //   {
                  //     //     model: AssessmentResponse,
                  //     //     as: 'response'
                  //     //   }
                  //     // ]
                  //   },
                  // ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!participant) {
      return {
        status: false,
        message: 'Participant not found',
      };
    }

    const avgScore = participant.class_part_report?.par_avg_comp
      ? participant.class_part_report.par_avg_comp.map((avgComp) =>
          parseFloat(avgComp.average_score),
        )
      : [];

    const overallScore = avgScore.length
      ? avgScore.reduce((sum, score) => sum + score, 0) / avgScore.length
      : 0;

    return {
      over_all_score: overallScore.toFixed(2),
      participant,
    };
  }

  // all participants report.
  async allParticipantReport(clientId: string) {
    const client = await this.clientsModel.findOne({
      where: {
        id: clientId,
      },
      include: [
        {
          model: this.participantModel,
          as: 'participants',
          include: [
            {
              model: this.classPartReportModel,
              as: 'class_part_report',
              include: [
                {
                  model: this.partAvgCompModel,
                  as: 'par_avg_comp',
                  include: [
                    {
                      model: Competencies,
                      as: 'competency',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!client) {
      return {
        status: false,
        message: 'Client not found',
      };
    }

    const participantsWithScores = client.participants.map((participant) => {
      const avgScore = participant.class_part_report?.par_avg_comp?.map(
        (avgComp) => parseFloat(avgComp.average_score),
      );

      const overallScore = avgScore?.length
        ? avgScore.reduce((sum, score) => sum + score, 0) / avgScore.length
        : 0;

      return {
        ...participant.toJSON(),
        overallScore,
      };
    });

    return {
      status: true,
      client: {
        ...client.toJSON(),
        participants: participantsWithScores,
      },
    };
  }

  async averageCompScore(participantId: string, classId: string) {
    if (!this.participantModel.sequelize) {
      throw new Error(
        'Sequelize instance is not available on participantModel',
      );
    }
    const transaction = await this.participantModel.sequelize.transaction();

    try {
      const responses = await this.assessmentReponseModel.findAll({
        where: {
          class_id: classId,
          participant_id: participantId,
        },
        include: [
          {
            model: this.participantScoreModel,
            as: 'scores',
            required: true,
            include: [
              {
                model: this.competencyModel,
                as: 'competency',
              },
            ],
          },
        ],
      });

      const compMap: Record<
        string,
        { comp_id: string; comp_name: string; total: number; count: number }
      > = {};

      responses.forEach((resp: any) => {
        (resp.scores || []).forEach((score: any) => {
          const compId = score.competency?.id;
          const compName = score.competency?.competency;
          const numericScore = Number(score.score);
          if (!compId || isNaN(numericScore)) return;
          if (!compMap[compId]) {
            compMap[compId] = {
              comp_id: compId,
              comp_name: compName,
              total: 0,
              count: 0,
            };
          }
          compMap[compId].total += numericScore;
          compMap[compId].count += 1;
        });
      });

      const averageScores = Object.values(compMap).map((item) => ({
        comp_id: item.comp_id,
        average_score:
          item.count > 0 ? (item.total / item.count).toFixed(2) : '0',
        class_part_rep_id: null as string | null,
      }));

      const existingReport = await this.classPartReportModel.findOne({
        where: {
          part_id: participantId,
          class_id: classId,
        },
      });
      if (existingReport) {
        await existingReport.destroy();
      }

      const part_report = await this.classPartReportModel.create(
        {
          part_id: participantId,
          class_id: classId,
        } as ClassPartReport,
        { transaction },
      );

      averageScores.forEach((score) => {
        score.class_part_rep_id = part_report.id;
      });

      const part_comp_avg = await this.partAvgCompModel.bulkCreate(
        averageScores as ParticipantAvgComp[],
        { transaction },
      );

      await transaction.commit();
      log('Average competency scores:', part_comp_avg);
      return {
        status: true,
        message: 'Average competency scores calculated and saved successfully',
        data: part_comp_avg,
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Error calculating average competency scores:', error);
      throw error;
    }
  }

  async averageCompScoreTest(participantId: string, classId: string) {
    if (!this.participantModel.sequelize) {
      throw new Error(
        'Sequelize instance is not available on participantModel',
      );
    }
    const transaction = await this.participantModel.sequelize.transaction();
    try {
      const responses = await this.assessmentReponseModel.findAll({
        where: {
          class_id: classId,
          participant_id: participantId,
        },
        attributes: ['id', 'par_ass_id', 'gr_act_room_id'],
        include: [
          {
            model: this.participantsAssessmentsModel,
            as: 'par_as',
            // required: true,
            attributes: ['id', 'scenerio_id', 'quessionnaire_id'],
            include: [
              {
                model: this.scenerioModel,
                as: 'scenerio',
                attributes: ['id', 'scenerio_name'],
              },
              {
                model: this.quessionnaireModel,
                as: 'quessionnaire',
                attributes: ['id'],
              },
            ],
          },
          {
            model: GroupActivityRooms,
            as: 'gr_act_room',
            // attributes:['id', 'scenerio_id'],
            include: [
              {
                model: this.scenerioModel,
                as: 'scenerio',
                attributes: ['id', 'scenerio_name'],
              },
            ],
          },
          {
            model: this.participantScoreModel,
            as: 'scores',
            required: true,
            attributes: ['id', 'score', 'competency_id'],
            include: [
              {
                model: this.competencyModel,
                as: 'competency',
                attributes: ['id', 'competency'],
                include: [
                  {
                    model: CompetencyWeightage,
                    as: 'comp_weight',
                    attributes: {
                      exclude: ['submitted', 'createdAt', 'updatedAt'],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      const compMap: Record<
        string,
        {
          comp_id: string;
          comp_name: string;
          total_score_weighted: number;
          total_weight: number;
        }
      > = {};

      let count = 0;
      responses.forEach((resp: any) => {
        let scenarioId = resp.par_as?.scenerio?.id;
        let questionnaireId = resp.par_as?.quessionnaire_id;
        let scenarioName = resp.par_as?.scenerio?.scenerio_name;

        if (!scenarioId && resp.gr_act_room?.scenerio?.id) {
          scenarioId = resp.gr_act_room.scenerio.id;
          scenarioName = resp.gr_act_room.scenerio.scenerio_name;
        }

        if (!questionnaireId && resp.gr_act_room?.quessionnaire_id) {
          questionnaireId = resp.gr_act_room.quessionnaire_id;
        } // not required

        (resp.scores || []).forEach((score: any) => {
          count++;
          const compId = score.competency?.id;
          const compName = score.competency?.competency;
          const compWeightArr = score.competency?.comp_weight;
          if (
            !compId ||
            !Array.isArray(compWeightArr) ||
            compWeightArr.length === 0
          )
            return;

          let compWeight;
          if (scenarioId) {
            compWeight = compWeightArr.find(
              (cw: any) => cw.scenerio_id === scenarioId,
            );
          }
          if (!compWeight && questionnaireId) {
            compWeight = compWeightArr.find(
              (cw: any) => cw.quessionnaire_id === questionnaireId,
            );
          }
          if (!compWeight) return;

          // let compCore;
          // compCore = resp.scores.find((c: any) => c.competency_id === compId);

          console.log(compWeight, '........<><><><>><>');
          console.log(scenarioName, '........<><><scenerio><>><>');
          console.log(score.competency?.id, '........<><>COMPEtency<><>><>');

          const weightage = Number(compWeight.weightage);
          const total = Number(compWeight.total);
          const numericScore = Number(score.score);
          // const numericScore = Number(compCore.score);

          console.log(numericScore, '........<><>numericScore<><>><>');

          if (isNaN(numericScore)) return;

          if (!compMap[compId]) {
            compMap[compId] = {
              comp_id: compId,
              comp_name: compName,
              total_score_weighted: 0,
              total_weight: 0,
            };
          }
          compMap[compId].total_score_weighted += numericScore * weightage;
          compMap[compId].total_weight = total;
        });
      });
      console.log('Count of scores processed:', count);

      const averageScores = Object.values(compMap).map((item) => ({
        comp_id: item.comp_id,
        average_score:
          item.total_weight > 0
            ? (item.total_score_weighted / item.total_weight).toFixed(2)
            : '0',
        class_part_rep_id: null as string | null,
      }));

      const existingReport = await this.classPartReportModel.findOne({
        where: {
          part_id: participantId,
          class_id: classId,
        },
      });
      if (existingReport) {
        await existingReport.destroy();
      }

      const part_report = await this.classPartReportModel.create(
        {
          part_id: participantId,
          class_id: classId,
        } as ClassPartReport,
        { transaction },
      );

      averageScores.forEach((score) => {
        score.class_part_rep_id = part_report.id;
      });

      const part_comp_avg = await this.partAvgCompModel.bulkCreate(
        averageScores as ParticipantAvgComp[],
        { transaction },
      );
      console.log(compMap, '{}{}{}{}{}{}{}{}{');

      await transaction.commit();
      return {
        status: true,
        message: 'Average competency scores calculated and saved successfully',
        data: part_comp_avg,
        responses,
        averageScores,
      };
    } catch (error) {
      console.error('Error calculating average competency scores:', error);
      await transaction.rollback();
      throw error;
    }
  }

  async averageCompScoreTest1(participantId: string, classId: string) {
    if (!this.participantModel.sequelize) {
      throw new Error(
        'Sequelize instance is not available on participantModel',
      );
    }
    const transaction = await this.participantModel.sequelize.transaction();
    try {
      const responses = await this.assessmentReponseModel.findAll({
        where: {
          class_id: classId,
          participant_id: participantId,
        },
        attributes: ['id', 'par_ass_id', 'gr_act_room_id'],
        include: [
          {
            model: this.participantsAssessmentsModel,
            as: 'par_as',
            // required: true,
            attributes: ['id', 'scenerio_id', 'quessionnaire_id'],
            include: [
              {
                model: this.scenerioModel,
                as: 'scenerio',
                attributes: ['id', 'scenerio_name'],
              },
              {
                model: this.quessionnaireModel,
                as: 'quessionnaire',
                attributes: ['id'],
              },
            ],
          },
          {
            model: GroupActivityRooms,
            as: 'gr_act_room',
            // attributes:['id', 'scenerio_id'],
            include: [
              {
                model: this.scenerioModel,
                as: 'scenerio',
                attributes: ['id', 'scenerio_name'],
              },
            ],
          },
          {
            model: this.participantScoreModel,
            as: 'scores',
            required: true,
            attributes: ['id', 'score', 'competency_id'],
            include: [
              {
                model: this.competencyModel,
                as: 'competency',
                attributes: ['id', 'competency'],
                include: [
                  {
                    model: CompetencyWeightage,
                    as: 'comp_weight',
                    // where:{
                    //   cohort_id: "d39d4a73-02f9-403c-a5b4-66dcf5f3732a"
                    // },
                    attributes: {
                      exclude: ['submitted', 'createdAt', 'updatedAt'],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      const compMap: Record<
        string,
        {
          comp_id: string;
          comp_name: string;
          total_score_weighted: number;
          total_weight: number;
        }
      > = {};

      let count = 0;
      responses.forEach((resp: any) => {
        let scenarioId = resp.par_as?.scenerio?.id;
        let questionnaireId = resp.par_as?.quessionnaire_id;
        let scenarioName = resp.par_as?.scenerio?.scenerio_name;

        if (!scenarioId && resp.gr_act_room?.scenerio?.id) {
          scenarioId = resp.gr_act_room.scenerio.id;
          scenarioName = resp.gr_act_room.scenerio.scenerio_name;
        }

        if (!questionnaireId && resp.gr_act_room?.quessionnaire_id) {
          questionnaireId = resp.gr_act_room.quessionnaire_id;
        } // not required

        (resp.scores || []).forEach((score: any) => {
          count++;
          const compId = score.competency?.id;
          const compName = score.competency?.competency;
          const compWeightArr = score.competency?.comp_weight;
          if (
            !compId ||
            !Array.isArray(compWeightArr) ||
            compWeightArr.length === 0
          )
            return;

          let compWeight;
          if (scenarioId) {
            compWeight = compWeightArr.find(
              (cw: any) => cw.scenerio_id === scenarioId,
            );
          }
          if (!compWeight && questionnaireId) {
            compWeight = compWeightArr.find(
              (cw: any) => cw.quessionnaire_id === questionnaireId,
            );
          }
          if (!compWeight) return;

          // let compCore;
          // compCore = resp.scores.find((c: any) => c.competency_id === compId);

          console.log(compWeight, '........<><><><>><>');
          console.log(scenarioName, '........<><><scenerio><>><>');
          console.log(score.competency?.id, '........<><>COMPEtency<><>><>');

          const weightage = Number(compWeight.weightage);
          const total = Number(compWeight.total);
          const numericScore = Number(score.score);
          // const numericScore = Number(compCore.score);

          console.log(numericScore, '........<><>numericScore<><>><>');

          if (isNaN(numericScore)) return;

          if (!compMap[compId]) {
            compMap[compId] = {
              comp_id: compId,
              comp_name: compName,
              total_score_weighted: 0,
              total_weight: 0,
            };
          }
          compMap[compId].total_score_weighted += numericScore * weightage;
          compMap[compId].total_weight = total;
        });
      });
      console.log('Count of scores processed:', count);

      const averageScores = Object.values(compMap).map((item) => ({
        comp_id: item.comp_id,
        average_score:
          item.total_weight > 0
            ? (item.total_score_weighted / item.total_weight).toFixed(2)
            : '0',
        class_part_rep_id: null as string | null,
      }));

      const existingReport = await this.classPartReportModel.findOne({
        where: {
          part_id: participantId,
          class_id: classId,
        },
      });
      if (existingReport) {
        await existingReport.destroy();
      }

      const part_report = await this.classPartReportModel.create(
        {
          part_id: participantId,
          class_id: classId,
        } as ClassPartReport,
        { transaction },
      );

      averageScores.forEach((score) => {
        score.class_part_rep_id = part_report.id;
      });

      const part_comp_avg = await this.partAvgCompModel.bulkCreate(
        averageScores as ParticipantAvgComp[],
        { transaction },
      );
      console.log(compMap, '{}{}{}{}{}{}{}{}{');

      await transaction.commit();
      return {
        status: true,
        message: 'Average competency scores calculated and saved successfully',
        data: part_comp_avg,
        responses,
        averageScores,
      };
    } catch (error) {
      console.error('Error calculating average competency scores:', error);
      await transaction.rollback();
      throw error;
    }
  }

  async updateClassPartReportAndAvgComp(
    partId: string,
    updateDto: UpdateClassPartReportAndAvgCompDto,
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      const classPartReport = await this.classPartReportModel.findOne({
        where: { part_id: partId },
        // transaction,
      });

      if (!classPartReport) {
        throw new HttpException(
          {
            message: 'ClassPartReport not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await classPartReport.update(
        {
          strength: updateDto.strength,
          area_for_dev: updateDto.area_for_dev,
          recommendation: updateDto.recommendation,
          conclusion: updateDto.conclusion,
          str_comp: updateDto.str_comp,
          dev_comp: updateDto.dev_comp,
          part_summary: updateDto.summary,
          assessor_id: updateDto.assessor_id,
        },
        { transaction },
      );
      // await transaction.commit();
      ``;
      if (updateDto.avgCompUpdates && updateDto.avgCompUpdates.length > 0) {
        await this.partAvgCompModel.bulkCreate(
          updateDto.avgCompUpdates.map((avgCompUpdate) => ({
            id: avgCompUpdate.avgCompId,
            strength: avgCompUpdate.strength,
            area_for_dev: avgCompUpdate.area_for_dev,
          })) as CreationAttributes<ParticipantAvgComp>[],

          {
            updateOnDuplicate: ['strength', 'area_for_dev'],
            transaction,
          },
        );
      }

      if (
        updateDto.assessor_status === 'completed' ||
        updateDto.assessor_status === 'inprogress'
      ) {
        classPartReport.assessor_status =
          updateDto.assessor_status as progressStatus;
        await classPartReport.save({ transaction });
      }

      await transaction.commit();

      return {
        status: true,
        message: 'ClassPartReport and ParticipantAvgComp updated successfully',
      };
    } catch (error) {
      console.error(
        'Error updating ClassPartReport and ParticipantAvgComp:',
        error,
      );
      await transaction.rollback();
      throw error;
    }
  }

  async getAllPartReport(
    clientId?: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;
    const where: any = {
      ...getSearchObject(this.requestParams.query, ['client_name']),
    };
    if (clientId) where.id = clientId;

    // const classInclude: any = {
    //   model: this.classModel,
    //   as: 'class',
    //   include: [
    //     {
    //       model: this.clientsModel,
    //       as: 'client',
    //     },
    //     {
    //       model: this.cohortModel,
    //       as: 'cohort',
    //     },
    //   ],
    // };

    // if (clientId) {
    //   classInclude.include[0].where = { id: clientId };
    // }

    // const reports = await this.classPartReportModel.findAll({
    //   offset: offset,
    //   limit: limit,
    //   attributes: [],
    //   include: [classInclude],
    // });

    const reports = await this.clientsModel.findAll({
      offset,
      limit,
      where,
      attributes: ['id', 'client_name'],
      include: [
        {
          model: this.classModel,
          as: 'classes',
          required: true,
          include: [
            {
              model: this.cohortModel,
              as: 'cohort',
              include: [
                {
                  model: Projects,
                  as: 'project',
                  include: [
                    {
                      model: Clients,
                      as: 'client',
                    },
                  ],
                },
              ],
            },
            {
              model: this.classPartReportModel,
              as: 'cl_par_report',
              attributes: [],
              required: true,
            },
          ],
        },
      ],
    });
    return {
      rows: reports,
      count: reports.length,
    };
  }

  async getPartReportOfClass(
    classId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;

    const reports = await this.classPartReportModel.findAll({
      offset,
      limit,
      where: {
        class_id: classId,
      },
      include: [
        {
          model: this.classModel,
          as: 'class',
          include: [
            {
              model: this.clientsModel,
              as: 'client',
            },
            // {
            //   model:this.cohortModel,
            //   as: 'cohort'
            // }
          ],
        },
        {
          model: this.participantModel,
          as: 'participant',
        },
      ],
    });

    const count = await this.classPartReportModel.count({
      where: {
        class_id: classId,
      },
    });

    return {
      rows: reports,
      count,
    };
  }

  async adminReportStatus(
    partId: string,
    admin_status: string,
    admin_name: string,
  ): Promise<any> {
    const classPartReport = await this.classPartReportModel.findOne({
      where: {
        part_id: partId,
      },
    });

    if (!classPartReport) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Class Participant Report not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (admin_status === 'accepted') {
      classPartReport.admin_status = 'accepted' as adminProgress;
      classPartReport.admin_name = admin_name;
      await classPartReport.save();
      return 'Admin Accepted the Report';
    }

    if (admin_status === 'rejected') {
      classPartReport.admin_status = 'rejected' as adminProgress;
      classPartReport.assessor_status = 'pending' as progressStatus;
      await classPartReport.save();

      //  this.emailService.sendEmailToActiveAssessors(
      //     classPartReport.email,
      //     'Assessor Status Updated',
      //     './email-templates/test.hbs',
      //     {
      //       name: assessor.assessor_name,
      //       email: assessor.email,
      //       // password: user?.password,
      //     },
      //   );

      return 'Admin Rejected the Report';
    }
  }

  async getSingleResponseReport(partId: string) {
    //updated
    // const userDataDir = path.join('/tmp', `puppeteer_nbo_${Date.now()}`);
    // fs.mkdirSync(userDataDir, { recursive: true });
    
    if (false && existsSync(`public/media/reports/report-${partId}.pdf`)) {
      return {
        file_path: `public/media/reports/report-${partId}.pdf`,
      };
    } else {
      const browser = await puppeteer.launch({
        // executablePath: process.env.Chrome_Path,
        headless: true,
        args: [
          // '--no-sandbox',
          // '--disable-setuid-sandbox',
          '--ignore-certificate-errors',

          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-sync',
          '--single-process',
          // '--user-data-dir=/tmp/chrome-data'
        ],
        // userDataDir,
      });

      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
      );

      // await page.goto(`http://localhost:3000/report-ui/${partId}`, {
      //   waitUntil: 'networkidle0',
      // });

      await page.goto(`${process.env.Report_Download_Url}/${partId}`, {
        waitUntil: 'networkidle0',
      });

      // debug...
      // await page.screenshot({ path: `debug-${partId}.png`, fullPage: true });

      // let height = await page.evaluate(
      //   () => document.documentElement.offsetHeight,
      // );

      await page.evaluateHandle('document.fonts.ready');
      await page.emulateMediaType('screen');
      const pdf = await page.pdf({
        printBackground: true,
        format: 'A4',
        waitForFonts: true,
        margin: {
          top: '20px',
        },

        // preferCSSPageSize: true,
        // height: height + 5 + "px",
      });

      await browser.close();
      //updated
      // fs.rmSync(userDataDir, { recursive: true, force: true });

      if (pdf) {
        writeFileSync(`public/media/reports/report-${partId}.pdf`, pdf);
        const partReport = await this.classPartReportModel.findOne({
          where: {
            part_id: partId,
          },
        });
        if (!partReport) {
          throw new HttpException(
            {
              status: 404,
              success: false,
              message: 'Participant report not found',
            },
            HttpStatus.NOT_FOUND,
          );
        }
        await partReport.update(
          {
            report_path: `public/media/reports/report-${partId}.pdf`,
          },
          // { where: { part_id: partId } },
        );
        return {
          file_path: `public/media/reports/report-${partId}.pdf`,
        };
      }
    }
    return;
  }

  async cohortPartScoreCardData(
    clientId?: string,
    projectId?: string,
    cohortId?: string,
    page?: number,
    limit?: number,
  ): Promise<any> {
    const offset = (page ? page : 0) * (limit ? limit : 10);
    const where: any = {};
    if (clientId) where.client_id = clientId;
    if (cohortId) where.cohort_id = cohortId;
    if (projectId) where.project_id = projectId;

    const existingClass = await this.classModel.findOne({
      where: {
        cohort_id: cohortId,
        status: 'completed',
      },
    });
    if (existingClass) {
      const participant = await this.participantModel.findAll({
        where,
        // order: [['createdAt', 'DESC']],
        attributes: [
          'id',
          'participant_name',
          'client_id',
          'project_id',
          'cohort_id',
          'admin_score',
        ],
        offset,
        limit,
        include: [
          {
            model: Clients,
            as: 'client',
            attributes: ['id', 'client_name'],
          },
          {
            model: this.cohortModel,
            as: 'cohorts',
            attributes: ['cohort_name'],
            include: [
              {
                model: this.classModel,
                as: 'class',
                attributes: ['id'],
              },
            ],
          },
        ],
      });

      const count = await this.participantModel.count({ where });

      return {
        rows: participant,
        count,
        page,
      };
    }
  }

  async getPartAllAssessmentsMarks(
    clientId: string,
    cohortId: string,
    partId: string,
  ): Promise<any> {
    const normalAssessments = await this.participantsAssessmentsModel.findAll({
      attributes: [],
      include: [
        {
          model: Scenerios,
          as: 'scenerio',
          attributes: ['id', 'scenerio_name'],
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
            },
          ],
        },
        {
          model: Quessionnaires,
          as: 'quessionnaire',
          attributes: ['id', 'quesionnaire_name'],
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
            },
          ],
        },
        {
          model: this.assessmentReponseModel,
          as: 'as_res',
          attributes: ['id', 'par_ass_id'],
          where: {
            [Op.and]: [
              literal(
                '"as_res"."assessment_id" = "ParticipantsAssessments"."assessment_id"',
              ),
              { participant_id: partId },
            ],
          },
          include: [
            {
              model: this.participantScoreModel,
              as: 'scores',
              attributes: ['id', 'score'],
              include: [
                {
                  model: this.competencyModel,
                  as: 'competency',
                  attributes: ['id', 'competency'],
                },
                {
                  model: AssessorsMeetScore,
                  as: 'sc_pa',
                  include: [
                    {
                      model: this.assessorsModel,
                      as: 'assessor',
                    },
                  ],
                },
              ],
            },
            {
              model: this.quessRespModel,
              as: 'quess_resp',
              // attributes: ['id', 'score'],
              include: [
                {
                  model: this.competencyModel,
                  as: 'competency',
                  attributes: ['id', 'competency'],
                },
                {
                  model: AssessorsMeetScore,
                  as: 'assess_score',
                  include: [
                    {
                      model: this.assessorsModel,
                      as: 'assessor',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const grpActAssessments = await GroupActivityRooms.findAll({
      attributes: [],
      include: [
        {
          model: this.scenerioModel,
          as: 'scenerio',
          attributes: ['id', 'scenerio_name'],
          include: [
            {
              model: this.assessmentsModel,
              as: 'assessment',
            },
          ],
        },
        {
          model: this.assessmentReponseModel,
          as: 'as_res',
          attributes: ['id', 'gr_act_room_id'],
          where: {
            participant_id: partId,
          },
          include: [
            {
              model: this.participantScoreModel,
              as: 'scores',
              separate: true,
              attributes: ['id', 'score'],
              include: [
                {
                  model: this.competencyModel,
                  as: 'competency',
                  attributes: ['id', 'competency'],
                },
                {
                  model: AssessorsMeetScore,
                  as: 'sc_pa',
                  include: [
                    {
                      model: this.assessorsModel,
                      as: 'assessor',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const competency = await this.competencyModel.findAll({
      attributes: ['id', 'competency'],
      where: {
        client_id: clientId,
        is_copy: true,
      },
      include: [
        {
          model: this.participantScoreModel,
          as: 'participant_score',
          attributes: ['id', 'score'],
          include: [
            {
              model: this.assessmentReponseModel,
              as: 'response',
              attributes: ['id'],
              where: {
                participant_id: partId,
              },
              include: [
                {
                  model: this.assessmentsModel,
                  as: 'assessment',
                  attributes: ['id', 'assessment_name'],
                },
              ],
            },
          ],
        },
      ],
      order: [
        [
          { model: this.participantScoreModel, as: 'participant_score' },
          { model: this.assessmentReponseModel, as: 'response' },
          { model: this.assessmentsModel, as: 'assessment' },
          'createdAt',
          'DESC',
        ],
      ],
    });

    // ===================

    // const competency = await this.competencyModel.findAll({
    //   attributes: [
    //     'id',
    //     'competency',
    //     // [
    //     //   Sequelize.fn(
    //     //     'AVG',
    //     //     Sequelize.cast(Sequelize.col('participant_score.score'), 'INT'),
    //     //   ),
    //     //   'leadership_avg',
    //     // ],
    //   ],
    //   where: { client_id: clientId, is_copy: true },
    //   include: [
    //     {
    //       model: this.participantScoreModel,
    //       as: 'participant_score',
    //       attributes: ['id', 'score'],
    //       include: [
    //         {
    //           model: this.assessmentReponseModel,
    //           as: 'response',
    //           where: { participant_id: partId },
    //           attributes: ['id'],
    //           include: [
    //             {
    //               model: this.assessmentsModel,
    //               as: 'assessment',
    //               attributes: ['id', 'assessment_name'],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       model: AdminScore,
    //       as: 'admin_score',
    //       attributes: ['id', 'score'],
    //       include: [
    //         {
    //           model: this.assessmentReponseModel,
    //           as: 'response',
    //           where: { participant_id: partId },
    //           attributes: ['id'],
    //           include: [
    //             {
    //               model: this.assessmentsModel,
    //               as: 'assessment',
    //               attributes: ['id', 'assessment_name'],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    //   // group: [
    //   //   'Competencies.id',
    //   //   'participant_score->response.id',
    //   //   'participant_score.id',
    //   //   'participant_score->response->assessment.id',
    //   // ],
    //   order: [
    //     [
    //       // { model: this.participantScoreModel, as: 'participant_score' },
    //       { model: AdminScore, as: 'admin_score' },
    //       { model: this.assessmentReponseModel, as: 'response' },
    //       { model: this.assessmentsModel, as: 'assessment' },
    //       'createdAt',
    //       'DESC',
    //     ],
    //   ],
    // });

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
            'createdAt',
          ],
        },
      ],
      order: [
        [
          { model: this.assessmentsModel, as: 'assessment' },
          'createdAt',
          'DESC',
        ],
      ],
    });

    return {
      normalAssessments,
      grpActAssessments,
      competency,
      assessments,
    };
  }

  async finalAssessorScore(data: UpdateFinalScore): Promise<any> {
    await this.participantScoreModel.bulkCreate(
      data.score.map((sc) => ({
        id: sc.score_id,
        score: sc.score,
        competency_id: sc.competency_id,
        assessment_response: sc.assessment_response,
      })) as CreationAttributes<ParticipantScore>[],
      {
        updateOnDuplicate: ['score'],
      },
    );

    await this.participantModel.update(
      { admin_score: data.admin_score as progressStatus },
      {
        where: {
          id: data.participant_id,
        },
      },
    );
    if (data.admin_score === 'completed') {
      // for (const sc of data.score) {
      //   if (sc.score === null || sc.score === undefined || sc.score === '') {
      //     throw new HttpException(
      //       {
      //         status: 400,
      //         success: false,
      //         message:
      //           'Score is null or undefined for one or more competencies'
      //       },
      //       HttpStatus.BAD_REQUEST,
      //     );
      //   }
      // }
      await this.averageCompScoreTest(data.participant_id, data.class_id);
      try {
        axios.get(
          `https://t7ttysqf4dbv5xnzfmzd5uc4kq0zkzqe.lambda-url.us-east-1.on.aws/?participant_id=${data.participant_id}`,
        );
      } catch (err) {
        throw new HttpException(
          {
            status: 500,
            success: false,
            message: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getscenerioSummary(cohortId: string): Promise<any> {
    const classAssessm = await this.clientAssessmentsModel.findAll({
      where: {
        cohort_id: cohortId,
      },
      attributes: ['id'],
      include: [
        {
          model: this.assessmentsModel,
          as: 'assessment',
          attributes: ['id', 'assessment_name'],
        },
        {
          model: this.scenerioModel,
          as: 'scenerio',
          attributes: ['id', 'scenerio_name', 'description'],
        },
        {
          model: this.quessionnaireModel,
          as: 'question',
          attributes: ['id', 'quesionnaire_name'],
        },
      ],
    });
    return classAssessm;
  }

  async updateAssessmSummary(data: updateScenerioSummary): Promise<any> {
    // const assessm_summary = await this.clientAssessmentsModel.bulkCreate(
    //   data.assessments.map((assesm) => ({
    //     id: assesm.id,
    //     client_id: data.client_id,
    //     cohort_id: data.cohort_id,
    //     assessment_id: assesm.assessment_id,
    //     scenerio_id: assesm.scenerio_id,
    //     quesionnaire_id: assesm.quessionnaire_id,
    //     assessm_summary: assesm.assessm_summary,
    //   })) as CreationAttributes<ClientAssessments>[],
    //   {
    //     updateOnDuplicate: [
    //       'client_id',
    //       'cohort_id',
    //       'assessment_id',
    //       'scenerio_id',
    //       'quesionnaire_id',
    //       'assessm_summary',
    //     ],
    //   },
    // );
    // return assessm_summary;

    await this.clientAssessmentsModel.bulkCreate(
      data.assessments.map((assesm) => ({
        id: assesm.id,
        client_id: data.client_id,
        cohort_id: data.cohort_id,
        assessment_id: assesm.assessment_id,
        scenerio_id: assesm.scenerio_id,
        quesionnaire_id: assesm.quessionnaire_id,
        assessm_summary: assesm.assessm_summary,
      })) as CreationAttributes<ClientAssessments>[],
      {
        updateOnDuplicate: [
          'client_id',
          'cohort_id',
          'assessment_id',
          'scenerio_id',
          'quesionnaire_id',
          'assessm_summary',
        ],
        conflictFields: ['id'],
      } as any,
    );
  }

  async cohortAvgCompScore(classId: string, cohortId: string): Promise<any> {
    const partCount = await this.participantModel.count({
      where: {
        cohort_id: cohortId,
      },
    });
    console.log(partCount, 'Count of Participants');

    const compAvgScore = await this.partAvgCompModel.findAll({
      attributes: [
        // 'id',
        'comp_id',
        // 'class_part_rep_id',
        // 'average_score',
        // [
        //   this.sequelize.fn('SUM',this.sequelize.cast(this.sequelize.col('average_score'), 'float'),),
        //   'Average Comp Score',
        // ],
        [
          this.sequelize.literal(
            `SUM(CAST("average_score" AS FLOAT) / ${partCount})`,
          ),
          'average_comp_score',
        ],
      ],
      include: [
        {
          model: this.classPartReportModel,
          as: 'class_part_rep',
          attributes: [],
          where: {
            class_id: classId,
          },
          required: true,
        },
        {
          model: this.competencyModel,
          as: 'competency',
        },
      ],
      group: ['comp_id', 'competency.id'],
    });

    // const compAvgScore = await this.partAvgCompModel.findOne({
    //   attributes: [
    //     [
    //       this.sequelize.fn(
    //         'MAX',
    //         this.sequelize.cast(this.sequelize.col('average_score'), 'float'),
    //       ),
    //       'sum',
    //     ],
    //   ],
    // });

    return compAvgScore;
  }

  async participantAssessments_Report_view(
    partId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;
    const assessmResponse = await this.assessmentReponseModel.findAll({
      offset: offset,
      limit: limit,
      where: {
        participant_id: partId,
      },
      attributes: ['id', 'class_id'],
      include: [
        {
          model: this.participantModel,
          as: 'participant',
          attributes: ['client_id', 'project_id', 'cohort_id'],
        },
        {
          model: this.participantsAssessmentsModel,
          as: 'par_as',
          attributes: ['id', 'start_time', 'end_time'],
          include: [
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
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: [
                'id',
                'assessment_name',
                'is_quesionnaire',
                'is_group_activity',
              ],
            },
          ],
        },
        {
          model: GroupActivityRooms,
          as: 'gr_act_room',
          attributes: ['id'],
          include: [
            {
              model: this.scenerioModel,
              as: 'scenerio',
              attributes: ['id', 'scenerio_name'],
            },
            {
              model: this.assessmentsModel,
              as: 'assessment',
              attributes: [
                'id',
                'assessment_name',
                'is_quesionnaire',
                'is_group_activity',
              ],
            },
          ],
        },
      ],
      order: [
        [
          Sequelize.literal(`CASE
            WHEN "par_as->assessment"."assessment_name" = 'Think On Your Feet' THEN 2
            WHEN "par_as->assessment"."assessment_name" = 'Role Play' THEN 1
            WHEN "par_as->assessment"."assessment_name" = 'Business Case' THEN 3
            WHEN "par_as->assessment"."assessment_name" = 'Group Activity' THEN 4
            WHEN "par_as->assessment"."assessment_name" = 'Leadership Questionnaire' THEN 5
            ELSE 6
            END`),
          'ASC',
        ],
      ],
    });

    const count = await this.assessmentReponseModel.count({
      where: {
        participant_id: partId,
      },
    });
    return { assessmResponse, count };
  }

  async assessmAssessors(
    partAssessmId: string,
    grpActRoomId: string,
  ): Promise<any> {
    let participant_assessment = {};
    if (partAssessmId) {
      participant_assessment = {
        participant_assessment_id: partAssessmId,
      };
    } else {
      participant_assessment = {
        gr_act_room: grpActRoomId,
      };
    }
    const assessor = await this.assessorsModel.findAll({
      attributes: ['id', 'assessor_name'],
      include: [
        {
          model: this.classAssessmentsAssessorsModel,
          as: 'class_assessors',
          where: participant_assessment,
          attributes: [],
          required: true,
        },
      ],
    });
    return assessor;
  }

  async getResp_of_single_assesm(assesmRespId: string): Promise<any> {
    const asessm = await this.assessorsMeetScoreModel.findAll({
      where: {
        assem_resp_id: assesmRespId,
      },
    });
    return asessm;
  }
}
