import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerConfigService } from '../share/server-config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
          }),

        MongooseModule.forRootAsync({
            inject: [ServerConfigService],
            useFactory: async (configService: ServerConfigService) => ({
              uri: configService.dbMongo.uri,
            }),
        }),
    ],
    exports: [MongooseModule],
})
export class MongoDbModule {}
