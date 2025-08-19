import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { PaginationResponseDto } from 'src/common/dto'
import { UserBriefResponseDto } from 'src/modules/users/dto'

export class SubscriptionResponseDto extends IntersectionType(PaginationResponseDto) {
    @ApiProperty({
        description: 'User who is following the specified user.',
        type: UserBriefResponseDto,
    })
    follower: UserBriefResponseDto

    @ApiProperty({
        description: 'User who is being followed.',
        type: UserBriefResponseDto,
    })
    following: UserBriefResponseDto
}

export class FollowerResponseDto extends PickType(SubscriptionResponseDto, ['follower']) {}

export class FollowerListResponseDto extends IntersectionType(PaginationResponseDto) {
    @ApiProperty({
        description: 'List of users who are following the specified user.',
        type: [FollowerResponseDto],
    })
    followers: FollowerResponseDto[]
}

export class FollowingResponseDto extends PickType(SubscriptionResponseDto, ['following']) {}

export class FollowingListResponseDto extends IntersectionType(PaginationResponseDto) {
    @ApiProperty({
        description: 'List of users that the specified user is following.',
        type: [FollowingResponseDto],
    })
    following: FollowingResponseDto[]
}
