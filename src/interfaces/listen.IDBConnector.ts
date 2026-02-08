import { Pool } from "pg";
import { NGINXLog } from "../classes/listen.NGINXLog";

export interface IDBConnector {

  setCredentials(username:string, password:string, hostname:string, port:number, dbname: string) : void;
  
  connectToBackend(): boolean;

  addTuple( input: NGINXLog ): boolean;

  checkIfTableExists(pool:Pool, name:string): Promise<boolean>;
  
}
