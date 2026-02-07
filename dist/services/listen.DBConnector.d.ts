import { IDBConnector } from '../interfaces/listen.IDBConnector';
import { Pool } from 'pg';
export declare class DBConnector implements IDBConnector {
    private details;
    private initialized;
    pool: Pool | null;
    setCredentials(username: string, password: string, hostname: string, port: number, dbname: string): void;
    connectToBackend(): boolean;
    addTuple(input: Array<Array<string>>): boolean;
}
