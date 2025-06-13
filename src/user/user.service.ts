import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>;

    async findAll(): Promise<Partial<Users>[]> {
        const users = await this.userRepository.find();
        return users.map(({ userpassword, ...rest }) => rest);
    }

    async findById(id: number): Promise<Users | null> {
        return this.userRepository.findOneBy({ id });
    }

    async findOneByEmail(email: string): Promise<Users | null> {
        if (!email) {
            return null;
        }
        return this.userRepository.findOne({ where: { email } });
    }

    async findOneByUserName(username: string): Promise<Users | null> {
        if (!username) {
            return null;
        }
        return this.userRepository.findOne({ where: { username } });
    }

    async create(user: Users): Promise<Users> {
        if (!user.email || !user.userpassword) {
            throw new Error('Email and password are required');
        }
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        user.userpassword = await bcrypt.hash(user.userpassword, salt);
        return await this.userRepository.save(user);
    }

    async update(id: number, user: Partial<Users>): Promise<Users | null> {
        const existingUser = await this.findById(id);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        // If the password is being updated, hash it
        if (user.userpassword) {
            const salt = await bcrypt.genSalt(10);
            user.userpassword = await bcrypt.hash(user.userpassword, salt);
        }
        // Object.assign(existingUser, user);
        await this.userRepository.update(id, user);
        return existingUser;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }

    async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
        const user = await this.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.refresh_token = refreshToken === null ? undefined : refreshToken;
        await this.userRepository.save(user);
    }
}
