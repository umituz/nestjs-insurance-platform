import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Controller('quotes')
@UseGuards(JwtAuthGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async createQuote(@Request() req, @Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.createQuote(req.user.userId, createQuoteDto);
  }

  @Get()
  async getMyQuotes(@Request() req) {
    return this.quotesService.getQuotesByUser(req.user.userId);
  }

  @Get(':id')
  async getQuote(@Request() req, @Param('id') id: string) {
    return this.quotesService.getQuoteById(id, req.user.userId);
  }

  @Post(':id/accept')
  async acceptQuote(@Request() req, @Param('id') id: string) {
    return this.quotesService.acceptQuote(id, req.user.userId);
  }
}