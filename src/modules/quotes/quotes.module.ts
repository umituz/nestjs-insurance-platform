import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { Quote, QuoteSchema } from './quote.schema';
import { IntegrationEntity } from './integration.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
    TypeOrmModule.forFeature([IntegrationEntity]),
  ],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}