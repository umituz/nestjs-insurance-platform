import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './common/common.module';
import { mongoConfig, postgresConfig } from './config/database.config';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forRoot(mongoConfig.uri),
    TypeOrmModule.forRoot(postgresConfig),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'insurance-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    QuotesModule,
    UsersModule,
  ],
})
export class AppModule {}