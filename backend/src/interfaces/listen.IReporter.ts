import { ReportBody } from "src/classes/listen.ReportBody.ts~";

export interface IReporter {

  reportToAPI(report: ReportBody): Promise<boolean>;

}
