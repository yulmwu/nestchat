import { User } from 'src/modules/users/users.entity'
import { SelectQueryBuilder } from 'typeorm'

export const isFollowingSelect = (qb: SelectQueryBuilder<User>, userId?: number | null) => {
    if (userId) {
        qb.addSelect(
            'EXISTS (SELECT 1 FROM subscriptions WHERE "followerId" = :userId AND "followingId" = user.id)',
            'isFollowing',
        )
            .addSelect(
                'EXISTS (SELECT 1 FROM subscriptions WHERE "followingId" = :userId AND "followerId" = user.id)',
                'isFollowsMe',
            )
            .setParameter('userId', userId)
    }
}
