import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './users.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { isFollowingSelect } from 'src/common/utils'

import { RegisterDto } from 'src/modules/auth/dto'
import { UserListResponseDto, UserResponseDto, UserUpdateRequestDto } from './dto'
import { PaginationDto } from 'src/common/dto'

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    async create(createUserDto: RegisterDto) {
        const hashed = await bcrypt.hash(createUserDto.password, 10)
        const user = this.userRepo.create({ ...createUserDto, password: hashed })
        return await this.userRepo.save(user)
    }

    async findAll(pdto: PaginationDto, meId?: number): Promise<UserListResponseDto> {
        const query = this.userRepo
            .createQueryBuilder('user')
            .orderBy('user.id', 'DESC')
            .skip((pdto.page! - 1) * pdto.limit!)
            .take(pdto.limit!)

        const [users, total] = await query.getManyAndCount()

        return {
            users,
            total,
            page: pdto.page!,
            limit: pdto.limit!,
        }
    }

    async findByUsername(username: string, meId?: number): Promise<UserResponseDto> {
        const query = this.userRepo.createQueryBuilder('user').where('user.username = :username', { username })
        isFollowingSelect(query, meId)

        const rows = await query.getRawAndEntities()
        if (!rows || rows.raw.length === 0) {
            throw new NotFoundException('User not found')
        }

        return {
            ...rows.entities[0],
            isFollowing: rows.raw[0].isFollowing,
            isFollowsMe: rows.raw[0].isFollowsMe,
        }
    }

    async findById(id: number) {
        const user = await this.userRepo.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async getPasswordByUsername(username: string) {
        const user = await this.userRepo
            .createQueryBuilder('user')
            .where('user.username = :username', { username })
            .select(['user', 'user.password'])
            .getOne()
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async update(username: string, updateUserDto: UserUpdateRequestDto, userId: number) {
        const user = await this.findByUsername(username)
        if (user.id !== userId) {
            throw new ForbiddenException('You are not allowed to update this user')
        }

        const trimmedNickname = updateUserDto.nickname?.trim()
        const trimmedDescription = updateUserDto.description?.trim()

        Object.assign(user, {
            nickname: trimmedNickname === '' ? null : trimmedNickname,
            description: trimmedDescription === '' ? null : trimmedDescription,
        })

        return await this.userRepo.save(user)
    }

    async increment(userId: number, field: keyof User, value: number) {
        await this.userRepo.increment({ id: userId }, field, value)
    }

    async decrement(userId: number, field: keyof User, value: number) {
        await this.userRepo.decrement({ id: userId }, field, value)
    }
}
