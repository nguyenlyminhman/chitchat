import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ collection: 'messages' })
export class Message {

  @Prop({
    type: {
      id: { type: String, trim: true },
      username: { type: String, trim: true },
      avatar: { type: String, trim: true },
    },
    default: {},
  })
  sender: {
    id: string;
    username: string;
    avatar: string
  };

  @Prop({
    type: {
      id: { type: String, trim: true },
      username: { type: String, trim: true },
      avatar: { type: String, trim: true },
    },
    default: {},
  })
  receiver: {
    id: string;
    username: string;
    avatar: string
  };

  @Prop({ type: String })
  text: string;

  @Prop({ type: String })
  file: string;

  @Prop({ type: Number, default: Date.now })
  createdAt: number;

  @Prop({ type: Number, default: null })
  updatedAt: number;

  @Prop({ type: Number, default: null })
  deletedAt: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
