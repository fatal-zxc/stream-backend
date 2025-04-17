import { SocialLinkModel } from '../../profile/models/social-link.model'
import { User } from '@/prisma/generated'
import { FollowModel } from '@/src/modules/follow/models/follow.model'
import { NotificationSettingsModel } from '@/src/modules/notification/models/notification-settings.model'
import { NotificationModel } from '@/src/modules/notification/models/notification.model'
import { StreamModel } from '@/src/modules/stream/models/stream.model'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

	@Field(() => String)
	username: string

	@Field(() => String, { nullable: true })
	avatar: string

	@Field(() => String, { nullable: true })
	bio: string

	@Field(() => String, { nullable: true })
	telegramId: string

	@Field(() => Boolean)
	isVerified: boolean

	@Field(() => Boolean)
	isEmailVerified: boolean

	@Field(() => Boolean)
	isTotpEnabled: boolean

	@Field(() => String, { nullable: true })
	totpSecret: string

	@Field(() => Boolean)
	isDeactivated: boolean

	@Field(() => Date, { nullable: true })
	deactivatedAt: Date

	@Field(() => [SocialLinkModel])
	socialLinks?: SocialLinkModel[]

	@Field(() => [FollowModel])
	followers?: FollowModel[]

	@Field(() => [FollowModel])
	followings?: FollowModel[]

	@Field(() => StreamModel)
	stream?: StreamModel

	@Field(() => [NotificationModel])
	notifications?: NotificationModel[]

	@Field(() => NotificationSettingsModel)
	notificationSettings?: NotificationSettingsModel

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
