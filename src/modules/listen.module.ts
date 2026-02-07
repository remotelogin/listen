import { Module } from '@nestjs/common';
import { ListenController } from '../controllers/listen.controller';
import { ListenService } from '../services/listen.service';
import { DBConnector } from 'src/services/listen.DBConnector';

@Module({
  imports: [],
  controllers: [ListenController],
  providers: [ListenService, DBConnector],
})
export class ListenModule {}
