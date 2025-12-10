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
import { Assessments } from './assessment.model';
import { Clients } from 'src/Modules/clients/model/clients.model';
import { ClientAssessments } from './client-assessments.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { IsNotEmpty, IsString } from 'class-validator';
import { Quessionnaires } from './quessionnaire.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { ParticipantScore } from 'src/Modules/class-configration/model/participantScore.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';

@Table({
  tableName: 'questions',
})
export class Questions extends Model<Questions> {
  @Index
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  question: string;

  @ForeignKey(() => Quessionnaires)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  quesionnaire_id: string;

  @ForeignKey(() => Competencies)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  competency_id: string;

  @BelongsTo(() => Quessionnaires)
  quessionnaire: Quessionnaires;

  @BelongsTo(() => Competencies)
  competencies: Competencies;

  @HasMany(()=> ParticipantScore,{
    onDelete: 'Cascade',
    onUpdate: 'Cascade'
  })
  part_score: ParticipantScore[]

  @HasMany(()=> QuessionnaireResponse,{
    onDelete: 'Cascade',
    onUpdate: 'Cascade'
  })
  quess_resp: QuessionnaireResponse[]
}
