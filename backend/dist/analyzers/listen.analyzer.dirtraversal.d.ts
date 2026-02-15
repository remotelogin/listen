import { IAnalyzeImplementation } from '../interfaces/listen.IAnalyzeImplementation';
import { DBConnector } from 'src/services/listen.DBConnector';
import { AnalyzeResult } from 'src/classes/listen.AnalyzeResult';
import { AnalysisEntry } from 'src/classes/listen.AnalysisEntry';
export declare class AnalyzerDirtraversal implements IAnalyzeImplementation {
    readonly db: DBConnector;
    constructor(db: DBConnector);
    analyzeRecord(record: AnalysisEntry): Promise<AnalyzeResult>;
}
