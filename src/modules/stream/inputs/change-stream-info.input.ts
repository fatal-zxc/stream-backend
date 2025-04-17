import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

@InputType()
export class ChangeStreamInfoInput {
	@Field(() => String, { nullable: true })
	@IsString()
	@MaxLength(500)
	title: string

	@Field(() => [String], { nullable: true })
	@IsString()
	categoryIds: string[]
}
