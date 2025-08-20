import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Subscription } from '../subscription/subscription.entity'

export enum UserRole {
    ADMIN = 0,
    USER = 1,
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 32, unique: true })
    username: string

    @Column({ type: 'varchar', length: 32, nullable: true })
    nickname: string

    @Exclude()
    @Column({ type: 'varchar', length: 255, select: false })
    password: string

    @Column({ type: 'varchar', length: 320, unique: true })
    email: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    profileImage?: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @Column({ type: 'int', default: 0 })
    points: number

    @Column({ type: 'int', default: 0 })
    followersCount: number

    @Column({ type: 'int', default: 0 })
    followingCount: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @OneToMany(() => Subscription, (subscription) => subscription.follower)
    followers: Subscription[]

    @OneToMany(() => Subscription, (subscription) => subscription.following)
    following: Subscription[]
}
