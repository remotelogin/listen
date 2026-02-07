import { IFileWatcher } from 'src/interfaces/listen.IFileWatcher';
import { DBConnector } from './listen.DBConnector';
export declare class ListenService implements IFileWatcher {
    private readonly db;
    private filePath;
    private number_of_lines;
    constructor(db: DBConnector);
    onModuleInit(): void;
    setWatchFilePath(newFilePath: string): boolean;
    startListener(): void;
}
