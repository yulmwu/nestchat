import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from './message.entity'
import { UsersService } from '../users/users.service'
import { MessageResponseDto, MessagesResponseDto } from './dto'
import { CursorPaginationDto } from 'src/common/dto'
import { selectUserBriefColumns } from 'src/common/utils'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        private readonly usersService: UsersService,
    ) {}

    async createMessage(senderId: number, recipientId: number, content: string): Promise<MessageResponseDto> {
        const trimmed = (content ?? '').trim()
        if (!trimmed) throw new BadRequestException('Message content is required')

        const recipient = await this.usersService.findById(recipientId)

        const message = this.messageRepo.create({
            sender: { id: senderId },
            recipient: { id: recipient.id },
            content: trimmed,
        })

        return this.messageRepo.save(message)
    }

    async getPrivateMessages(
        recipientId: number,
        userId: number,
        pdto: CursorPaginationDto,
    ): Promise<MessagesResponseDto> {
        const query = this.messageRepo
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.recipient', 'recipient')
            .where(
                '(sender.id = :senderId AND recipient.id = :recipientId) OR (sender.id = :recipientId AND recipient.id = :senderId)',
                {
                    senderId: userId,
                    recipientId,
                },
            )
            .select(['message', ...selectUserBriefColumns('sender'), ...selectUserBriefColumns('recipient')])
            .orderBy('message.createdAt', 'DESC')
            .take(pdto.limit!)

        if (pdto.cursor) {
            query.andWhere('message.id < :cursor', { cursor: pdto.cursor })
        }

        const messages = await query.getMany()
        const nextCursor = messages.length < pdto.limit! ? null : messages[messages.length - 1].id

        return {
            items: messages,
            nextCursor,
        }
    }
}
