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
exports.DBConnector = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const assert_1 = __importDefault(require("assert"));
let DBConnector = class DBConnector {
    details = { CONNECTION_DB_NAME: "", CONNECTION_HOST: "", CONNECTION_PASSWORD: "", CONNECTION_PORT: 0, CONNECTION_USER: "" };
    initialized = false;
    pool = null;
    setCredentials(username, password, hostname, port, dbname) {
        this.details.CONNECTION_DB_NAME = dbname.toString();
        this.details.CONNECTION_PORT = port;
        this.details.CONNECTION_HOST = hostname.toString();
        this.details.CONNECTION_PASSWORD = password.toString();
        this.details.CONNECTION_USER = username.toString();
        this.initialized = true;
        console.log("set credentials!");
    }
    ;
    connectToBackend() {
        if (!this.initialized)
            return false;
        this.pool = new pg_1.Pool({
            user: this.details.CONNECTION_USER,
            host: this.details.CONNECTION_HOST,
            database: this.details.CONNECTION_DB_NAME,
            password: this.details.CONNECTION_PASSWORD,
            port: this.details.CONNECTION_PORT,
        });
        const verifyConnection = async () => {
            try {
                (0, assert_1.default)(this.pool != null);
                const client = await this.pool.connect();
                console.log('Connected to PostgreSQL database');
                client.release();
            }
            catch (error) {
                console.error('error connecting to the database:', error);
            }
        };
        verifyConnection();
        return true;
    }
    ;
    addTuple(input) {
        (0, assert_1.default)(this.pool != null);
        this.checkIfTableExists(this.pool, "nginxLogs");
        if (input == null)
            return false;
        return true;
    }
    ;
    async checkIfTableExists(pool, name) {
        const r = await pool.query(`SELECT to_regclass($1) IS NOT NULL AS exists`, [`public.${name}`]);
        return r.rows[0].exists === true;
    }
};
exports.DBConnector = DBConnector;
exports.DBConnector = DBConnector = __decorate([
    (0, common_1.Injectable)()
], DBConnector);
//# sourceMappingURL=listen.DBConnector.js.map