import { Global, Module } from '@nestjs/common';
import { DynamodbService } from './dynamodb.service';
import { ServerConfigService } from '../share/server-config.service';

@Global()
@Module({
  providers: [
    DynamodbService, 
    ServerConfigService
  ],
  exports: [DynamodbService]
})
export class DynamodbModule {}
