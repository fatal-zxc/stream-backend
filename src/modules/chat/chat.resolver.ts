import { ChatService } from './chat.service'
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input'
import { SendChatMessageInput } from './inputs/send-chat-message.input'
import { ChatMessageModel } from './models/chat-message.model'
import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'

@Resolver('Chat')
export class ChatResolver {
	private readonly pubSub: PubSub

	constructor(private readonly chatService: ChatService) {
		this.pubSub = new PubSub()
	}

	@Query(() => [ChatMessageModel], { name: 'findChatMessagesByStream' })
	async findMessagesByStream(@Args('streamId') streamId: string) {
		return this.chatService.findMessagesByStream(streamId)
	}

	@Authorization()
	@Mutation(() => ChatMessageModel, { name: 'sendChatMessage' })
	async sendMessage(@Authorized('id') userId: string, @Args('data') input: SendChatMessageInput) {
		const message = await this.chatService.sendMessage(userId, input)

		this.pubSub.publish('CHAT_MESSAGE_ADDED', { chatMessageAdded: message })

		return message
	}

	@Subscription(() => ChatMessageModel, {
		name: 'chatMessageAdded',
		filter: (payload, variables) => payload.chatMessageAdded.streamId === variables.streamId,
	})
	chatMessageAdded(@Args('streamId') streamId: string) {
		return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED')
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeChatSettings' })
	async changeSettings(@Authorized() user: User, @Args('data') input: ChangeChatSettingsInput) {
		return this.chatService.changeSettings(user, input)
	}
}
