import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

export const entities = [User];

@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
