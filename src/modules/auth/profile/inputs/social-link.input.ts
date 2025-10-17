import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator'

@InputType()
export class SocialLinkInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Length(2, 30)
	title: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsUrl()
	url: string
}

@InputType()
export class SocialLinkOrderInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	id: string

	@Field(() => Number)
	@IsNumber()
	@IsNotEmpty()
	position: number
}
