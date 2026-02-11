import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, IsOptional } from 'class-validator';
export class createContactPerson{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsEmail()
    email: string;

    // @IsPhoneNumber()
    @IsOptional()
    mobile: string;

    @IsString()
    @IsOptional()  
    department: string;
} 