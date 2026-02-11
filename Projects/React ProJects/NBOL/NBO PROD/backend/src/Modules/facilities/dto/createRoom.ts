import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class createRoom{
    @IsString()
    @IsOptional()
    room_id: string

    @IsString()
    @IsNotEmpty()
    room: string
}