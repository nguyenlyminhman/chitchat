import { Module } from '@nestjs/common';
import { ServerConfigService } from './server-config.service';

const providers = [ServerConfigService];

@Module({
    imports: [],
    controllers: [],
    providers,
    exports: [...providers],
})
export class ShareModule { }
