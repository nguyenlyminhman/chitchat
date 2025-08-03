import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatGroupDocument = ChatGroup & Document;

@Schema({ collection: 'chat-groups' })
export class ChatGroup {

  @Prop({ type: String })
  name: string

  @Prop({ type: Number, min: 3, max: 1000 })
  userAmount: number;

  @Prop({ type: Number, default: 0 })
  messageAmount: number;

  @Prop({ type: String })
  userId: string;

  @Prop({
    type: [{ userId: String }],
    default: [],
  })
  numbers: { userId: string }[];

  @Prop({ type: Number, default: Date.now })
  createdAt: number;

  @Prop({ type: Number, default: null })
  updatedAt: number;

  @Prop({ type: Number, default: null })
  deletedAt: number;
}

export const ChatGroupSchema = SchemaFactory.createForClass(ChatGroup);
