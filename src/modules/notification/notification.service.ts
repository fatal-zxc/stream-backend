import { ChangeNotificationsSettingsInput } from './inputs/change-notifications-settings.input'
import { NotificationType, SponsorshipPlan, TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationService {
	constructor(private readonly prismaService: PrismaService) {}

	async findUnreadCount(user: User) {
		const count = await this.prismaService.notification.count({
			where: {
				userId: user.id,
				isRead: false,
			},
		})

		return count
	}

	async findByUser(user: User) {
		await this.prismaService.notification.updateMany({
			where: {
				isRead: false,
				userId: user.id,
			},
			data: {
				isRead: true,
			},
		})

		const notifications = await this.prismaService.notification.findMany({
			where: {
				userId: user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return notifications
	}

	async createStreamStart(userId: string, channel: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b classname='font-medium'>Не пропустите!</b><p>Присойденяйтесь к прямой трансляции на канале <a href='/${channel.username}' classname='font-semibold'>${channel.username}</a></p>`,
				type: NotificationType.STREAM_START,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})

		return notification
	}

	async createNewFollower(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b classname='font-medium'>У вас новый подписчик!</b><p>Это пользователь <a href='/${follower.username}' classname='font-semibold'>${follower.username}</a></p>`,
				type: NotificationType.NEW_FOLLOWER,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})

		return notification
	}

	async createNewSponsorship(userId: string, plan: SponsorshipPlan, sponsor: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b classname='font-medium'>У вас новый спонсор!</b><p>Пользователь <a href='/${sponsor.username}' classname='font-semibold'>${sponsor.username}</a> стал вашим спонсором выбрав план <strong>${plan.title}</strong></p>`,
				type: NotificationType.NEW_SPONSORSHIP,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})

		return notification
	}

	async createVerifyChannel(userId: string) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `<b classname='font-medium'>Поздравляем!</b><p>Ваш канал верифицирован, и теперь рядом с вашим каналом будет галочка.</p>`,
				type: NotificationType.VERIFIED_CHANNEL,
				userId,
			},
		})

		return notification
	}

	async changeSettings(user: User, input: ChangeNotificationsSettingsInput) {
		const { siteNotifications, telegramNotifications } = input

		const notificationSettings = await this.prismaService.notificationSettings.update({
			where: {
				userId: user.id,
			},
			data: {
				siteNotifications,
				telegramNotifications,
			},
			include: {
				user: true,
			},
		})

		if (notificationSettings.telegramNotifications && !user.telegramId) {
			const telegramAuthToken = await generateToken(this.prismaService, user, TokenType.TELEGRAM_AUTH)

			return { notificationSettings, telegramAuthToken: telegramAuthToken.token }
		}

		if (!notificationSettings.telegramNotifications && user.telegramId) {
			await this.prismaService.user.update({
				where: {
					id: user.id,
				},
				data: {
					telegramId: null,
				},
			})

			return { notificationSettings }
		}

		return { notificationSettings }
	}
}
