import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Quote extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['auto', 'home', 'life', 'health'] })
  insuranceType: string;

  @Prop({ required: true, enum: ['pending', 'calculated', 'accepted', 'rejected'] })
  status: string;

  @Prop({ type: Object, required: true })
  customerData: Record<string, any>;

  @Prop({ type: Object })
  calculatedPremium: {
    amount: number;
    currency: string;
    breakdown: Record<string, number>;
  };

  @Prop({ type: Object })
  coverage: Record<string, any>;

  @Prop({ type: [String] })
  errors: string[];

  @Prop()
  validUntil: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);