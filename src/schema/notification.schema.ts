import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ collection: 'notifications' })
export class Notification {

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
  type: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Number, default: Date.now })
  createdAt: number;

  @Prop({ type: Number, default: null })
  updatedAt: number;

  @Prop({ type: Number, default: null })
  deletedAt: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
