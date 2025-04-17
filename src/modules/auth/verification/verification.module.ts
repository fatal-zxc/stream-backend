import { VerificationResolver } from './verification.resolver'
import { VerificationService } from './verification.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
