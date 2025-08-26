import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateQuoteDto {
  @IsEnum(['auto', 'home', 'life', 'health'])
  insuranceType: string;

  @IsObject()
  customerData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    [key: string]: any;
  };

  @IsOptional()
  @IsObject()
  coverage?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}