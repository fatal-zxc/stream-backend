import { CategoryResolver } from './category.resolver'
import { CategoryService } from './category.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [CategoryResolver, CategoryService],
})
export class CategoryModule {}
