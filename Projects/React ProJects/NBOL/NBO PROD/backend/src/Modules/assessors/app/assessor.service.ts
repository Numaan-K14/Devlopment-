import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Assessros } from '../model/assessor.model';
import { createAssessors } from '../dto/createAssessorDto';
import { InjectModel } from '@nestjs/sequelize';
import * as XLSX from 'xlsx';
import { CreationAttributes, json, Op } from 'sequelize';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { EmailService } from 'src/Modules/mail/email.service';
import { Sequelize } from 'sequelize-typescript';
import { Users } from 'src/Modules/users/model/user.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { ClassAssessors } from 'src/Modules/class-configration/model/classPartAssessmAssessors.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { start } from 'repl';
import { ClassPartReport } from 'src/Modules/report/model/class_part_report.model';

@Injectable()
export class AssessorsService {
  constructor(
    @InjectModel(Assessros)
    private assessorModel: typeof Assessros,

    private readonly requestParams: RequestParamsService,
    private emailService: EmailService,
    private sequelize: Sequelize,
  ) {}

  // download() {
  //   try {
  //     const fileName = 'assessor_data.xlsx';
  //     return {
  //       fileName,
  //       filePath: 'public/excel/assessor_data.xlsx',
  //     };
  //   } catch (error) {
  //     throw new Error(`Failed to download Excel file: ${error.message}`);
  //   }
  // }

  async download(): Promise<any> {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Sample Assessors Excel', {
        views: [{ state: 'frozen', ySplit: 1 }],
      });

      sheet.columns = [
        { header: 'Assessor Name', key: 'assessor_name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Credential', key: 'credential', width: 30 },
      ];

      for (let row = 2; row <= 9999; row++) {
        const emailCell = sheet.getCell(`B${row}`);
        emailCell.dataValidation = {
          type: 'custom',
          formulae: [
            `=AND(ISNUMBER(FIND("@",B${row})), ISNUMBER(FIND(".",B${row})))`,
          ],
          allowBlank: false,
          showErrorMessage: true,
          errorStyle: 'error',
          errorTitle: 'Invalid Email',
          error: 'Please enter a valid email addres',
        };
      }

      const fileName = 'assessor_data.xlsx';
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
      throw new Error(`Failed to generate Excel file: ${error.message}`);
    }
  }

  async processExcelFile(file: Express.Multer.File): Promise<string> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!jsonData || jsonData.length === 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Excel File Is Empty No Valid Assessor Found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // jsonData.map((item)=> {
      //   if(item.Email === ""){
      //     throw new HttpException({
      //       status: 400,
      //       success: false,
      //       message: "Some Fields are Missing fill all the Fields"
      //     }, HttpStatus.BAD_REQUEST)
      //   }
      // })

      jsonData.forEach((item, idx) => {
        const requiredFields = ['Assessor Name', 'Email', 'Credential'];
        for (const field of requiredFields) {
          if (!item[field] || item[field].toString().trim() === '') {
            throw new HttpException(
              {
                status: 400,
                success: false,
                message: `Row ${idx + 2}: Field ${field} Is Missing Or Empty. Please Fill All The Fields.`,
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      });

      const normalizedData = jsonData
        .map((item) => ({
          assessor_name: item['Assessor Name']?.toString().trim(),
          email: item['Email']?.toString().trim(),
          credential: item['Credential']?.toString().trim(),
        }))
        .filter((item) => item.assessor_name && item.email && item.credential);

      const emailSet = new Set<string>();
      for (const item of normalizedData) {
        if (emailSet.has(item.email)) {
          throw new HttpException(
            {
              status: 400,
              success: false,
              message: `Duplicate Email "${item.email}" Found In Excel File.`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        emailSet.add(item.email);
      }

      for (const item of normalizedData) {
        const existingAssessor = await this.assessorModel.findOne({
          where: {
            email: item.email,
          },
        });
        const checkAssessorUser = await Users.findOne({
          where: { email: item.email },
        });
        const checkAssessorPart = await Participants.findOne({
          where: { email: item.email },
        });
        if (existingAssessor || checkAssessorUser || checkAssessorPart) {
          throw new HttpException(
            {
              status: 400,
              success: false,
              message: `Email ${item.email} Already Exists`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      await this.assessorModel.bulkCreate(
        normalizedData as CreationAttributes<Assessros>[],
        { returning: true },
      );

      return 'Excel Data Uploaded Successfully!';
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

  async createAssessor(createAssessor: createAssessors): Promise<any> {
    const transaction = await this.sequelize.transaction();
    try {
      const checkAssessor = await this.assessorModel.findOne({
        where: { email: createAssessor.email },
        transaction,
      });

      // const checkAssessorUser = await Users.findOne({
      //   where: { email: createAssessor.email },
      //   transaction,
      // });

      const checkAssessorPart = await Participants.findOne({
        where: { email: createAssessor.email },
        transaction,
      });

      if (checkAssessor || checkAssessorPart) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Email Already Exists Please Use a Different Email.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const assessor = await this.assessorModel.create(
        {
          assessor_name: createAssessor.assessor_name,
          email: createAssessor.email,
          credential: createAssessor.credential,
          status: createAssessor.status ?? false,
        } as Assessros,
        { transaction },
      );

      this.emailService.sendEmailToActiveAssessors(
        assessor.email,
        'New Assessor Created for NBOL CLASS Assessment & Competency Evaluation',
        './email-templates/test.hbs',
        {
          name: assessor.assessor_name,
          email: assessor.email,
          // password: user?.password,
        },
      );

      await transaction.commit();
      return {
        success: true,
        message: 'Assessor created successfully',
        assessor,
      };
    } catch (error) {
      await transaction.rollback();
      // console.error('Error creating assessor:', error);
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

  async getAssessor(assessorId: string): Promise<any> {
    const assessor = await this.assessorModel.findByPk(assessorId);
    return assessor;
  }

  async getAllAssessor(page?: number, limit?: number): Promise<any> {
    const offset = page ? page * (limit ? limit : 100) : 0;
    const assessor = await this.assessorModel.findAll({
      where: {
        ...getSearchObject(this.requestParams.query, [
          'assessor_name',
          'email',
        ]),
      },
      order: [['createdAt', 'DESC']],
      offset: offset,
      limit: limit,
    });
    return {
      rows: assessor,
      count: await this.assessorModel.count(),
      // count: await this.assessorModel.count({
      //   where: {
      //     ...getSearchObject(this.requestParams.query, ['assessor_name']),
      //   },
      // }),
    };
  }

  async getActiveAssessors(): Promise<any> {
    const assessor = await this.assessorModel.findAll({
      where: {
        status: true,
      },
    });
    return {
      rows: assessor,
      count: await this.assessorModel.count({
        where: {
          status: true,
        },
      }),
    };
  }

  async updateAssessor(
    assessorId: string,
    updateData: Partial<createAssessors>,
  ): Promise<any> {
    try {
      const checkAssessor = await this.assessorModel.findOne({
        where: {
          id: assessorId,
        },
      });

      if (checkAssessor?.email != updateData.email) {
        const checkAssessor = await this.assessorModel.findOne({
          where: {
            email: updateData.email,
          },
        });

        const checkAssessorUser = await Users.findOne({
          where: { email: updateData.email },
        });

        const checkAssessorPart = await Participants.findOne({
          where: { email: updateData.email },
        });

        if (checkAssessor || checkAssessorUser || checkAssessorPart) {
          throw new HttpException(
            {
              status: 400,
              success: false,
              message: 'Email Already Exists. Please Use a Different Email.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const assessor = await this.assessorModel.findByPk(assessorId);

      if (!assessor) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Assessor Not Found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (updateData.status === true) {
        this.emailService.sendEmailToActiveAssessors(
          assessor.email,
          'Assessor Status Updated',
          './email-templates/test.hbs',
          {
            name: assessor.assessor_name,
            email: assessor.email,
            // password: user?.password,
          },
        );
      }

      await assessor.update(updateData);

      return { message: 'Assessor Updated Successfully', assessor };
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

  async deleteAssessor(assessorId: string): Promise<any> {
    const Assessor = await this.assessorModel.findByPk(assessorId);
    if (!Assessor) {
      throw new HttpException(
        {
          status: 404,
          success: false,
          message: 'Assessor Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (Assessor && Assessor.status === false) {
      await Assessor.destroy();
      return {
        message: 'Assessor Deleted Successfully',
      };
    } else {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Assessor Is Active And Cannot Be Deleted',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async assessorActivity(assessorId: string): Promise<any> {
    const assesor = await ClassAssessors.findAll({
      where: {
        assessors_id: assessorId,
      },
      attributes: ['id', 'assessors_id'],
      include: [
        {
          model: Assessros,
          as: 'assessor',
          attributes: ['id', 'assessor_name'],
        },
        {
          model: ParticipantsAssessments,
          as: 'participant_assessment',
          attributes: ['id'],
          include: [
            {
              model: Assessments,
              as: 'assessment',
            },
          ],
        },
      ],
    });
    return assesor;
  }

  async assessorsClients(
    assessorId: string,
    startDate: any,
    endDate: any,
    page?: number,
    limit?: number,
  ): Promise<any> {
    const offset = page ? page * (limit ? limit : 100) : 0;
    const parseDateInput = (input: any): Date | undefined => {
      if (input == null) return undefined;
      if (Array.isArray(input) && input.length > 0) input = input[0];
      if (input instanceof Date && !isNaN(input.getTime())) return input;
      if (typeof input === 'number' && !isNaN(input)) return new Date(input);

      let prim: any;
      try {
        prim =
          input && typeof input.valueOf === 'function'
            ? input.valueOf()
            : input;
      } catch {
        prim = undefined;
      }
      if (prim == null) return undefined;

      if (typeof prim === 'string') {
        const s = prim.trim();
        if (!s) return undefined;
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T00:00:00`);
        const replaced = s.replace(' ', 'T');
        const p = Date.parse(replaced);
        if (!isNaN(p)) return new Date(p);
        const p2 = Date.parse(s);
        return isNaN(p2) ? undefined : new Date(p2);
      }
      if (typeof prim === 'object') {
        try {
          const sObj = (prim as any).toString();
          if (sObj && sObj !== '[object Object]') {
            const replaced = sObj.replace(' ', 'T');
            const p = Date.parse(replaced);
            return isNaN(p) ? undefined : new Date(p);
          }
        } catch {
          return undefined;
        }
      }
      return undefined;
    };

    const classStart = parseDateInput(startDate);
    const classEndRaw = parseDateInput(endDate);
    if (classEndRaw) classEndRaw.setHours(23, 59, 59, 999);
    const clients = await Clients.findAll({
      offset,
      limit,
      attributes: {
        include: [
          [
            Sequelize.literal(`
              (
                SELECT COUNT(*) FROM class_part_report
                WHERE class_part_report.assessor_id = '${assessorId}'
                AND class_part_report.assessor_status = 'completed'
                AND class_part_report.class_id IN (select id from class where class.client_id = "Clients".id AND class.start_date BETWEEN '${classStart?.toISOString()}' AND '${classEndRaw?.toISOString()}')
              )
            `),
            'report_completed_count',
          ],
        ],
        exclude: [
          'createdAt',
          'updatedAt',
          'is_360_client',
          'nbol_client_name',
          'nbol_client_schema',
          'nbol_client_id',
          'logo',
          'is_grp_comp',
        ],
      },
      include: [
        {
          model: Class,
          as: 'classes',
          required: true,
          attributes: [],
          where: {
            start_date:
              classStart && classEndRaw
                ? { [Op.gte]: classStart, [Op.lte]: classEndRaw }
                : undefined,
          },
          // where: {
          //   start_date:
          //     startDate && endDate
          //       ? { [Op.gte]: startDate, [Op.lte]: endDate }
          //       : undefined,
          // },
          // -----------------------------------------
          // where: startDate && endDate
          //   ? {
          //       start_date: {
          //         [Op.between]: [startDate, endDate],
          //       },
          //     }
          //   : undefined,
          include: [
            {
              model: ParticipantsAssessments,
              as: 'participant_assessments',
              required: true,
              attributes: [],
              include: [
                {
                  model: ClassAssessors,
                  as: 'class_assessors',
                  required: true,
                  where: { assessors_id: assessorId },
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
    });

    const count = await Clients.findAll({
      attributes: ['id'],
      include: [
        {
          model: Class,
          as: 'classes',
          required: true,
          attributes: [],
          where: {
            start_date:
              classStart && classEndRaw
                ? { [Op.gte]: classStart, [Op.lte]: classEndRaw }
                : undefined,
          },
          include: [
            {
              model: ParticipantsAssessments,
              as: 'participant_assessments',
              required: true,
              attributes: [],
              include: [
                {
                  model: ClassAssessors,
                  as: 'class_assessors',
                  required: true,
                  where: { assessors_id: assessorId },
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
    });
    return { rows: clients, count: count.length };
  }

  async assessorsClientsClasses(
    clientId: string,
    assessorId: string,
    startDate: any,
    endDate: any,
  ): Promise<any> {
    const parseDateInput = (input: any): Date | undefined => {
      if (input == null) return undefined;
      if (Array.isArray(input) && input.length > 0) input = input[0];
      if (input instanceof Date && !isNaN(input.getTime())) return input;
      if (typeof input === 'number' && !isNaN(input)) return new Date(input);

      let prim: any;
      try {
        prim =
          input && typeof input.valueOf === 'function'
            ? input.valueOf()
            : input;
      } catch {
        prim = undefined;
      }
      if (prim == null) return undefined;

      if (typeof prim === 'string') {
        const s = prim.trim();
        if (!s) return undefined;
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T00:00:00`);
        const replaced = s.replace(' ', 'T');
        const p = Date.parse(replaced);
        if (!isNaN(p)) return new Date(p);
        const p2 = Date.parse(s);
        return isNaN(p2) ? undefined : new Date(p2);
      }
      if (typeof prim === 'object') {
        try {
          const sObj = (prim as any).toString();
          if (sObj && sObj !== '[object Object]') {
            const replaced = sObj.replace(' ', 'T');
            const p = Date.parse(replaced);
            return isNaN(p) ? undefined : new Date(p);
          }
        } catch {
          return undefined;
        }
      }
      return undefined;
    };

    const classStart = parseDateInput(startDate);
    const classEndRaw = parseDateInput(endDate);
    if (classEndRaw) classEndRaw.setHours(23, 59, 59, 999);

    const clients = await Clients.findOne({
      where: { id: clientId },
      attributes: ['id', 'client_name'],
      include: [
        {
          model: Class,
          as: 'classes',
          required: true,
          attributes: {
            include: [
              [
                Sequelize.literal(`
              (
                SELECT COUNT(*) FROM class_part_report
                WHERE class_part_report.assessor_id = '${assessorId}'
                AND class_part_report.assessor_status = 'completed'
                AND class_part_report.class_id = "classes".id
              )
            `),
                'report_completed_count',
              ],
              [
                Sequelize.literal(`
              (
                SELECT COUNT(*) FROM class_part_report
                WHERE class_part_report.assessor_id = '${assessorId}'
                AND class_part_report.assessor_status = 'inprogress'
                AND class_part_report.class_id = "classes".id
              )
            `),
                'report_pending_count',
              ],
            ],
            exclude: [
              'createdAt',
              'updatedAt',
              'client_id',
              'facility_id',
              'cohort_id',
              'status',
            ],
          },
          where: {
            start_date:
              classStart && classEndRaw
                ? { [Op.gte]: classStart, [Op.lte]: classEndRaw }
                : undefined,
          },
          include: [
            {
              model: Cohorts,
              as: 'cohort',
              attributes: ['id', 'cohort_name'],
            },
            {
              model: ClassPartReport,
              as: 'cl_par_report',
              required: false,
              where: {
                assessor_id: assessorId,
                class_id: { [Op.col]: 'classes.id' },
              },
              attributes: ['id'],
              include: [
                {
                  model: Participants,
                  as: 'participant',
                  attributes: ['id', 'participant_name'],
                },
              ],
            },
            {
              model: ParticipantsAssessments,
              as: 'participant_assessments',
              required: true,
              attributes: [],
              include: [
                {
                  model: ClassAssessors,
                  as: 'class_assessors',
                  required: true,
                  where: { assessors_id: assessorId },
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
    });
    return {rows: clients};
  }
}
