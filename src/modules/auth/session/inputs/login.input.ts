import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator'

@InputType()
export class LoginInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	login: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@Length(6)
	pincode?: string
}
