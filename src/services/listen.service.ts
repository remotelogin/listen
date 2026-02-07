import { Injectable } from '@nestjs/common';
import chokidar from 'chokidar';
import {promises as fs} from 'node:fs';
import { IFileWatcher } from 'src/interfaces/listen.IFileWatcher';
import { DBConnector } from './listen.DBConnector';

let file_buffer: String[];

@Injectable()
export class ListenService implements IFileWatcher {
  
  private filePath = '/etc/nginx/logs/access.log';
  private number_of_lines: number = 0;

  // inject database service
  constructor(private readonly db :DBConnector){ // <- worst syntax ever lmao

    db.setCredentials("","","",1337,"");
    db.connectToBackend();

  }
  // start listener when service initializes
  onModuleInit() {
    this.startListener();
  }

  setWatchFilePath(newFilePath: string): boolean {
    this.filePath = newFilePath;
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
	  let last_line: string = lines[this.number_of_lines-1];
	  
	  console.log("new request: " + last_line);
	  
	  //add to db
	  this.db.connectToBackend();
	  
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
