import { Controller, Get } from '@nestjs/common';
import { ListenService } from '../services/listen.service';

@Controller()
export class ListenController {
  
  constructor(private readonly listenService: ListenService) {
    this.listenService.setWatchFilePath("/etc/nginx/logs/access.log"); 
  }
}
