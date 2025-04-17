import { UserModel } from '../../auth/account/models/user.model'
import { NotificationSettings } from '@/prisma/generated'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {
	@Field(() => ID)
	id: string

	@Field(() => Boolean)
	siteNotifications: boolean

	@Field(() => Boolean)
	telegramNotifications: boolean

	@Field(() => UserModel)
	user: UserModel

	@Field(() => String)
	userId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}

@ObjectType()
export class ChangeNotificationsSettingsResponse {
	@Field(() => NotificationSettingsModel)
	notificationSettings: NotificationSettingsModel

	@Field(() => String, { nullable: true })
	telegramAuthToken?: string
}
