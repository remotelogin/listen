import { IDBConnector } from '../interfaces/listen.IDBConnector';
import { Pool } from 'pg';
import { NGINXLog } from 'src/classes/listen.NGINXLog';
export declare class DBConnector implements IDBConnector {
    private details;
    private initialized;
    pool: Pool | null;
    setCredentials(username: string, password: string, hostname: string, port: number, dbname: string): void;
    connectToBackend(): boolean;
    addTuple(input: NGINXLog): boolean;
    checkIfTableExists(pool: Pool, name: string): Promise<boolean>;
}
