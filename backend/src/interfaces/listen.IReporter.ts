import { ReportBody } from "src/classes/listen.ReportBody";

export interface IReporter {

  reportToAPI(report: ReportBody): Promise<boolean>;

}
