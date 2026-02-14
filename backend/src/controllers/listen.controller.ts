import { Controller, Get, Post } from '@nestjs/common';
import { ListenService } from '../services/listen.service';
import { GUARDS_METADATA } from '@nestjs/common/constants';

@Controller()
export class ListenController {
  
  constructor(private readonly listenService: ListenService) {
    this.listenService.setWatchFilePath("/etc/nginx/logs/access.log"); 
  }


  // the logs endpoint. main interactive thingy
  @Get("/logs/")
  accessLog():any {

    return this.listenService.db.runSQLQuery("SELECT * FROM nginxlogs");
   
  }

  // get number of logs in db
  @Get("/logs/count")
  accessLogCount():any {
    return this.listenService.db.runSQLQuery("SELECT COUNT(*) AS total_entries FROM nginxlogs;");
  }
 
}
