"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerService = void 0;
const common_1 = require("@nestjs/common");
const listen_DBConnector_1 = require("./listen.DBConnector");
const listen_AnalysisEntry_1 = require("../classes/listen.AnalysisEntry");
const listen_EConvictionResult_1 = require("../classes/listen.EConvictionResult");
const listen_reporter_1 = require("./listen.reporter");
const listen_ReportBody_1 = require("../classes/listen.ReportBody");
const assert_1 = __importDefault(require("assert"));
let AnalyzerService = class AnalyzerService {
    db;
    abuseReporter;
    fetchSqlQuery = `SELECT
uuid        AS "uuid",
processed   AS "processed",
convicted   AS "convicted",
reason      AS "reason",
details     AS "details",
created_at  AS "created_at"
FROM analysis_log
WHERE processed IS DISTINCT FROM TRUE
ORDER BY created_at DESC
LIMIT 100;
`;
    patchSqlQuery = `UPDATE analysis_log
SET
processed  = $2,
convicted  = $3,
reason     = $4,
details    = $5
WHERE uuid = $1;
`;
    timeout = 1000;
    running = true;
    analyzers = [];
    constructor(db, abuseReporter) {
        this.db = db;
        this.abuseReporter = abuseReporter;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setAnalyzeIntervalS(newSeconds) {
        this.timeout = newSeconds * 1000;
    }
    registerAnalyzer(analyzer) {
        this.analyzers.push(analyzer);
    }
    getAllAnalyzers() {
        return this.analyzers;
    }
    onModuleInit() {
        this.loop();
    }
    onModuleDestroy() {
        this.running = false;
    }
    async loop() {
        while (this.running) {
            try {
                await this.run();
            }
            catch (err) {
                console.error("Analyzer loop error:", err);
            }
            await this.sleep(this.timeout);
        }
    }
    async patchAnalysisEntry(uuid, processed, convicted, reason, details) {
        await this.db.runSQLParameterizedQuery(this.patchSqlQuery, [
            uuid,
            processed,
            convicted,
            reason,
            details,
        ]);
    }
    async run() {
        let jsonUnprocessedTuples = await this.db.runSQLQuery(this.fetchSqlQuery);
        let newRecords = [];
        newRecords = jsonUnprocessedTuples.map(listen_AnalysisEntry_1.AnalysisEntry.fromString);
        if (this.analyzers.length <= 0) {
            console.log("There are no analyzers registered! Skipping processing...");
            return;
        }
        console.log(`found ${newRecords.length} records. Running on ${this.analyzers.length} analyzers!`);
        for (let record of newRecords) {
            let finalConviction = false;
            for (let analyzer of this.analyzers) {
                if (finalConviction)
                    break;
                let result = await analyzer.analyzeRecord(record);
                if (result.convicted) {
                    let stringReason = "";
                    switch (result.reason) {
                        case listen_EConvictionResult_1.EConvictionResult.E_ABUSE: {
                            stringReason = "23";
                            break;
                        }
                        case listen_EConvictionResult_1.EConvictionResult.E_DOS: {
                            stringReason = "4";
                            break;
                        }
                        case listen_EConvictionResult_1.EConvictionResult.E_EXPLOIT: {
                            stringReason = "20";
                            break;
                        }
                        case listen_EConvictionResult_1.EConvictionResult.E_NONE: {
                            stringReason = "None";
                            break;
                        }
                        case listen_EConvictionResult_1.EConvictionResult.E_SCANNER: {
                            stringReason = "19";
                            break;
                        }
                        case listen_EConvictionResult_1.EConvictionResult.E_SCRAPER: {
                            stringReason = "19";
                            break;
                        }
                    }
                    console.log("Detected abuse: " + record.uuid + "reporting...");
                    let logEntry = await this.db.getNGINXLogFromUUID(record.uuid);
                    (0, assert_1.default)(logEntry != null, "Could not fetch log entry!!! Database state might be corrupt!");
                    finalConviction = true;
                    await this.sleep(500);
                    let apiResponse = (await this.abuseReporter.reportToAPI(new listen_ReportBody_1.ReportBody(logEntry.realip, result.notes, stringReason)));
                    if (apiResponse.status == 200) {
                        await this.patchAnalysisEntry(record.uuid, true, true, stringReason, result.notes);
                        console.log("reported a detected bot successfully. Sleeping 500ms to prevent spam.");
                        break;
                    }
                    else {
                        console.log("reported a detected bot but API returned non success status code..." + apiResponse.status + "and response: " + apiResponse.body);
                        break;
                    }
                    ;
                }
            }
            if (!finalConviction) {
                await this.patchAnalysisEntry(record.uuid, true, false, "legitimate request", "legitimate request");
            }
        }
    }
};
exports.AnalyzerService = AnalyzerService;
exports.AnalyzerService = AnalyzerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [listen_DBConnector_1.DBConnector, listen_reporter_1.AbuseIPDBreporter])
], AnalyzerService);
//# sourceMappingURL=listen.analyzer.js.map