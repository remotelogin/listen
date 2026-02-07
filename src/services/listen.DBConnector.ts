import { Injectable } from '@nestjs/common';
import { IDBConnector } from '../interfaces/listen.IDBConnector';
import { DBDetails } from '../interfaces/listen.DBDetails';
import { Pool } from 'pg';
import assert from 'assert';

@Injectable()
export class DBConnector implements IDBConnector {

  private details: DBDetails = {CONNECTION_DB_NAME:"",CONNECTION_HOST:"",CONNECTION_PASSWORD:"",CONNECTION_PORT:0,CONNECTION_USER:""};
  private initialized: boolean = false;
  public pool: Pool | null = null;
  
  
  setCredentials(username:string, password:string, hostname:string, port:number, dbname: string) : void {    
    this.details.CONNECTION_DB_NAME = dbname.toString();
    this.details.CONNECTION_PORT = port;
    this.details.CONNECTION_HOST = hostname.toString();
    this.details.CONNECTION_PASSWORD = password.toString();
    this.details.CONNECTION_USER = username.toString();   
    this.initialized = true;
  };
  
  connectToBackend(): boolean {

    if(!this.initialized)
      return false;
    
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });

    const  verifyConnection = async (): Promise<void> => {
      try {      
	assert(this.pool != null);
	const client = await this.pool.connect();
	console.log('Connected to PostgreSQL database');
	client.release();
      } catch (error) {
	console.error('error connecting to the database:', error);
      }
    }
    verifyConnection();
    
    return true;
    
  };
  
  addTuple(input:Array<Array<string>> ): boolean {

    if(input == null)
      return false;
    
    return true;

  };


}
