export declare class AnalysisEntry {
    uuid: string;
    processed: boolean;
    convicted: boolean;
    reason: string;
    details: string;
    constructor(uuid?: string, processed?: boolean, convicted?: boolean, reason?: string, details?: string);
    static fromString(row: string): AnalysisEntry;
}
