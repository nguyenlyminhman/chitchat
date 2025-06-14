import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DynamodbService } from '../dynamodb/dynamodb.service';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
