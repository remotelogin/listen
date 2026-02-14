import { ListenService } from '../services/listen.service';
export declare class ListenController {
    private readonly listenService;
    constructor(listenService: ListenService);
    accessLog(): any;
    accessLogCount(): any;
    runCustomSQL(query: string): any;
}
