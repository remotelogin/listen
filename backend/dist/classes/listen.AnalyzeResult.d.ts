import { EConvictionResult } from "./listen.EConvictionResult";
export declare class AnalyzeResult {
    constructor(newconvicted: boolean, newreason: EConvictionResult, newnotes: string);
    convicted: boolean;
    reason: EConvictionResult;
    notes: string;
}
