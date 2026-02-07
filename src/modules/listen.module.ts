import { Module } from '@nestjs/common';
import { ListenController } from '../controllers/listen.controller';
import { ListenService } from '../services/listen.service';

@Module({
  imports: [],
  controllers: [ListenController],
  providers: [ListenService],
})
export class ListenModule {}
