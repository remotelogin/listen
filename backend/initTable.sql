CREATE TABLE IF NOT EXISTS public.nginxlogs (
  id BIGSERIAL PRIMARY KEY,

  ts TIMESTAMPTZ NOT NULL,
  msec NUMERIC(16,3),
  pid INTEGER,

  conn TEXT,
  conn_reqs INTEGER,

  remote_addr INET,
  realip INET,
  remote_port INTEGER,
  remote_user TEXT,

  scheme TEXT,
  request_method TEXT,
  request TEXT,
  request_uri TEXT,
  uri TEXT,
  args TEXT,
  is_args TEXT,
  query_string TEXT,
  host TEXT,
  server_name TEXT,
  server_addr INET,
  server_port INTEGER,
  server_protocol TEXT,

  status INTEGER,
  body_bytes_sent BIGINT,
  bytes_sent BIGINT,
  request_length BIGINT,

  request_time DOUBLE PRECISION,

  upstream_addr TEXT,
  upstream_status TEXT,
  upstream_connect_time TEXT,
  upstream_header_time TEXT,
  upstream_response_time TEXT,
  upstream_cache_status TEXT,

  sent_http_content_type TEXT,
  sent_http_content_length TEXT,
  sent_http_location TEXT,

  gzip_ratio TEXT,

  h_user_agent TEXT,
  h_referer TEXT,
  h_accept TEXT,
  h_accept_language TEXT,
  h_accept_encoding TEXT,
  h_cache_control TEXT,
  h_range TEXT,
  h_if_modified_since TEXT,
  h_if_none_match TEXT,
  h_x_forwarded_for TEXT,
  h_x_forwarded_proto TEXT,
  h_x_forwarded_host TEXT,
  h_x_request_id TEXT,
  h_x_real_ip TEXT,

  ssl_protocol TEXT,
  ssl_cipher TEXT,
  ssl_server_name TEXT,
  ssl_session_reused TEXT,
  ssl_client_verify TEXT,
  ssl_client_s_dn TEXT,
  ssl_client_i_dn TEXT,
  uuid TEXT
);
