import { TotpResolver } from './totp.resolver'
import { TotpService } from './totp.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [TotpResolver, TotpService],
})
export class TotpModule {}
