export class AnalysisEntry {

  constructor(public uuid:string = "none",
	      public processed:boolean = false,
	      public convicted:boolean = false,
	      public reason:string = "none",
	      public details:string = "none",) {}
  
  static fromString(row: string) {    
    return new AnalysisEntry(row['uuid'],
			     row['processed'],
			     row['convicted'],
			     row['reason'],
			     row['details']);}
  
}
