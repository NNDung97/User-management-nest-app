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

    @Post('forgot-password')
    @ApiBody({ schema: {
    type: 'object',
    properties: {
      email: { type: 'string' }
    }
  }})
    async forgotPassword(@Body() body: { email: string }) {
        const { email } = body;
        if (!email) {
            throw new Error('Email is required');
        }
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    @ApiBody({ schema: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      otp: { type: 'string' },
      newPassword: { type: 'string' }
    }
  }})
    async resetPassword(@Body() body: { email: string, otp: string, newPassword: string }) {
        const { email, otp, newPassword } = body;
        if (!email || !otp || !newPassword) {
            throw new Error('Email, OTP, and new password are required');
        }
        return this.authService.ResetPassword(email, otp, newPassword);
    }
}