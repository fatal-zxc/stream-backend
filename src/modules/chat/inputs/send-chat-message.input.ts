import { Field, ID, InputType } from '@nestjs/graphql'
import { IsString, IsUUID, Length } from 'class-validator'

@InputType()
export class SendChatMessageInput {
	@Field(() => String)
	@IsString()
	@Length(1, 300)
	text: string

	@Field(() => ID)
	@IsString()
	@IsUUID('4')
	streamId: string
}
