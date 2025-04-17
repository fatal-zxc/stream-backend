import { CreatePlanInput } from './inputs/create-plan.input'
import { PlanModel } from './models/plan.model'
import { PlanService } from './plan.service'
import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver('Plan')
export class PlanResolver {
	constructor(private readonly planService: PlanService) {}

	@Authorization()
	@Query(() => [PlanModel], { name: 'findMySponsorshipPlans' })
	async findMyPlans(@Authorized() user: User): Promise<PlanModel[]> {
		return this.planService.findMyPlans(user)
	}

	@Authorization()
	@Mutation(() => PlanModel, { name: 'createSponsorshipPlan' })
	async create(@Authorized() user: User, @Args('data') input: CreatePlanInput) {
		return this.planService.create(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSponsorshipPlan' })
	async remove(@Args('planId') planId: string) {
		return this.planService.remove(planId)
	}
}
