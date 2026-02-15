import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { IAnalyzeImplementation } from "src/interfaces/listen.IAnalyzeImplementation";
import { DBConnector } from "./listen.DBConnector";
import { AnalysisEntry } from "src/classes/listen.AnalysisEntry";
import { AnalyzeResult } from "src/classes/listen.AnalyzeResult";
import { EConvictionResult } from "src/classes/listen.EConvictionResult";

@Injectable()
export class AnalyzerService implements OnModuleInit, OnModuleDestroy {
  
  private readonly fetchSqlQuery =
    `SELECT
uuid        AS "uuid",
processed   AS "processed",
convicted   AS "convicted",
reason      AS "reason",
details     AS "details",
created_at  AS "crated_at"
FROM analysis_log
WHERE processed IS DISTINCT FROM TRUE
ORDER BY created_at DESC
LIMIT 100;
`;

  private readonly patchSqlQuery =
    `UPDATE analysis_log
SET
processed  = $2,
convicted  = $3,
reason     = $4,
details    = $5
WHERE uuid = $1;
`;
  
  private timer?: NodeJS.Timeout;
  private timeout:number = 1000;

  private analyzers: IAnalyzeImplementation[] = [];

  constructor(public readonly db :DBConnector) {}
  
  public setAnalyzeIntervalS(newSeconds:number) {
    this.timeout = newSeconds*1000;
  }

  public registerAnalyzer(analyzer: IAnalyzeImplementation) {
    this.analyzers.push(analyzer);
  }

  public getAllAnalyzers() {
    return this.analyzers;
  }
  
  onModuleInit() {
    this.timer = setInterval(() => {
      this.run();
    }, this.timeout);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  async patchAnalysisEntry(
    uuid: string,
    processed: boolean,
    convicted: boolean,
    reason: string | null,
    details: string | null,
  ): Promise<void> {
    
    await this.db.runSQLParameterizedQuery(this.patchSqlQuery, [
      uuid,
      processed,
      convicted,
      reason,
      details,
    ]);
  }
  
  
  private async run() {

    let jsonUnprocessedTuples = await this.db.runSQLQuery(this.fetchSqlQuery);
    let newRecords: AnalysisEntry[] = [];
    newRecords = jsonUnprocessedTuples.map(AnalysisEntry.fromString);

    if(this.analyzers.length <= 0) {
      console.log("There are no analyzers registered! Skipping processing...");
      return;
    }
    
    console.log(`found ${newRecords.length} records. Running on ${this.analyzers.length} analyzers!`);
    for(let record of newRecords ) {
      for(let analyzer of this.analyzers) {

	console.log(`analyzing record with uuid: ${record.uuid}`);
	
	let result: AnalyzeResult = await analyzer.analyzeRecord(record);

	if(result.convicted) {
	  // TODO: treat reporting to api
	  let stringReason: string = "";
	  switch(result.reason){
	    case EConvictionResult.E_ABUSE:{ stringReason = "Abuse"; break; }
	    case EConvictionResult.E_DOS:{ stringReason = "DDOS attempt"; break; }
	    case EConvictionResult.E_EXPLOIT:{ stringReason = "Exploitation"; break; }
	    case EConvictionResult.E_NONE:{ stringReason = "None"; break; }
	    case EConvictionResult.E_SCANNER:{ stringReason = "Unauthorized scanning"; break; }
	    case EConvictionResult.E_SCRAPER:{ stringReason = "Unauthorized webscraper"; break; }
	  }
	  this.patchAnalysisEntry(record.uuid,true,true,stringReason,result.notes);
	  console.log("Detected abuse: " + record.uuid);
	} else {
	  // simply update processed
	  this.patchAnalysisEntry(record.uuid,true,false,"none","none");
	  console.log("Packet looks normal: " + record.uuid);
	}
	
      }
    }
  }
}
