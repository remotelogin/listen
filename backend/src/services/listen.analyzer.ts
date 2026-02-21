import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { IAnalyzeImplementation } from "src/interfaces/listen.IAnalyzeImplementation";
import { DBConnector } from "./listen.DBConnector";
import { AnalysisEntry } from "src/classes/listen.AnalysisEntry";
import { AnalyzeResult } from "src/classes/listen.AnalyzeResult";
import { EConvictionResult } from "src/classes/listen.EConvictionResult";
import { AbuseIPDBreporter } from "./listen.reporter";
import { ReportBody } from "src/classes/listen.ReportBody";
import { NGINXLog } from "src/classes/listen.NGINXLog";
import assert from "assert";

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
  
  private timeout:number = 1000;

  private running: boolean = true;
  
  private analyzers: IAnalyzeImplementation[] = [];

  constructor(public readonly db :DBConnector, private readonly abuseReporter: AbuseIPDBreporter) {}

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
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
    this.loop();
  }

  onModuleDestroy() {
    this.running = false;
  }
  
  private async loop() {
    while (this.running) {
      try {
	await this.run();
      } catch (err) {
	console.error("Analyzer loop error:", err);
      }
      await this.sleep(this.timeout);
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
	let result: AnalyzeResult = await analyzer.analyzeRecord(record);

	if(result.convicted) {
	  let stringReason: string = "";
	  switch(result.reason){
	    case EConvictionResult.E_ABUSE:{ stringReason = "23"; break; }
	    case EConvictionResult.E_DOS:{ stringReason = "4"; break; }
	    case EConvictionResult.E_EXPLOIT:{ stringReason = "20"; break; }
	    case EConvictionResult.E_NONE:{ stringReason = "None"; break; }
	    case EConvictionResult.E_SCANNER:{ stringReason = "19"; break; }
	    case EConvictionResult.E_SCRAPER:{ stringReason = "19"; break; }
	  }
	  console.log("Detected abuse: " + record.uuid + "reporting...");

	  let logEntry:NGINXLog|null = await this.db.getNGINXLogFromUUID(record.uuid);
	  assert(logEntry!=null, "Could not fetch log entry!!! Database state might be corrupt!");
	  
	  if(await this.abuseReporter.reportToAPI(new ReportBody(logEntry.realip,result.notes,stringReason))) {
	    await this.patchAnalysisEntry(record.uuid,true,true,stringReason,result.notes);//processed and reported detected as bot
	    await this.sleep(500);
	    console.log("reported a detected bot. Sleeping 500ms to prevent spam.")
	    break;
	  } else {
	    console.log("reported a detected bot but API returned non success status code... retrying on next interval...")
	    break;
	  };
	} else {
	  // simply update processed
	  await this.patchAnalysisEntry(record.uuid,true,false,"legitimate request","legitimate request");
	}
	
      }
    }
  }
}
