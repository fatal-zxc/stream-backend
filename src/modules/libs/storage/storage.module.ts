import { StorageService } from './storage.service'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
	providers: [StorageService],
	exports: [StorageService],
})
export class StorageModule {}
