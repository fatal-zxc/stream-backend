import { UserModel } from '../account/models/user.model'
import { LoginInput } from './inputs/login.input'
import { AuthModel } from './models/auth.model'
import { SessionModel } from './models/session.model'
import { SessionService } from './session.service'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import type { GqlContext } from '@/src/shared/types/gql-context.types'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver('Session')
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	@Authorization()
	@Query(() => [SessionModel], { name: 'findSessionByUser' })
	async findByUser(@Context() { req }: GqlContext) {
		return this.sessionService.findByUser(req)
	}

	@Authorization()
	@Query(() => SessionModel, { name: 'findCurrentSession' })
	async findCurrent(@Context() { req }: GqlContext) {
		return this.sessionService.findCurrent(req)
	}

	@Mutation(() => AuthModel, { name: 'loginUser' })
	async login(@Context() { req }: GqlContext, @Args('data') input: LoginInput, @UserAgent() userAgent: string) {
		return this.sessionService.login(req, input, userAgent)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'logoutUser' })
	async logout(@Context() { req }: GqlContext) {
		return this.sessionService.logout(req)
	}

	@Mutation(() => Boolean, { name: 'clearSessionCookie' })
	async clearSession(@Context() { req }: GqlContext) {
		return this.sessionService.clearSession(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSession' })
	async remove(@Context() { req }: GqlContext, @Args('id') id: string) {
		return this.sessionService.remove(req, id)
	}
}
