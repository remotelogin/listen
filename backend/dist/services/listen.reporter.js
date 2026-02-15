"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbuseIPDBreporter = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
let AbuseIPDBreporter = class AbuseIPDBreporter {
    apiToken = "";
    credLocation = "";
    recentlyReported = new Map();
    constructor() {
        this.credLocation = ".credentials/api.key";
    }
    async onModuleInit() {
        const credentials = await node_fs_1.promises.readFile(this.credLocation, "utf8");
        const credentials_map = credentials.split("\n");
        this.apiToken = credentials_map[0].split(":")[1].trim();
    }
    async reportToAPI(report) {
        if (!this.apiToken)
            throw new Error("Missing API key");
        const now = Date.now();
        const last = this.recentlyReported.get(report.ip);
        if (last && now - last < 15 * 60 * 1000) {
            return false;
        }
        this.recentlyReported.set(report.ip, now);
        const url = `https://api.abuseipdb.com/api/v2/report`;
        console.log(`reporting as : ${report.ip} ip, ${report.category} category, ${report.reason} comment`);
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
};
exports.AbuseIPDBreporter = AbuseIPDBreporter;
exports.AbuseIPDBreporter = AbuseIPDBreporter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AbuseIPDBreporter);
//# sourceMappingURL=listen.reporter.js.map