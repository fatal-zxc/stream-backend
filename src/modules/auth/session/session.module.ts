import { VerificationService } from '../verification/verification.service'
import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [SessionResolver, SessionService, VerificationService],
})
export class SessionModule {}
