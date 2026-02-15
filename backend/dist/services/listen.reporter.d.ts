import { IReporter } from "src/interfaces/listen.IReporter";
import { ReportBody } from "src/classes/listen.ReportBody";
export declare class AbuseIPDBreporter implements IReporter {
    private apiToken;
    private credLocation;
    private recentlyReported;
    constructor();
    onModuleInit(): Promise<void>;
    reportToAPI(report: ReportBody): Promise<boolean>;
}
