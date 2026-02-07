import { IFileWatcher } from 'src/interfaces/listen.IFileWatcher';
export declare class ListenService implements IFileWatcher {
    private filePath;
    private number_of_lines;
    setWatchFilePath(newFilePath: string): boolean;
    startListener(): void;
}
export declare class DBConnector {
    testConnector(): string;
}
