import { Controller, Get, Post, Put, Param, Body, ParseIntPipe, NotFoundException, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entity/users.entity';
import { UserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UploadService } from 'src/upload/upload.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { avatarStorage } from 'src/upload/upload.config';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly uploadService: UploadService
    ) {}

    // Define your endpoints here
    @Post('create')
    @ApiBody({type: UserDto})
    async createUser(@Body() userDto: UserDto): Promise<Users> {
        const user = new Users();
        user.username = userDto.name;
        user.email = userDto.email;
        user.userpassword = userDto.password;
        return this.userService.create(user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('all')
    @Roles('admin')
    async getAllUsers(): Promise<Partial<Users>[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<Users | null> {
        return this.userService.findById(id);
    }

    @Post(':id/update')
    @ApiBody({type: UserDto})
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto): Promise<Users | null> {
        const user = new Users();
        user.username = userDto.name;
        user.email = userDto.email;
        user.userpassword = userDto.password;
        return this.userService.update(id, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':id/delete')
    @ApiBody({ schema: {
        type: 'object',
        properties: {
        userId: { type: 'number' }
        }
    }})
    async deleteUser(id: number): Promise<boolean> {
        return this.userService.delete(id);
    }

    @Post(':id/upload')
    @UseInterceptors(FileInterceptor('file',{storage: avatarStorage}))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: {
        type: 'object',
        properties: {
            file: { type: 'string', format: 'binary' }
        }
    }})
    async uploadAvatar(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        console.log(`Uploading avatar for user ID: ${id}`);
        console.log(file);
        const filepath = this.uploadService.getFilePath('avatars', file.filename);
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Nếu có ảnh cũ thì xóa
        console.log('Checking for old profile picture...', user.profile_picture);
        if (user.profile_picture) {
            const oldPath = join(process.cwd(), user.profile_picture);
            if (existsSync(oldPath)) {
            unlinkSync(oldPath); // Xóa ảnh cũ
            console.log('Đã xóa ảnh cũ:', oldPath);
            }
        }
        user.profile_picture = filepath;
        await this.userService.update(id, { profile_picture: filepath });
        return { message: 'Avatar uploaded successfully', path: filepath, filename: file.filename };
    }
}

