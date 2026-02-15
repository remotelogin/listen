import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { IAnalyzeImplementation } from "src/interfaces/listen.IAnalyzeImplementation";
import { DBConnector } from "./listen.DBConnector";
export declare class AnalyzerService implements OnModuleInit, OnModuleDestroy {
    readonly db: DBConnector;
    private readonly fetchSqlQuery;
    private readonly patchSqlQuery;
    private timer?;
    private timeout;
    private analyzers;
    constructor(db: DBConnector);
    setAnalyzeIntervalS(newSeconds: number): void;
    registerAnalyzer(analyzer: IAnalyzeImplementation): void;
    getAllAnalyzers(): IAnalyzeImplementation[];
    onModuleInit(): void;
    onModuleDestroy(): void;
    patchAnalysisEntry(uuid: string, processed: boolean, convicted: boolean, reason: string | null, details: string | null): Promise<void>;
    private run;
}
