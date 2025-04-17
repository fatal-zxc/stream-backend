import { DeactivateResolver } from './deactivate.resolver'
import { DeactivateService } from './deactivate.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [DeactivateResolver, DeactivateService],
})
export class DeactivateModule {}
