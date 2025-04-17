import { PlanResolver } from './plan.resolver'
import { PlanService } from './plan.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [PlanResolver, PlanService],
})
export class PlanModule {}
