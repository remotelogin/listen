import { ListenService } from '../services/listen.service';
import { AnalyzerService } from 'src/services/listen.analyzer';
export declare class ListenController {
    private readonly listenService;
    private readonly analyzerService;
    constructor(listenService: ListenService, analyzerService: AnalyzerService);
    accessLog(): any;
    accessLogCount(): any;
    runCustomSQL(query: string): any;
}
