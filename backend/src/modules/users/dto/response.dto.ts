import { IntersectionType } from '@nestjs/swagger'
import { CreatedAtDto, IdDto, PaginationResponseDto } from 'src/common/dto'
import {
    EmailDto,
    NicknameDto,
    UsernameDto,
    RoleDto,
    PointsDto,
    UserDescriptionDto,
    ProfileImageDto,
    FollowCountDto,
    IsFollowResponseOnlyDto,
} from '.'

export class UserResponseDto extends IntersectionType(
    IdDto,
    UsernameDto,
    NicknameDto,
    EmailDto,
    UserDescriptionDto,
    ProfileImageDto,
    CreatedAtDto,
    RoleDto,
    PointsDto,
    FollowCountDto,
    IsFollowResponseOnlyDto,
) {}

export class UserBriefResponseDto extends IntersectionType(
    IdDto,
    UsernameDto,
    NicknameDto,
    UserDescriptionDto,
    ProfileImageDto,
    RoleDto,
    PointsDto,
    FollowCountDto,
) {}

export class UserListResponseDto extends IntersectionType(PaginationResponseDto) {
    users: UserResponseDto[]
}
