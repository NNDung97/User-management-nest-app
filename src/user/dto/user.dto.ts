import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDto {
    @ApiProperty({example: 'user'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: 'user@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example: 'password'})
    @IsString()
    @IsNotEmpty()
    password: string;
}
