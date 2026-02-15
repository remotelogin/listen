import { NGINXLog } from 'src/classes/listen.NGINXLog';
import { IAnalyzeImplementation } from '../interfaces/listen.IAnalyzeImplementation';
import { DBConnector } from 'src/services/listen.DBConnector';
import { AnalyzeResult } from 'src/classes/listen.AnalyzeResult';
import { EConvictionResult } from 'src/classes/listen.EConvictionResult';
import { AnalysisEntry } from 'src/classes/listen.AnalysisEntry';
import assert from 'assert';

export class AnalyzerDirtraversal implements IAnalyzeImplementation {

  constructor(public readonly db: DBConnector) {}
  
  async analyzeRecord(record:AnalysisEntry): Promise<AnalyzeResult> {

    let logEntry:NGINXLog|null = await this.db.getNGINXLogFromUUID(record.uuid);
    assert(logEntry!=null, "Could not fetch log entry!!! Database state might be corrupt!");
    
    let numOfBackslash:number = (logEntry.uri.match(/\.\.\//g) || []).length;

    if(numOfBackslash>10)
      return new AnalyzeResult(true,EConvictionResult.E_EXPLOIT,"Attempted Directory traversal with useragent: "+ logEntry.h_user_agent+" and uri: " + logEntry.uri);
    else
      return new AnalyzeResult(false,EConvictionResult.E_NONE, "No offense detected!");
    
  }

}
