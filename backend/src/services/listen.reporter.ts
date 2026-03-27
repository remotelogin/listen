import { Injectable } from "@nestjs/common";
import { IReporter } from "src/interfaces/listen.IReporter";
import {promises as fs} from 'node:fs';
import { ReportBody } from "src/classes/listen.ReportBody";
import LRU from 'lru-cache';

@Injectable()
export class AbuseIPDBreporter implements IReporter {

  private apiToken: string = "";
  private credLocation: string = "";

  private recentlyReported = new LRU<string, number>({
    max: 10000,
    ttl: 15 * 60 * 1000
  });
  
  constructor() {
    this.credLocation = ".credentials/api.key";
  }

  async onModuleInit() {    
    const credentials = await fs.readFile(this.credLocation, "utf8");
    
    const credentials_map = credentials.split("\n");
    this.apiToken = credentials_map[0].split(":")[1].trim();
  }
  
  async reportToAPI(report: ReportBody): Promise<Response> {
    if (!this.apiToken) throw new Error("Missing API key");

    const now = Date.now();
    const last = this.recentlyReported.get(report.ip);
    
    //prevent spamming
    if (last && now - last < 15 * 60 * 1000) {
      return new Response();
    }
    this.recentlyReported.set(report.ip, now);
    
    const url = `https://api.abuseipdb.com/api/v2/report`;

    console.log(`reporting as : ${report.ip} ip, ${report.category} category, ${report.reason} comment`)
    
    const response: Response = await fetch(url, {
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
      return new Response();
    }
    
    const data = await response.json();
    console.log("AbuseIPDB response:", data);
    if(response.status == 200)
      return response;
    else
      return new Response();
  }
  
}
