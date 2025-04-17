import { NotificationService } from '../notification/notification.service'
import { CronService } from './cron.service'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [CronService, NotificationService],
})
export class CronModule {}
