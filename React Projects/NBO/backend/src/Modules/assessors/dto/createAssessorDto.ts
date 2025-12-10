import {
  IS_EMAIL,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class createAssessors {
  @IsString()
  @IsNotEmpty()
  assessor_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  credential: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
