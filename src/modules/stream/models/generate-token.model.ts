import { UserModel } from '../../auth/account/models/user.model'
import { Stream, User } from '@/prisma/generated'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenerateStreamTokenModel {
	@Field(() => String)
	token: string
}
