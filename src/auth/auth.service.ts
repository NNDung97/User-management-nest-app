import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        console.log('Validating user with email:', email);
        const user = await this.userService.findOneByEmail(email);
        console.log('User found:', user);
        //chưa mã hoá hash khi lưu vào database
        if (!user || !user.userpassword || bcrypt.compareSync(password, user.userpassword) === false) {
            console.log('Password mismatch or user not found for email:', email);
            throw new UnauthorizedException('Invalid credentials');
        }
        console.log('Password match for user:', user.email);
        const { userpassword, ...result } = user; // Exclude userpassword from the result
        return result; // Return user without password
    }

    async login(user: any): Promise<any> {
        console.log('Login payload:', user);
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}