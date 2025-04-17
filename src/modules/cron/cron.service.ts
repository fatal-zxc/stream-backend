import { MailService } from '../libs/mail/mail.service'
import { StorageService } from '../libs/storage/storage.service'
import { TelegramService } from '../libs/telegram/telegram.service'
import { NotificationService } from '../notification/notification.service'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class CronService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly notificationService: NotificationService,
		private readonly storageService: StorageService,
		private readonly telegramService: TelegramService
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		const deactivatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo,
				},
			},
			include: {
				notificationSettings: true,
				stream: true,
			},
		})

		for (const user of deactivatedAccounts) {
			await this.mailService.sendAccountDeletion(user.email)

			if (user.notificationSettings.telegramNotifications && user.telegramId) {
				await this.telegramService.sendAccountDeletion(user.telegramId)
			}

			if (user.avatar) {
				this.storageService.remove(user.avatar)
			}

			if (user.stream.thumbnailUrl) {
				this.storageService.remove(user.stream.thumbnailUrl)
			}
		}

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo,
				},
			},
		})
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async verifyChannels() {
		const users = await this.prismaService.user.findMany({
			include: {
				notificationSettings: true,
			},
		})

		for (const user of users) {
			const followersCount = await this.prismaService.follow.count({
				where: {
					followingId: user.id,
				},
			})

			if (followersCount > 10 && !user.isVerified) {
				await this.prismaService.user.update({
					where: {
						id: user.id,
					},
					data: {
						isVerified: true,
					},
				})

				await this.mailService.sendVerifyAccount(user.email)

				if (user.notificationSettings.siteNotifications) {
					await this.notificationService.createVerifyChannel(user.id)
				}

				if (user.notificationSettings.telegramNotifications && user.telegramId) {
					await this.telegramService.sendVerify(user.telegramId)
				}
			}
		}
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteOldNotifications() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		await this.prismaService.notification.deleteMany({
			where: {
				createdAt: {
					lte: sevenDaysAgo,
				},
			},
		})
	}
}
