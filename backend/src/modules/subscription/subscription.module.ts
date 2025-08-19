import { Module } from '@nestjs/common'
import { Subscription } from './subscription.entity'
import { UsersModule } from '../users/users.module'
import { SubscriptionService } from './subscription.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubscriptionController } from './subscription.controller'

@Module({
    imports: [TypeOrmModule.forFeature([Subscription]), UsersModule],
    providers: [SubscriptionService],
    controllers: [SubscriptionController],
    exports: [SubscriptionService],
})
export class SubscriptionModule {}
