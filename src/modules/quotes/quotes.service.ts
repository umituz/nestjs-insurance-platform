import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { Quote } from './quote.schema';
import { IntegrationEntity } from './integration.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectModel(Quote.name) private quoteModel: Model<Quote>,
    @InjectRepository(IntegrationEntity)
    private integrationRepo: Repository<IntegrationEntity>,
  ) {}

  async createQuote(userId: string, createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const quote = new this.quoteModel({
      userId,
      ...createQuoteDto,
      status: 'pending',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    const savedQuote = await quote.save();
    
    // Trigger async quote calculation
    this.calculateQuoteAsync(savedQuote._id.toString());
    
    return savedQuote;
  }

  async getQuotesByUser(userId: string): Promise<Quote[]> {
    return this.quoteModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getQuoteById(id: string, userId: string): Promise<Quote> {
    const quote = await this.quoteModel.findOne({ _id: id, userId }).exec();
    if (!quote) {
      throw new NotFoundException('Quote not found');
    }
    return quote;
  }

  async acceptQuote(id: string, userId: string): Promise<Quote> {
    const quote = await this.getQuoteById(id, userId);
    quote.status = 'accepted';
    return quote.save();
  }

  private async calculateQuoteAsync(quoteId: string): Promise<void> {
    try {
      const quote = await this.quoteModel.findById(quoteId);
      if (!quote) return;

      // Simulate integration with external insurance providers
      const integrationLog = this.integrationRepo.create({
        providerId: 'sample-provider',
        providerName: 'Sample Insurance Provider',
        quoteId: quote._id.toString(),
        requestData: quote.customerData,
        status: 'pending',
      });

      const startTime = Date.now();
      
      // Mock calculation logic
      await this.simulateExternalAPICall();
      
      const processingTime = Date.now() - startTime;
      
      // Update quote with calculated premium
      quote.calculatedPremium = {
        amount: this.calculatePremiumAmount(quote),
        currency: 'USD',
        breakdown: {
          base: 100,
          riskAdjustment: 25,
          taxes: 15,
        },
      };
      
      quote.status = 'calculated';
      
      integrationLog.responseData = { premium: quote.calculatedPremium };
      integrationLog.status = 'success';
      integrationLog.processingTime = processingTime;
      
      await Promise.all([
        quote.save(),
        this.integrationRepo.save(integrationLog),
      ]);
    } catch (error) {
      console.error('Quote calculation failed:', error);
      // Handle error logging
    }
  }

  private calculatePremiumAmount(quote: Quote): number {
    const baseAmount = 140;
    const typeMultipliers = { auto: 1.2, home: 1.0, life: 1.5, health: 1.3 };
    return Math.round(baseAmount * (typeMultipliers[quote.insuranceType] || 1.0));
  }

  private simulateExternalAPICall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }
}