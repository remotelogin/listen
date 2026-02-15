import { AnalysisEntry } from "src/classes/listen.AnalysisEntry";
import { AnalyzeResult } from "src/classes/listen.AnalyzeResult";
export interface IAnalyzeImplementation {
    analyzeRecord(record: AnalysisEntry): AnalyzeResult;
}
