import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.schema';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userModel: any;

  const mockUser = {
    _id: 'user-id-123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    save: jest.fn().mockResolvedValue(true),
    toObject: jest.fn().mockReturnValue({
      _id: 'user-id-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
    }),
  };

  beforeEach(async () => {
    const mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      constructor: jest.fn().mockImplementation(() => mockUser),
    };
    Object.setPrototypeOf(mockUserModel.constructor, mockUserModel);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt-token'),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel.constructor,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get(getModelToken(User.name));
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      userModel.findOne = jest.fn().mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await service.register(registerDto);

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: 'user-id-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      userModel.findOne = jest.fn().mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      userModel.findOne = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result.access_token).toBe('jwt-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      userModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});