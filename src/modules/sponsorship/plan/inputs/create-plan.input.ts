import { IsDecimalMax } from '@/src/shared/validators/is-decimal-max.validator'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from 'class-validator'

@InputType()
export class CreatePlanInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Length(3, 25)
	title: string

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@MaxLength(200)
	description?: string

	@IsNumber()
	@IsNotEmpty()
	@Field(() => Number)
	@Min(50)
	@Max(100_000)
	@IsDecimalMax(2)
	price: number
}
