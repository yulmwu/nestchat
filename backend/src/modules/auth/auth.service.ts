import { Injectable, UnauthorizedException } from '@nestjs/common'
import {
    JWT_EXPIRES_IN_SECONDS,
    REFRESH_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN_SECONDS,
} from 'src/common/constants'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/modules/users/users.service'
import { RedisService } from 'src/common/redis/redis.service'
import { User } from 'src/modules/users/users.entity'
import * as bcrypt from 'bcrypt'

import { LoginDto, RegisterDto } from './dto'
import { UserResponseDto } from '../users/dto'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private redisService: RedisService,
    ) {}

    async login(dto: LoginDto) {
        const user = await this.usersService.getPasswordByUsername(dto.username)
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload = { sub: user.id }
        const accessToken = this.jwtService.sign(payload, { expiresIn: JWT_EXPIRES_IN_SECONDS })
        const refreshToken = this.jwtService.sign(payload, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })

        await this.redisService.set(`user:${user.id}:refresh`, refreshToken, REFRESH_TOKEN_EXPIRES_IN_SECONDS)

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user_id: user.id,
            max_age: JWT_EXPIRES_IN_SECONDS,
        }
    }

    async register(dto: RegisterDto): Promise<User> {
        return this.usersService.create(dto)
    }

    async refresh(userId: number, refreshToken: string) {
        const stored = await this.redisService.get(`user:${userId}:refresh`)
        if (!stored || stored !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token')
        }

        const payload = { sub: userId }
        const accessToken = this.jwtService.sign(payload)

        return { accessToken: accessToken }
    }

    async logout(userId: number) {
        await this.redisService.del(`user:${userId}:refresh`)
    }

    async getMe(userId: number): Promise<UserResponseDto> {
        return this.usersService.findById(userId)
    }
}
