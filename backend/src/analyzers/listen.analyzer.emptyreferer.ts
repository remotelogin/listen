import { NGINXLog } from 'src/classes/listen.NGINXLog';
import { IAnalyzeImplementation } from '../interfaces/listen.IAnalyzeImplementation';
import { DBConnector } from 'src/services/listen.DBConnector';
import { AnalyzeResult } from 'src/classes/listen.AnalyzeResult';
import { EConvictionResult } from 'src/classes/listen.EConvictionResult';
import { AnalysisEntry } from 'src/classes/listen.AnalysisEntry';
import assert from 'assert';

export class AnalyzerEmptyReferer implements IAnalyzeImplementation {

  constructor(public readonly db: DBConnector) {}
  
  async analyzeRecord(record:AnalysisEntry): Promise<AnalyzeResult> {

    let logEntry:NGINXLog|null = await this.db.getNGINXLogFromUUID(record.uuid);
    assert(logEntry!=null, "Could not fetch log entry!!! Database state might be corrupt!");

    if(logEntry.h_referer == "-"){
      console.log(`empty referer. Will not happen to normal user...`)
      return new AnalyzeResult(true,EConvictionResult.E_ABUSE,"Detected empty referer, indicating web scraping / abusive scanning with UA: "+ logEntry.h_user_agent+" and uri: " + logEntry.uri);
    } else {
      return new AnalyzeResult(false,EConvictionResult.E_NONE, "No offense detected!");
    }
  }
}
