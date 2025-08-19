import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, Column, Index } from 'typeorm'
import { User } from 'src/modules/users/users.entity'

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.followers, { eager: true, onDelete: 'CASCADE' })
    follower: User

    @ManyToOne(() => User, (user) => user.following, { eager: true, onDelete: 'CASCADE' })
    following: User
}
