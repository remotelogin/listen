import { Injectable } from "@nestjs/common";
import { IReporter } from "src/interfaces/listen.IReporter";
import {promises as fs} from 'node:fs';
import { ReportBody } from "src/classes/listen.ReportBody";

@Injectable()
export class AbuseIPDBreporter implements IReporter {

  private apiToken: string = "";
  private credLocation: string = "";
  private recentlyReported = new Map<string, number>();
  
  constructor() {
    this.credLocation = ".credentials/api.key";
  }

  async onModuleInit() {    
    const credentials = await fs.readFile(this.credLocation, "utf8");
    
    const credentials_map = credentials.split("\n");
    this.apiToken = credentials_map[0].split(":")[1].trim();
  }
  
  async reportToAPI(report: ReportBody): Promise<boolean> {
    if (!this.apiToken) throw new Error("Missing API key");

    const now = Date.now();
    const last = this.recentlyReported.get(report.ip);
    
    //prevent spamming
    if (last && now - last < 15 * 60 * 1000) {
      return false;
    }
    this.recentlyReported.set(report.ip, now);
    
    const url = `https://api.abuseipdb.com/api/v2/report`;

    console.log(`reporting as : ${report.ip} ip, ${report.category} category, ${report.reason} comment`)
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
	"Accept": "application/json",
	"Key": this.apiToken,
	"Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
	ip: report.ip,
	categories: report.category,
	comment: report.reason,
      }),
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.log(`Failed to report IP: ${response.status} - ${text}`);
      return false;
    }
    
    const data = await response.json();
    console.log("AbuseIPDB response:", data);
    return data;
  }
  
}
