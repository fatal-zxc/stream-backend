import { IngressResolver } from './ingress.resolver'
import { IngressService } from './ingress.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [IngressResolver, IngressService],
})
export class IngressModule {}
