import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RegisterDto {

    @ApiProperty({example: 'user'})
    @IsString()
    username: string;

    @ApiProperty({example: 'user@gmail.com'})
    @IsString()
    email: string;

    @ApiProperty({example: 'password'})
    @IsString()
    userpassword: string;
}