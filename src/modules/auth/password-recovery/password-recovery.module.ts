import { TelegramService } from '../../libs/telegram/telegram.service'
import { PasswordRecoveryResolver } from './password-recovery.resolver'
import { PasswordRecoveryService } from './password-recovery.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [PasswordRecoveryResolver, PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
