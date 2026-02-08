import { Injectable } from '@nestjs/common';
import { IDBConnector } from '../interfaces/listen.IDBConnector';
import { DBDetails } from '../interfaces/listen.DBDetails';
import { Pool } from 'pg';
import assert from 'assert';
import { NGINXLog } from 'src/classes/listen.NGINXLog';

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
    console.log("set credentials!");
  };
  
  connectToBackend(): boolean {

    if(!this.initialized)
      return false;
    
    this.pool = new Pool({
      user: this.details.CONNECTION_USER,
      host: this.details.CONNECTION_HOST,
      database: this.details.CONNECTION_DB_NAME,
      password: this.details.CONNECTION_PASSWORD,
      port: this.details.CONNECTION_PORT,
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
  
  addTuple(input:NGINXLog ): boolean {

    assert(this.pool != null);
    this.checkIfTableExists(this.pool,"nginxLogs")

    
    
    if(input == null)
      return false;
    
    return true;

  };

  async checkIfTableExists(pool:Pool, name:string): Promise<boolean> {

    const r = await pool.query(
      `SELECT to_regclass($1) IS NOT NULL AS exists`,
      [`public.${name}`]
    );
    return r.rows[0].exists === true;
    
  }

}
