import { NotificationResolver } from './notification.resolver'
import { NotificationService } from './notification.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [NotificationResolver, NotificationService],
})
export class NotificationModule {}
