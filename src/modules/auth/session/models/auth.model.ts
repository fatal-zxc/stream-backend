import { UserModel } from '../../account/models/user.model'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AuthModel {
	@Field(() => UserModel, { nullable: true })
	user: UserModel

	@Field(() => String, { nullable: true })
	message?: string
}
