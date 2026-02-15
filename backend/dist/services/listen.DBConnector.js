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
    COLS = [
        "ts", "msec", "pid", "conn", "conn_reqs",
        "remote_addr", "realip", "remote_port", "remote_user",
        "scheme", "request_method", "request", "request_uri", "uri", "args", "is_args", "query_string",
        "host", "server_name", "server_addr", "server_port", "server_protocol",
        "status", "body_bytes_sent", "bytes_sent", "request_length", "request_time",
        "upstream_addr", "upstream_status", "upstream_connect_time", "upstream_header_time", "upstream_response_time", "upstream_cache_status",
        "sent_http_content_type", "sent_http_content_length", "sent_http_location",
        "gzip_ratio",
        "h_user_agent", "h_referer", "h_accept", "h_accept_language", "h_accept_encoding", "h_cache_control", "h_range", "h_if_modified_since", "h_if_none_match",
        "h_x_forwarded_for", "h_x_forwarded_proto", "h_x_forwarded_host", "h_x_request_id", "h_x_real_ip",
        "ssl_protocol", "ssl_cipher", "ssl_server_name", "ssl_session_reused", "ssl_client_verify", "ssl_client_s_dn", "ssl_client_i_dn", "uuid",
    ];
    ANALYSIS_LOG_COLS = [
        "uuid",
        "processed",
        "convicted",
        "reason",
        "details"
    ];
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
    nullIfDashOrEmpty(v) {
        if (v === undefined || v === null)
            return null;
        if (typeof v === "string") {
            const t = v.trim();
            if (t === "" || t === "-")
                return null;
            return t;
        }
        return v;
    }
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
    async addTuple(log) {
        (0, assert_1.default)(log != null, "must provide a log entry!");
        (0, assert_1.default)(this.initialized, "Credentials for logging in must be set!");
        (0, assert_1.default)(this.pool != null, "Pool not initialized!!");
        const exists = await this.checkIfTableExists(this.pool, "nginxlogs");
        (0, assert_1.default)(exists, "nginxlogs table not existing!!!");
        console.log(`connected to: ${this.details.CONNECTION_USER},${this.details.CONNECTION_HOST},${this.details.CONNECTION_DB_NAME},${this.details.CONNECTION_PORT}}`);
        let colsSql = this.COLS.join(",");
        let placeholders = this.COLS.map((_, i) => `$${i + 1}`).join(",");
        let values = this.COLS.map((c) => this.nullIfDashOrEmpty(log[c]));
        await this.pool.query(`INSERT INTO public."nginxlogs" (${colsSql}) VALUES (${placeholders})`, values);
        return true;
    }
    ;
    async addAnalysisTuple(log) {
        (0, assert_1.default)(log != null, "must provide a analysis entry!");
        (0, assert_1.default)(this.initialized, "Credentials for logging in must be set!");
        (0, assert_1.default)(this.pool != null, "Pool not initialized!!");
        const exists = await this.checkIfTableExists(this.pool, "analysis_log");
        (0, assert_1.default)(exists, "analysis_log table not existing!!!");
        console.log(`connected to: ${this.details.CONNECTION_USER},${this.details.CONNECTION_HOST},${this.details.CONNECTION_DB_NAME},${this.details.CONNECTION_PORT}}`);
        let colsSql = this.ANALYSIS_LOG_COLS.join(",");
        let placeholders = this.ANALYSIS_LOG_COLS.map((_, i) => `$${i + 1}`).join(",");
        let values = this.ANALYSIS_LOG_COLS.map((c) => this.nullIfDashOrEmpty(log[c]));
        await this.pool.query(`INSERT INTO public."analysis_log" (${colsSql}) VALUES (${placeholders})`, values);
        return true;
    }
    ;
    async runSQLQuery(query) {
        (0, assert_1.default)(this.pool != null, "Pool may not be initialized!!!");
        const r = await this.pool.query(query);
        return r.rows;
    }
    async runSQLParameterizedQuery(query, params = []) {
        (0, assert_1.default)(this.pool != null, "Pool may not be initialized!!!");
        const r = await this.pool.query(query, params);
        return r.rows;
    }
    async checkIfTableExists(pool, name) {
        const r = await pool.query(`SELECT to_regclass($1) IS NOT NULL AS exists`, [`public.${name}`]);
        return r.rows[0].exists === true;
    }
    async getNGINXLogFromUUID(uuid) {
        (0, assert_1.default)(this.pool != null, "Pool may not be initialized!!!");
        const cols = this.COLS.join(", ");
        const query = `SELECT ${cols}
FROM nginxlogs
WHERE uuid = $1
LIMIT 1`;
        const result = await this.runSQLParameterizedQuery(query, [uuid]);
        return result[0] ?? null;
    }
};
exports.DBConnector = DBConnector;
exports.DBConnector = DBConnector = __decorate([
    (0, common_1.Injectable)()
], DBConnector);
//# sourceMappingURL=listen.DBConnector.js.map