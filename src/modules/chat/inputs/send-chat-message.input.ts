import { Field, ID, InputType } from '@nestjs/graphql'
import { IsString, IsUUID, MaxLength } from 'class-validator'

@InputType()
export class SendChatMessageInput {
	@Field(() => String)
	@IsString()
	@MaxLength(300)
	text: string

	@Field(() => ID)
	@IsString()
	@IsUUID('4')
	streamId: string
}
