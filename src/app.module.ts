import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ChatGroupModule } from './modules/chat-group/chat-group.module';
import { MessagesModule } from './modules/messages/messages.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ContactModule } from './modules/contact/contact.module';
import { ShareModule } from './modules/share/share.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MongoDbModule } from './modules/mongo-db/mongo-db.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    UserModule,
    ChatGroupModule,
    MessagesModule,
    NotificationModule,
    ContactModule,
    ShareModule,
    AuthModule,
    MongoDbModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
