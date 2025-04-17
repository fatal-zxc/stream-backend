import { GqlAuthGuard } from '../guards/gql-auth.guard'
import { applyDecorators, UseGuards } from '@nestjs/common'

export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard))
}
