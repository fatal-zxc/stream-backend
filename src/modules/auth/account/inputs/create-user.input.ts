import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator'

@InputType()
export class CreateUserInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:[-!_?a-zA-Z0-9]+)*$/)
	@Length(3, 20)
	username: string

	@Field()
	@IsString()
	@IsEmail()
	email: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string
}
