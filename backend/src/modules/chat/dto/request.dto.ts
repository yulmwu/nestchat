import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, Min } from 'class-validator'
import { IdDto } from 'src/common/dto'

export class SendMessageDto extends IntersectionType(IdDto) {
    @ApiProperty({ example: 'Hello!', description: 'Message content' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    content: string
}
