import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DynamodbModule } from './modules/dynamodb/dynamodb.module';
import { ChatGroupModule } from './modules/chat-group/chat-group.module';
import { MessagesModule } from './modules/messages/messages.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [UserModule, DynamodbModule, ChatGroupModule, MessagesModule, NotificationModule, ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
