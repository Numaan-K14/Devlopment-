import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Participants } from '../model/participants.model';
import { createParticipants } from '../dto/createParticipants';
import { Clients } from '../../clients/model/clients.model';
import { CreationAttributes, Model, Op } from 'sequelize';
import { updateParticipants } from '../dto/updateParticiapnts';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { ClientRoles } from 'src/Modules/client-roles-levels/model/role.model';
import * as fs from 'fs';
import * as path from 'path';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { UserRole, Users } from 'src/Modules/users/model/user.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { AssociateCompanies } from 'src/Modules/clients/model/associateCompanies.model';
import { Response } from 'express';
@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participants)
    private participantModel: typeof Participants,

    @InjectModel(ClientRoles)
    private roleModel: typeof ClientRoles,

    @InjectModel(Cohorts)
    private cohortModel: typeof Cohorts,

    @InjectModel(ParticipantsAssessments)
    private partAssessmentModel: typeof ParticipantsAssessments,

    @InjectModel(Class)
    private classModel: typeof Class,

    @InjectModel(NbolLeadLevels)
    private nbolLeadLevelModel: typeof NbolLeadLevels,

    @InjectModel(AssociateCompanies)
    private associateCompModel: typeof AssociateCompanies,

    private readonly requestParams: RequestParamsService,
  ) {}

  async download(
    clientId: string,
    nbolId: string,
    projectId: string,
  ): Promise<any> {
    try {
      const jobGrades = await this.roleModel.findAll({
        where: {
          [Op.and]: [{ client_id: clientId }, { nbol_id: nbolId }],
        },
        attributes: ['role'],
        group: ['role'],
      });

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Sample Participant Excel', {
        views: [{ state: 'frozen', ySplit: 1 }],
      });

      const jobGradeSheet = workbook.addWorksheet('Job Grade');
      jobGradeSheet.columns = [
        {
          header: 'Job Grade',
          key: 'role',
          width: 0,
          hidden: true,
        },
      ];
      jobGradeSheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.protection = { locked: true };
        });
      });

      await jobGradeSheet.protect('1234', {
        selectLockedCells: false,
        selectUnlockedCells: true,
      });

      const normalizeScore = workbook.addWorksheet('Score Translator');

      normalizeScore.columns = [
        { header: 'Score', key: 'score', width: 30 },
        { header: 'Score Descriptors', key: 'grade', width: 30 },
      ];

      const scoreValues = [2, 2.5, 3, 3.5, 4, 4.5, 5];
      scoreValues.forEach((score) => {
        normalizeScore.addRow({ score, grade: '' });
      });

      normalizeScore.eachRow((row) => {
        row.eachCell((cell) => {
          cell.protection = { locked: true };
        });
      });

      await normalizeScore.protect('1234', {
        selectLockedCells: false,
        selectUnlockedCells: true,
      });

      for (let row = 2; row <= scoreValues.length + 1; row++) {
        normalizeScore.getCell(`B${row}`).protection = { locked: false };
      }

      const partRawData = workbook.addWorksheet('Participant Raw Data', {
        views: [{ state: 'frozen', ySplit: 1 }],
      });
      partRawData.columns = [
        { header: 'Participant Name', key: 'participant_name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Job Grade', key: 'job_grade', width: 30 },
        { header: 'Current Year Performance', key: 'perf1', width: 30 },
        { header: 'Previous Year Performance', key: 'perf2', width: 30 },
        { header: 'Year Before Last Performance', key: 'perf3', width: 30 },
        { header: 'Department', key: 'department', width: 30 },
        { header: 'Division', key: 'division', width: 30 },
        { header: 'Position', key: 'position', width: 30 },
        {
          header: 'Date of Birth (DD/MM/YYYY)',
          key: 'date_of_birth',
          width: 30,
          style: { numFmt: 'dd/mm/yyyy' },
        },
        {
          header: 'Date of Joining (DD/MM/YYYY)',
          key: 'date_of_joining',
          width: 30,
          style: { numFmt: 'dd/mm/yyyy' },
        },
      ];

      partRawData.eachRow((row) => {
        row.eachCell((cell) => {
          cell.protection = { locked: true };
        });
      });

      await partRawData.protect('1234', {
        selectLockedCells: false,
        selectUnlockedCells: true,
      });

      let jobGradeList: { role: string }[] = [];

      if (jobGrades.length > 0) {
        const jobGradeListData = jobGrades.map((grade) => ({
          role: grade.role,
        }));
        jobGradeList.push(...jobGradeListData);
        jobGradeSheet.addRows(jobGradeList);
      }

      // const jobGradeList = jobGrades.map((grade) => ({ role: grade.role }));
      // jobGradeSheet.addRows(jobGradeList);

      if (!jobGrades || jobGrades.length === 0) {
        const leadLevel = await this.nbolLeadLevelModel.findAll({
          include: [
            {
              model: Projects,
              as: 'projects',
              where: {
                id: projectId,
              },
            },
          ],
        });
        if (!leadLevel) {
          throw new HttpException(
            {
              status: 400,
              success: false,
              message: 'Leadership Level not Found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        const jobGradeListData = leadLevel.map((grade) => ({
          role: grade.leadership_level,
        }));
        jobGradeList.push(...jobGradeListData);
        jobGradeSheet.addRows(jobGradeList);
      }

      sheet.columns = [
        { header: 'Participant Name', key: 'participant_name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Job Grade', key: 'job_grade', width: 30 },
        { header: 'Current Year Performance', key: 'perf1', width: 30 },
        { header: 'Previous Year Performance', key: 'perf2', width: 30 },
        { header: 'Year Before Last Performance', key: 'perf3', width: 30 },
        { header: 'Department', key: 'department', width: 30 },
        { header: 'Division', key: 'division', width: 30 },
        { header: 'Position', key: 'position', width: 30 },
        {
          header: 'Date of Birth (DD/MM/YYYY)',
          key: 'date_of_birth',
          width: 30,
          style: { numFmt: 'dd/mm/yyyy' },
        },
        {
          header: 'Date of Joining (DD/MM/YYYY)',
          key: 'date_of_joining',
          width: 30,
          style: { numFmt: 'dd/mm/yyyy' },
        },
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

      const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
      const maxRows = 1000;

      for (let row = 2; row <= maxRows; row++) {
        columns.forEach((col) => {
          sheet.getCell(`${col}${row}`).protection = { locked: false };
          partRawData.getCell(`${col}${row}`).protection = { locked: false };
        });
      }

      const jobGradeValidation = {
        type: 'list' as const,
        allowBlank: false,
        formulae: [`'Job Grade'!$A$2:$A${jobGradeList.length + 1}`],
        showErrorMessage: true,
        errorStyle: 'error' as const,
        errorTitle: 'Invalid Job Grade',
        error: 'Enter a valid Job Grade',
      };

      const dateValidation = {
        type: 'date' as const,
        operator: 'greaterThan' as const,
        formulae: [new Date(1, 0, 1900)],
        allowBlank: false,
        showErrorMessage: true,
        errorStyle: 'error' as const,
        errorTitle: 'Invalid Date',
        error: 'Enter a valid date in dd/mm/yyyy format',
      };

      const decimalValidationRequired = {
        type: 'decimal' as const,
        operator: 'greaterThanOrEqual' as const,
        formulae: [0],
        allowBlank: false,
        showErrorMessage: true,
        errorStyle: 'error' as const,
        errorTitle: 'Invalid Number',
        error: 'Enter a valid Number',
      };

      const decimalValidationOptional = {
        type: 'decimal' as const,
        operator: 'greaterThanOrEqual' as const,
        formulae: [0],
        allowBlank: true,
        showErrorMessage: true,
        errorStyle: 'error' as const,
        errorTitle: 'Invalid Number',
        error: 'Enter a valid Number',
      };

      for (let row = 2; row <= maxRows; row++) {
        partRawData.getCell(`C${row}`).dataValidation = jobGradeValidation;

        const rawCellJ = partRawData.getCell(`J${row}`);
        rawCellJ.dataValidation = dateValidation;
        rawCellJ.numFmt = 'dd/mm/yyyy';

        const rawCellK = partRawData.getCell(`K${row}`);
        rawCellK.dataValidation = dateValidation;
        rawCellK.numFmt = 'dd/mm/yyyy';

        sheet.getCell(`C${row}`).dataValidation = jobGradeValidation;
        // sheet.getCell(`D${row}`).dataValidation = decimalValidationRequired;
        // sheet.getCell(`E${row}`).dataValidation = decimalValidationOptional;
        // sheet.getCell(`F${row}`).dataValidation = decimalValidationOptional;

        const cellJ = sheet.getCell(`J${row}`);
        cellJ.dataValidation = dateValidation;
        cellJ.numFmt = 'dd/mm/yyyy';

        const cellK = sheet.getCell(`K${row}`);
        cellK.dataValidation = dateValidation;
        cellK.numFmt = 'dd/mm/yyyy';
      }

      const fileName = 'participants_data.xlsx';
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

  async processExcelFile(
    clientId: string,
    projectId: string,
    cohortId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      const normScore = workbook.SheetNames[2];
      const scoreSheet = workbook.Sheets[normScore];
      const scoreData: any[] = XLSX.utils.sheet_to_json(scoreSheet);

      const gradeToScoreMap = new Map<string, number>();
      scoreData.forEach((item) => {
        const grade = item['Score Descriptors'];
        const score = item['Score'];
        if (grade && score !== undefined) {
          gradeToScoreMap.set(grade.toString().trim().toUpperCase(), score);
        }
      });

      const hasGradeMappings = gradeToScoreMap.size > 0;

      // console.log(
      //   'Grade to Score Mapping:',
      //   Array.from(gradeToScoreMap.entries()),
      // );
      // console.log('Has Grade Mappings:', hasGradeMappings);

      if (jsonData.length === 0) {
        throw new HttpException(
          {
            success: false,
            message:
              'The uploaded Excel file is empty. Please provide a valid file.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      jsonData.forEach((item, idx) => {
        const email = item.Email?.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new HttpException(
            {
              message: `Invalid email format for email "${email}".`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        const reqFields = [
          'Participant Name',
          'Email',
          'Job Grade',
          'Current Year Performance',
          'Department',
          'Division',
          'Date of Joining (DD/MM/YYYY)',
          'Date of Birth (DD/MM/YYYY)',
        ];
        for (const field of reqFields) {
          if (!item[field] || item[field].toString().trim() === '') {
            throw new HttpException(
              {
                status: 400,
                success: false,
                message: `Row ${idx + 2}: Field ${field} is missing or empty. Please fill all the fields.`,
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      });

      function excelDateToJSDate(serial: number): string {
        if (typeof serial !== 'number') return serial;
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400; // seconds
        const date_info = new Date(utc_value * 1000);
        const fractional_day = serial - Math.floor(serial);
        if (fractional_day > 0) {
          const totalSeconds = Math.round(86400 * fractional_day);
          date_info.setSeconds(date_info.getSeconds() + totalSeconds);
        }
        return date_info.toISOString().slice(0, 10);
      }

      const normalizeGrade = (grade: any): any => {
        if (!grade) return null;

        if (!hasGradeMappings) {
          const numericValue = parseFloat(grade);
          return !isNaN(numericValue) ? numericValue : grade;
        }

        const gradeStr = grade.toString().trim().toUpperCase();
        const score = gradeToScoreMap.get(gradeStr);
        if (score !== undefined) {
          return score;
        }

        const numericValue = parseFloat(grade);
        if (!isNaN(numericValue)) {
          return numericValue;
        }

        return grade;
      };

      const normalizedData = jsonData.map((item) => ({
        participant_name: item['Participant Name'],
        email: item['Email'],
        job_grade: item['Job Grade'],
        perf1: normalizeGrade(item['Current Year Performance']),
        perf2: normalizeGrade(item['Previous Year Performance']),
        perf3: normalizeGrade(item['Year Before Last Performance']),
        department: item['Department'],
        division: item['Division'],
        position: item['Position'],
        date_of_joining: excelDateToJSDate(
          item['Date of Joining (DD/MM/YYYY)'],
        ),
        date_of_birth: excelDateToJSDate(item['Date of Birth (DD/MM/YYYY)']),
      }));

      const createData = await Promise.all(
        normalizedData.map(async (item, idx) => {
          const existingParticipant = await this.participantModel.findOne({
            where: { email: item.email },
          });

          const checkAssessor = await Assessros.findOne({
            where: {
              email: item.email,
            },
          });

          const checkUser = await Users.findOne({
            where: { email: item.email },
          });

          if (existingParticipant || checkAssessor || checkUser) {
            throw new HttpException(
              {
                status: 400,
                success: false,
                message: `Row ${idx + 2}: Email ${item.email} already exists. Please use a unique email.`,
              },
              HttpStatus.BAD_REQUEST,
            );
          }
          const jobGrade = await this.roleModel.findOne({
            where: {
              client_id: clientId,
              role: item.job_grade?.trim(),
            },
          });
          return {
            ...item,
            client_id: clientId,
            project_id: projectId,
            cohort_id: cohortId,
            job_grade: jobGrade?.id,
          };
        }),
      );

      // console.log(createData, "_____createData_____");

      await this.participantModel.bulkCreate(
        createData as unknown as CreationAttributes<Participants>[],
      );

      return 'Excel data uploaded successfully!';
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          status: 400,
          message: error.message || 'Failed to process Excel file',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async exportParticipantsData(
    clientId: string,
    projectId: string,
    cohortId: string,
    res: Response,
  ): Promise<void> {
    const where: any = {};
    if (clientId) where.client_id = clientId;
    if (projectId) where.project_id = projectId;
    if (cohortId) where.cohort_id = cohortId;
    const participants = await this.participantModel.findAll({
      where,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Participants Data');

    worksheet.columns = [
      { header: 'Participant Name', key: 'participant_name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      // { header: 'Job Grade', key: 'job_grade', width: 15 },
      { header: 'Current Year Performance', key: 'perf1', width: 30 },
      { header: 'Previous Year Performance', key: 'perf2', width: 30 },
      { header: 'Year Before Last Performance', key: 'perf3', width: 30 },
      { header: 'Department', key: 'department', width: 30 },
      { header: 'Division', key: 'division', width: 30 },
      { header: 'Position', key: 'position', width: 30 },
      {
        header: 'Date of Joining (DD/MM/YYYY)',
        key: 'date_of_joining',
        width: 30,
      },
      { header: 'Date of Birth (DD/MM/YYYY)', key: 'date_of_birth', width: 30 },
    ];

    const participantsArray: any = [];

    for (const participant of participants) {
      participantsArray.push({
        participant_name: participant.participant_name,
        email: participant.email,
        // job_grade: participant.job_grade,
        perf1: participant.perf1,
        perf2: participant.perf2,
        perf3: participant.perf3,
        department: participant.department,
        division: participant.division,
        position: participant.position,
        date_of_joining: participant.date_of_joining,
        date_of_birth: participant.date_of_birth,
      });
    }

    worksheet.addRows(participantsArray);

    const filename = 'participants.xlsx';

    res.attachment(filename);
    await workbook.xlsx.write(res);
    res.end();
  }

  async partJobGrade(
    clientId: string,
    nbolId: string,
    projectId: string,
  ): Promise<any> {
    const jobGrades = await this.roleModel.findAll({
      where: {
        [Op.and]: [{ client_id: clientId }, { nbol_id: nbolId }],
      },
    });
    const leadLevel = [];
    if (jobGrades.length === 0) {
      const leadLevel = await this.nbolLeadLevelModel.findAll({
        include: [
          {
            model: Projects,
            as: 'projects',
            where: {
              id: projectId,
            },
          },
        ],
      });
      return { leadLevel, jobGrades };
    }
    return {
      jobGrades,
      leadLevel,
    };
  }

  async createParticipant(
    client_id: string,
    createParticipant: createParticipants,
  ): Promise<any> {
    const existingClass = await this.classModel.findOne({
      where: {
        cohort_id: createParticipant.cohort_id,
      },
    });
    if (existingClass) {
      throw new HttpException(
        {
          success: false,
          message:
            'A class has already been generated for this cohort. You cannot add a participant.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const checkAssessor = await Assessros.findOne({
      where: {
        email: createParticipant.email,
      },
    });

    // const checkUser = await Users.findOne({
    //   where: { email: createParticipant.email },
    // });

    if (checkAssessor) {
      throw new HttpException(
        {
          success: false,
          message: 'Email already exists. Please use a unique email.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const associateCompanies = await this.associateCompModel.findAll({
      where: {
        client_id: client_id,
      },
      raw: true,
      nest: true,
    });

    const associateCompanyIds = associateCompanies.map(
      (comp) => comp.assoc_comp,
    );

    const allowedClientIds = [client_id, ...associateCompanyIds];
    const existingParticipant = await this.participantModel.findOne({
      where: {
        [Op.and]: [
          { email: createParticipant.email },
          {
            client_id: {
              [Op.notIn]: allowedClientIds,
            },
          },
        ],
      },
    });

    if (associateCompanies.length > 0) {
      const partClass = await this.classModel.findAll({
        include: [
          {
            model: this.partAssessmentModel,
            as: 'participant_assessments',
            attributes: ['id', 'class_id', 'participant_id'],
            required: true,

            include: [
              {
                model: this.participantModel,
                as: 'participant',
                where: {
                  email: createParticipant.email,
                },
                attributes: ['id', 'email', 'participant_name'],
                required: true,
              },
            ],
          },
        ],
      });

      if (partClass.length > 0) {
        if (partClass.length > 0) {
          if (
            partClass.some(
              (item) =>
                item.status === 'pending' || item.status === 'inprogress',
            )
          ) {
            throw new HttpException(
              {
                success: false,
                message: 'Participant Previous Class Not Completed.',
              },
              HttpStatus.NOT_FOUND,
            );
          }
        }
      }
    }

    if (existingParticipant) {
      throw new HttpException(
        {
          success: false,
          message:
            'Participant with this email already exists for another client.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const participant = await this.participantModel.create({
      participant_name: createParticipant.participant_name,
      email: createParticipant.email,
      job_grade: createParticipant.job_grade,
      perf1: createParticipant.perf1,
      perf2: createParticipant.perf2,
      perf3: createParticipant.perf3,
      department: createParticipant.department,
      division: createParticipant.division,
      date_of_joining: createParticipant.date_of_joining,
      date_of_birth: createParticipant.date_of_birth,
      client_id: client_id,
      cohort_id: createParticipant.cohort_id,
      project_id: createParticipant.project_id,
      position: createParticipant.position,
    } as Participants);

    return {
      success: true,
      message: 'Participant created successfully',
      participant,
    };
  }

  async test() {
    const partClass = await this.classModel.findAll({
      // attributes: ['id', 'client_id', 'cohort_id'],
      include: [
        {
          model: this.partAssessmentModel,
          as: 'participant_assessments',
          attributes: ['id', 'class_id', 'participant_id'],
          required: true,

          include: [
            {
              model: this.participantModel,
              as: 'participant',
              where: {
                email: 'c@mail.com',
              },
              attributes: ['id', 'email', 'participant_name'],
              required: true,
            },
          ],
        },
      ],
    });

    return partClass;
  }

  async participantsFilter(
    clientId?: string,
    projectId?: string,
    cohortId?: string,
    page?: number,
    limit?: number,
  ): Promise<any> {
    // if (clientId && projectId && cohortId) {
    //   try {
    //     await Promise.all([
    //       Clients.findByPk(clientId),
    //       Projects.findByPk(projectId),
    //       Cohorts.findByPk(cohortId),
    //     ]);
    //   } catch (error) {
    //     throw new HttpException(
    //       {
    //         message: 'Error while fatching the Client/Project/Cohort data.',
    //       },
    //       HttpStatus.NOT_FOUND,
    //     );
    //   }
    // }
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
      order: [['createdAt', 'ASC']],
      offset,
      limit,
      include: [
        {
          model: Clients,
          as: 'client',
          attributes: ['id', 'client_name'],
        },
        {
          model: ClientRoles,
          as: 'client_roles',
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

  async updateParticipant(
    particiapntId: string,
    updateData: Partial<updateParticipants>,
  ): Promise<any> {
    const classParticipant = await this.partAssessmentModel.findOne({
      where: {
        participant_id: particiapntId,
      },
    });
    if (classParticipant) {
      throw new HttpException(
        {
          message: 'Update not allowed: Participant present in NBO CLASS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const participant = await this.participantModel.findByPk(particiapntId);

    if (!participant) {
      throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
    }
    if (participant.email != updateData.email) {
      const existingParticipant = await this.participantModel.findOne({
        where: {
          email: updateData.email,
        },
      });
      const checkAssessor = await Assessros.findOne({
        where: {
          email: updateData.email,
        },
      });

      const checkUser = await Users.findOne({
        where: { email: updateData.email },
      });
      if (existingParticipant || checkUser || checkAssessor) {
        throw new HttpException(
          {
            success: false,
            message: 'Email already exists. Please use a unique email.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    await participant.update({
      participant_name: updateData.participant_name,
      email: updateData.email,
      job_grade: updateData.job_grade,
      perf1: updateData.perf1,
      perf2: updateData.perf2,
      perf3: updateData.perf3,
      department: updateData.department,
      division: updateData.division,
      date_of_joining: updateData.date_of_joining,
      date_of_birth: updateData.date_of_birth,
      position: updateData.position,
    });

    return { message: 'Participant updated successfully', participant };
  }

  async getParticipant(partId: string): Promise<Participants> {
    const participant = await this.participantModel.findOne({
      where: {
        id: partId,
      },
      include: [
        {
          model: Clients,
          as: 'client',
          attributes: ['id', 'client_name'],
        },
        {
          model: Cohorts,
          as: 'cohorts',
          attributes: ['id', 'cohort_name'],
          include: [
            {
              model: Projects,
              as: 'project',
              attributes: ['id', 'project_name', 'nbol_ll_id'],
              include: [
                {
                  model: NbolLeadLevels,
                  as: 'nbol',
                },
              ],
            },
          ],
        },
        {
          model: ClientRoles,
          as: 'client_roles',
          attributes: ['id', 'role'],
        },
      ],
    });
    if (!participant) {
      throw new HttpException('Participant Not Found', HttpStatus.NOT_FOUND);
    }
    return participant;
  }

  async deleteParticipant(participantId: string): Promise<any> {
    const classParticipant = await this.partAssessmentModel.findOne({
      where: {
        participant_id: participantId,
      },
    });
    if (classParticipant) {
      throw new HttpException(
        {
          message: 'Deletion not allowed: Participant present in NBO CLASS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const participant = await this.participantModel.findByPk(participantId);
    if (participant) {
      await this.participantModel.destroy({ where: { id: participantId } });
    } else {
      throw new HttpException(
        {
          message: 'Participant not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      message: 'Participant deleted successfully',
    };
  }

  async getProjectCohorts(projectId): Promise<any> {
    const cohorts = await this.cohortModel.findAll({
      where: {
        project_id: projectId,
      },
      order: [['createdAt', 'DESC']],
    });
    if (cohorts.length <= 0) {
      throw new HttpException(
        {
          message: 'Cohort Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      rows: cohorts,
    };
  }

  async getAllParticipants(page: number = 0, limit: number = 10): Promise<any> {
    const offset = page * limit;
    const participants = await this.participantModel.findAll({
      where: {
        ...getSearchObject(this.requestParams.query, [
          'participant_name',
          'email',
        ]),
      },
      order: [['createdAt', 'DESC']],
      offset: offset,
      limit: limit,
      include: [
        {
          model: Clients,
          as: 'client',
          attributes: ['id', 'client_name'],
        },
        {
          model: this.roleModel,
          as: 'client_roles',
          attributes: ['id', 'role'],
          include: [
            {
              model: NbolLeadLevels,
              as: 'nbol',
              attributes: ['id', 'leadership_level'],
            },
          ],
        },
      ],
    });
    if (participants.length <= 0) {
      throw new HttpException(
        {
          message: 'Participants not found',
        },
        HttpStatus.OK,
      );
    }
    return {
      rows: participants,
      count: participants.length,
    };
  }
}
