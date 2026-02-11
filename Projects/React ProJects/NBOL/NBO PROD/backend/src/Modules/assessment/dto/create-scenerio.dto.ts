import { IsNotEmpty, IsString } from 'class-validator';

export class createScenerio {
  @IsString()
  @IsNotEmpty()
  scenerio_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
