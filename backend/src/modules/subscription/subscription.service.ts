import { Injectable, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Subscription } from './subscription.entity'
import { UsersService } from '../users/users.service'
import { PaginationDto } from 'src/common/dto'
import { selectUserBriefColumns } from 'src/common/utils'
import { FollowerListResponseDto, FollowingListResponseDto } from './dto'

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription) private readonly subscriptionRepo: Repository<Subscription>,
        private readonly usersService: UsersService,
    ) {}

    async follow(followerId: number, followingName: string) {
        const following = await this.usersService.findByUsername(followingName)
        if (following.id === followerId) {
            throw new ConflictException('Cannot follow yourself.')
        }

        const follower = await this.usersService.findById(followerId)

        const subscription = this.subscriptionRepo.create({ follower, following })
        await this.subscriptionRepo.save(subscription)

        await this.usersService.increment(followerId, 'followingCount', 1)
        await this.usersService.increment(following.id, 'followersCount', 1)
    }

    async unfollow(followerId: number, followingName: string) {
        const following = await this.usersService.findByUsername(followingName)

        const query = this.subscriptionRepo
            .createQueryBuilder('subscriptions')
            .where('subscriptions."followerId" = :followerId', { followerId })
            .andWhere('subscriptions."followingId" = :followingId', { followingId: following.id })

        await query.delete().execute()

        await this.usersService.decrement(followerId, 'followingCount', 1)
        await this.usersService.decrement(following.id, 'followersCount', 1)
    }

    async getFollowers(username: string, pdto: PaginationDto): Promise<FollowerListResponseDto> {
        const query = this.subscriptionRepo
            .createQueryBuilder('subscription')
            .leftJoinAndSelect('subscription.follower', 'follower')
            .leftJoinAndSelect('subscription.following', 'following')
            .select(['subscription', ...selectUserBriefColumns('follower')])
            .where('following.username = :username', { username })
            .orderBy('subscription.id', 'DESC')
            .skip((pdto.page! - 1) * pdto.limit!)
            .take(pdto.limit!)

        const [followers, total] = await query.getManyAndCount()

        return {
            followers,
            total,
            page: pdto.page!,
            limit: pdto.limit!,
        }
    }

    async getFollowing(username: string, pdto: PaginationDto): Promise<FollowingListResponseDto> {
        const query = this.subscriptionRepo
            .createQueryBuilder('subscription')
            .leftJoinAndSelect('subscription.follower', 'follower')
            .leftJoinAndSelect('subscription.following', 'following')
            .select(['subscription', ...selectUserBriefColumns('following')])
            .where('follower.username = :username', { username })
            .orderBy('subscription.id', 'DESC')
            .skip((pdto.page! - 1) * pdto.limit!)
            .take(pdto.limit!)

        const [following, total] = await query.getManyAndCount()

        return {
            following,
            total,
            page: pdto.page!,
            limit: pdto.limit!,
        }
    }
}
