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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerService = void 0;
const common_1 = require("@nestjs/common");
const listen_DBConnector_1 = require("./listen.DBConnector");
const listen_AnalysisEntry_1 = require("../classes/listen.AnalysisEntry");
let AnalyzerService = class AnalyzerService {
    db;
    fetchSqlQuery = `SELECT
uuid        AS "Internal ID",
processed   AS "Processed",
convicted   AS "Convicted",
reason      AS "Reason",
details     AS "Details",
created_at  AS "Created At"
FROM analysis_log
WHERE processed IS DISTINCT FROM TRUE
ORDER BY created_at DESC
LIMIT 5;
`;
    patchSqlQuery = `UPDATE analysis_log
SET
processed  = $2,
convicted  = $3,
reason     = $4,
details    = $5
WHERE uuid = $1;
`;
    timer;
    timeout = 1000;
    analyzers = [];
    constructor(db) {
        this.db = db;
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
        this.timer = setInterval(() => {
            this.run();
        }, this.timeout);
    }
    onModuleDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
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
            for (let analyzer of this.analyzers) {
                let result = analyzer.analyzeRecord(record);
                if (result.convicted) {
                }
                else {
                    this.patchAnalysisEntry(record.uuid, true, false, "none", "none");
                }
            }
        }
    }
};
exports.AnalyzerService = AnalyzerService;
exports.AnalyzerService = AnalyzerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [listen_DBConnector_1.DBConnector])
], AnalyzerService);
//# sourceMappingURL=listen.analyzer.js.map