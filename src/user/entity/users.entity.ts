import { Entity,Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class Users {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 225 })
    username: string;
    
    @Column({ type: 'varchar', length: 225, unique: true })
    email: string;
    
    @Column({ type: 'varchar', length: 225 })
    userpassword: string;
    
    @Column({ type: 'varchar', length: 225, default: 'user' })
    role: string;

    @Column({ type: 'varchar', length: 225, nullable: true })
    profile_picture?: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'bit', default: true })
    is_active?: boolean;

    @Column({ nullable: true })
    refresh_token?: string;
    }