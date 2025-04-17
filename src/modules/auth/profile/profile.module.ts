import { ProfileResolver } from './profile.resolver'
import { ProfileService } from './profile.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [ProfileResolver, ProfileService],
})
export class ProfileModule {}
