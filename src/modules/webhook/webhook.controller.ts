import { WebhookService } from './webhook.service'
import {
	BadRequestException,
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	RawBody,
	UnauthorizedException,
} from '@nestjs/common'

@Controller('webhook')
export class WebhookController {
	constructor(private readonly webhookService: WebhookService) {}

	@Post('livekit')
	@HttpCode(HttpStatus.OK)
	async receiveWebhookLivekit(@Body() body: string, @Headers('Authorization') authorization: string) {
		if (!authorization) {
			throw new UnauthorizedException('Отсутствует заголовок авторизации')
		}

		return this.webhookService.receiveWebhookLivekit(body, authorization)
	}

	@Post('stripe')
	@HttpCode(HttpStatus.OK)
	async receiveWebhookStripe(@RawBody() rawBody: string, @Headers('stripe-signature') signature: string) {
		if (!signature) {
			throw new BadRequestException('Отсутствует подпись Stripe в заголовке')
		}

		const event = await this.webhookService.constructStripeEvent(rawBody, signature)
		await this.webhookService.receiveWebhookStripe(event)
	}
}
