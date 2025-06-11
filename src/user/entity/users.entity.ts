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
    
    // @Column({ type: 'varchar', length: 15, nullable: true })
    // phone?: string;
    
    // @Column({ type: 'boolean', default: true })
    // isActive?: boolean;
    }