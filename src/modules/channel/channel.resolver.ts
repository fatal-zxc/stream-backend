import { UserModel } from '../auth/account/models/user.model'
import { SubscriptionModel } from '../sponsorship/subscription/models/subscription.model'
import { ChannelService } from './channel.service'
import { Args, Query, Resolver } from '@nestjs/graphql'

@Resolver('Channel')
export class ChannelResolver {
	constructor(private readonly channelService: ChannelService) {}

	@Query(() => [UserModel], { name: 'findRecommendedChannels' })
	async findRecommended() {
		return this.channelService.findRecommended()
	}

	@Query(() => UserModel, { name: 'findChannelByUsername' })
	async findByUsername(@Args('username') username: string) {
		return this.channelService.findByUsername(username)
	}

	@Query(() => UserModel, { name: 'findChannelFollowersCount' })
	async findFollowersCount(@Args('channelId') channelId: string) {
		return this.channelService.findFollowersCount(channelId)
	}

	@Query(() => [SubscriptionModel], { name: 'findSponsorsByChannel' })
	async findSponsors(@Args('channelId') channelId: string) {
		return this.channelService.findSponsors(channelId)
	}
}
