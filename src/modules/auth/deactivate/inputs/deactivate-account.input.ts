import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator'

@InputType()
export class DeactivateAccountInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field(() => String)
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String, { nullable: true })
	@IsString()
	@IsNotEmpty()
	@Length(6, 6)
	@IsOptional()
	pincode?: string
}
