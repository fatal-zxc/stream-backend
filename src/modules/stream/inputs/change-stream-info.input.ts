import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsString, Length } from 'class-validator'

@InputType()
export class ChangeStreamInfoInput {
	@Field(() => String, { nullable: false })
	@IsString()
	@Length(3, 80)
	title: string

	@Field(() => [String], { nullable: true })
	@IsArray()
	categoryIds: string[]
}
