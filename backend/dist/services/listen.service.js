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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenService = void 0;
const common_1 = require("@nestjs/common");
const chokidar_1 = __importDefault(require("chokidar"));
const node_fs_1 = require("node:fs");
const listen_DBConnector_1 = require("./listen.DBConnector");
const listen_NGINXLog_1 = require("../classes/listen.NGINXLog");
let ListenService = class ListenService {
    db;
    filePath = '/etc/nginx/logs/access.log';
    number_of_lines = 0;
    constructor(db) {
        this.db = db;
        this.initDB(".credentials/database.key");
    }
    onModuleInit() {
        this.startListener();
    }
    async initDB(credPath) {
        let credentials = await node_fs_1.promises.readFile(credPath, 'utf8');
        let credentials_map = credentials.split("\n");
        let username = credentials_map[0].split(":")[1];
        let password = credentials_map[1].split(":")[1];
        let name = credentials_map[2].split(":")[1];
        let host = credentials_map[3].split(":")[1];
        let port = Number(credentials_map[4].split(":")[1]);
        this.db.setCredentials(username, password, host, port, name);
        this.db.connectToBackend();
    }
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
                    let new_entry = lines[this.number_of_lines - 1];
                    let new_entry_parts = new_entry.split(`\\x1f`);
                    let new_db_tuple = new listen_NGINXLog_1.NGINXLog();
                    for (let entry_part of new_entry_parts) {
                        if (entry_part == "")
                            continue;
                        let idx = entry_part.indexOf("=");
                        if (idx === -1) {
                            console.log("COULD NOT FIND FIELD IN OUTPUT TUPLE!!! SKIPPING FIELD WITH NAME:" + entry_part);
                            continue;
                        }
                        let key = entry_part.split("=")[0];
                        let val = entry_part.split("=")[1];
                        if (key in new_db_tuple) {
                            new_db_tuple[key] = val;
                        }
                    }
                    console.log("adding new request to db...");
                    this.db.addTuple(new_db_tuple);
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
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [listen_DBConnector_1.DBConnector])
], ListenService);
//# sourceMappingURL=listen.service.js.map