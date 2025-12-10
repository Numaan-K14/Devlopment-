import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreationAttributes, Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { IsNull, Sequelize } from 'sequelize-typescript';
import * as XLSX from 'xlsx';
import * as path from 'path';
import transaction from 'sequelize/types/transaction';
import { Competencies } from '../model/competency.model';
import { ExpectedBehaviours } from '../model/expected_behaviour.model';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { NbolClientCompetency } from '../model/nbol_client_competency.model';
import { updateCompetency } from '../dto/update-competency.dto';
import { createCompetency } from '../dto/create_competency.dto';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { ClientRoles } from 'src/Modules/client-roles-levels/model/role.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { count } from 'console';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { createCompWeightage } from '../dto/competency_weightage.dto';
import { CompetencyWeightage } from '../model/competency_weightage.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { Participants } from 'src/Modules/participants/model/participants.model';
import { Transaction } from 'sequelize';


@Injectable()
export class CompetencyService {
  constructor(
    @InjectModel(Competencies)
    private competencyModel: typeof Competencies,

    @InjectModel(Participants)
    private participantsModel: typeof Participants,

    @InjectModel(ExpectedBehaviours)
    private expectedbehaviourModel: typeof ExpectedBehaviours,

    @InjectModel(NbolLeadLevels)
    private nbolLeadLevelModel: typeof NbolLeadLevels,

    @InjectModel(NbolClientCompetency)
    private NbolClientCompetencyModel: typeof NbolClientCompetency,

    @InjectModel(Clients)
    private clientModel: typeof Clients,

    @InjectModel(ClientRoles)
    private roleModel: typeof ClientRoles,

    @InjectModel(Projects)
    private projectModel: typeof Projects,

    @InjectModel(Class)
    private classModel: typeof Class,

    @InjectModel(CompetencyWeightage)
    private competencyWeightageModel: typeof CompetencyWeightage,

    @InjectModel(ClientAssessments)
    private clientAssessmentsModel: typeof ClientAssessments,

    @InjectModel(Scenerios)
    private scenerioModel: typeof Scenerios,

    @InjectModel(Quessionnaires)
    private quessionnaireModel: typeof Quessionnaires,

    @InjectModel(Assessments)
    private assessmentsModel: typeof Assessments,

    private sequelize: Sequelize,
    private readonly requestParams: RequestParamsService,
  ) {}

  async download() {
    try {
      const fileName = 'client_competency_data.xlsx';
      return {
        fileName,
        filePath: 'public/excel/client_competency_data.xlsx',
      };
    } catch (error) {
      throw new Error(`Failed to download Excel file: ${error.message}`);
    }
  }

  // async processExcelFile(
  //   clientId: string,
  //   nbolId: string,
  //   file: Express.Multer.File,
  // ): Promise<string> {
  //   try {
  //     const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

  //     const competencyMap = new Map<
  //       string,
  //       { competency: string; client_id: string; nbol_id: string }
  //     >();
  //     const expected_behaviours: {
  //       expected_behaviour: string;
  //       competency: string;
  //     }[] = [];

  //     jsonData.forEach((item) => {
  //       const competencyKey = `${item.competency}`;

  //       if (!competencyMap.has(competencyKey)) {
  //         competencyMap.set(competencyKey, {
  //           competency: item.competency,
  //           client_id: clientId,
  //           nbol_id: nbolId,
  //         });
  //       }

  //       Object.keys(item).forEach((key) => {
  //         if (key.toLowerCase().startsWith('expected_behaviour') && item[key]) {
  //           expected_behaviours.push({
  //             expected_behaviour: item[key],
  //             competency: item.competency,
  //           });
  //         }
  //       });
  //     });

  //     const competenciesArray = Array.from(competencyMap.values());

  //     const savedCompetencies = await this.competencyModel.bulkCreate(
  //       competenciesArray as CreationAttributes<Competencies>[],
  //       {
  //         returning: true,
  //       },
  //     );

  //     const competencyIdMap = new Map<string, string>();
  //     savedCompetencies.forEach((competency: any) => {
  //       competencyIdMap.set(`${competency.competency}`, competency.id);
  //     });

  //     const expectedBehavioursWithCompetencyId: CreationAttributes<ExpectedBehaviours>[] =
  //       expected_behaviours.map(
  //         (expectedBehaviour) =>
  //           ({
  //             expected_behaviour: expectedBehaviour.expected_behaviour,
  //             competency_id:
  //               competencyIdMap.get(`${expectedBehaviour.competency}`) || null,
  //             createdAt: new Date(),
  //             updatedAt: new Date(),
  //           }) as unknown as CreationAttributes<ExpectedBehaviours>,
  //       );

  //     await this.expectedbehaviourModel.bulkCreate(
  //       expectedBehavioursWithCompetencyId,
  //     );

  //     return 'Excel data uploaded successfully!';
  //   } catch (error) {
  //     throw new Error(`Failed to process Excel file: ${error.message}`);
  //   }
  // }

  async processExcelFile(
    clientId: string,
    nbolId: string,
    file: Express.Multer.File,
  ): Promise<string> {
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
            message: 'Excel file is empty No Valid Competency Found.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      jsonData.forEach((item, idx) => {
        const requiredFields = ['Competency', 'Expected Behaviours'];
        for (const field of requiredFields) {
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

      const normalizedData = jsonData.map((item) => ({
        competency: item['Competency'],
        expected_behaviour1: item['Expected Behaviours'],
        // expected_behaviour2: item['Expected Behaviour 2'],
        // expected_behaviour3: item['Expected Behaviour 3'],
        // expected_behaviour4: item['Expected Behaviour 4'],
        // expected_behaviour5: item['Expected Behaviour 5'],
        // expected_behaviour6: item['Expected Behaviour 6'],
      }));

      const competencyMap = new Map<
        string,
        { competency: string; client_id: string; nbol_id: string }
      >();
      const expected_behaviours: {
        expected_behaviour: string;
        competency: string;
      }[] = [];

      normalizedData.forEach((item) => {
        if (
          !item.competency ||
          item.competency === null ||
          item.competency.toString().trim() === ''
        ) {
          return;
        }

        const competencyKey = `${item.competency}`;

        if (!competencyMap.has(competencyKey)) {
          competencyMap.set(competencyKey, {
            competency: item.competency.toString().trim(),
            client_id: clientId,
            nbol_id: nbolId,
          });
        }

        // Object.keys(item).forEach((key) => {
        //   if (
        //     key.toLowerCase().startsWith('expected_behaviour') &&
        //     item[key] &&
        //     item[key] !== null &&
        //     item[key].toString().trim() !== ''
        //   ) {
        //     expected_behaviours.push({
        //       expected_behaviour: item[key].toString().trim(),
        //       competency: item.competency.toString().trim(),
        //     });
        //   }
        // });

        Object.keys(item).forEach((key) => {
          if (
            key.toLowerCase().startsWith('expected_behaviour') &&
            item[key] &&
            item[key] !== null &&
            item[key].toString().trim() !== ''
          ) {
            const behaviours = item[key]
              .toString()
              .split(/\r?\n/)
              .map((b) => b.trim())
              .filter((b) => b.length > 0);

            behaviours.forEach((behaviour) => {
              expected_behaviours.push({
                expected_behaviour: behaviour,
                competency: item.competency.toString().trim(),
              });
            });
          }
        });
      });

      const competenciesArray = Array.from(competencyMap.values());

      if (competenciesArray.length === 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'No valid competencies found in the Excel file.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const savedCompetencies = await this.competencyModel.bulkCreate(
        competenciesArray as CreationAttributes<Competencies>[],
        {
          returning: true,
        },
      );

      const competencyIdMap = new Map<string, string>();
      savedCompetencies.forEach((competency: any) => {
        competencyIdMap.set(`${competency.competency}`, competency.id);
      });

      const expectedBehavioursWithCompetencyId: CreationAttributes<ExpectedBehaviours>[] =
        expected_behaviours
          .filter((expectedBehaviour) =>
            competencyIdMap.get(`${expectedBehaviour.competency}`),
          )
          .map(
            (expectedBehaviour) =>
              ({
                expected_behaviour: expectedBehaviour.expected_behaviour,
                competency_id:
                  competencyIdMap.get(`${expectedBehaviour.competency}`) ||
                  null,
                createdAt: new Date(),
                updatedAt: new Date(),
              }) as unknown as CreationAttributes<ExpectedBehaviours>,
          );

      if (expectedBehavioursWithCompetencyId.length > 0) {
        await this.expectedbehaviourModel.bulkCreate(
          expectedBehavioursWithCompetencyId,
        );
      }

      return 'Excel data uploaded successfully!';
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `Failed to process Excel file: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createCompetency(
    clientId: string,
    nbolId: string,
    createCompetencyDto: createCompetency,
  ): Promise<Competencies> {
    return await this.sequelize.transaction(async (transaction) => {
      const competency = await this.competencyModel.create(
        {
          competency: createCompetencyDto.competency,
          description: createCompetencyDto.description,
          nbol_id: nbolId,
          client_id: clientId,
        } as Competencies,
        { transaction, returning: true },
      );

      const expectedBehaviour: CreationAttributes<ExpectedBehaviours>[] =
        createCompetencyDto.expected_behaviours.map(
          (behaviour): CreationAttributes<ExpectedBehaviours> =>
            ({
              expected_behaviour: behaviour.expected_behaviour,
              competency_id: competency.id,
            }) as CreationAttributes<ExpectedBehaviours>,
        );

      await this.expectedbehaviourModel.bulkCreate(expectedBehaviour, {
        transaction,
      });

      if (clientId != null) {
        // await this.competencyModel.create(
        //   {
        //     competency: competency.competency,
        //     nbol_id: nbolId,
        //     client_id: clientId,
        //     ref_nbol_id: competency.id,
        //     is_copy: true,
        //   } as Competencies,
        //   { transaction, returning: true },
        // );
        await this.NbolClientCompetencyModel.create(
          {
            nbol_id: nbolId,
            client_id: clientId,
            ref_nbol_compt_id: competency.id,
          } as NbolClientCompetency,
          { transaction },
        );
      }
      return competency;
    });
  }

  async userAllCompetency(clientId: string): Promise<any> {
    const competency = await this.competencyModel.findAll({
      where: {
        client_id: clientId,
      },
    });
    return competency;
  }

  async getAllCompetency(): Promise<any> {
    const competencies = await this.competencyModel.findAll();
    return competencies;
  }

  async getCompetency(nbolId: string): Promise<any> {
    const nbolLevel = await this.nbolLeadLevelModel.findAll({
      where: {
        id: nbolId,
      },
      attributes: ['id', 'leadership_level', 'description'],

      include: [
        {
          model: Competencies,
          as: 'competencies',
          attributes: ['id', 'competency', 'nbol_id'],
          where: {
            client_id: {
              [Op.eq]: null,
            },
          },

          include: [
            {
              model: ExpectedBehaviours,
              as: 'expected_behaviours',
              attributes: ['id', 'expected_behaviour', 'competency_id'],
            },
          ],
        },
      ],
    });

    return nbolLevel;
  }

  async getSingleCompetency(competencyId: string): Promise<any> {
    const competency = await this.competencyModel.findOne({
      where: {
        id: competencyId,
      },
      include: [
        {
          model: this.expectedbehaviourModel,
          as: 'expected_behaviours',
        },
      ],
    });

    return competency;
  }

  async updateCompetency(
    competencyId: string,
    updateCompetencyDto: Partial<updateCompetency>,
  ): Promise<Competencies> {
    return await this.sequelize.transaction(async (transaction) => {
      const competency = await this.competencyModel.findByPk(competencyId, {
        transaction,
      });

      if (!competency) {
        throw new HttpException('Competency not found', HttpStatus.NOT_FOUND);
      }

      if (updateCompetencyDto.competency) {
        (competency.competency = updateCompetencyDto.competency),
          (competency.description =
            updateCompetencyDto.description ?? competency.description);

        await competency.save({ transaction });
      }

      if (updateCompetencyDto.expected_behaviours) {
        await this.expectedbehaviourModel.destroy({
          where: { competency_id: competencyId },
          transaction,
        });

        const newBehaviours: CreationAttributes<ExpectedBehaviours>[] =
          updateCompetencyDto.expected_behaviours.map(
            (behaviour): CreationAttributes<ExpectedBehaviours> =>
              ({
                expected_behaviour: behaviour.expected_behaviour,
                competency_id: competencyId,
              }) as CreationAttributes<ExpectedBehaviours>,
          );

        await this.expectedbehaviourModel.bulkCreate(newBehaviours, {
          transaction,
        });
      }

      return competency;
    });
  }

  // async deleteCompetency(competencyId: string): Promise<any> {
  //   const competency = await this.competencyModel.findOne({
  //     where: {
  //       id: competencyId,
  //     },
  //   });
  //   if (!competency) {
  //     throw new HttpException('competency not found', HttpStatus.NOT_FOUND);
  //   }
  //   await competency?.destroy();
  // }

  async deleteCompetency(recordId: string): Promise<any> {
    // const copyCompetency = await this.competencyModel.findOne({
    //   where: {
    //     ref_nbol_id: recordId,
    //   },
    // });
    // if (copyCompetency) {
    //   throw new HttpException(
    //     {
    //       message:
    //         'You can not delete the Competency which is used in the NBOL Class',
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    const competency = await this.competencyModel.findOne({
      where: {
        id: recordId,
      },
    });

    if (competency) {
      await competency.destroy();
      return { message: 'Competency Deleted successfully' };
    }

    const clientCompetency = await this.NbolClientCompetencyModel.findOne({
      where: {
        id: recordId,
      },
    });

    if (clientCompetency) {
      await clientCompetency.destroy();
      return {
        message: 'Competency Deleted successfully',
      };
    }

    throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
  }

  // async getAllLevelsCompetency(
  //   page: number = 0,
  //   limit: number = 10,
  // ): Promise<any> {
  //   const offset = page * limit;
  //   const allLevels = await this.competencyModel.findAll({
  //     offset: offset,
  //     limit: limit,
  //     include: [
  //       {
  //         model: ExpectedBehaviours,
  //         as: 'expected_behaviours',
  //       },
  //       {
  //         model: NbolLeadLevels,
  //         as: 'nbol_leadership_level',
  //       },
  //     ],
  //   });
  //   // const count = allLevels.reduce(
  //   //   (total, level) => total + (level.nbol_levels?.length || 0),
  //   //   0,
  //   // );
  //   const count = await this.competencyModel.count();
  //   return {
  //     rows: allLevels,
  //     count: count,
  //   };
  // }

  async getLeadLevelsCompetencyfilter(
    nbolId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;

    const allLevels = await this.competencyModel.findAll({
      where: {
        [Op.and]: [{ nbol_id: nbolId }, { client_id: { [Op.is]: null } }],
        ...getSearchObject(this.requestParams.query, ['competency']),
      },
      // order: [['createdAt', 'DESC']],
      offset: offset,
      limit: limit,
      order: [
        Sequelize.literal(`CASE 
      WHEN "Competencies".competency = 'Strategic Vision and Insight' THEN 1
      WHEN "Competencies".competency = 'Business Acumen and Financial Stewardship' THEN 2
      WHEN "Competencies".competency = 'Innovation and Transformation Leadership' THEN 3
      WHEN "Competencies".competency = 'Inspirational Leadership and Decision-Making' THEN 4
      WHEN "Competencies".competency = 'Collaborative Influence and Stakeholder Engagement' THEN 5
      WHEN "Competencies".competency = 'Talent Development and Inclusion' THEN 6
      ELSE 7
    END`),
      ],
      include: [
        {
          model: ExpectedBehaviours,
          as: 'expected_behaviours',
        },
        {
          model: NbolLeadLevels,
          as: 'nbol_leadership_level',
        },
      ],
    });

    if (allLevels.length <= 0) {
      throw new HttpException(
        {
          message: 'Competencies not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      rows: allLevels,
      count: await this.competencyModel.count({
        where: {
          [Op.and]: [{ nbol_id: nbolId }, { client_id: { [Op.is]: null } }],
        },
      }),
    };
  }

  async getAllParticipantDashboardData(
    partId: string,
    clientId: string,
  ): Promise<any> {
    // const participant = await this.participantsModel.findOne({
    //   where: { id: partId },
    //   include: [
    //     {
    //       model: Projects,
    //       as: 'project',
    //       include: [{ model: NbolLeadLevels, as: 'nbol' }],
    //     },
    //   ],
    // });

    const leadership = await this.nbolLeadLevelModel.findOne({
      include: [
        {
          model: Projects,
          as: 'projects',
          include: [
            { model: Participants, as: 'participants', where: { id: partId } },
          ],
        },
      ],
    });

    console.log(leadership, '<-=---------- leadership');
    let competencies;

    if (leadership) {
      competencies = await this.competencyModel.findAll({
        where: {
          nbol_id: leadership.id,
          client_id: clientId,
        },
         order: [
        Sequelize.literal(`CASE 
      WHEN "Competencies".competency = 'Strategic Vision and Insight' THEN 1
      WHEN "Competencies".competency = 'Business Acumen and Financial Stewardship' THEN 2
      WHEN "Competencies".competency = 'Innovation and Transformation Leadership' THEN 3
      WHEN "Competencies".competency = 'Inspirational Leadership and Decision-Making' THEN 4
      WHEN "Competencies".competency = 'Collaborative Influence and Stakeholder Engagement' THEN 5
      WHEN "Competencies".competency = 'Talent Development and Inclusion' THEN 6
      ELSE 7
    END`),
      ],
        include: [
          { model: this.expectedbehaviourModel, as: 'expected_behaviours' },
        ],
      });
    }
    return competencies;
  }

  async getNbolLeadComp(
    projectId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;
    const allLevels = await this.competencyModel.findAll({
      where: {
        client_id: { [Op.is]: null },
      },
      offset: offset,
      limit: limit,
      include: [
        {
          model: NbolLeadLevels,
          as: 'nbol_leadership_level',
          required: true,
          attributes: ['id', 'leadership_level'],
          include: [
            {
              model: Projects,
              as: 'projects',
              attributes: ['id', 'project_name'],
              where: {
                id: projectId,
              },
              required: true,
            },
          ],
        },
      ],
    });
    if (allLevels.length <= 0) {
      throw new HttpException(
        {
          message: 'Competencies not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      rows: allLevels,
      count: allLevels.length,
    };
  }

  async clientLeadLeavelComp(clientId: string): Promise<any> {
    const clientRole = await this.roleModel.findOne({
      where: {
        client_id: clientId,
      },
    });
    const nbolId = clientRole?.nbol_id;

    const competency = await this.competencyModel.findAll({
      where: {
        [Op.and]: [{ client_id: null }, { nbol_id: nbolId }, { is_copy: null }],
      },
    });
    return competency;
  }

  // ===============

  // refer it .....
  // async getAllLevelsLeadershipClientfilter(
  //   nbolId: string,
  //   clientId: string,
  //   page: number = 0,
  //   limit: number = 10,
  // ): Promise<any> {
  //   const offset = page * limit;

  //   const allLevels = await this.competencyModel.findAll({
  //     where: {
  //       [Op.and]: [
  //         {
  //           [Op.or]: [
  //             { client_id: clientId },
  //             { client_id: { [Op.is]: null } },
  //           ],
  //         },
  //         { nbol_id: nbolId },
  //       ],
  //     },
  //     offset: offset,
  //     limit: limit,
  //     include: [
  //       {
  //         model: NbolClientCompetency,
  //         as: 'nbol_client_competencies',
  //         required: false,
  //         attributes: [],
  //         where: {
  //           client_id: clientId,
  //         },
  //       },
  //       {
  //         model: NbolLeadLevels,
  //         as: 'nbol_leadership_level',
  //       },
  //     ],
  //   });

  //   const count = await this.competencyModel.count({
  //     where: {
  //       [Op.and]: [
  //         { nbol_id: nbolId },
  //         {
  //           [Op.or]: [
  //             { client_id: clientId },
  //             { client_id: { [Op.is]: null } },
  //           ],
  //         },
  //       ],
  //     },
  //   });

  //   return {
  //     rows: allLevels,
  //     count: count,
  //   };
  // }

  async getAllLevelsLeadershipClientfilter(
    nbolId: string,
    clientId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;

    const allLevels = await this.competencyModel.findAll({
      where: {
        [Op.and]: [
          { nbol_id: nbolId },
          {
            [Op.or]: [
              { client_id: clientId },
              {
                [Op.and]: [
                  // { client_id: { [Op.is]: null } },
                  {
                    id: {
                      [Op.in]: Sequelize.literal(`
                        (SELECT ref_nbol_compt_id
                         FROM nbol_client_competencies
                         WHERE client_id = '${clientId}'
                         AND nbol_id = '${nbolId}')
                      `),
                    },
                  },
                ],
              },
            ],
          },
          { is_copy: null },
        ],
      },
      offset: offset,
      limit: limit,
      include: [
        {
          model: NbolClientCompetency,
          as: 'nbol_client_competencies',
          required: false,
          where: {
            // client_id: clientId,
            [Op.and]: [{ client_id: clientId }, { nbol_id: nbolId }],
          },
          include: [
            {
              model: NbolLeadLevels,
              as: 'nbol_leadership_level',
            },
          ],
        },
        {
          model: NbolLeadLevels,
          as: 'nbol_leadership_level',
        },
        {
          model: ExpectedBehaviours,
          as: 'expected_behaviours',
        },
      ],
      // order: [['createdAt', 'DESC']],
      order: [
        Sequelize.literal(`CASE 
      WHEN "Competencies".competency = 'Strategic Vision and Insight' THEN 1
      WHEN "Competencies".competency = 'Business Acumen and Financial Stewardship' THEN 2
      WHEN "Competencies".competency = 'Innovation and Transformation Leadership' THEN 3
      WHEN "Competencies".competency = 'Inspirational Leadership and Decision-Making' THEN 4
      WHEN "Competencies".competency = 'Collaborative Influence and Stakeholder Engagement' THEN 5
      WHEN "Competencies".competency = 'Talent Development and Inclusion' THEN 6
      ELSE 7
    END`),
      ],
    });

    // const allLevels = await this.competencyModel.findAll({
    //   where: {
    //    [Op.and]:[
    //     {client_id: clientId},
    //     {nbol_id: nbolId},
    //     {is_copy: true},
    //    ]
    //   },
    //   offset: offset,
    //   limit: limit,
    //   include: [
    //     {
    //       model: NbolLeadLevels,
    //       as: 'nbol_leadership_level',
    //     },
    //     {
    //       model: ExpectedBehaviours,
    //       as: 'expected_behaviours',
    //     },
    //   ],
    //   order: [['createdAt', 'DESC']],
    // });

    const count = await this.competencyModel.count({
      where: {
        [Op.and]: [
          { nbol_id: nbolId },
          {
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
                         WHERE client_id = '${clientId}'
                         AND nbol_id = '${nbolId}')
                      `),
                    },
                  },
                ],
              },
            ],
          },
          { is_copy: null },
        ],
      },
    });

    return {
      rows: allLevels,
      count: count,
    };
  }

  async addNbolCompetencyToClientCompetency(
    nbolId: string,
    clientId: string,
    competencyIds: string[],
  ): Promise<Competencies[]> {
    const nbol_competencies = await this.competencyModel.findAll({
      where: {
        [Op.and]: [
          { id: { [Op.in]: competencyIds } },
          { client_id: { [Op.is]: null } },
        ],
      },
      include: [
        {
          model: ExpectedBehaviours,
          as: 'expected_behaviours',
        },
      ],
    });

    if (!nbol_competencies.length) {
      throw new HttpException(
        'No NBOL Competencies found',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.sequelize.transaction(async (transaction) => {
      const newCompetencies = await this.competencyModel.bulkCreate(
        nbol_competencies.map((comp) => ({
          competency: comp.competency,
          description: comp.description,
          nbol_id: nbolId,
          client_id: clientId,
          ref_nbol_id: comp.id,
          is_copy: true,
        })) as CreationAttributes<Competencies>[],
        { transaction },
      );

      const allExpectedBehaviors = nbol_competencies.reduce(
        (behaviors, comp, index) => {
          if (comp.expected_behaviours?.length) {
            const compBehaviors = comp.expected_behaviours.map((behaviour) => ({
              expected_behaviour: behaviour.expected_behaviour,
              competency_id: newCompetencies[index].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            }));
            return [...behaviors, ...compBehaviors];
          }
          return behaviors;
        },
        [] as any[],
      );

      if (allExpectedBehaviors.length > 0) {
        await this.expectedbehaviourModel.bulkCreate(
          allExpectedBehaviors as CreationAttributes<ExpectedBehaviours>[],
          { transaction },
        );
      }

      const createdCompetencies = await this.competencyModel.findAll({
        where: {
          id: {
            [Op.in]: newCompetencies.map((comp) => comp.id),
          },
        },
        include: [
          {
            model: ExpectedBehaviours,
            as: 'expected_behaviours',
          },
        ],
        transaction,
      });

      if (!createdCompetencies.length) {
        throw new Error('Failed to create competencies');
      }

      return createdCompetencies;
    });
  }

  // comp of client and nbol that client selected
  async addNbolCompToClient(
    nbolId: string,
    clientId: string,
    competencyIds: string[],
  ): Promise<any> {
    try {
      const existingMappings = await this.NbolClientCompetencyModel.findAll({
        where: {
          [Op.and]: [
            { client_id: clientId },
            { ref_nbol_compt_id: { [Op.in]: competencyIds } },
          ],
        },
      });

      if (existingMappings.length > 0) {
        const duplicateCompetencyIds = existingMappings.map(
          (mapping) => mapping.ref_nbol_compt_id,
        );
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: `Some competencies are already mapped to this client`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const recordsToCreate = competencyIds.map((competencyId) => ({
        nbol_id: nbolId,
        ref_nbol_compt_id: competencyId,
        client_id: clientId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const client_nbol_comp = await this.NbolClientCompetencyModel.bulkCreate(
        recordsToCreate as CreationAttributes<NbolClientCompetency>[],
        {
          returning: true,
          validate: true,
        },
      );

      const createdRecords = await this.NbolClientCompetencyModel.findAll({
        where: {
          id: {
            [Op.in]: client_nbol_comp.map((record) => record.id),
          },
        },
        include: [
          {
            model: Competencies,
            as: 'competency',
          },
        ],
      });

      if (!createdRecords.length) {
        throw new HttpException(
          {
            message: 'Atleast Select One NBOL Competency.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return createdRecords;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create NBOL client competencies: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async clientAllCompetency(
    clientId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const offset = page * limit;
    const allCompetencies = await this.competencyModel.findAll({
      offset: offset,
      limit: limit,
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
      order: [['createdAt', 'DESC']],
    });
    const count = await this.competencyModel.count({
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
    });
    return {
      rows: allCompetencies,
      count: count,
    };
  }

  async getAllComp(page: number = 0, limit: number = 10): Promise<any> {
    const offset = page * limit;

    const competency = await this.competencyModel.findAll({
      offset: offset,
      limit: limit,
      where: {
        client_id: {
          [Op.is]: null,
        },
      },
    });
    return {
      rows: competency,
      count: competency,
      length,
    };
  }

  async createCompetencyWeightages(
    client_id: string,
    project_id: string,
    cohort_id: string,
    dto: createCompWeightage,
  ): Promise<any> {
    const existingClass = await this.classModel.findOne({
      where: {
        cohort_id,
      },
    });
    if (existingClass) {
      throw new HttpException(
        {
          message:
            'Weightage cannot be assigned as the class is already configured for this cohort.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingWeightages = await this.competencyWeightageModel.findOne({
      where: {
        cohort_id: cohort_id,
      },
    });

    if (existingWeightages) {
      await this.competencyWeightageModel.destroy({
        where: {
          cohort_id: cohort_id,
        },
      });
    }
    const recordsToInsert = dto.assessment.flatMap(
      ({ assessment_id, competency, scenerio_id, quessionnaire_id }) =>
        competency.map(
          ({ competency_id, weightage, total }) =>
            ({
              client_id,
              project_id,
              cohort_id,
              assessment_id: assessment_id,
              scenerio_id: scenerio_id,
              quessionnaire_id: quessionnaire_id,
              comp_id: competency_id,
              weightage: weightage,
              total: total,
              submitted: dto.submitted,
            }) as any,
        ),
    );

    return await this.competencyWeightageModel.bulkCreate(recordsToInsert);
  }

  //   async createCompetencyWeightages(
  //   client_id: string,
  //   project_id: string,
  //   cohort_id: string,
  //   dto: createCompWeightage,
  // ) {
  //   const recordsToInsert = dto.assessment.flatMap(
  //     ({ assessment_id, competency, scenerio_id, quessionnaire_id }) =>
  //       competency.map(
  //         ({ competency_id, weightage, total }) =>
  //           ({
  //             client_id,
  //             project_id,
  //             cohort_id,
  //             assessment_id,
  //             scenerio_id,
  //             quessionnaire_id,
  //             comp_id: competency_id,
  //             weightage,
  //             total,
  //             submitted: dto.submitted,
  //           }) as any,
  //       ),
  //   );

  //   return await this.competencyWeightageModel.bulkCreate(recordsToInsert, {
  //     updateOnDuplicate: ['weightage', 'total', 'submitted'], // fields to update on conflict
  //   });
  // }

  async getAssessmCompWeightage(
    clientId: string,
    cohortId: string,
  ): Promise<any> {
    const assessments = await this.clientAssessmentsModel.findAll({
      where: {
        cohort_id: cohortId,
      },
      attributes: [],
      // order: [['createdAt', 'DESC']],
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
          where: {
            is_cbi: {
              [Op.ne]: true,
            },
          },
          attributes: [
            'assessment_name',
            'is_quesionnaire',
            'is_group_activity',
            'is_cbi',
          ],
        },
      ],
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
    });

    const competency = await this.NbolClientCompetencyModel.findAll({
      where: {
        client_id: clientId,
      },
      attributes: [],
      include: [
        {
          model: this.competencyModel,
          as: 'competency',
          attributes: ['id', 'competency'],
          include: [
            {
              model: this.competencyWeightageModel,
              as: 'comp_weight',
              attributes: [
                'id',
                'cohort_id',
                'assessment_id',
                'scenerio_id',
                'quessionnaire_id',
                'comp_id',
                'weightage',
                'total',
                'submitted',
              ],
              where: {
                cohort_id: cohortId,
              },
              required: false,
            },
          ],
        },
      ],
      // order: [[{ model: Competencies, as: 'competency' }, 'createdAt', 'DESC']],
      order: [
        Sequelize.literal(`CASE 
      WHEN "competency".competency = 'Strategic Vision and Insight' THEN 1
      WHEN "competency".competency = 'Business Acumen and Financial Stewardship' THEN 2
      WHEN "competency".competency = 'Innovation and Transformation Leadership' THEN 3
      WHEN "competency".competency = 'Inspirational Leadership and Decision-Making' THEN 4
      WHEN "competency".competency = 'Collaborative Influence and Stakeholder Engagement' THEN 5
      WHEN "competency".competency = 'Talent Development and Inclusion' THEN 6
      ELSE 7
    END`),
      ],
    });
    return { assessments, competency };
  }

  async test(clientId: string, cohortId: string): Promise<any> {
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
          include: [
            {
              model: this.competencyWeightageModel,
              as: 'comp_weight_as',
              where: {
                client_id: clientId,
              },
              required: false,
              include: [
                {
                  model: this.competencyModel,
                  as: 'comp',
                  required: false,

                  include: [
                    {
                      model: this.NbolClientCompetencyModel,
                      as: 'nbol_client_competencies',
                      where: {
                        client_id: clientId,
                      },
                      required: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // const competency = await this.NbolClientCompetencyModel.findAll({
    //   where: {
    //     client_id: clientId,
    //   },
    //   attributes: [],
    //   include: [
    //     {
    //       model: this.competencyModel,
    //       as: 'competency',
    //       attributes: ['id', 'competency'],
    //       include: [
    //         {
    //           model: this.competencyWeightageModel,
    //           as: 'comp_weight',
    //           attributes: [
    //             'id',
    //             'assessment_id',
    //             'comp_id',
    //             'weightage',
    //             'total',
    //             'submitted',
    //           ],
    //           where: {
    //             client_id: clientId,
    //           },
    //           required: false,
    //         },
    //       ],
    //     },
    //   ],
    // });
    return assessments;
  }

  // async updateNbolCompToCompyComp(
  //   clientId: string,
  //   cohortId: string,
  // ): Promise<any> {
  //   const compWeightage = await this.competencyWeightageModel.findAll({
  //     where: {
  //       cohort_id: cohortId,
  //     },
  //     attributes: ['comp_id'],
  //     group: ['comp_id'],
  //   });
  //   const copyComp = await this.competencyModel.findAll({
  //     where: {
  //       client_id: clientId,
  //       is_copy: true,
  //     },
  //     attributes: ['id', 'competency', 'ref_nbol_id'],
  //   });

  //   const updates = compWeightage.map((cw, idx) => ({
  //     id: cw.id,
  //     comp_id: copyComp[idx]?.id,
  //   }));

  //   console.log(updates, "-=-=-=-=-=-=-=-=-");

  //   await this.competencyWeightageModel.bulkCreate(updates as any[], {
  //     updateOnDuplicate: ['comp_id'],
  //   });

  //   return {
  //     copyComp,
  //     compWeightage,
  //   };
  // }

  async updateNbolCompToCompyComp(
    clientId: string,
    projectId: string,
    cohortId: string,
    transaction?: Transaction
  ): Promise<any> {
    // const transaction = await this.sequelize.transaction();
    const compWeightage = await this.competencyWeightageModel.findAll({
      where: { cohort_id: cohortId },
      attributes: ['id', 'comp_id'],
      transaction,
    });

    const copyComp = await this.competencyModel.findAll({
      where: { client_id: clientId, is_copy: true },
      attributes: ['id', 'competency', 'ref_nbol_id'],
      transaction,
    });

    const copyCompMap = new Map<string, string>();
    copyComp.forEach((comp) => {
      if (comp.ref_nbol_id) {
        copyCompMap.set(comp.ref_nbol_id.toString(), comp.id.toString());
      }
    });

    const updates = compWeightage
      .map((cw) => {
        const newCompId = copyCompMap.get(cw.comp_id?.toString());
        if (newCompId) {
          return {
            id: cw.id,
            comp_id: newCompId,
            client_id: clientId,
            project_id: projectId,
            cohort_id: cohortId,
          };
        }
        return null;
      })
      .filter((u) => u !== null);

    if (updates.length > 0) {
      const updated_comp = await this.competencyWeightageModel.bulkCreate(
        updates as any[],
        {
          updateOnDuplicate: ['comp_id'],
          transaction,
        },
      );
      // await transaction.commit();
      return {
        updated_comp,
      };
    }
  }

  async copyCohortAssemWeightage(
    cohort_id: string,
    new_cohort_id: string,
  ): Promise<any> {
    const existingAssessmentsWeight =
      await this.competencyWeightageModel.findOne({
        where: {
          cohort_id: new_cohort_id,
        },
      });
    if (existingAssessmentsWeight) {
      throw new HttpException(
        {
          message: 'Assessments scenerios already exists for this cohort',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const clientAssessmentsWeightage =
      await this.competencyWeightageModel.findAll({
        where: { cohort_id },
        raw: true,
      });

    if (!clientAssessmentsWeightage.length) {
      return [];
    }

    const newAssessmentsWeightage = clientAssessmentsWeightage.map(
      ({ id, cohort_id, submitted, createdAt, updatedAt, ...rest }) => ({
        ...rest,
        cohort_id: new_cohort_id,
      }),
    );

    const created = await this.competencyWeightageModel.bulkCreate(
      newAssessmentsWeightage as any,
    );

    return created;
  }
}
