# listen

- an anti bot/webscraper detector and usage statistics server

## installation

### nginx setup

add this to your nginx.conf to log in the right format to allow parsing:

```

    log_format main
  'ts=$time_iso8601\x1f'
  'msec=$msec\x1f'
  'pid=$pid\x1f'
  'conn=$connection\x1f'
  'conn_reqs=$connection_requests\x1f'

  'remote_addr=$remote_addr\x1f'
  'realip=$realip_remote_addr\x1f'
  'remote_port=$remote_port\x1f'
  'remote_user=$remote_user\x1f'

  'scheme=$scheme\x1f'
  'request_method=$request_method\x1f'
  'request="$request"\x1f'
  'request_uri="$request_uri"\x1f'
  'uri="$uri"\x1f'
  'args="$args"\x1f'
  'is_args="$is_args"\x1f'
  'query_string="$query_string"\x1f'
  'host="$host"\x1f'
  'server_name="$server_name"\x1f'
  'server_addr=$server_addr\x1f'
  'server_port=$server_port\x1f'
  'server_protocol=$server_protocol\x1f'

  'status=$status\x1f'
  'body_bytes_sent=$body_bytes_sent\x1f'
  'bytes_sent=$bytes_sent\x1f'
  'request_length=$request_length\x1f'

  'request_time=$request_time\x1f'

  'upstream_addr="$upstream_addr"\x1f'
  'upstream_status="$upstream_status"\x1f'
  'upstream_connect_time="$upstream_connect_time"\x1f'
  'upstream_header_time="$upstream_header_time"\x1f'
  'upstream_response_time="$upstream_response_time"\x1f'
  'upstream_cache_status="$upstream_cache_status"\x1f'

  'sent_http_content_type="$sent_http_content_type"\x1f'
  'sent_http_content_length="$sent_http_content_length"\x1f'
  'sent_http_location="$sent_http_location"\x1f'

  'gzip_ratio=$gzip_ratio\x1f'

  'h_user_agent="$http_user_agent"\x1f'
  'h_referer="$http_referer"\x1f'
  'h_accept="$http_accept"\x1f'
  'h_accept_language="$http_accept_language"\x1f'
  'h_accept_encoding="$http_accept_encoding"\x1f'
  'h_cache_control="$http_cache_control"\x1f'
  'h_range="$http_range"\x1f'
  'h_if_modified_since="$http_if_modified_since"\x1f'
  'h_if_none_match="$http_if_none_match"\x1f'
  'h_x_forwarded_for="$http_x_forwarded_for"\x1f'
  'h_x_forwarded_proto="$http_x_forwarded_proto"\x1f'
  'h_x_forwarded_host="$http_x_forwarded_host"\x1f'
  'h_x_request_id="$http_x_request_id"\x1f'
  'h_x_real_ip="$http_x_real_ip"\x1f'

  'ssl_protocol="$ssl_protocol"\x1f'
  'ssl_cipher="$ssl_cipher"\x1f'
  'ssl_server_name="$ssl_server_name"\x1f'
  'ssl_session_reused="$ssl_session_reused"\x1f'
  'ssl_client_verify="$ssl_client_verify"\x1f'
  'ssl_client_s_dn="$ssl_client_s_dn"\x1f'
  'ssl_client_i_dn="$ssl_client_i_dn"\x1f';

```

### postgresql setup:

- Install postgresql n enable the service + create postgres user / log in.

```
CREATE DATABASE nginx_access;
```

- Create table in db

```
psql -U postgres -d nginx_access -f initTable.sql
```

and analysis table

```
psql -U postgres -d nginx_access -f initAnalysisTable.sql
```


- Then create the ``` .credentials/database.key ``` file. an example would be:


```
user:postgres
password:huh
name:nginx_access
host:localhost
port:5432
```
