import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsMobilePhone,
  isMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../model/user.model';

export class createUser {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsNotEmpty()
  @IsOptional()
  role: UserRole;

  @IsString()
  @IsOptional()
  client_id: string;

  @IsBoolean()
  @IsNotEmpty()
  is_assessor: boolean;
}
