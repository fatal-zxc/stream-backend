import { MailService } from '../../libs/mail/mail.service'
import { TelegramService } from '../../libs/telegram/telegram.service'
import { AuthModel } from '../session/models/auth.model'
import { DeactivateAccountInput } from './inputs/deactivate-account.input'
import { TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { destroySession } from '@/src/shared/utils/session.util'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request } from 'express'

@Injectable()
export class DeactivateService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly configService: ConfigService,
		private readonly telegramService: TelegramService
	) {}

	async validateDeactivateToken(req: Request, token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.DEACTIVATE_ACCOUNT,
			},
		})

		if (!existingToken) {
			throw new NotFoundException('Токен не найден')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Токен истек')
		}

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId,
			},
			data: {
				isDeactivated: true,
				deactivatedAt: new Date(),
			},
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.DEACTIVATE_ACCOUNT,
			},
		})

		return destroySession(req, this.configService)
	}

	async sendDeactivateToken(req: Request, user: User, userAgent: string) {
		const deactivateToken = await generateToken(this.prismaService, user, TokenType.DEACTIVATE_ACCOUNT, false)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.sendDeactivateToken(user.email, deactivateToken.token, metadata)

		if (deactivateToken.user.notificationSettings.telegramNotifications && user.telegramId) {
			await this.telegramService.sendDeactivateToken(user.telegramId, deactivateToken.token, metadata)
		}

		return true
	}

	async deactivate(req: Request, input: DeactivateAccountInput, user: User, userAgent: string): Promise<AuthModel> {
		const { email, password, pincode } = input

		if (user.email !== email) {
			throw new BadRequestException('Неверная почта')
		}

		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) {
			throw new BadRequestException('Неверный пароль')
		}

		if (!pincode) {
			await this.sendDeactivateToken(req, user, userAgent)

			return { user: null, message: 'Требуется код подтверждения, проверьте почту' }
		}

		await this.validateDeactivateToken(req, pincode)

		return { user, message: 'Успешно' }
	}
}
