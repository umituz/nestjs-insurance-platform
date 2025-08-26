import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface QueueJob {
  id: string;
  type: string;
  data: any;
  priority: number;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
}

@Injectable()
export class QueueService {
  constructor(private readonly redisService: RedisService) {}

  async addJob(queueName: string, jobData: Omit<QueueJob, 'id' | 'createdAt'>): Promise<void> {
    const job: QueueJob = {
      ...jobData,
      id: this.generateJobId(),
      createdAt: new Date(),
    };

    const queueKey = `queue:${queueName}`;
    await this.redisService.lpush(queueKey, JSON.stringify(job));
    
    console.log(`Job ${job.id} added to queue ${queueName}`);
  }

  async processQueue(queueName: string, processor: (job: QueueJob) => Promise<void>): Promise<void> {
    const queueKey = `queue:${queueName}`;
    
    while (true) {
      try {
        const jobData = await this.redisService.rpop(queueKey);
        
        if (!jobData) {
          await this.sleep(1000); // Wait 1 second before checking again
          continue;
        }

        const job: QueueJob = JSON.parse(jobData);
        
        try {
          await processor(job);
          console.log(`Job ${job.id} processed successfully`);
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          await this.handleFailedJob(queueName, job, error);
        }
      } catch (error) {
        console.error('Queue processing error:', error);
        await this.sleep(5000); // Wait 5 seconds on error
      }
    }
  }

  async getQueueLength(queueName: string): Promise<number> {
    const queueKey = `queue:${queueName}`;
    return await this.redisService.llen(queueKey);
  }

  private async handleFailedJob(queueName: string, job: QueueJob, error: any): Promise<void> {
    job.attempts += 1;
    
    if (job.attempts < job.maxAttempts) {
      // Retry the job
      await this.addJob(queueName, job);
      console.log(`Job ${job.id} retried (${job.attempts}/${job.maxAttempts})`);
    } else {
      // Move to failed queue
      const failedQueueKey = `queue:${queueName}:failed`;
      const failedJob = { ...job, error: error.message, failedAt: new Date() };
      await this.redisService.lpush(failedQueueKey, JSON.stringify(failedJob));
      console.log(`Job ${job.id} moved to failed queue after ${job.attempts} attempts`);
    }
  }

  private generateJobId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}