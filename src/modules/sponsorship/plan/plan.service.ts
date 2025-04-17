import { StripeService } from '../../libs/stripe/stripe.service'
import { CreatePlanInput } from './inputs/create-plan.input'
import { User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class PlanService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService
	) {}

	async findMyPlans(user: User) {
		const plans = await this.prismaService.sponsorshipPlan.findMany({
			where: {
				channelId: user.id,
			},
		})

		return plans
	}

	async create(user: User, input: CreatePlanInput) {
		const { title, description, price } = input

		if (!user.isVerified) {
			throw new ForbiddenException('Создание планов доступно только верифицированным каналам')
		}

		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(price * 100),
			currency: 'rub',
			interval: 'month',
			product: {
				name: title,
			},
		})

		const plan = await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId: stripePlan.product.toString(),
				stripePlanId: stripePlan.id,
				channel: {
					connect: {
						id: user.id,
					},
				},
			},
		})

		return plan
	}

	async remove(planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId,
			},
		})

		if (!plan) {
			throw new NotFoundException('План не найден')
		}

		await this.stripeService.plans.del(plan.stripePlanId)
		await this.stripeService.products.del(plan.stripeProductId)

		await this.prismaService.sponsorshipPlan.delete({
			where: {
				id: planId,
			},
		})

		return true
	}
}
