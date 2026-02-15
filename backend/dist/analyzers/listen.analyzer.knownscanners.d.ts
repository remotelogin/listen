import { IAnalyzeImplementation } from '../interfaces/listen.IAnalyzeImplementation';
import { DBConnector } from 'src/services/listen.DBConnector';
import { AnalyzeResult } from 'src/classes/listen.AnalyzeResult';
import { AnalysisEntry } from 'src/classes/listen.AnalysisEntry';
export declare class AnalyzerKnownScanners implements IAnalyzeImplementation {
    readonly db: DBConnector;
    private readonly KNOWN_SCRAPER_UA_SUBSTRINGS;
    constructor(db: DBConnector);
    private checkSubstring;
    analyzeRecord(record: AnalysisEntry): Promise<AnalyzeResult>;
}
