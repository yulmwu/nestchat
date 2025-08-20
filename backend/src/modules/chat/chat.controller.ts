import { Controller, Get, Query, UseGuards, Req, Param } from '@nestjs/common'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { ChatService } from './chat.service'
import { MessagesResponseDto } from './dto'
import { ApiBadRequestResponse, ApiBearerAuth, ApiProperty, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AuthenticatedRequest } from 'src/common/types/express-request.interface'
import { CursorPaginationDto, IdDto, PaginationDto } from 'src/common/dto'

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('messages/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiProperty({
        description: 'Retrieve messages between users',
        type: MessagesResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid request parameters' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getPrivateMessages(
        @Param() { id: recipientId }: IdDto,
        @Query() pdto: CursorPaginationDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<MessagesResponseDto> {
        return this.chatService.getPrivateMessages(recipientId, req.user.userId, pdto)
    }
}
