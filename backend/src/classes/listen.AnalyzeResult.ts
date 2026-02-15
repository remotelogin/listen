import { EConvictionResult } from "./listen.EConvictionResult";

export class AnalyzeResult {

  convicted:boolean = false;
  reason:EConvictionResult = EConvictionResult.E_NONE;
  notes:string ="";

}
