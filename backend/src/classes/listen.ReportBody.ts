export class ReportBody {

  constructor(newip:string, newreason:string, newcategory:string) {

    this.ip = newip;
    this.reason = newreason;
    this.category = newcategory;
    
  }

  
  ip:string = "";
  reason:string = "";
  category:string = "";

}
