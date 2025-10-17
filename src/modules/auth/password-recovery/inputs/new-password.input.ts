import { IsPasswordMatchingConstraint } from '@/src/shared/decorators/is-password-matching-constraint.decorator'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUUID, Length, MinLength, Validate } from 'class-validator'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Length(8, 30)
	password: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Length(8, 30)
	@Validate(IsPasswordMatchingConstraint)
	passwordRepeat: string

	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	token: string
}
