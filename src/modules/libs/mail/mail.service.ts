import { AccountDeletionTemplate } from './templates/account-deletion.template'
import { DeactivateTemplate } from './templates/deactivate.template'
import { PasswordRecoveryTemplate } from './templates/password-recovery.template'
import { VerificationTemplate } from './templates/verification.template'
import { VerifyChannelTemplate } from './templates/verify-channel.template'
import { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(VerificationTemplate({ domain, token }))

		return this.sendMail(email, 'Верификация аккаунта', html)
	}

	async sendPasswordResetToken(email: string, token: string, metadata: SessionMetadata) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(PasswordRecoveryTemplate({ domain, token, metadata }))

		return this.sendMail(email, 'Сброс пароля', html)
	}

	async sendDeactivateToken(email: string, token: string, metadata: SessionMetadata) {
		const html = await render(DeactivateTemplate({ token, metadata }))

		return this.sendMail(email, 'Деактивация аккаунта', html)
	}

	async sendAccountDeletion(email: string) {
		const html = await render(AccountDeletionTemplate({}))

		return this.sendMail(email, 'Аккаунт деактивирован', html)
	}

	async sendVerifyAccount(email: string) {
		const html = await render(VerifyChannelTemplate({}))

		return this.sendMail(email, 'Ваш канал верифицирован', html)
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html,
		})
	}
}
