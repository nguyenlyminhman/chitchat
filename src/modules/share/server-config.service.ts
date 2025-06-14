import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class ServerConfigService {
  constructor(private configService: ConfigService) {}

  private get(key: string): string {
    const value: any = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get dbUser() {
    return {
      host: this.getString('DB_HOST'),
      port: this.getString('DB_PORT'),
      user: this.getString('DB_USER'),
      password: this.getString('DB_PASSWORD'),
      name: this.getString('DB_USR_NAME'),
    };
  }

  get dbDefault() {
    return {
      host: this.getString('DB_HOST'),
      port: this.getString('DB_PORT'),
      user: this.getString('DB_USER'),
      password: this.getString('DB_PASSWORD'),
      name: this.getString('DB_DF_NAME'),
    };
  }

  get swaggerEnabled(): boolean {
    return this.getBoolean('ENABLE_SWAGGER');
  }

  get serverPort() {
    return {
      port: this.getNumber('PORT'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

}
