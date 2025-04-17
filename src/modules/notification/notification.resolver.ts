import { ChangeNotificationsSettingsInput } from './inputs/change-notifications-settings.input'
import { ChangeNotificationsSettingsResponse } from './models/notification-settings.model'
import { NotificationModel } from './models/notification.model'
import { NotificationService } from './notification.service'
import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver('Notification')
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@Authorization()
	@Query(() => Number, { name: 'findNotificationsUnreadCount' })
	async findUnreadCount(@Authorized() user: User) {
		return this.notificationService.findUnreadCount(user)
	}

	@Authorization()
	@Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
	async findByUser(@Authorized() user: User) {
		return this.notificationService.findByUser(user)
	}

	@Authorization()
	@Mutation(() => ChangeNotificationsSettingsResponse, { name: 'changeNotificationSettigns' })
	async changeSettings(
		@Authorized() user: User,
		@Args('data') input: ChangeNotificationsSettingsInput
	): Promise<ChangeNotificationsSettingsResponse> {
		return this.notificationService.changeSettings(user, input)
	}
}
