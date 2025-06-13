import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOneByUserName(username);
        if (!user || !user.userpassword || bcrypt.compareSync(password, user.userpassword) === false) {
            console.log('Password mismatch or user not found for email:', username);
            throw new UnauthorizedException('Invalid credentials');
        }
        const { userpassword, ...result } = user; // Exclude userpassword from the result
        return result; // Return user without password
    }

    async login(user: any): Promise<any> {
        const payload = { email: user.email, sub: user.id };

        const access_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m', // Set the expiration time for the access token
        });

        const refresh_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d', // Set the expiration time for the refresh token
        });

        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
        await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

        return {
            access_token,
            refresh_token,
        };
    }

    async Register(user: any): Promise<any> {
        const existingUser = await this.userService.findOneByEmail(user.email);
        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }
        const salt = await bcrypt.genSalt(10);
        user.userpassword = await bcrypt.hash(user.userpassword, salt);
        const newUser = await this.userService.create(user);
        return {
            message: 'User created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
            }
        };
    }

    async Logout(userId: number): Promise<any> {
        await this.userService.updateRefreshToken(userId, null);
        return {
            message: 'User logged out successfully',
        };
    }

    async refreshToken(userId: number, refreshToken: string): Promise<any> {
        const user = await this.userService.findById(userId);
        if (!user || !user.refresh_token) {
            throw new UnauthorizedException('User not found or no refresh token');
        }

        const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);
        if (!isMatch) {
            throw new UnauthorizedException('Refresh token mismatch');
        }

        const payload = { email: user.email, sub: user.id };
        const newAccessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
        });

        return {
            access_token: newAccessToken,
        };
    }

}