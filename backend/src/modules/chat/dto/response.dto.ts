import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { CreatedAtDto, IdDto, PaginationResponseDto } from 'src/common/dto'

export class MessageResponseDto extends IntersectionType(CreatedAtDto) {
    @ApiProperty({
        description: 'Id of the sender',
        example: 1,
    })
    sender: IdDto

    @ApiProperty({
        description: 'Id of the recipient',
        example: 2,
    })
    recipient: IdDto

    @ApiProperty({
        description: 'Content of the message',
        example: 'Hello, how are you?',
    })
    content: string
}

export class MessagesResponseDto extends PaginationResponseDto {
    @ApiProperty({
        description: 'List of messages',
        type: [MessageResponseDto],
    })
    items: MessageResponseDto[]
}
