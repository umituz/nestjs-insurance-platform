import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('insurance_integrations')
export class IntegrationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  providerId: string;

  @Column()
  providerName: string;

  @Column()
  quoteId: string;

  @Column('jsonb')
  requestData: Record<string, any>;

  @Column('jsonb', { nullable: true })
  responseData: Record<string, any>;

  @Column({ enum: ['pending', 'success', 'failed', 'timeout'], default: 'pending' })
  status: string;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ nullable: true })
  processingTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}