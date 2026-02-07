"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnector = exports.ListenService = void 0;
const common_1 = require("@nestjs/common");
const chokidar_1 = __importDefault(require("chokidar"));
const node_fs_1 = require("node:fs");
let file_buffer;
let ListenService = class ListenService {
    filePath = '/etc/nginx/logs/access.log';
    number_of_lines = 0;
    setWatchFilePath(newFilePath) {
        this.filePath = newFilePath;
        return true;
    }
    startListener() {
        const watcher = chokidar_1.default.watch(this.filePath, {
            persistent: true,
            ignoreInitial: true,
            usePolling: false,
            atomic: true
        });
        const events = ['change', 'add'];
        for (const eventType of events) {
            watcher.on(eventType, async (path) => {
                try {
                    await node_fs_1.promises.access(path);
                    let file_content = await node_fs_1.promises.readFile(path, 'utf8');
                    let lines = file_content.split(/\r?\n/);
                    this.number_of_lines = lines.length - 1;
                    let last_line = lines[this.number_of_lines - 1];
                    console.log("new request: " + last_line);
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        console.warn(`file ${path} was deleted before reading`);
                    }
                    else {
                        console.error(`error reading ${path}:`, err.message);
                    }
                }
            });
        }
        ;
        watcher.on('error', (error) => {
            console.error('Watcher error:', error);
        });
        console.log(`Watching ${this.filePath} for updates...`);
    }
};
exports.ListenService = ListenService;
exports.ListenService = ListenService = __decorate([
    (0, common_1.Injectable)()
], ListenService);
let DBConnector = class DBConnector {
    testConnector() {
        return "hi";
    }
};
exports.DBConnector = DBConnector;
exports.DBConnector = DBConnector = __decorate([
    (0, common_1.Injectable)()
], DBConnector);
//# sourceMappingURL=listen.service.js.map