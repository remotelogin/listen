"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerKnownScanners = void 0;
const listen_AnalyzeResult_1 = require("../classes/listen.AnalyzeResult");
const listen_EConvictionResult_1 = require("../classes/listen.EConvictionResult");
const assert_1 = __importDefault(require("assert"));
class AnalyzerKnownScanners {
    db;
    KNOWN_SCRAPER_UA_SUBSTRINGS = [
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
        "headless",
        "puppeteer",
        "playwright",
        "selenium",
        "phantomjs",
        "slimerjs",
        "chromedriver",
        "geckodriver",
        "colly",
        "beautifulsoup",
        "httrack",
        "siteexplorer",
        "nutch",
        "heritrix",
        "stormcrawler",
        "ahrefs",
        "semrush",
        "mj12bot",
        "dotbot",
        "blexbot",
        "seokicks",
        "serpstat",
        "sitebulb",
        "screaming frog",
        "ccbot",
        "commoncrawl",
        "ai2bot",
        "petalbot",
        "yandexbot",
        "amazonbot",
        "facebookexternalhit",
        "twitterbot",
        "linkedinbot",
        "slackbot",
        "discordbot",
        "telegrambot"
    ];
    constructor(db) {
        this.db = db;
    }
    checkSubstring(input, arr) {
        const lowerInput = input.toLowerCase();
        return arr.some(sub => lowerInput.includes(sub.toLowerCase()));
    }
    async analyzeRecord(record) {
        let logEntry = await this.db.getNGINXLogFromUUID(record.uuid);
        (0, assert_1.default)(logEntry != null, "Could not fetch log entry!!! Database state might be corrupt!");
        if (this.checkSubstring(logEntry.h_user_agent, this.KNOWN_SCRAPER_UA_SUBSTRINGS))
            return new listen_AnalyzeResult_1.AnalyzeResult(true, listen_EConvictionResult_1.EConvictionResult.E_SCANNER, "Automated scanning with useragent: " + logEntry.h_user_agent + " and uri: " + logEntry.uri);
        else
            return new listen_AnalyzeResult_1.AnalyzeResult(false, listen_EConvictionResult_1.EConvictionResult.E_NONE, "No offense detected!");
    }
}
exports.AnalyzerKnownScanners = AnalyzerKnownScanners;
//# sourceMappingURL=listen.analyzer.knownscanners.js.map