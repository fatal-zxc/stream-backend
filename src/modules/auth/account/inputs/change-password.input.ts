import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator'

@InputType()
export class ChangePasswordInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@Length(8, 30)
	oldPassword: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@Length(8, 30)
	newPassword: string
}
