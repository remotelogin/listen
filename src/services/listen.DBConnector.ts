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

  //kms xd
  COLS = [
    "ts","msec","pid","conn","conn_reqs",
    "remote_addr","realip","remote_port","remote_user",
    "scheme","request_method","request","request_uri","uri","args","is_args","query_string",
    "host","server_name","server_addr","server_port","server_protocol",
    "status","body_bytes_sent","bytes_sent","request_length","request_time",
    "upstream_addr","upstream_status","upstream_connect_time","upstream_header_time","upstream_response_time","upstream_cache_status",
    "sent_http_content_type","sent_http_content_length","sent_http_location",
    "gzip_ratio",
    "h_user_agent","h_referer","h_accept","h_accept_language","h_accept_encoding","h_cache_control","h_range","h_if_modified_since","h_if_none_match",
    "h_x_forwarded_for","h_x_forwarded_proto","h_x_forwarded_host","h_x_request_id","h_x_real_ip",
    "ssl_protocol","ssl_cipher","ssl_server_name","ssl_session_reused","ssl_client_verify","ssl_client_s_dn","ssl_client_i_dn",
  ] as const;
  
  setCredentials(username:string, password:string, hostname:string, port:number, dbname: string) : void {    
    this.details.CONNECTION_DB_NAME = dbname.toString();
    this.details.CONNECTION_PORT = port;
    this.details.CONNECTION_HOST = hostname.toString();
    this.details.CONNECTION_PASSWORD = password.toString();
    this.details.CONNECTION_USER = username.toString();   
    this.initialized = true;
    console.log("set credentials!");
  };

  // gheto helper to get sql viable format
  nullIfDashOrEmpty(v: unknown): any {
    if (v === undefined || v === null) return null;
    if (typeof v === "string") {
      const t = v.trim();
      if (t === "" || t === "-") return null;
      return t;
    }
    return v;
  }
  
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
  
  async addTuple(log:NGINXLog ): Promise<boolean> {

    assert(log != null, "must provide a log entry!");
    assert(this.initialized, "Credentials for logging in must be set!");
    assert(this.pool != null, "Pool not initialized!!");
    const exists = await this.checkIfTableExists(this.pool, "nginxlogs");
    assert(exists, "nginxlogs table not existing!!!");
    
    console.log(`connected to: ${this.details.CONNECTION_USER},${this.details.CONNECTION_HOST},${this.details.CONNECTION_DB_NAME},${this.details.CONNECTION_PORT},}`);
    
    let colsSql = this.COLS.join(",");
    let placeholders = this.COLS.map((_, i) => `$${i + 1}`).join(","); //swag sql injection bypass thx stackoverflow
    
    type Col =typeof this.COLS[number];    
    let values = this.COLS.map((c: Col) => this.nullIfDashOrEmpty((log as any)[c]));
    
    await this.pool.query(
      `INSERT INTO public."nginxlogs" (${colsSql}) VALUES (${placeholders})`,
      values
    );
    
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
