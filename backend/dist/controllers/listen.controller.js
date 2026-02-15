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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenController = void 0;
const common_1 = require("@nestjs/common");
const listen_service_1 = require("../services/listen.service");
const listen_analyzer_1 = require("../services/listen.analyzer");
let ListenController = class ListenController {
    listenService;
    analyzerService;
    constructor(listenService, analyzerService) {
        this.listenService = listenService;
        this.analyzerService = analyzerService;
        this.listenService.setWatchFilePath("/etc/nginx/logs/access.log");
        this.analyzerService.setAnalyzeIntervalS(2);
    }
    accessLog() {
        return this.listenService.db.runSQLQuery("SELECT * FROM nginxlogs");
    }
    accessLogCount() {
        return this.listenService.db.runSQLQuery("SELECT COUNT(*) AS total_entries FROM nginxlogs;");
    }
    runCustomSQL(query) {
        return this.listenService.db.runSQLQuery(query);
    }
};
exports.ListenController = ListenController;
__decorate([
    (0, common_1.Get)("/logs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ListenController.prototype, "accessLog", null);
__decorate([
    (0, common_1.Get)("/logs/count"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ListenController.prototype, "accessLogCount", null);
__decorate([
    (0, common_1.Get)("/logs/custom"),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], ListenController.prototype, "runCustomSQL", null);
exports.ListenController = ListenController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [listen_service_1.ListenService, listen_analyzer_1.AnalyzerService])
], ListenController);
//# sourceMappingURL=listen.controller.js.map