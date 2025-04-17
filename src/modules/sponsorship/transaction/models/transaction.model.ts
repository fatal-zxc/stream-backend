import { Transaction, TransactionStatus } from '@/prisma/generated'
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(TransactionStatus, { name: 'TransactionStatus' })

@ObjectType()
export class TransactionModel implements Transaction {
	@Field(() => ID)
	id: string

	@Field(() => Number)
	amount: number

	@Field(() => String)
	currency: string

	@Field(() => String)
	stripeSubscriptionId: string

	@Field(() => TransactionStatus)
	status: TransactionStatus

	@Field(() => ID)
	userId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
