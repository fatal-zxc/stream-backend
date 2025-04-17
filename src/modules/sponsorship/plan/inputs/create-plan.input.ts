import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreatePlanInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	title: string

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	description?: string

	@IsNumber()
	@IsNotEmpty()
	@Field(() => Number)
	price: number
}
