import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  //   createTypeOrmOptions(): TypeOrmModuleOptions {
  //     return {
  //       type: 'sqlite',
  //       synchronize: false,
  //       database: this.configService.get('DB_NAME'),
  //       autoLoadEntities: true,
  //     };
  //   }
  createTypeOrmOptions(): TypeOrmModuleOptions {
    switch (process.env.NODE_ENV) {
      case 'development':
        return {
          type: this.configService.get<any>('DB_TYPE'),
          // synchronize: false,
          synchronize: JSON.parse(
            this.configService.get<string>('SYNCHRONIZE'),
          ),
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
        };
      case 'test':
        return {
          type: this.configService.get<any>('DB_TYPE'),
          // synchronize: false,
          synchronize: JSON.parse(
            this.configService.get<string>('SYNCHRONIZE'),
          ),
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          migrationsRun: JSON.parse(
            this.configService.get<string>('MIGRATIONS_RUN'),
          ),
        };
      case 'production':
        const obj = {
          type: this.configService.get<any>('DB_TYPE'),
          // synchronize: false,
          synchronize: JSON.parse(
            this.configService.get<string>('SYNCHRONIZE'),
          ),
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          migrationsRun: JSON.parse(
            this.configService.get<string>('MIGRATIONS_RUN'),
          ),
          ssl: {
            rejectUnauthorized: JSON.parse(
              this.configService.get<string>('SSL'),
            ),
          },
        };
        console.log(obj);
        return obj;
    }
  }
}
