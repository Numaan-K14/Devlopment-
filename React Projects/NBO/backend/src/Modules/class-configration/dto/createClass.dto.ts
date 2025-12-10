import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Is } from 'sequelize-typescript';

export class ClassAssessorDto {
  @IsUUID()
  @IsNotEmpty()
  assessor_id: string;
}

export class CompetencyDto {
  @IsUUID()
  @IsNotEmpty()
  competency_id: string;
}

export class ParticipantAssessmentDto {
  @IsUUID()
  @IsNotEmpty()
  participant_id: string;

  // @IsEmail()
  // @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsOptional()
  // @IsNotEmpty()
  room_id: string;

  // @IsString()
  // @IsNotEmpty()
  // start_time: string;

  // @IsString()
  // @IsNotEmpty()
  // end_time: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  start_time: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  end_time: string;

  @IsOptional()
  @IsString()
  break: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassAssessorDto)
  class_assessors: ClassAssessorDto[];
}

export class ClassAssessmentDto {
  @IsUUID()
  @IsNotEmpty()
  assessment_id: string;

  @IsUUID()
  @IsOptional()
  scenerio_id: string;

  @IsUUID()
  @IsOptional()
  quessionnaire_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompetencyDto)
  class_competencies: CompetencyDto[];

  @IsOptional() // =--=-=-=-=-
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantAssessmentDto)
  participant_assessment: ParticipantAssessmentDto[];
  //======================================================================
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartGroupActivityRoomDto)
  part_gr_act_room: PartGroupActivityRoomDto[];
}

export class PartGroupActivityRoomDto {
  @IsUUID()
  @IsNotEmpty()
  room_id: string;

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  end_time: string;

  @IsUUID()
  @IsNotEmpty()
  assessor_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartGroupActDto)
  part_gr_act: PartGroupActDto[];

  //  @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ClassAssessorDto)
  // class_assessors: ClassAssessorDto[];
}
export class PartGroupActDto {
  @IsUUID()
  @IsNotEmpty()
  participant_id: string;

  // @IsString()
  // @IsNotEmpty()
  @IsOptional()
  email: string;
}
//==============================================================
export class CreateClass {
  @IsUUID()
  @IsNotEmpty()
  facility_id: string;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  end_date: Date;

  @IsArray()
  @IsOptional()
  quessionnaire_id: string[];

  @IsString()
  @IsOptional()
  project_id: string;

  @IsNumber()
  @IsOptional()
  normal_assess_duration: number;

  @IsNumber()
  @IsOptional()
  grp_act_assess_duration: number;

  @IsNumber()
  @IsOptional()
  cbi_assess_duration: number;

  @IsNumber()
  @IsOptional()
  welcome_sess_duration: number;

  @IsString()
  @IsOptional()
  cbi_assessment_id: string;

  @IsString()
  @IsOptional()
  cbi_quessionnaire_id: string;

 
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassAssessmentDto)
  class_assessments: ClassAssessmentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassBreaksDto)
  class_breaks: ClassBreaksDto[];
}
export class ClassBreaksDto {
  @IsString()
  @IsNotEmpty()
  first_br_st: string;

  @IsString()
  @IsNotEmpty()
  first_br_en: string;

  @IsString()
  @IsNotEmpty()
  second_br_st: string;

  @IsString()
  @IsNotEmpty()
  second_br_en: string;

  @IsString()
  @IsNotEmpty()
  lunch_br_st: string;

  @IsString()
  @IsNotEmpty()
  lunch_br_en: string;

  @IsString()
  @IsNotEmpty()
  class_date: string;

   @IsString()
  @IsNotEmpty()
  wlc_sess_st: string;

  @IsString()
  @IsNotEmpty()
  wlc_sess_en: string;

  @IsString()
  @IsNotEmpty()
  ending_sess_st: string;

  @IsString()
  @IsNotEmpty()
  ending_sess_en: string;

}

