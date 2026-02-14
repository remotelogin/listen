export class NGINXLog {

  // reference
  uuid: string = "";
  
  // time
  ts = "";
  msec = 0;
  pid = 0;
  
  // conn details
  conn = "";
  conn_reqs = 0;
  
  // client 
  remote_addr = "";
  realip = "";
  remote_port = 0;
  remote_user = "";
  
  // routing
  scheme = "";
  request_method = "";
  request = "";
  request_uri = "";
  uri = "";
  args = "";
  is_args = "";
  query_string = "";
  host = "";
  server_name = "";
  server_addr = "";
  server_port = 0;
  server_protocol = "";
  
  // response
  status = 0;
  body_bytes_sent = 0;
  bytes_sent = 0;
  request_length = 0;
  
  // ping
  request_time = 0;
  
  // upstream shit
  upstream_addr = "";
  upstream_status = "";
  upstream_connect_time = "";
  upstream_header_time = "";
  upstream_response_time = "";
  upstream_cache_status = "";
  
  // return resp header
  sent_http_content_type = "";
  sent_http_content_length = "";
  sent_http_location = "";
  
  // compression
  gzip_ratio = "";
  
  // request headers
  
  h_user_agent = "";
  h_referer = "";
  h_accept = "";
  h_accept_language = "";
  h_accept_encoding = "";
  h_cache_control = "";
  h_range = "";
  h_if_modified_since = "";
  h_if_none_match = "";
  h_x_forwarded_for = "";
  h_x_forwarded_proto = "";
  h_x_forwarded_host = "";
  h_x_request_id = "";
  h_x_real_ip = "";
  
  // tls details
  ssl_protocol = "";
  ssl_cipher = "";
  ssl_server_name = "";
  ssl_session_reused = "";
  ssl_client_verify = "";
  ssl_client_s_dn = "";
  ssl_client_i_dn = "";

}
