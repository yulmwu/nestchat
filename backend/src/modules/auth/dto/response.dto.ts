import { ApiProperty, IntersectionType } from '@nestjs/swagger'

import { IdDto } from 'src/common/dto'
import { UserResponseDto } from 'src/modules/users/dto'
import { AccessTokenDto } from '.'

export class LoginResponseDto extends IntersectionType(IdDto, AccessTokenDto) {
    @ApiProperty({
        description: 'The expiration time of the access token in seconds',
        example: 3600,
    })
    maxAgeSeconds: number
}
export class RegisterResponseDto extends IntersectionType(UserResponseDto) {}
