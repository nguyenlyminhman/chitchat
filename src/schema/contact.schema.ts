import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ collection: 'contacts' }) 
export class Contact {
  
  @Prop({type: String})
  userId: string;
  
  @Prop({type: String})
  contactId: string;

  @Prop({type: Boolean})
  status: boolean;
  
  @Prop({type: Number, default: Date.now})
  createdAt: number;
  
  @Prop({type: Number, default: null})
  updatedAt: number;

  @Prop({type: Number, default: null})
  deletedAt: number;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
