import { StreamModel } from '../../stream/models/stream.model'
import { Category, Stream, User } from '@/prisma/generated'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CategoryModel implements Category {
	@Field(() => ID)
	id: string

	@Field(() => String)
	title: string

	@Field(() => String)
	slug: string

	@Field(() => String, { nullable: true })
	description: string

	@Field(() => String, { nullable: true })
	thumbnailUrl: string

	@Field(() => [StreamModel])
	streams: Stream[]

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
