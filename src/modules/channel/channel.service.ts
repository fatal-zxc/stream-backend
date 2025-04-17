import { PrismaService } from '@/src/core/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class ChannelService {
	constructor(private readonly prismaService: PrismaService) {}

	async findRecommended() {
		const channels = await this.prismaService.user.findMany({
			where: {
				isDeactivated: false,
			},
			orderBy: {
				followings: {
					_count: 'desc',
				},
			},
			include: {
				stream: true,
			},
			take: 7,
		})

		return channels
	}

	async findByUsername(username: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				username,
				isDeactivated: false,
			},
			include: {
				socialLinks: {
					orderBy: {
						position: 'desc',
					},
				},
				stream: {
					include: {
						categories: true,
					},
				},
				followings: true,
			},
		})

		if (!channel) {
			throw new NotFoundException('Канал не найден')
		}

		return channel
	}

	async findFollowersCount(channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId,
			},
		})

		if (!channel) {
			throw new NotFoundException('Канал не найден')
		}

		const count = await this.prismaService.follow.count({
			where: {
				followingId: channelId,
			},
		})

		return count
	}

	async findSponsors(channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId,
			},
		})

		if (!channel) {
			throw new NotFoundException('Канал не найден')
		}

		const sponsors = await this.prismaService.sponsorshipSubscription.findMany({
			where: {
				channelId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				plan: true,
				user: true,
			},
		})

		return sponsors
	}
}
