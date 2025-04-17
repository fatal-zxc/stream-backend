import { SubscriptionResolver } from './subscription.resolver'
import { SubscriptionService } from './subscription.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [SubscriptionResolver, SubscriptionService],
})
export class SubscriptionModule {}
