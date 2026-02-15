import { IDBConnector } from '../interfaces/listen.IDBConnector';
import { Pool } from 'pg';
import { NGINXLog } from 'src/classes/listen.NGINXLog';
import { AnalysisEntry } from 'src/classes/listen.AnalysisEntry';
export declare class DBConnector implements IDBConnector {
    private details;
    private initialized;
    pool: Pool | null;
    COLS: readonly ["ts", "msec", "pid", "conn", "conn_reqs", "remote_addr", "realip", "remote_port", "remote_user", "scheme", "request_method", "request", "request_uri", "uri", "args", "is_args", "query_string", "host", "server_name", "server_addr", "server_port", "server_protocol", "status", "body_bytes_sent", "bytes_sent", "request_length", "request_time", "upstream_addr", "upstream_status", "upstream_connect_time", "upstream_header_time", "upstream_response_time", "upstream_cache_status", "sent_http_content_type", "sent_http_content_length", "sent_http_location", "gzip_ratio", "h_user_agent", "h_referer", "h_accept", "h_accept_language", "h_accept_encoding", "h_cache_control", "h_range", "h_if_modified_since", "h_if_none_match", "h_x_forwarded_for", "h_x_forwarded_proto", "h_x_forwarded_host", "h_x_request_id", "h_x_real_ip", "ssl_protocol", "ssl_cipher", "ssl_server_name", "ssl_session_reused", "ssl_client_verify", "ssl_client_s_dn", "ssl_client_i_dn", "uuid"];
    ANALYSIS_LOG_COLS: readonly ["uuid", "processed", "convicted", "reason", "details"];
    setCredentials(username: string, password: string, hostname: string, port: number, dbname: string): void;
    nullIfDashOrEmpty(v: unknown): any;
    connectToBackend(): boolean;
    addTuple(log: NGINXLog): Promise<boolean>;
    addAnalysisTuple(log: AnalysisEntry): Promise<boolean>;
    runSQLQuery(query: string): Promise<any[]>;
    runSQLParameterizedQuery(query: string, params?: any[]): Promise<any[]>;
    checkIfTableExists(pool: Pool, name: string): Promise<boolean>;
}
