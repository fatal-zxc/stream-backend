import { SponsorshipSubscription, TransactionStatus } from '@/prisma/generated'
import { UserModel } from '@/src/modules/auth/account/models/user.model'
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { PlanModel } from '../../plan/models/plan.model'

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
	@Field(() => ID)
	id: string

	@Field(() => Date)
	expiresAt: Date

	@Field(() => ID)
	sponsorId: string

	@Field(() => UserModel)
	sponsor: UserModel

	@Field(() => ID)
	channelId: string

	@Field(() => ID)
	planId: string

	@Field(() => PlanModel)
	plan: PlanModel

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
