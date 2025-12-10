import {
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { createContactPerson } from 'src/Modules/client-contact-persons/dto/createContactPerson';

export class createClient {
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsBoolean()
  @IsOptional()
  is_360_client: boolean;

  @IsString()
  @IsOptional()
  nbol_client_name?: string;

  @IsString()
  @IsOptional()
  nbol_client_schema?: string;

  @IsString()
  @IsOptional()
  nbol_client_id?: string;
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createContactPerson)
  contact_persons: createContactPerson[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssociateComp)
  associate_comp: AssociateComp[];

  @IsBoolean()
  @IsOptional()
  is_grp_of_comp: boolean;
}
export class AssociateComp {
  @IsString()
  @IsOptional()
  assoc_comp: string;

  // @IsBoolean()
  // @IsOptional()
  // is_grp_comp?: boolean;
}
