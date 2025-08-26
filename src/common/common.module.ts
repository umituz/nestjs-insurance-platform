import { Module, Global } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { QueueService } from './services/queue.service';

@Global()
@Module({
  providers: [RedisService, QueueService],
  exports: [RedisService, QueueService],
})
export class CommonModule {}