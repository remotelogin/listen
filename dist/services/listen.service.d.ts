import { IFileWatcher } from 'src/interfaces/listen.IFileWatcher';
import { DBConnector } from './listen.DBConnector';
export declare class ListenService implements IFileWatcher {
    readonly db: DBConnector;
    private filePath;
    private number_of_lines;
    constructor(db: DBConnector);
    onModuleInit(): void;
    initDB(credPath: string): Promise<void>;
    setWatchFilePath(newFilePath: string): boolean;
    startListener(): void;
}
