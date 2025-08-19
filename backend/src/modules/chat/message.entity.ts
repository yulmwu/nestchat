import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../users/users.entity'

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    sender: User

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    recipient: User

    @Column({ type: 'text' })
    content: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @Column({ type: 'timestamp', nullable: true })
    readAt?: Date | null
}
