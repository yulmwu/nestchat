import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from './message.entity'
import { UsersService } from '../users/users.service'
import { MessageResponseDto, MessagesResponseDto } from './dto'
import { IdDto, PaginationDto } from 'src/common/dto'
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

    async getPrivateMessages(recipientId: number, userId: number, pdto: PaginationDto): Promise<MessagesResponseDto> {
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
            .skip((pdto.page! - 1) * pdto.limit!)
            .take(pdto.limit!)

        const [items, total] = await query.getManyAndCount()
        return {
            items,
            total,
            page: pdto.page!,
            limit: pdto.limit!,
        }
    }

    async getRecentConversation(userId: number, peerId: number, take = 50) {
        return this.messageRepo.find({
            where: [
                { sender: { id: userId }, recipient: { id: peerId } },
                { sender: { id: peerId }, recipient: { id: userId } },
            ],
            order: { createdAt: 'DESC' },
            take,
        })
    }
}
