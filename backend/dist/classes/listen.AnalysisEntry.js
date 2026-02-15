"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisEntry = void 0;
class AnalysisEntry {
    uuid;
    processed;
    convicted;
    reason;
    details;
    constructor(uuid = "none", processed = false, convicted = false, reason = "none", details = "none") {
        this.uuid = uuid;
        this.processed = processed;
        this.convicted = convicted;
        this.reason = reason;
        this.details = details;
    }
    static fromString(row) {
        return new AnalysisEntry(row['uuid'], row['processed'], row['convicted'], row['reason'], row['details']);
    }
}
exports.AnalysisEntry = AnalysisEntry;
//# sourceMappingURL=listen.AnalysisEntry.js.map