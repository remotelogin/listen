"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerEmptyReferer = void 0;
const listen_AnalyzeResult_1 = require("../classes/listen.AnalyzeResult");
const listen_EConvictionResult_1 = require("../classes/listen.EConvictionResult");
const assert_1 = __importDefault(require("assert"));
class AnalyzerEmptyReferer {
    db;
    constructor(db) {
        this.db = db;
    }
    async analyzeRecord(record) {
        let logEntry = await this.db.getNGINXLogFromUUID(record.uuid);
        (0, assert_1.default)(logEntry != null, "Could not fetch log entry!!! Database state might be corrupt!");
        if (logEntry.h_referer == '"-"') {
            console.log(`empty referer. Will not happen to normal user...`);
            return new listen_AnalyzeResult_1.AnalyzeResult(true, listen_EConvictionResult_1.EConvictionResult.E_ABUSE, "Detected empty referer, indicating web scraping / abusive scanning with UA: " + logEntry.h_user_agent + " and uri: " + logEntry.uri);
        }
        else {
            return new listen_AnalyzeResult_1.AnalyzeResult(false, listen_EConvictionResult_1.EConvictionResult.E_NONE, "No offense detected!");
        }
    }
}
exports.AnalyzerEmptyReferer = AnalyzerEmptyReferer;
//# sourceMappingURL=listen.analyzer.emptyreferer.js.map