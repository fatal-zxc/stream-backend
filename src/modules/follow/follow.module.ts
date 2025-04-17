import { NotificationService } from '../notification/notification.service'
import { FollowResolver } from './follow.resolver'
import { FollowService } from './follow.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [FollowResolver, FollowService, NotificationService],
})
export class FollowModule {}
