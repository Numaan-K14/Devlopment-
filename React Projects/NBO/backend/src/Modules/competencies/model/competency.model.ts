import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Index,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ExpectedBehaviours } from './expected_behaviour.model';
import { NbolLeadLevels } from 'src/Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { NbolClientCompetency } from './nbol_client_competency.model';
import { ClassCompetencies } from 'src/Modules/class-configration/model/classAssessmentsCompetencies';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { ParticipantScore } from 'src/Modules/class-configration/model/participantScore.model';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { ParticipantAvgComp } from 'src/Modules/report/model/part_average_comp_score.model';
import { CompetencyWeightage } from './competency_weightage.model';
import { AdminScore } from 'src/Modules/class-configration/model/adminFinalScore.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';

@Table({
  tableName: 'competencies',
})
export class Competencies extends Model<Competencies> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  competency: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @ForeignKey(() => NbolLeadLevels)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nbol_id: string;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  client_id?: string | null;

  @ForeignKey(() => Competencies)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ref_nbol_id?: string | null;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_copy: boolean | null;

  @BelongsTo(() => NbolLeadLevels)
  nbol_leadership_level: NbolLeadLevels;

  @HasMany(() => NbolClientCompetency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  nbol_client_competencies: NbolClientCompetency[];

  @HasMany(() => ExpectedBehaviours, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  expected_behaviours: ExpectedBehaviours[];

  @BelongsTo(() => Clients)
  client: Clients;

  @BelongsToMany(() => Assessments, () => ClassCompetencies)
  assessments: Assessments[];

  @HasMany(() => ClassCompetencies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class_competencies: ClassCompetencies[];
  // ----------------

  @HasMany(() => ParticipantScore)
  participant_score: ParticipantScore[];

  @HasMany(() => Questions)
  questions: Questions[];

  @HasMany(() => ParticipantAvgComp, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  par_avg_comp: ParticipantAvgComp[];

  @HasMany(() => CompetencyWeightage)
  comp_weight: CompetencyWeightage[];

  @HasMany(() => AdminScore)
  admin_score: AdminScore[];

  @HasMany(()=> QuessionnaireResponse)
  quess_resp: QuessionnaireResponse[]
}
