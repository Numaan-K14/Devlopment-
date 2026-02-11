import { IsNotEmpty, IsString } from "class-validator";

export class createExpectedBehaviour{
    @IsString()
    @IsNotEmpty({ message: 'Expected Behaviour cannot be empty' })
    expected_behaviour: string
}