import { NGINXLog } from 'src/classes/listen.NGINXLog';
import { IAnalyzeImplementation } from '../interfaces/listen.IAnalyzeImplementation';
import { DBConnector } from 'src/services/listen.DBConnector';
import { AnalyzeResult } from 'src/classes/listen.AnalyzeResult';
import { EConvictionResult } from 'src/classes/listen.EConvictionResult';
import { AnalysisEntry } from 'src/classes/listen.AnalysisEntry';
import assert from 'assert';

export class AnalyzerKnownScanners implements IAnalyzeImplementation {

   private readonly KNOWN_SCRAPER_UA_SUBSTRINGS: readonly string[] = [
    // Generic / obvious
    "bot",
    "crawler",
    "spider",
    "scrapy",
    "curl",
    "wget",
    "httpclient",
    "python-requests",
    "urllib",
    "aiohttp",
    "libwww",
    "lwp",
    "mechanize",
    "http.rb",
    "go-http-client",
    "java/",
    "okhttp",
    "restsharp",
    
    // Headless / automation
    "headless",
    "puppeteer",
    "playwright",
    "selenium",
    "phantomjs",
    "slimerjs",
    "chromedriver",
    "geckodriver",
    
    // Scraping frameworks
    "colly",
    "beautifulsoup",
    "httrack",
    "siteexplorer",
    "nutch",
    "heritrix",
    "stormcrawler",
    
    // SEO & commercial crawlers
    "ahrefs",
    "semrush",
    "mj12bot",
    "dotbot",
    "blexbot",
    "seokicks",
    "serpstat",
    "sitebulb",
    "screaming frog",
    
    // AI / dataset crawlers
    "ccbot",
    "commoncrawl",
    "ai2bot",
    "petalbot",
    "yandexbot",
    
    // Infra / preview bots
    "amazonbot",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "slackbot",
    "discordbot",
    "telegrambot"
  ] as const;
  
  constructor(public readonly db: DBConnector) {}

  private checkSubstring(input: string, arr: readonly string[]): boolean {
    const lowerInput = input.toLowerCase();
    return arr.some(sub => lowerInput.includes(sub.toLowerCase()));
  }
  
  async analyzeRecord(record:AnalysisEntry): Promise<AnalyzeResult> {

    let logEntry:NGINXLog|null = await this.db.getNGINXLogFromUUID(record.uuid);
    assert(logEntry!=null, "Could not fetch log entry!!! Database state might be corrupt!");
    
    if(this.checkSubstring(logEntry.h_user_agent, this.KNOWN_SCRAPER_UA_SUBSTRINGS))
      return new AnalyzeResult(true,EConvictionResult.E_SCANNER,"Automated scanning with known malicious useragent: "+ logEntry.h_user_agent+" and uri: " + logEntry.uri);
    else
      return new AnalyzeResult(false,EConvictionResult.E_NONE, "No offense detected!");
    
  }

}
