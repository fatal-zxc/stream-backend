import { BUTTONS } from './telegram.buttons'
import { MESSAGES } from './telegram.messages'
import { SponsorshipPlan, TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Action, Command, Ctx, Start, Update } from 'nestjs-telegraf'
import { Context, Telegraf } from 'telegraf'

@Update()
@Injectable()
export class TelegramService extends Telegraf {
	private readonly _token: string

	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService
	) {
		super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'))
		this._token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
	}

	@Start()
	async onStart(@Ctx() ctx: any) {
		const chatId = ctx.chat.id.toString()
		const token = ctx.message.text.split(' ')[1]

		if (token) {
			const authToken = await this.prismaService.token.findUnique({
				where: {
					token,
					type: TokenType.TELEGRAM_AUTH,
				},
			})

			if (!authToken) {
				ctx.reply(MESSAGES.invalidToken)
				return
			}

			const hasExpired = new Date(authToken.expiresIn) < new Date()

			if (hasExpired) {
				ctx.reply(MESSAGES.invalidToken)
				return
			}

			await this.connectTelegram(authToken.userId, chatId)

			await this.prismaService.token.delete({
				where: {
					id: authToken.id,
				},
			})

			await ctx.replyWithHTML(MESSAGES.authSucces, BUTTONS.authSuccess)
			return
		}

		const user = await this.findUserByChatId(chatId)

		if (user) {
			await this.onMe(ctx)
			return
		}

		await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile)
	}

	@Command('me')
	@Action('me')
	async onMe(@Ctx() ctx: Context) {
		const chatId = ctx.chat.id.toString()

		const user = await this.findUserByChatId(chatId)
		const followersCount = await this.prismaService.follow.count({
			where: {
				followerId: user.id,
			},
		})

		if (!user) {
			await ctx.reply(MESSAGES.welcome)
		}

		await ctx.replyWithHTML(MESSAGES.profile(user, followersCount), BUTTONS.profile)
	}

	@Command('follows')
	@Action('follows')
	async onFollows(@Ctx() ctx: Context) {
		const chatId = ctx.chat.id.toString()

		const user = await this.findUserByChatId(chatId)

		if (!user) {
			await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile)
			return
		}

		const follows = await this.prismaService.follow.findMany({
			where: {
				followerId: user.id,
			},
			include: {
				following: true,
			},
		})

		if (!follows.length) {
			await ctx.replyWithHTML(MESSAGES.noFollows)
			return
		}

		const followsList = follows.map(follow => MESSAGES.follows(follow.following)).join('\n')

		await ctx.replyWithHTML(`${MESSAGES.followsHeader}${followsList}`)
	}

	async sendPasswordResetToken(chatId: string, token: string, metadata: SessionMetadata) {
		await this.telegram.sendMessage(chatId, MESSAGES.resetPassword(token, metadata), { parse_mode: 'HTML' })
	}

	async sendDeactivateToken(chatId: string, token: string, metadata: SessionMetadata) {
		await this.telegram.sendMessage(chatId, MESSAGES.deactivate(token, metadata), { parse_mode: 'HTML' })
	}

	async sendAccountDeletion(chatId: string) {
		await this.telegram.sendMessage(chatId, MESSAGES.accountDeleted, { parse_mode: 'HTML' })
	}

	async sendStreamStart(chatId: string, channel: User) {
		await this.telegram.sendMessage(chatId, MESSAGES.streamStart(channel), { parse_mode: 'HTML' })
	}

	async sendNewFollower(chatId: string, follower: User) {
		const user = await this.findUserByChatId(chatId)

		await this.telegram.sendMessage(chatId, MESSAGES.newFollower(follower, user.followings.length), {
			parse_mode: 'HTML',
		})
	}

	async sendNewSponsorship(chatId: string, plan: SponsorshipPlan, sponsor: User) {
		await this.telegram.sendMessage(chatId, MESSAGES.newSponsorship(plan, sponsor), { parse_mode: 'HTML' })
	}

	async sendVerify(chatId: string) {
		await this.telegram.sendMessage(chatId, MESSAGES.verifyChannel, { parse_mode: 'HTML' })
	}

	private async connectTelegram(userId: string, chatId: string) {
		await this.prismaService.user.update({
			where: {
				id: userId,
			},
			data: {
				telegramId: chatId,
			},
		})

		return true
	}

	private async findUserByChatId(chatId: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				telegramId: chatId,
			},
			include: {
				followings: true,
			},
		})

		return user
	}
}
