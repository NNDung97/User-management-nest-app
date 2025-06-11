import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({example: 'user1@gmail.com'})
    @IsString()
    email: string;

    @ApiProperty({example: 'password123'})
    @IsString()
    userpassword: string;
}