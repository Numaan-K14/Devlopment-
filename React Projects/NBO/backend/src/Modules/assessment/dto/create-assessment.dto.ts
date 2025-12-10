import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class createAssessment{
    @IsString()
    @IsNotEmpty()
    assessment_name: string

    // @IsBoolean()
    // status: boolean
}