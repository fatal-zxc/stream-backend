import { Field, ID, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GenerateStreamTokenInput {
	@Field(() => ID, { nullable: true })
	@IsString()
	userId: string

	@Field(() => String, { nullable: true })
	@IsString()
	channelId: string
}
