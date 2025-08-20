import { Body, Controller, Get, Param, Put, Query, Request, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiNotFoundResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

import { UserListResponseDto, UsernameDto, UserResponseDto } from './dto'
import { UserUpdateRequestDto } from './dto/request.dto'
import { AuthenticatedRequest, MaybeAuthenticatedRequest } from 'src/common/types/express-request.interface'
import { JwtOptionalAuthGuard } from 'src/common/guards/jwt-optional-auth.guard'
import { CursorPaginationDto, PaginationDto } from 'src/common/dto'

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(JwtOptionalAuthGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.', type: UserListResponseDto })
    findAll(@Query() pdto: PaginationDto, @Request() req: MaybeAuthenticatedRequest): Promise<UserListResponseDto> {
        return this.usersService.findAll(pdto, req.user?.userId)
    }

    @UseGuards(JwtOptionalAuthGuard)
    @ApiBearerAuth()
    @Get(':username')
    @ApiOperation({ summary: 'Get a user by username' })
    @ApiResponse({ status: 200, description: 'Return a user by username.', type: UserResponseDto })
    @ApiNotFoundResponse({ description: 'User not found.' })
    findByUsername(
        @Param() { username }: UsernameDto,
        @Request() req: MaybeAuthenticatedRequest,
    ): Promise<UserResponseDto> {
        return this.usersService.findByUsername(username, req.user?.userId)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':username')
    @ApiOperation({ summary: 'Update a user by username' })
    @ApiResponse({ status: 200, description: 'Return the updated user.', type: UserResponseDto })
    @ApiNotFoundResponse({ description: 'User not found.' })
    @ApiForbiddenResponse({ description: 'You are not allowed to update this user.' })
    update(
        @Param() { username }: UsernameDto,
        @Body() updateUserDto: UserUpdateRequestDto,
        @Request() req: AuthenticatedRequest,
    ): Promise<UserResponseDto> {
        return this.usersService.update(username, updateUserDto, req.user.userId)
    }
}
