import { Injectable } from '@nestjs/common';
import chokidar from 'chokidar';

let file_buffer:String[];

@Injectable()
export class AppService {
  
  getHello(): string {
    return 'Hello World!';
  }

  checkForUpdate(): string {

    const watcher = chokidar.watch("/var/www/gamma.pm", {
      persistent:true,
      awaitWriteFinish: true,
      atomic: true,
    }).on('all',(event,path)=>{

      console.log("file changed!")
      
    })
    
    return ""
  }
  
}
