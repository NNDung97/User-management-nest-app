import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}
    
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.username, loginDto.userpassword);
        console.log('User authenticated:', user);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const user = {
            username: registerDto.username,
            email: registerDto.email,
            userpassword: registerDto.userpassword
        };
        return this.authService.Register(user);
    }

    @Post('refresh-token')
    @ApiBody({ schema: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      refreshToken: { type: 'string' }
    }
  }})
    async refreshToken(@Body() body: { userId: number, refreshToken: string }) {
        const { userId, refreshToken } = body;
        if (!userId || !refreshToken) {
            throw new Error('User ID and refresh token are required');
        }
        return this.authService.refreshToken(userId, refreshToken);
    }

    @Post('logout')
     @ApiBody({ schema: {
    type: 'object',
    properties: {
      userId: { type: 'number' }
    }
  }})
    async logout(@Body() body: { userId: number }) {
        const { userId } = body;
        if (!userId) {
            throw new Error('User ID is required');
        }
        return this.authService.Logout(userId);
    }
}
