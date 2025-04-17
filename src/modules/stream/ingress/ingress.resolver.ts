import { IngressService } from './ingress.service'
import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { IngressInput } from 'livekit-server-sdk'

@Resolver('Ingress')
export class IngressResolver {
	constructor(private readonly ingressService: IngressService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createIngress' })
	async create(@Authorized() user: User, @Args('ingressType') ingressType: IngressInput) {
		return this.ingressService.create(user, ingressType)
	}
}
