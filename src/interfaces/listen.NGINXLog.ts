export interface NGINXLog {

  // time
  ts: string;
  msec: number;
  pid: number;

  // conn details
  conn: string;
  conn_reqs: number;

  // client
  remote_addr: string;
  realip: string;
  remote_port: number;
  remote_user: string;

  // routing
  scheme: string;
  request_method: string;
  request: string;
  request_uri: string;
  uri: string;
  args: string;
  is_args: string;
  query_string: string;
  host: string;
  server_name: string;
  server_addr: string;
  server_port: number;
  server_protocol: string;

  // response
  status: number;
  body_bytes_sent: number;
  bytes_sent: number;
  request_length: number;

  // ping
  request_time: number;

  // upstream shit
  upstream_addr: string;
  upstream_status: string;
  upstream_connect_time: string;
  upstream_header_time: string;
  upstream_response_time: string;
  upstream_cache_status: string;

  // return resp header
  sent_http_content_type: string;
  sent_http_content_length: string;
  sent_http_location: string;

  // compression
  gzip_ratio: string;

  // request headers
  h_user_agent: string;
  h_referer: string;
  h_accept: string;
  h_accept_language: string;
  h_accept_encoding: string;
  h_cache_control: string;
  h_range: string;
  h_if_modified_since: string;
  h_if_none_match: string;
  h_x_forwarded_for: string;
  h_x_forwarded_proto: string;
  h_x_forwarded_host: string;
  h_x_request_id: string;
  h_x_real_ip: string;

// tls details
  ssl_protocol: string;
  ssl_cipher: string;
  ssl_server_name: string;
  ssl_session_reused: string;
  ssl_client_verify: string;
  ssl_client_s_dn: string;
  ssl_client_i_dn: string;

}
