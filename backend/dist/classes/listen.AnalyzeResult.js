"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzeResult = void 0;
const listen_EConvictionResult_1 = require("./listen.EConvictionResult");
class AnalyzeResult {
    constructor(newconvicted, newreason, newnotes) {
        this.convicted = newconvicted;
        this.reason = newreason;
        this.notes = newnotes;
    }
    convicted = false;
    reason = listen_EConvictionResult_1.EConvictionResult.E_NONE;
    notes = "";
}
exports.AnalyzeResult = AnalyzeResult;
//# sourceMappingURL=listen.AnalyzeResult.js.map