import { VerificationService } from '../verification/verification.service'
import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [AccountResolver, AccountService, VerificationService],
})
export class AccountModule {}
