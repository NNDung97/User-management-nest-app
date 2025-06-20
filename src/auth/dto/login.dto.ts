import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({example: 'user'})
    @IsString()
    username: string;

    @ApiProperty({example: 'password'})
    @IsString()
    userpassword: string;
}