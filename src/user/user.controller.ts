import { Controller, Get, Post, Put, Param, Body, ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entity/users.entity';
import { UserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Define your endpoints here
    @UseGuards(JwtAuthGuard)
    @Post('create')
    @ApiBody({type: UserDto})
    async createUser(@Body() userDto: UserDto): Promise<Users> {
        const user = new Users();
        user.username = userDto.name;
        user.email = userDto.email;
        user.userpassword = userDto.password;
        return this.userService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('all')
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

    @Post(':id/delete')
    async deleteUser(id: number): Promise<boolean> {
        return this.userService.delete(id);
    }
}
