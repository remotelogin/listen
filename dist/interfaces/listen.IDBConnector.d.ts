export interface IDBConnector {
    setCredentials(username: string, password: string, hostname: string, port: number, dbname: string): void;
    connectToBackend(): boolean;
    addTuple(input: Array<Array<string>>): boolean;
}
