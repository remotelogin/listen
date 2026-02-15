import { Controller, Get, Post, Query } from '@nestjs/common';
import { ListenService } from '../services/listen.service';
import { AnalyzerService } from 'src/services/listen.analyzer';
import { AnalyzerDirtraversal } from 'src/analyzers/listen.analyzer.dirtraversal';
import { AnalyzerKnownScanners } from 'src/analyzers/listen.analyzer.knownscanners';

@Controller()
export class ListenController {
  
  constructor(private readonly listenService: ListenService, private readonly analyzerService: AnalyzerService) {
    this.listenService.setWatchFilePath("/etc/nginx/logs/access.log");
    this.analyzerService.setAnalyzeIntervalS(5);

    //register analyzers
    this.analyzerService.registerAnalyzer(new AnalyzerDirtraversal(listenService.db));
    this.analyzerService.registerAnalyzer(new AnalyzerKnownScanners(listenService.db));

  }


  // the logs endpoint. main interactive thingy
  @Get("/logs")
  accessLog():any {
    return this.listenService.db.runSQLQuery("SELECT * FROM nginxlogs");
  }

  // get number of logs in db
  @Get("/logs/count")
  accessLogCount():any {
    return this.listenService.db.runSQLQuery("SELECT COUNT(*) AS total_entries FROM nginxlogs;");
  }

  // run sql to fetch stuff like the last entries
  @Get("/logs/custom")
  runCustomSQL(@Query('q') query: string):any {
    return this.listenService.db.runSQLQuery(query);
  }
 
}
