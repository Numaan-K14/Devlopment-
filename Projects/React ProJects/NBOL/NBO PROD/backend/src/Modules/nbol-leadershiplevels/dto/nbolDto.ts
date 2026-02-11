import { IsNotEmpty, IsString } from 'class-validator';

export class createNbolLevels {
  @IsString()
  @IsNotEmpty()
  leadership_level: string;
  
  // @IsString()
  // nbol_level_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
