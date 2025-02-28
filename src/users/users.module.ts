import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'common/database/database';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DatabaseModule],
})
export class UsersModule {}
