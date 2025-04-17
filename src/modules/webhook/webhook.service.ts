import { LivekitService } from '../libs/livekit/livekit.service'
import { StripeService } from '../libs/stripe/stripe.service'
import { TelegramService } from '../libs/telegram/telegram.service'
import { NotificationService } from '../notification/notification.service'
import { TransactionStatus } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

@Injectable()
export class WebhookService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly livekitService: LivekitService,
		private readonly notificationService: NotificationService,
		private readonly telegramService: TelegramService,
		private readonly stripeService: StripeService
	) {}

	async receiveWebhookLivekit(body: string, authorization: string) {
		// true если будет ошибка с токеном
		const event = await this.livekitService.receiver.receive(body, authorization, true)

		if (event.event === 'ingress_started') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo.ingressId,
				},
				data: {
					isLive: true,
				},
				include: {
					user: true,
				},
			})

			const follows = await this.prismaService.follow.findMany({
				where: {
					followingId: stream.userId,
					follower: {
						isDeactivated: false,
					},
				},
				include: {
					follower: {
						include: {
							notificationSettings: true,
						},
					},
				},
			})

			for (const follow of follows) {
				const { follower } = follow

				if (follower.notificationSettings.siteNotifications) {
					await this.notificationService.createStreamStart(follower.id, stream.user)
				}

				if (follower.notificationSettings.telegramNotifications && follower.telegramId) {
					await this.telegramService.sendStreamStart(follower.telegramId, stream.user)
				}
			}
		}

		if (event.event === 'ingress_ended') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo.ingressId,
				},
				data: {
					isLive: false,
				},
			})

			await this.prismaService.chatMessage.deleteMany({
				where: {
					streamId: stream.id,
				},
			})
		}
	}

	async receiveWebhookStripe(event: Stripe.Event) {
		const session = event.data.object as Stripe.Checkout.Session
		const { planId, userId, channelId } = session.metadata

		if (event.type === 'checkout.session.completed') {
			const expiresAt = new Date()
			expiresAt.setMonth(expiresAt.getMonth() + 1)

			const sponsorshipSubscription = await this.prismaService.sponsorshipSubscription.create({
				data: {
					expiresAt,
					planId,
					userId,
					channelId,
				},
				include: {
					plan: true,
					user: true,
					channel: {
						include: {
							notificationSettings: true,
						},
					},
				},
			})

			await this.prismaService.transaction.update({
				where: {
					userId,
					stripeSubscriptionId: session.id,
					status: TransactionStatus.PENDING,
				},
				data: {
					status: TransactionStatus.SUCCES,
				},
			})

			if (sponsorshipSubscription.channel.notificationSettings.siteNotifications) {
				await this.notificationService.createNewSponsorship(
					channelId,
					sponsorshipSubscription.plan,
					sponsorshipSubscription.user
				)
			}

			if (
				sponsorshipSubscription.channel.notificationSettings.telegramNotifications &&
				sponsorshipSubscription.channel.telegramId
			) {
				await this.telegramService.sendNewSponsorship(
					sponsorshipSubscription.channel.telegramId,
					sponsorshipSubscription.plan,
					sponsorshipSubscription.user
				)
			}
		}

		if (event.type === 'checkout.session.expired') {
			await this.prismaService.transaction.update({
				where: {
					userId,
					stripeSubscriptionId: session.id,
				},
				data: {
					status: TransactionStatus.EXPIRED,
				},
			})
		}

		if (event.type === 'checkout.session.async_payment_failed') {
			await this.prismaService.transaction.update({
				where: {
					userId,
					stripeSubscriptionId: session.id,
				},
				data: {
					status: TransactionStatus.FAILED,
				},
			})
		}
	}

	async constructStripeEvent(payload: any, signature: any) {
		return this.stripeService.webhooks.constructEvent(
			payload,
			signature,
			this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET')
		)
	}
}
