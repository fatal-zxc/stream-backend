import { TransactionResolver } from './transaction.resolver'
import { TransactionService } from './transaction.service'
import { Module } from '@nestjs/common'

@Module({
	providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
