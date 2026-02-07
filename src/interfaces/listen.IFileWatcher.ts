export interface IFileWatcher {
  
  startListener() : void;
  
  setWatchFilePath(newFilePath: string) : boolean ;
  
}
