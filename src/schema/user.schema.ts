// cats/schemas/cat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ default: 'male' })
  gender: string;

  @Prop({ default: null })
  phone: string;

  @Prop({ default: null })
  address: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({
    type: {
      email: { type: String, trim: true },
      password: { type: String, trim: true },
      isActive: { type: Boolean, default: false },
    },
    default: {},
  })
  local: {
    email: string;
    password: string;
    isActive: Boolean;
    verifyToken: String
  };

  @Prop({
    type: {
      uid: { type: String, trim: true },
      token: { type: String, trim: true },
      email: { type: String, trim: true },
    },
    default: {},
  })
  facebook: {
    uid: String;
    token: String;
    email: string;
  };

  @Prop({
    type: {
      uid: { type: String, trim: true },
      token: { type: String, trim: true },
      email: { type: String, trim: true },
    },
    default: {},
  })
  google: {
    uid: String;
    token: String;
    email: string;
  };

  @Prop({ type: Number, default: Date.now })
  createdAt: Number;

  @Prop({ type: Number, default: null })
  updatedAt: Number;

  @Prop({ type: Number, default: null })
  deletedAt: Number;
}

export const UserSchema = SchemaFactory.createForClass(User);
