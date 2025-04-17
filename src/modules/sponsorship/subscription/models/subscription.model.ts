import { SponsorshipSubscription, TransactionStatus } from '@/prisma/generated'
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
	@Field(() => ID)
	id: string

	@Field(() => Date)
	expiresAt: Date

	@Field(() => ID)
	userId: string

	@Field(() => ID)
	channelId: string

	@Field(() => ID)
	planId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
