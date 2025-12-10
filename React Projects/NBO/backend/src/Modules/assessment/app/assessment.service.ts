import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Assessments } from '../model/assessment.model';
import { Scenerios } from '../model/scenerio.model';
import { createAssessment } from '../dto/create-assessment.dto';
import { createScenerio } from '../dto/create-scenerio.dto';
import * as pdf from 'pdf-parse';
import { asNumber, PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist';
import * as fs from 'fs';
import * as pdfjs from 'pdfjs-dist';
import { off } from 'process';
import { count } from 'console';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { ClientAssessments } from '../model/client-assessments.model';
import { TypeOptions } from 'class-transformer';
import { CreationAttributes, literal, Model, Op } from 'sequelize';
import { Rooms } from 'src/Modules/facilities/model/rooms.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import * as XLSX from 'xlsx';
import * as crypto from 'crypto';
import { Questions } from '../model/questions.model';
import { Quessionnaires } from '../model/quessionnaire.model';
import { CreateQuessionnaireDto } from '../dto/quesionnaire.dto';
import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';
import { Projects } from 'src/Modules/client-project/project.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { ClientRoles } from 'src/Modules/client-roles-levels/model/role.model';
import * as ExcelJS from 'exceljs';
import { NbolClientCompetency } from 'src/Modules/competencies/model/nbol_client_competency.model';
import { ParticipantScore } from 'src/Modules/class-configration/model/participantScore.model';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { ClassAssessments } from 'src/Modules/class-configration/model/classAsessments.model';
import { createClientAssessment } from '../dto/createClientAssessment.dto';
import { AssessorsMeetScore } from 'src/Modules/class-configration/model/assessorsMeetScore.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ExpectedBehaviours } from 'src/Modules/competencies/model/expected_behaviour.model';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectModel(Assessments)
    private assessmentModel: typeof Assessments,

    @InjectModel(Scenerios)
    private scenerioModel: typeof Scenerios,

    @InjectModel(Clients)
    private clientModel: typeof Clients,

    @InjectModel(ClientAssessments)
    private clientAssessmentModel: typeof ClientAssessments,

    @InjectModel(Questions)
    private questionModel: typeof Questions,

    @InjectModel(Quessionnaires)
    private quessionnaireModel: typeof Quessionnaires,

    @InjectModel(Projects)
    private projectModel: typeof Projects,

    @InjectModel(Cohorts)
    private cohortModel: typeof Cohorts,

    @InjectModel(NbolLeadLevels)
    private nbolLeadModel: typeof NbolLeadLevels,

    @InjectModel(Competencies)
    private competencyModel: typeof Competencies,

    @InjectModel(ParticipantScore)
    private participantScoreModel: typeof ParticipantScore,

    @InjectModel(AssessmentResponse)
    private assessmentReponseModel: typeof AssessmentResponse,

    @InjectModel(AssessorsMeetScore)
    private assessorMeetScoreModel: typeof AssessorsMeetScore,

    @InjectModel(QuessionnaireResponse)
    private quessRespModel: typeof QuessionnaireResponse,

    private sequelize: Sequelize,

    private readonly requestParams: RequestParamsService,
  ) {}

  //   ========================================================
  async convertPdfToHtml(fileBuffer: Buffer): Promise<string> {
    const data = await pdf(fileBuffer);
    const cleanedText = this.removeFooter(data.text);
    return this.convertTextToHtml(cleanedText);
  }

  private removeFooter(text: string): string {
    return text
      .replace(/\nCopyright.*?\n/g, '')
      .replace(/\nPage\s+\d+\s+of\s+\d+\n?/gi, '');
  }

  private convertTextToHtml(text: string): string {
    let html = text
      .split('\n\n')
      .map((para) => `<p>${para.trim()}</p>`)
      .join('');

    html = html.replace(
      /(?:\n|^)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\n/g,
      '<h2>$1</h2>',
    );

    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');

    html = html.replace(/__(.*?)__/g, '<u>$1</u>');

    return `<html><body>${html}</body></html>`;
  }
  //   =========================================================
  async createAssessment(createAssessment: createAssessment): Promise<any> {
    const assessment = await this.assessmentModel.create({
      assessment_name: createAssessment.assessment_name,
    } as Assessments);

    return assessment;
  }

  async download() {
    try {
      const fileName = 'quesionnair_data.xlsx';
      return {
        fileName,
        filePath: 'public/excel/quesionnair_data.xlsx',
      };
    } catch (error) {
      throw new Error(`Failed To Download Excel File: ${error.message}`);
    }
  }

  async downloadQuestionsWithCompetencyDropdown(
    clientId: string,
  ): Promise<any> {
    try {
      // const competencies = await this.competencyModel.findAll({
      //   where: {
      //     client_id: clientId,
      //     is_copy: true,
      //   },
      //   attributes: ['id', 'competency'],
      //   group: ['id', 'competency'],
      // });

      const competencies = await this.competencyModel.findAll({
        attributes: ['id', 'competency'],
        group: [
          Sequelize.col('Competencies.id'),
          Sequelize.col('Competencies.competency'),
        ],
        where: {
          [Op.or]: [
            {
              [Op.and]: [{ client_id: clientId }, { is_copy: null }],
            },
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
        order: [
          this.sequelize.literal(
            `CASE 
            WHEN "Competencies".competency = 'Strategic Vision and Insight' THEN 1
            WHEN "Competencies".competency = 'Business Acumen and Financial Stewardship' THEN 2
            WHEN "Competencies".competency = 'Innovation and Transformation Leadership' THEN 3
            WHEN "Competencies".competency = 'Inspirational Leadership and Decision-Making' THEN 4
            WHEN "Competencies".competency = 'Collaborative Influence and Stakeholder Engagement' THEN 5
            WHEN "Competencies".competency = 'Talent Development and Inclusion' THEN 6
            ELSE 7
          END`,
          ),
        ],
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
        ],
        // order: [['createdAt', 'DESC']],
      });

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Questions Excel', {
        views: [{ state: 'frozen', ySplit: 1 }],
      });
      const competencySheet = workbook.addWorksheet('Competency');

      competencySheet.columns = [
        {
          header: 'Competency',
          key: 'competency',
          width: 0,
          hidden: true,
        },
      ];

      competencySheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.protection = { locked: true };
        });
      });

      await competencySheet.protect('1234', {
        selectLockedCells: false,
        selectUnlockedCells: true,
      });

      const competencyList = competencies.map((c) => ({
        competency: c.competency,
      }));
      competencySheet.addRows(competencyList);

      sheet.columns = [
        { header: 'Competency', key: 'competency', width: 50 },
        { header: 'Questions', key: 'question', width: 50 },
      ];

      sheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.protection = { locked: true };
        });
      });

      await sheet.protect('1234', {
        selectLockedCells: false,
        selectUnlockedCells: true,
      });

      for (let row = 2; row <= 9999; row++) {
        const cellUnlocked_A = sheet.getCell(`A${row}`);
        cellUnlocked_A.protection = { locked: false };

        const cellUnlocked_B = sheet.getCell(`B${row}`);
        cellUnlocked_B.protection = { locked: false };

        const cell = sheet.getCell(`A${row}`);
        cell.dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: [`'Competency'!$A$2:$A${competencyList.length + 1}`],
          showErrorMessage: true,
          errorStyle: 'error',
          errorTitle: 'Invalid Competency',
          error: 'Select a valid Competency',
        };
      }

      const fileName = 'questions_with_competency.xlsx';
      const folderPath = path.join(__dirname, '../../../../public/excel');
      const filePath = path.join(folderPath, fileName);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      return {
        fileName,
        filePath: `public/excel/${fileName}`,
      };
    } catch (error) {
      throw new Error(`Failed To Generate Excel File: ${error.message}`);
    }
  }

  async processExcelFile(
    assessmentId: string,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Excel File Is Empty No Valid Competency Found.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let createData = jsonData?.map((item) => {
        return { ...item, assessment_id: assessmentId };
      });

      await this.quessionnaireModel.bulkCreate(createData);

      // return JSON.stringify(createData);
      return {
        message: 'Excel File Processed Successfully',
        data: createData,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed To Create Quessionnaire: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async convertExcelToHtml(fileBuffer: Buffer): Promise<any> {
  //   try {
  //     const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

  //     if (jsonData.length === 0) {
  //       throw new HttpException(
  //         {
  //           status: 400,
  //           success: false,
  //           message: 'Excel file is empty No Valid Questions Found.',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     const html = this.convertJsonToHtmlTable(jsonData);

  //     return {
  //       success: true,
  //       message: 'Excel file converted to HTML successfully',
  //       html,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: 400,
  //         success: false,
  //         message: `${error.message}`,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // -=-=-=-=

  // private convertJsonToHtmlTable(jsonData: any[]): any {
  //   if (!jsonData || jsonData.length === 0) {
  //     throw new HttpException(
  //       {
  //         status: 400,
  //         success: false,
  //         message: 'No Data Available ',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const processedData = jsonData.map((row) => ({
  //     question: row.Questions,
  //     id: row.id,
  //     comptency: row.competency
  //   }));

  //   processedData.map((item) => {
  //     if (item.question === '') {
  //       throw new HttpException(
  //         {
  //           status: 400,
  //           success: false,
  //           message: 'Empty Data Found In Questions ',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   });

  //   return {
  //     message: 'Excel file processed successfully',
  //     data: processedData,
  //   };
  // }

  async convertExcelToHtml(fileBuffer: Buffer, clientId: string): Promise<any> {
    try {
      // const competencies = await this.competencyModel.findAll({
      //   where: { client_id: clientId },
      //   attributes: ['id', 'competency'],
      // });

      const competencies = await this.competencyModel.findAll({
        attributes: ['id', 'competency'],
        group: [
          Sequelize.col('Competencies.id'),
          Sequelize.col('Competencies.competency'),
        ],
        where: {
          [Op.or]: [
            {
              [Op.and]: [{ client_id: clientId }, { is_copy: null }],
            },
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
        ],
      });
      const compMap = new Map(
        competencies.map((c) => [c.competency.trim(), c.id]),
      );

      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Excel File Is Empty No Valid Questions Found.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const html = this.convertJsonToHtmlTable(jsonData, compMap);

      return {
        success: true,
        message: 'Excel File Converted To HTML Successfully',
        html,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private convertJsonToHtmlTable(
    jsonData: any[],
    compMap: Map<string, string>,
  ): any {
    if (!jsonData || jsonData.length === 0) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'No Data Available ',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const processedData = jsonData.map((row) => {
      const question = row.Questions ?? row.questions ?? row.question ?? '';
      const competency =
        row.competency ?? row.Competency ?? row.comptency ?? '';
      const competency_id = compMap.get((competency || '').trim()) ?? null;

      return { question, competency, competency_id };
    });

    processedData.forEach((item, idx) => {
      if (!item.question || item.question.trim() === '') {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: `Empty Data Found In Questions At Row ${idx + 2}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    return {
      message: 'Excel File Processed Successfully',
      data: processedData,
    };
  }

  async createQuessionnaire(
    assessmentId: string,
    createQuessionnaireDto: CreateQuessionnaireDto,
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try {
      const competencies = await NbolClientCompetency.findAll({
        where: {
          client_id: createQuessionnaireDto.client_id,
        },
        attributes: ['ref_nbol_compt_id'],
      });

      const competencyIds = competencies.map((c) => c.ref_nbol_compt_id);
      const questionCompetencyIds = createQuessionnaireDto.questions.map(
        (q) => q.competency_id,
      );

      const missingIds = competencyIds.filter(
        (id) => !questionCompetencyIds.includes(id),
      );

      if (missingIds.length > 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: `Please upload one question for each competency.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const quessionnaire = await this.quessionnaireModel.create(
        {
          quesionnaire_name: createQuessionnaireDto.quesionnaire_name,
          assessment_id: assessmentId,
          client_id: createQuessionnaireDto.client_id,
          project_id: createQuessionnaireDto.project_id,
        } as unknown as CreationAttributes<Quessionnaires>,

        { transaction },
      );

      const questionsData = createQuessionnaireDto.questions.map(
        (question) => ({
          // ...question,
          question: question.question,
          competency_id: question.competency_id,
          quesionnaire_id: quessionnaire.id,
        }),
      );

      await this.questionModel.bulkCreate(
        questionsData as unknown as CreationAttributes<Questions>[],
        { transaction },
      );
      await transaction.commit();
      return {
        success: true,
        message: 'Quessionnaire And Questions Created Successfully',
        data: {
          quessionnaire,
          questions: questionsData,
        },
      };
    } catch (error) {
      await transaction.rollback();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed To Create Quessionnaire: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllQuessionnaires(
    projectId: string,
    cohortId: string,
    assessmentId: string,
  ): Promise<any> {
    const quessionnaires = await this.quessionnaireModel.findAll({
      where: {
        project_id: projectId,
        assessment_id: assessmentId,
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`
              EXISTS (
                  SELECT 1 FROM client_assessments 
                  WHERE client_assessments.quesionnaire_id = "Quessionnaires"."id"
                  AND client_assessments.cohort_id = '${cohortId}'
                  AND client_assessments.assessment_id = '${assessmentId}'
                ) 
            `),
            'status',
          ],
        ],
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Questions,
          as: 'questions',
        },
      ],
    });

    return {
      rows: quessionnaires,
    };
  }

  async getClientQuesionnaire(
    clintId: string,
    cohortId: string,
    participantId: string,
    assessmentId: string,
    par_ass_id: string,
    quessionaire_id: string,
    assessor_id: string,
    assem_resp_id: string,
  ): Promise<any> {
    let where = {};
    let as_resp = {};

    if (assem_resp_id) {
      where = {
        [Op.and]: [
          { assessor_id: assessor_id },
          { assem_resp_id: assem_resp_id },
        ],
      };
      // as_resp = {
      //   assessment_response: assem_resp_id,
      // };
      as_resp = {
        assessm_resp_id: assem_resp_id,
      };
    } else {
      where = {
        [Op.and]: [{ assessor_id }],
      };
    }

    // const quessionnaire = await this.quessionnaireModel.findOne({
    //   where: {
    //     id: quessionaire_id,
    //   },
    //   include: [
    //     {
    //       model: Questions,
    //       as: 'questions',
    //       required: false,
    //       include: [
    //         {
    //           model: this.competencyModel,
    //           as: 'competencies',
    //           required: false,
    //           include: [
    //             {
    //               model: this.quessRespModel,
    //               as: 'quess_resp',
    //               where: {
    //                 [Op.and]: [
    //                   literal(
    //                     `"questions->competencies->quess_resp"."question_id" = "questions->competencies"."id"`,
    //                   ),
    //                   as_resp,
    //                 ],
    //               },

    //               include: [
    //                 {
    //                   model: this.assessmentReponseModel,
    //                   as: 'assm_resp',
    //                   attributes: ['id'],
    //                   where: {
    //                     participant_id: participantId,
    //                     assessment_id: assessmentId,
    //                     par_ass_id: par_ass_id,
    //                   },
    //                   required: false,
    //                 },
    //                 {
    //                   model: this.assessorMeetScoreModel,
    //                   as: 'assess_score',
    //                   where: where,
    //                   required: false,
    //                 },
    //               ],
    //             },
    //             // {
    //             //   model: this.participantScoreModel,
    //             //   as: 'participant_score',
    //             //   where: {
    //             //     [Op.and]: [
    //             //       {
    //             //         question_id: literal(
    //             //           '"questions->competencies->participant_score"."question_id" = "questions"."id"',
    //             //         ),
    //             //       },
    //             //       as_resp,
    //             //     ],
    //             //   },
    //             //   required: false,
    //             //   include: [
    //             //     {
    //             //       model: this.assessmentReponseModel,
    //             //       as: 'response',
    //             //       where: {
    //             //         participant_id: participantId,
    //             //         assessment_id: assessmentId,
    //             //         par_ass_id: par_ass_id,
    //             //       },
    //             //       required: false,
    //             //     },
    //             //     {
    //             //       model: this.assessorMeetScoreModel,
    //             //       as: 'sc_pa',
    //             //       where: where,
    //             //       required: false,
    //             //     },
    //             //   ],
    //             // },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       model: this.clientAssessmentModel,
    //       as: 'client_assessment',
    //       attributes: [],
    //       where: {
    //         [Op.and]: [
    //           { client_id: clintId },
    //           { cohort_id: cohortId },
    //           {
    //             scenerio_id: {
    //               [Op.is]: null,
    //             },
    //           },
    //         ],
    //       },
    //     },
    //   ],
    // });

    const quessionnaire = await this.quessionnaireModel.findOne({
      where: {
        id: quessionaire_id,
      },
      include: [
        {
          model: Questions,
          as: 'questions',
          required: false,
          include: [
            {
              model: this.quessRespModel,
              as: 'quess_resp',
              where: as_resp,
              required: false,
              include: [
                {
                  model: this.competencyModel,
                  as: 'competency',
                  required: false,
                  include: [
                    {
                      model: ExpectedBehaviours,
                      as: 'expected_behaviours',
                    },
                  ],
                },
                {
                  model: this.assessmentReponseModel,
                  as: 'assm_resp',
                  attributes: ['id', 'par_ass_id'],
                  where: {
                    participant_id: participantId,
                    assessment_id: assessmentId,
                    par_ass_id: par_ass_id,
                  },
                  required: false,
                },
                {
                  model: this.assessorMeetScoreModel,
                  as: 'assess_score',
                  where: where,
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: this.clientAssessmentModel,
          as: 'client_assessment',
          attributes: [],
          where: {
            [Op.and]: [
              { client_id: clintId },
              { cohort_id: cohortId },
              {
                scenerio_id: {
                  [Op.is]: null,
                },
              },
            ],
          },
        },
      ],
    });
    return quessionnaire;
  }

  async getClientAssessment(
    // clientId: string,
    cohortId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;

    const allAssessment = await this.assessmentModel.findAll({
      where: {
        ...getSearchObject(this.requestParams.query, ['assessment_name']),
      },
      limit: limit,
      offset: offset,
      attributes: {
        include: [
          [
            Sequelize.literal(`
              EXISTS (
                SELECT 1 FROM client_assessments 
                WHERE client_assessments.assessment_id = "Assessments".id
                AND client_assessments.cohort_id = '${cohortId}'
              )
            `),
            'status',
          ],
          [
            Sequelize.literal(`
              (
                SELECT COUNT(*) FROM client_assessments 
                WHERE client_assessments.assessment_id = "Assessments".id
                AND client_assessments.cohort_id = '${cohortId}'
              )
            `),
            'assessment_count',
          ],
        ],
        exclude: ['createdAt', 'updatedAt'],
      },
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

    return {
      rows: allAssessment,
      count: await this.assessmentModel.count({
        where: {
          ...getSearchObject(this.requestParams.query, ['assessment_name']),
        },
      }),
    };
  }

  async getClientSelctedScenerios(
    assessmentId: string,
    cohortId: string,
    page?: number,
    limit?: number,
  ): Promise<any> {
    const offset = page ? page * (limit ? limit : 1000) : 0;
    const SelectedScenerios = await this.scenerioModel.findAll({
      limit: limit,
      offset: offset,
      attributes: {
        include: [
          [
            Sequelize.literal(`
                  CASE WHEN EXISTS (
                    SELECT 1 FROM client_assessments
                    WHERE client_assessments.scenerio_id = "Scenerios".id
                      AND client_assessments.cohort_id = '${cohortId}'
                  ) THEN true ELSE false END
                `),
            'status',
          ],
        ],
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [[Sequelize.literal('status'), 'DESC']],
      where: {
        assessment_id: assessmentId,
        class_id: {
          [Op.eq]: null,
        },
      } as any,
    });

    const count = await this.scenerioModel.count({
      where: {
        assessment_id: assessmentId,
        class_id: {
          [Op.eq]: null,
        },
      } as any,
    });

    return {
      rows: SelectedScenerios,
      count: count,
    };
  }

  async getClientSelectedAssessment(
    clientId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;

    const clientAssessments = await this.assessmentModel.findAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: this.clientAssessmentModel,
          as: 'client_assessments',
          where: {
            client_id: clientId,
          },
          include: [
            {
              model: Clients,
              as: 'client',
            },
            {
              model: Scenerios,
              as: 'scenerio',
            },
          ],
        },
      ],
    });
    return {
      rows: clientAssessments,
      count: clientAssessments.length,
    };
  }

  // async createScenerio(assessmentId: string, createScenerio: createScenerio) {
  //   const scenerio = await this.scenerioModel.create({
  //     scenerio_name: createScenerio.scenerio_name,
  //     description: createScenerio.description,
  //     assessment_id: assessmentId,
  //   } as Scenerios);
  //   return scenerio;
  // }

  async createScenerio(
    fileBuffer: Buffer,
    assessmentId: string,
    createScenerio: createScenerio,
  ) {
    const existingScenerio = await this.scenerioModel.findOne({
      where: {
        scenerio_name: createScenerio.scenerio_name.trim(),
      },
    });
    if (existingScenerio) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Scenerio with this name alredy exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!fileBuffer) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Please upload a file',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const publicFolderPath = path.join(
      __dirname,
      '../../../../public/scenarios',
    );
    if (!fs.existsSync(publicFolderPath)) {
      fs.mkdirSync(publicFolderPath, { recursive: true });
    }

    const fileName = `scenario_${createScenerio.scenerio_name}.pdf`;
    const filePath = path.join(publicFolderPath, fileName);

    fs.writeFileSync(filePath, fileBuffer);

    const scenerio = await this.scenerioModel.create({
      scenerio_name: createScenerio.scenerio_name,
      description: createScenerio.description,
      assessment_id: assessmentId,
      file_location: filePath,
    } as Scenerios);
    return scenerio;
  }

  async assessmentScenerio(
    assessmentId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;
    const assessmentScenerio = await this.scenerioModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        assessment_id: assessmentId,
      },
    });
    const count = await this.scenerioModel.count({
      where: {
        assessment_id: assessmentId,
      },
    });
    return {
      rows: assessmentScenerio,
      count: count,
    };
  }

  async getSingleAssessmentScenerio(
    assessmentId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;
    const assessmentScenerio = await this.scenerioModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        assessment_id: assessmentId,
      },
      attributes: ['id', 'scenerio_name', 'description', 'assessment_id'],
      include: [
        {
          model: ClientAssessments,
          as: 'client_assessment',
        },
      ],
    });

    const count = await this.scenerioModel.count({
      where: {
        assessment_id: assessmentId,
      },
    });
    return {
      rows: assessmentScenerio,
      count: count,
    };
  }

  async updateScenerio(
    scenerioId: string,
    updateScenerio: Partial<createScenerio>,
  ): Promise<any> {
    const scenerio = await this.scenerioModel.findByPk(scenerioId);
    if (!scenerio) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Scenerio Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await scenerio.update(updateScenerio);
    return {
      message: 'Scenerio Updated',
      scenerio,
    };
  }

  async deleteScenerio(scenerioId: string): Promise<any> {
    const scenerio = await this.scenerioModel.findOne({
      where: { id: scenerioId },
      include: [{ model: ClientAssessments, as: 'client_assessment' }],
    });

    if (!scenerio) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Scenerio Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await ClientAssessments.destroy({
      where: { scenerio_id: scenerioId },
    });

    await scenerio.destroy();

    return { message: 'Scenerio Deleted Successfully' };
  }

  // async addClientAssessments(
  //   clientId: string,
  //   cohortId: string,
  //   assessmentId: string,
  //   scenerioId?: string,
  //   questionnairId?: string,
  // ): Promise<any> {
  //   const client = await this.clientModel.findByPk(clientId);
  //   const assessment = await this.assessmentModel.findByPk(assessmentId);
  //   const scenerio = await this.scenerioModel.findByPk(scenerioId);

  //   if (!client) {
  //      throw new HttpException({
  //       status: 400,
  //       success: false,
  //       message:"Client Not Found"
  //     }, HttpStatus.BAD_REQUEST)
  //   }
  //     ;
  //   if (!assessment) {
  //      throw new HttpException({
  //       status: 400,
  //       success: false,
  //       message:"Assessment Not Found"
  //     }, HttpStatus.BAD_REQUEST)
  //   };

  //   const existingEntry = await this.clientAssessmentModel.findOne({
  //     where: { cohort_id: cohortId, assessment_id: assessmentId },
  //   });

  //   if (existingEntry) {
  //     throw new HttpException(
  //       {
  //         status: 400,
  //         success: false,
  //         message:
  //           'Client Has Already Selected This Assessment For This Cohort',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   if (!scenerioId && !questionnairId) {
  //     throw new HttpException(
  //       {
  //         status: 400,
  //         success: false,
  //         message: 'Scenerio Must Be Provided',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   await this.clientAssessmentModel.create({
  //     client_id: clientId,
  //     assessment_id: assessmentId,
  //     scenerio_id: scenerioId,
  //     quesionnaire_id: questionnairId,
  //     cohort_id: cohortId,
  //   } as ClientAssessments);

  //   return { message: 'Client Assessment Added Successfully' };
  // }

  async addClientAssessmentsNew(
    clientId: string,
    cohortId: string,
    createClassAssessments: createClientAssessment,
  ): Promise<any> {
    const client = await this.clientModel.findByPk(clientId);
    const assessment = await this.assessmentModel.findByPk(
      createClassAssessments.assessments[0].assessment_id,
    );

    if (!client) return { message: 'Client not found' };
    if (!assessment) return { message: 'Assessment not found' };

    if (
      !createClassAssessments.assessments[0].scenerio_id &&
      !createClassAssessments.assessments[0].quesionnaire_id
    ) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Scenerio Must Be Provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const clientAssessment: CreationAttributes<ClassAssessments>[] =
      createClassAssessments.assessments.map(
        (assesment): CreationAttributes<ClassAssessments> =>
          ({
            client_id: clientId,
            assessment_id: assesment.assessment_id,
            scenerio_id: assesment.scenerio_id,
            quesionnaire_id: assesment.quesionnaire_id,
            cohort_id: cohortId,
          }) as unknown as CreationAttributes<ClassAssessments>,
      );

    await this.clientAssessmentModel.bulkCreate(
      clientAssessment as unknown as CreationAttributes<ClientAssessments>[],
    );
    return { message: 'Client assessment added successfully' };
  }

  // async updateClientAssessments(
  //   clientId: string,
  //   cohortId: string,
  //   assessmentId: string,
  //   newScenerioId?: string,
  //   newQuestionnaireId?: string,
  // ): Promise<any> {
  //   const clientAssessment = await this.clientAssessmentModel.findOne({
  //     where: {
  //       [Op.and]: [
  //         { client_id: clientId },
  //         { assessment_id: assessmentId },
  //         { cohort_id: cohortId },
  //       ],
  //     },
  //   });
  //   if (!clientAssessment) {
  //      throw new HttpException(
  //       {
  //         status: 400,
  //         success: false,
  //         message: 'Client Assessment Not Found',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   if (newScenerioId) {
  //     clientAssessment.scenerio_id = newScenerioId;
  //   }

  //   if (newQuestionnaireId) {
  //     clientAssessment.quesionnaire_id = newQuestionnaireId;
  //   }

  //   await clientAssessment.save();

  //   return { message: 'Client Assessment Updated Successfully' };
  // }

  async updateClientAssessmentsBulk(
    clientId: string,
    cohortId: string,
    createClassAssessments: createClientAssessment,
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try {
      const existingClass = await Class.findOne({
        where: {
          cohort_id: cohortId,
        },
      });
      if (existingClass) {
        throw new HttpException(
          {
            message:
              'Update Failed: Assessment Associate to NBO Existing CLASS',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (createClassAssessments.assessments.length > 0) {
        const assessments = await this.clientAssessmentModel.findAll({
          where: {
            [Op.and]: [
              { client_id: clientId },
              {
                assessment_id:
                  createClassAssessments.assessments[0].assessment_id,
              },
              { cohort_id: cohortId },
            ],
          },
        });

        assessments.map((assessment) => assessment.destroy({ transaction }));

        if (
          !createClassAssessments.assessments[0].scenerio_id &&
          !createClassAssessments.assessments[0].quesionnaire_id
        ) {
          throw new HttpException(
            {
              status: 400,
              success: false,
              message: 'Scenerio Must Be Provided',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const clientAssessment: CreationAttributes<ClassAssessments>[] =
          createClassAssessments.assessments.map(
            (assesment): CreationAttributes<ClassAssessments> =>
              ({
                client_id: clientId,
                assessment_id: assesment.assessment_id,
                scenerio_id: assesment.scenerio_id,
                quesionnaire_id: assesment.quesionnaire_id,
                cohort_id: cohortId,
              }) as unknown as CreationAttributes<ClassAssessments>,
            { transaction },
          );

        await this.clientAssessmentModel.bulkCreate(
          clientAssessment as unknown as CreationAttributes<ClientAssessments>[],
          { transaction },
        );
      }

      await transaction.commit();
      return { message: 'Client assessment Updated successfully' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(
        `Failed to update quessionnaires/scenerios: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteClientAssessment(
    clientId: string,
    cohortId: string,
    assessmentId: string,
  ): Promise<any> {
    const existingClass = await Class.findOne({
      where: {
        cohort_id: cohortId,
      },
    });
    if (existingClass) {
      throw new HttpException(
        {
          message:
            'Deletion Failed: Assessment Associated to NBO Existing CLASS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const clientAssessment = await this.clientAssessmentModel.findAll({
      where: {
        [Op.and]: [
          { client_id: clientId },
          { assessment_id: assessmentId },
          { cohort_id: cohortId },
        ],
      },
    });
    await Promise.all(clientAssessment.map((item) => item.destroy()));
    return { message: 'Client Assessment Deleted Successfully' };
  }

  async clientAssessmentsScenerio(
    clientId: string,
    // cohortId: string
  ): Promise<any> {
    // let existing_class: boolean
    // const existingClass = await Class.findOne({
    //   where: {
    //     cohort_id: cohortId,
    //   },
    // });
    // if (existingClass) {
    //   existing_class = true
    // }
    // else{
    //   existing_class= false
    // }
    const clientAssessment = await this.assessmentModel.findAll({
      include: [
        {
          model: Scenerios,
          as: 'scenerios',
          required: true,
          include: [
            {
              model: this.clientAssessmentModel,
              as: 'client_assessment',
              attributes: [],
              where: {
                client_id: clientId,
              },
            },
          ],
        },
      ],
    });

    return clientAssessment;

    // return {clientAssessment,existing_class};
  }

  async getAllAssessments(): Promise<any> {
    const assessments = await this.assessmentModel.findAll();
    return {
      rows: assessments,
    };
  }

  async clientAssessmentsAllDetails(
    clientId: string,
    cohortId: string,
  ): Promise<any> {
    const clientAssessment = await this.clientModel.findAll({
      include: [
        {
          model: Assessments,
          as: 'assessments',
          // attributes:['id','assessment_name','is_quesionnaire', 'is_group_activity'],
          include: [
            {
              model: Scenerios,
              as: 'scenerios',
              attributes: [],
            },
            {
              model: this.clientAssessmentModel,
              as: 'client_assessments',
              // attributes: [],
              // updated______________________________________
              include: [
                {
                  model: this.assessmentModel,
                  as: 'assessment',
                },
              ],
              //______________________________________________
              where: {
                cohort_id: cohortId,
              },
            },
          ],
        },
        {
          model: Facilities,
          as: 'facilities',
          include: [
            {
              model: Rooms,
              as: 'room',
            },
          ],
        },
        {
          model: this.projectModel,
          as: 'projects',
          include: [
            {
              model: Cohorts,
              as: 'cohorts',
              where: {
                id: cohortId,
              },
            },
          ],
        },
        {
          model: Participants,
          as: 'participants',
          where: {
            cohort_id: cohortId,
          },
        },
      ],
    });
    return {
      rows: clientAssessment,
    };
  }

  // async participantAssessmentPdf(
  //   clientId: string,
  //   assessmentId: string,
  // ): Promise<any> {
  //   const scenerio_pdf = await this.clientAssessmentModel.findOne({
  //     where: {
  //       [Op.and]: [{ client_id: clientId }, { assessment_id: assessmentId }],
  //     },
  //     attributes: [],
  //     include: [
  //       {
  //         model: Assessments,
  //         as: 'assessment',
  //       },
  //       {
  //         model: Scenerios,
  //         as: 'scenerio',
  //       },
  //     ],
  //   });
  //   return scenerio_pdf;
  // }

  async copyCohortAssessments(
    cohort_id: string,
    new_cohort_id: string,
  ): Promise<any> {
    const existingAssessments = await this.clientAssessmentModel.findOne({
      where: {
        cohort_id: new_cohort_id,
      },
    });
    if (existingAssessments) {
      throw new HttpException(
        {
          message: 'Assessment scenarios already exists for this cohort',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const clientAssessments = await this.clientAssessmentModel.findAll({
      where: { cohort_id },
      raw: true,
    });

    if (!clientAssessments.length) {
      return [];
    }

    const newAssessments = clientAssessments.map(
      ({ id, cohort_id, createdAt, updatedAt, ...rest }) => ({
        ...rest,
        cohort_id: new_cohort_id,
      }),
    );

    const created = await this.clientAssessmentModel.bulkCreate(
      newAssessments as any,
    );

    return created;
  }
}
