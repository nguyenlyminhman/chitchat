import { Global, Module } from '@nestjs/common';
import { ServerConfigService } from './server-config.service';

const providers = [ServerConfigService];

@Global()
@Module({
    imports: [],
    controllers: [],
    providers,
    exports: [...providers],
})
export class ShareModule { }
