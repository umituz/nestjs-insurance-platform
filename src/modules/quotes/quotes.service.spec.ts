import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuotesService } from './quotes.service';
import { Quote } from './quote.schema';
import { IntegrationEntity } from './integration.entity';

describe('QuotesService', () => {
  let service: QuotesService;
  let quoteModel: any;
  let integrationRepo: any;

  const mockQuote = {
    _id: 'quote-id-123',
    userId: 'user-id-123',
    insuranceType: 'auto',
    status: 'pending',
    customerData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const mockQuoteModel = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockQuote]),
        }),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockQuote),
      }),
      findById: jest.fn().mockResolvedValue(mockQuote),
      constructor: jest.fn().mockImplementation(() => mockQuote),
    };
    Object.setPrototypeOf(mockQuoteModel.constructor, mockQuoteModel);

    const mockIntegrationRepo = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        {
          provide: getModelToken(Quote.name),
          useValue: mockQuoteModel.constructor,
        },
        {
          provide: getRepositoryToken(IntegrationEntity),
          useValue: mockIntegrationRepo,
        },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
    quoteModel = module.get(getModelToken(Quote.name));
    integrationRepo = module.get(getRepositoryToken(IntegrationEntity));
  });

  describe('createQuote', () => {
    it('should create a new quote', async () => {
      const createQuoteDto = {
        insuranceType: 'auto',
        customerData: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          dateOfBirth: '1990-01-01',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'USA',
          },
        },
      };

      const result = await service.createQuote('user-id-123', createQuoteDto);

      expect(result).toBeDefined();
      expect(result.status).toBe('pending');
    });
  });

  describe('getQuotesByUser', () => {
    it('should return quotes for a user', async () => {
      const result = await service.getQuotesByUser('user-id-123');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('acceptQuote', () => {
    it('should accept a quote', async () => {
      const result = await service.acceptQuote('quote-id-123', 'user-id-123');

      expect(result).toBeDefined();
      expect(mockQuote.save).toHaveBeenCalled();
    });
  });
});