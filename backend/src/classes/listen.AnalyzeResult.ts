import { EConvictionResult } from "./listen.EConvictionResult";

export class AnalyzeResult {

  constructor(newconvicted:boolean, newreason:EConvictionResult, newnotes:string) {
    this.convicted=newconvicted;
    this.reason=newreason;
    this.notes=newnotes;
  }
  
  convicted:boolean = false;
  reason:EConvictionResult = EConvictionResult.E_NONE;
  notes:string ="";

}
