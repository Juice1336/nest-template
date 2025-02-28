import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import * as path from 'path';
import * as fs from 'fs';
import { UsersService } from './users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { DatabaseModule } from 'common/database/database';
import { JwtService } from '@nestjs/jwt';

const srcDir = path.join(__dirname);
const moduleFolders = fs
  .readdirSync(srcDir)
  .filter((file) => fs.statSync(path.join(srcDir, file)).isDirectory());

const importedModules = moduleFolders.map(async (moduleName) => {
  const modulePath = path.join(__dirname, moduleName, `${moduleName}.module`);
  const {
    [`${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}Module`]:
      module,
  } = await import(modulePath);
  return module;
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL'),
        entities: [User],
        synchronize: true,
        ssl: false,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    ...importedModules,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, JwtService],
})
export class AppModule {}
