import { ChannelResolver } from './channel.resolver'
import { ChannelService } from './channel.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [ChannelResolver, ChannelService],
})
export class ChannelModule {}
