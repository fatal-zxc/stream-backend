import { FollowService } from './follow.service'
import { FollowModel } from './models/follow.model'
import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver('Follow')
export class FollowResolver {
	constructor(private readonly followService: FollowService) {}

	@Authorization()
	@Query(() => [FollowModel], { name: 'findMyFollowers' })
	async findMyFollowers(@Authorized() user: User) {
		return this.followService.findMyFollowers(user)
	}

	@Authorization()
	@Query(() => [FollowModel], { name: 'findMyFollowings' })
	async findMyFollowings(@Authorized() user: User) {
		return this.followService.findMyFollowings(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'followChanel' })
	async follow(@Authorized() user: User, @Args('channelId') channelId: string) {
		return this.followService.follow(user, channelId)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'unfollowChanel' })
	async unfollow(@Authorized() user: User, @Args('channelId') channelId: string) {
		return this.followService.unfollow(user, channelId)
	}
}
