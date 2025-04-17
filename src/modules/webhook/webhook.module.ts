import { NotificationService } from '../notification/notification.service'
import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'
import { RawBodyMiddleware } from '@/src/shared/middlewares/raw-body.middleware'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'

@Module({
	controllers: [WebhookController],
	providers: [WebhookService, NotificationService],
})
export class WebhookModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RawBodyMiddleware).forRoutes({ path: 'webhook/livekit', method: RequestMethod.POST })
	}
}
