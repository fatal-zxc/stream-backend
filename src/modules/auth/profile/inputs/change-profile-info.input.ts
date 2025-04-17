import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator'

@InputType()
export class ChangeProfileInfoInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	username: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
	bio: string
}
