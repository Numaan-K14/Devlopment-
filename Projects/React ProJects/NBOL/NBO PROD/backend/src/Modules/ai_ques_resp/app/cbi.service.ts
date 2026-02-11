import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  AiReportResponseDto,
  AiResponseDto,
  AiScoreResponseDto,
  SubmitAnswerDto,
} from '../dto/cbi.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import {
  cbiProgressStatus,
  CoreQuestionResponse,
} from '../model/core_ques_resp.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { ExpectedBehaviours } from 'src/Modules/competencies/model/expected_behaviour.model';
import axios from 'axios';
import { PropQuesResp } from '../model/prop_ques_resp.model';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { CbiReport } from '../model/cbi_report.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { progressStatus } from 'src/Modules/class-configration/model/groupActivityParticipants.model';
import { UpdateCbiReportDto } from '../dto/updateCbiReport.dto';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { NbolClientCompetency } from 'src/Modules/competencies/model/nbol_client_competency.model';
// import { AxiosResponse } from 'axios';

@Injectable()
export class CbiService {
  constructor(
    @InjectModel(ParticipantsAssessments)
    private participantsAssessmentsModel: typeof ParticipantsAssessments,
    // @InjectModel(Quessionnaires)
    // private quessionnairesModel: typeof Quessionnaires,
    @InjectModel(Questions)
    private questionsModel: typeof Questions,
    @InjectModel(CoreQuestionResponse)
    private coreQuestionResponseModel: typeof CoreQuestionResponse,
    @InjectModel(PropQuesResp)
    private propQuesRespModel: typeof PropQuesResp,
    @InjectModel(Participants)
    private participantModel: typeof Participants,
    @InjectModel(CbiReport)
    private CbiReportModel: typeof CbiReport,
    private sequelize: Sequelize,
    private readonly requestParams: RequestParamsService,
  ) {}

  async submitAnswer(submitAnswerDto: SubmitAnswerDto) {
    let coreQuestionStatus = {};
    const updatePromises: any = [];
    let transaction: Transaction | null = await this.sequelize.transaction();

    try {
      for (let i = 0; i < submitAnswerDto.conversation.length; i += 2) {
        const current = submitAnswerDto.conversation[i];
        const next = submitAnswerDto.conversation[i + 1];

        if (!current || !next) continue;

        const model: any =
          i === 0 ? this.coreQuestionResponseModel : this.propQuesRespModel;

        // Combine find + update into one call
        updatePromises.push(
          model.update(
            { response: next.text },
            {
              where: {
                id: current.id,
                response: null,
              },
              transaction,
            },
          ),
        );
      }

      // Perform all DB updates in parallel
      await Promise.all(updatePromises);

      let AiResponse: { data: AiResponseDto } | null = null;

      try {
        AiResponse = await axios.post(
          `${process.env.LAMBDA_ENDPOINT}/ai/analyze`,
          {
            ...submitAnswerDto,
            competency_key: submitAnswerDto['competency_name'],
          },
        );

        console.log(
          AiResponse.data,
          '<========================================================Ai response',
        );
      } catch (error: any) {
        transaction.rollback();
        transaction = null;
        throw new HttpException(
          'AI Service Failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (AiResponse) {
        if (AiResponse.data.status === 'inprogress' || AiResponse.data.probe) {
          await this.propQuesRespModel.create({
            question_text: AiResponse.data.probe,
            core_ques_id: submitAnswerDto.conversation[0].id,
          } as any);

          coreQuestionStatus = {
            status: cbiProgressStatus.INPROGRESS,
          };

          await this.participantModel.update(
            {
              cbi_status: 'inprogress' as cbiProgressStatus,
            },
            {
              where: {
                id: submitAnswerDto['participant_id'],
              },
              transaction,
            },
          );
        } else if (AiResponse.data.status === 'complete') {
          await this.coreQuestionResponseModel.update(
            {
              status: cbiProgressStatus.COMPLETED,
            } as any,
            {
              where: {
                id: submitAnswerDto.conversation[0].id,
              },
              transaction,
            },
          );
        }

        await this.coreQuestionResponseModel.update(
          {
            behavior_alignment: AiResponse.data.behavior_alignment,
            reasoning: AiResponse.data.reasoning,
            ...coreQuestionStatus,
          },
          {
            where: {
              id: submitAnswerDto.conversation[0].id,
            },
            transaction,
          },
        );
      }

      let isAssessmentCompleted = false;
      let totalQuestionCount = 0;

      // await transaction.commit();
      // transaction = null;

      if (!AiResponse?.data.probe) {
        let allCoreQuestions = await this.coreQuestionResponseModel.findAll({
          where: {
            participant_id: submitAnswerDto['participant_id'],
            quessionaire_id: submitAnswerDto['questionnaire_id'],
          },
          attributes: ['id', 'status'],
          raw: true,
          transaction,
        });

        isAssessmentCompleted = allCoreQuestions.every(
          (q) => q.status === cbiProgressStatus.COMPLETED,
        );

        if (isAssessmentCompleted) {
          const coreIds = allCoreQuestions.map((q) => q.id);

          const coreCount = allCoreQuestions.length;

          const propCount = await this.propQuesRespModel.count({
            where: { core_ques_id: coreIds },
          });

          totalQuestionCount = coreCount + propCount;

          await this.getFinalScore(
            submitAnswerDto['questionnaire_id'],
            submitAnswerDto['participant_id'],
            transaction,
          );

          await this.participantModel.update(
            {
              cbi_status: cbiProgressStatus.COMPLETED,
            },
            {
              where: {
                id: submitAnswerDto['participant_id'],
              },
              transaction,
            },
          );
        }
      }

      await transaction.commit();
      transaction = null;

      return {
        message: 'Answer submitted successfully',

        is_assessment_completed: isAssessmentCompleted,
        is_prop_ques_available: !!AiResponse.data.probe,
        ...(isAssessmentCompleted && {
          total_question_count: totalQuestionCount,
        }),
      };
    } catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      throw new HttpException(
        {
          message: error.message || 'Submit Answer Failed',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFinalScore(
    questionnaireId: string,
    participantId: string,
    transaction?: Transaction,
  ): Promise<any> {
    const isExternalTransaction = !!transaction;
    const tr: Transaction = transaction || (await this.sequelize.transaction());

    let allCoreQuestions = await this.coreQuestionResponseModel.findAll({
      where: {
        participant_id: participantId,
        quessionaire_id: questionnaireId,
      },
      include: [
        {
          model: Questions,
          as: 'questions',
          attributes: ['id', 'question'],
        },
        {
          model: PropQuesResp,
          as: 'prop_ques_resp',
          attributes: ['id', 'question_text', 'response'],
        },
        {
          model: Competencies,
          as: 'competency',
          attributes: ['id', 'competency'],
          include: [
            {
              model: ExpectedBehaviours,
              as: 'expected_behaviours',
              attributes: ['id', 'expected_behaviour'],
            },
            {
              model: NbolLeadLevels,
              as: 'nbol_leadership_level',
              attributes: ['id', 'leadership_level'],
            },
          ],
        },
      ],
      transaction: tr,
    });

    let items = allCoreQuestions.map((ques) => {
      let conversation: { role: string; text: string }[] = [];

      conversation.push(
        ...[
          {
            role: 'assistant',
            text: ques.questions.question,
          },
          {
            role: 'user',
            text: ques.response || '',
          },
        ],
      );

      ques.prop_ques_resp?.forEach((propQues) => {
        conversation.push(
          ...[
            {
              role: 'assistant',
              text: propQues.question_text,
            },
            {
              role: 'user',
              text: propQues.response || '',
            },
          ],
        );
      });

      return {
        conversation,
        competency_key: ques.competency.competency,
        level: ques.competency.nbol_leadership_level.leadership_level,
        expected_behaviours: ques.competency.expected_behaviours.map(
          (eb) => eb.expected_behaviour,
        ),
        question_id: ques?.id,
      };
    });

    // console.log({ items }, '<===items');
    if (allCoreQuestions.length) {
      try {
        let AiScoreResponse: { data: { results: AiScoreResponseDto[] } } =
          await axios.post(`${process.env.LAMBDA_ENDPOINT}/ai/score`, {
            items,
          });
        if (AiScoreResponse?.data?.results?.length) {
          console.log(
            AiScoreResponse?.data?.results,
            '<=====================Ai Score Response',
          );
          let aiScorePromises: any = [];
          AiScoreResponse.data?.results?.forEach((res) => {
            aiScorePromises.push(
              this.coreQuestionResponseModel.update(
                {
                  rating: res?.rating,
                  reasoning: res?.rationale,
                  evidence: res?.evidence,
                  behavior_alignment: res?.behavior_alignment,
                },
                {
                  where: {
                    id: res?.question_id,
                  },
                  transaction: tr,
                },
              ),
            );
          });
          await Promise.all(aiScorePromises);
          if (!isExternalTransaction) {
            await tr.commit();
          }
          console.log(
            'scroring done===========================================================',
          );
        }
      } catch (error: any) {
        if (!isExternalTransaction) {
          await tr.rollback();
        }
        if (error.isAxiosError) {
          console.error('Lambda Error:', error.response?.data || error.message);
        } else {
          console.error('Unexpected Error:', error);
        }
        throw new InternalServerErrorException('AI Scoring service failed.');
      }
    }

    return {
      message: 'Final scores computed and saved successfully',
    };
  }

  async generateReportData(
    questionnaireId: string,
    participantId: string,
  ): Promise<any> {
    let transaction: Transaction | null = await this.sequelize.transaction();

    let allCoreQuestions = await this.coreQuestionResponseModel.findAll({
      where: {
        participant_id: participantId,
        quessionaire_id: questionnaireId,
      },
      include: [
        {
          model: Questions,
          as: 'questions',
          attributes: ['id', 'question'],
        },

        {
          model: Competencies,
          as: 'competency',
          attributes: ['id', 'competency'],
        },
      ],
      transaction,
    });

    // if (allCoreQuestions.length === 0) {
    //   throw new HttpException(
    //     'No completed core questions found for report generation',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    let participant = await this.participantModel.findOne({
      where: { id: participantId },
      attributes: ['id', 'position', 'project_id'],
      include: [
        {
          model: Projects,
          as: 'project',
          attributes: ['id', 'nbol_ll_id'],
          include: [
            {
              model: NbolLeadLevels,
              as: 'nbol',
              attributes: ['id', 'leadership_level'],
            },
          ],
        },
      ],
      transaction,
    });

    let AiReportResponseData: {
      data: AiReportResponseDto;
    } | null = null;

    if (allCoreQuestions.length) {
      let outcomes: {
        key: string;
        rating: number;
        rationale: string;
        evidence: any;
        behavior_alignment: any;
        question_id: string;
      }[] = allCoreQuestions.map((ques) => {
        return {
          key: ques.competency.competency,
          rating: ques.rating,
          rationale: ques.reasoning,
          evidence: ques.evidence,
          behavior_alignment: ques.behavior_alignment,
          question_id: ques?.id,
        };
      });

      try {
        const RequestBody = {
          role: participant?.position,
          level: participant?.project?.nbol?.leadership_level,
          outcomes,
        };

        AiReportResponseData = await axios.post(
          `${process.env.LAMBDA_ENDPOINT}/ai/report`,
          {
            ...RequestBody,
          },
        );

        if (AiReportResponseData?.data) {
          console.log(
            AiReportResponseData?.data,
            '<=====================Ai Report Response',
          );

          await this.CbiReportModel.create(
            {
              overall_score: AiReportResponseData.data.overall.score,
              overall_scale: AiReportResponseData.data.overall.scale,
              strengths: {
                rows: AiReportResponseData.data.strengths,
                overall_strength: AiReportResponseData?.data?.overall_strength,
              },
              development_areas: {
                rows: AiReportResponseData.data.development_areas,
                overall_development:
                  AiReportResponseData?.data?.overall_development,
              },
              recommendations:
                AiReportResponseData.data.development_suggestions,
              participant_id: participantId,
            } as any,
            {
              transaction,
            },
          );
        }
      } catch (error: any) {
        await transaction?.rollback();
        if (error.isAxiosError) {
          console.error('Lambda Error:', error.response?.data || error.message);
        } else {
          console.error('Unexpected Error:', error);
        }
        throw new InternalServerErrorException('AI Reporting service failed.');
      }
    }

    await transaction.commit();
    transaction = null;

    return {
      message: 'Report data computed and saved successfully',
    };
  }

  async getParticipantAssessment(
    participantId: string,
    clientId: string,
    cohortId: string,
  ): Promise<any> {
    const countCompetency = await NbolClientCompetency.count({
      where: {
        client_id: clientId,
      },
    });
    const cbiAssessmentDuration = await Class.findOne({
      where: {
        cohort_id: cohortId,
      },
      attributes: ['cbi_assess_duration'],
    });

    let timer: number = 0;
    if (
      typeof cbiAssessmentDuration?.cbi_assess_duration === 'number' &&
      countCompetency > 0
    ) {
      timer = Math.round(
        cbiAssessmentDuration.cbi_assess_duration / countCompetency,
      );
    }

    const partiAssessments = await this.participantsAssessmentsModel.findOne({
      where: { participant_id: participantId },
      include: [
        {
          model: Assessments,
          as: 'assessment',
          where: {
            is_cbi: true,
          },
          attributes: [],
        },
      ],
      attributes: ['quessionnaire_id'],
    });

    let questions = await this.questionsModel.findAll({
      where: { quesionnaire_id: partiAssessments?.quessionnaire_id },
    });

    let existingCoreQuestions = await this.coreQuestionResponseModel.findOne({
      where: {
        participant_id: participantId,
        quessionaire_id: partiAssessments?.quessionnaire_id,
      },
    });

    if (!existingCoreQuestions && questions.length > 0) {
      await this.coreQuestionResponseModel.bulkCreate(
        questions.map(
          (question, index) =>
            ({
              question_id: question.id,
              competency_id: question.competency_id,
              quessionaire_id: partiAssessments?.quessionnaire_id,
              participant_id: participantId,
              sequence: index + 1,
            }) as any,
        ),
      );
    }

    if (!partiAssessments) {
      throw new HttpException('Assessment not found', HttpStatus.NOT_FOUND);
    }
    return {
      partiAssessments,
      each_section_timer: timer,
      sections: countCompetency,
    };
  }

  async getQuestions(questionnaireId: string, participantId: string) {
    const includesForCore: any = [
      {
        model: Competencies,
        as: 'competency',
        order: [['createdAt', 'ASC']],
        attributes: ['id', 'competency'],
        include: [
          {
            model: ExpectedBehaviours,
            as: 'expected_behaviours',
            attributes: ['id', 'expected_behaviour'],
          },
        ],
      },
      {
        model: Questions,
        as: 'questions',
        attributes: ['id', 'question'],
      },
      {
        model: PropQuesResp,
        as: 'prop_ques_resp',
        attributes: ['id', 'question_text', 'response', 'createdAt'],
        // order: [['createdAt', 'DESC']],
      },
    ];

    const includesForOthers: any = [
      {
        model: Competencies,
        as: 'competency',
        order: [['createdAt', 'ASC']],
        attributes: ['id', 'competency'],
        include: [
          {
            model: ExpectedBehaviours,
            as: 'expected_behaviours',
            attributes: ['id', 'expected_behaviour'],
          },
        ],
      },
      {
        model: Questions,
        as: 'questions',
        attributes: ['id', 'question'],
      },
      {
        model: PropQuesResp,
        as: 'prop_ques_resp',
        attributes: ['id', 'question_text', 'response', 'createdAt'],
        separate: true,
        order: [['createdAt', 'ASC']],
      },
    ];
    const where = {
      quessionaire_id: questionnaireId,
      participant_id: participantId,
    };

    let inProgressQuestion = await this.coreQuestionResponseModel.findOne({
      where: {
        status: cbiProgressStatus.INPROGRESS,
        ...where,
      },
      include: [...includesForOthers],
      // order: [
      //   [{ model: PropQuesResp, as: 'prop_ques_resp' }, 'createdAt', 'ASC'],
      // ],
    });

    if (inProgressQuestion) {
      return inProgressQuestion;
    } else {
      let pausedQuestion = await this.coreQuestionResponseModel.findOne({
        where: {
          status: cbiProgressStatus.PAUSED,
          ...where,
        },
        include: [...includesForOthers],
        // order: [
        //   [{ model: PropQuesResp, as: 'prop_ques_resp' }, 'createdAt', 'ASC'],
        // ],
      });

      if (pausedQuestion) {
        return pausedQuestion;
      }

      let question = await this.coreQuestionResponseModel.findOne({
        where: {
          status: cbiProgressStatus.PENDING,
          ...where,
        },
        include: [...includesForCore],
        order: [
          ['sequence', 'ASC'],
          [{ model: PropQuesResp, as: 'prop_ques_resp' }, 'createdAt', 'ASC'],
        ],
      });
      return question;
    }
  }

  async pauseAssessment(questionnaireId: string, participantId: string) {
    await this.coreQuestionResponseModel.update(
      {
        status: cbiProgressStatus.PAUSED,
      },
      {
        where: {
          status: cbiProgressStatus.PENDING,
          quessionaire_id: questionnaireId,
          participant_id: participantId,
        },
      },
    );

    await this.participantModel.update(
      {
        cbi_status: cbiProgressStatus.PAUSED,
      },
      {
        where: {
          id: participantId,
        },
      },
    );

    return 'Assessment paused successfully';
  }

  async getReportData(participantId: string): Promise<any> {
    const reportData = await this.CbiReportModel.findOne({
      where: { participant_id: participantId },
      include: [
        {
          model: Participants,
          as: 'participant',
          attributes: ['id', 'participant_name', 'email', 'position'],
        },
      ],
    });
    console.log(reportData, '<==================reportDattatatattat');

    let allCoreQuestions = await this.coreQuestionResponseModel.findAll({
      where: {
        participant_id: participantId,
        status: cbiProgressStatus.COMPLETED,
      },
    });

    const coreIds = allCoreQuestions.map((q) => q.id);

    const coreCount = allCoreQuestions.length;

    const propCount = await this.propQuesRespModel.count({
      where: { core_ques_id: coreIds },
    });

    console.log(
      coreCount,
      '<==================Cpountttttttttttttttt================',
      propCount,
    );

    let totalQuestionCount = coreCount + propCount;

    if (!reportData) {
      throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
    }
    return { reportData, totalQuestionCount };
  }

  async participantsFilter(
    clientId?: string,
    projectId?: string,
    cohortId?: string,
    page?: number,
    limit?: number,
  ): Promise<any> {
    const offset = page ? page * (limit ? limit : 100) : 0;
    const where: any = {
      ...getSearchObject(this.requestParams.query, [
        'participant_name',
        'email',
      ]),
    };
    if (clientId) {
      where.client_id = clientId;
      const client = await Clients.findByPk(clientId);
      if (!client) {
        throw new HttpException(
          {
            message: 'Client not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (cohortId) {
      where.cohort_id = cohortId;
      const cohort = await Cohorts.findByPk(cohortId);
      if (!cohort) {
        throw new HttpException(
          {
            message: 'Cohort not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
    if (projectId) {
      where.project_id = projectId;
      const project = await Projects.findByPk(projectId);
      if (!project) {
        throw new HttpException(
          {
            message: 'Project not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const participants = await this.participantModel.findAll({
      where,
      offset,
      limit,
      attributes: [
        'id',
        'participant_name',
        'email',
        'position',
        'cbi_status',
        'cbi_score_submitted',
        'createdAt',
      ],
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: this.CbiReportModel,
          as: 'cbi_report',
          attributes: ['id', 'overall_score', 'overall_scale', 'createdAt'],
        },
      ],
    });
    if (participants.length <= 0) {
      throw new HttpException(
        {
          message: 'Participants not found',
          data: participants,
        },
        HttpStatus.OK,
      );
    }

    const count = await this.participantModel.count({ where });
    return {
      rows: participants,
      count,
      page,
    };
  }

  async dashboardData(): Promise<any> {
    const totalParticipants = await this.participantModel.count();
    const reportCompletedPart = await this.participantModel.count({
      where: {
        cbi_status: cbiProgressStatus.COMPLETED,
      },
    });
    const reportPausedPart = await this.participantModel.count({
      where: {
        cbi_status: cbiProgressStatus.PAUSED,
      },
    });
    const reportInprogressPart = await this.participantModel.count({
      where: {
        cbi_status: cbiProgressStatus.INPROGRESS,
      },
    });
    return {
      total_participants: totalParticipants,
      report_completed_participants: reportCompletedPart,
      report_paused_participants: reportPausedPart,
      report_inprogress_participants: reportInprogressPart,
    };
  }

  async getPartResponseScore(participantId: string): Promise<any> {
    const allCoreQuestions = await this.coreQuestionResponseModel.findAll({
      where: {
        participant_id: participantId,
      },
      attributes: ['id', 'rating', 'response', 'quessionaire_id'],
      include: [
        {
          model: Competencies,
          as: 'competency',
          attributes: ['id', 'competency'],
        },
        {
          model: Questions,
          as: 'questions',
          attributes: ['id', 'question'],
        },
        {
          model: PropQuesResp,
          as: 'prop_ques_resp',
          attributes: ['id', 'question_text', 'response'],
        },
        {
          model: Participants,
          as: 'participant',
          attributes: ['id', 'cbi_score_submitted'],
        },
      ],
    });
    return allCoreQuestions;
  }

  async updateParticipantFinalScore(
    participantId: string,
    cbi_score_submitted: string,
    finalScore: {
      id: string;
      rating: number;
      questionnaire_id: string;
      question_id: string;
      competency_id: string;
    }[],
  ): Promise<any> {
    let transaction: Transaction | null = await this.sequelize.transaction();
    try {
      await this.coreQuestionResponseModel.bulkCreate(
        finalScore.map(
          (score) =>
            ({
              id: score.id,
              rating: score.rating,
              participant_id: participantId,
              quessionaire_id: score.questionnaire_id,
              question_id: score.question_id,
              competency_id: score.competency_id,
            }) as any,
        ),
        {
          updateOnDuplicate: ['rating'],
          transaction,
        },
      );
      await this.participantModel.update(
        {
          cbi_score_submitted: cbi_score_submitted as progressStatus,
        },
        {
          where: {
            id: participantId,
          },
          transaction,
        },
      );
      await transaction.commit();

      if (cbi_score_submitted === 'completed') {
        await this.generateReportData(
          finalScore[0].questionnaire_id,
          participantId,
        );
      }

      return 'Participant final score updated successfully';
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async getParticipantReportData(participantId: string): Promise<any> {
    const partReport = await this.CbiReportModel.findOne({
      where: {
        participant_id: participantId,
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!partReport) {
      throw new HttpException('CBI Report not found', HttpStatus.NOT_FOUND);
    }
    return partReport;
  }

  async updateParticipantReport(
    partReportId: string,
    updateCbiReportDto: UpdateCbiReportDto,
  ): Promise<any> {
    let cbiReport = await this.CbiReportModel.findByPk(partReportId);

    if (!cbiReport) {
      throw new HttpException('CBI Report not found', HttpStatus.NOT_FOUND);
    }

    if (cbiReport) {
      await this.CbiReportModel.update(
        {
          strengths: {
            ...cbiReport?.strengths,
            overall_strength: updateCbiReportDto.strengths,
          },
          development_areas: {
            ...cbiReport?.development_areas,
            overall_development: updateCbiReportDto.development_areas,
          },
          recommendations: updateCbiReportDto.recommendations,
          is_report_submitted:
            updateCbiReportDto.is_report_submitted as cbiProgressStatus,
        },
        {
          where: {
            id: partReportId,
          },
        },
      );
    }
  }
}
