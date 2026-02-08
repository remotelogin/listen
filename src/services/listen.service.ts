import { Injectable } from '@nestjs/common';
import chokidar from 'chokidar';
import {promises as fs} from 'node:fs';
import { IFileWatcher } from 'src/interfaces/listen.IFileWatcher';
import { DBConnector } from './listen.DBConnector';
import { NGINXLog } from 'src/classes/listen.NGINXLog';

@Injectable()
export class ListenService implements IFileWatcher {
  
  private filePath = '/etc/nginx/logs/access.log';
  private number_of_lines: number = 0;

  // inject database service
  constructor(private readonly db :DBConnector){ // <- worst syntax ever lmao

    //TODO: launch param? or env var
    this.initDB(".credentials/database.key");

  }

  // start listener when service initializes
  onModuleInit() {
    this.startListener();
  }

  // connect to database
  async initDB(credPath:string): Promise<void> {

    // kinda sloppy and insecure, TODO: refactor
    let credentials:string = await fs.readFile(credPath,'utf8');
    let credentials_map:Array<string> = credentials.split("\n");
    let username:string = credentials_map[0].split(":")[1];
    let password:string = credentials_map[1].split(":")[1];
    let name:string = credentials_map[2].split(":")[1];
    let host:string = credentials_map[3].split(":")[1];
    let port:number = Number(credentials_map[4].split(":")[1]);
    
    this.db.setCredentials(username,password,host,port,name);
    this.db.connectToBackend();
    
  }
  
  setWatchFilePath(newFilePath: string): boolean {
    this.filePath = newFilePath; //TODO: make return on exists
    return true;
  }
  
  startListener(): void {
    
    const watcher = chokidar.watch(this.filePath, {
      persistent: true,
      ignoreInitial: true,
      usePolling: false,
      atomic: true
    });

    const events: Array<'change' | 'add'> = ['change','add'];
    
    for (const eventType of events) {
      watcher.on(eventType, async (path) => {
	try {
	  await fs.access(path);
	  
	  let file_content:string = await fs.readFile(path, 'utf8');
	  let lines: string[] = file_content.split(/\r?\n/);
	  this.number_of_lines = lines.length-1;
	  let new_entry: string = lines[this.number_of_lines-1];
	  let new_entry_parts: Array<string> = new_entry.split(`\\x1f`);

	  console.log(`number of nginx fields: ${new_entry_parts.length}`);

	  let new_db_tuple: NGINXLog = new NGINXLog();
	  
	  for(let entry_part of new_entry_parts) {

	    let idx = entry_part.indexOf("=");
	    if (idx === -1) {
	      console.log("COULD NOT FIND FIELD IN OUTPUT TUPLE!!! SKIPPING!!!");
	      continue;}
	    
	    let key:string = entry_part.split("=")[0];
	    let val:string = entry_part.split("=")[1];

	    if(key in new_db_tuple) {
	      (new_db_tuple as any)[key] = val;
	    }
	    
	    console.log(`foundn new field: ${key}, ${val}, and loaded into output tuple!`);
	    
	  }
	  
	  console.log("adding to db...");
	  //this.db.addTuple()
	  
	} catch (err) {
	  if (err.code === 'ENOENT') {
	    console.warn(`file ${path} was deleted before reading`);
	  } else {
	    console.error(`error reading ${path}:`, err.message);
	  }
	}
      });
    };
    
    watcher.on('error', (error) => {
      console.error('Watcher error:', error);
    });
    
    console.log(`Watching ${this.filePath} for updates...`);
    
  }
  
}
