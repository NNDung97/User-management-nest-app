import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDto {
    @ApiProperty({example: 'user'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: 'user@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example: 'password123'})
    @IsString()
    @IsNotEmpty()
    password: string;

    // @ApiProperty({ required: false })
    // phone?: string;

    // @ApiProperty({ default: true })
    // isActive?: boolean;
}
