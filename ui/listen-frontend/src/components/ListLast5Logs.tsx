import { useQuery } from "@tanstack/react-query";

const runCustomSQL = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, sqlQuery] = queryKey;
  const response = await fetch(`../api/logs/custom?q=${encodeURIComponent(sqlQuery)}`);
  if (!response.ok) throw new Error('Failed to run SQL!');
  return response.json();
};

interface Props {
  autoRefresh: boolean;
}

function ListLast5Logs({ autoRefresh }: Props) {
  
  const sqlQuery =
    `SELECT ts AS "Time", remote_addr AS "Client IP", realip AS "Real IP", request_method AS "Method", request_uri AS "URI", status AS "Status", body_bytes_sent AS "Bytes Sent", uuid AS "Internal ID", upstream_addr AS "Upstream Server", upstream_status AS "Upstream Status", h_user_agent AS "User Agent", h_referer AS "Referer" FROM nginxlogs ORDER BY ts DESC LIMIT 5;`;

  const { data, isLoading, error } = useQuery({
    queryKey: ['customSQL', sqlQuery],
    queryFn: runCustomSQL,
    refetchInterval: autoRefresh ? 2000 : false,
  });
  
  if (isLoading) return <p>Loading logs...</p>;
  if (error) return <p>Error: {error.message}</p>;
  

  const log = Array.isArray(data) ? data[0] : data;
  
  if (!log) return <p>No log found.</p>;

  console.log(data);
  let fields: string[] = Object.keys(data[0]);

  for(let field of fields) {
    console.log(field);
  }
  
  const headers: string[] = Object.keys(data[0]);
  
  return (
    <div>      
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
      <tr>
      {headers.map((header) => (
	<th
	key={header}
	style={{
          border: '1px solid #ccc',
          padding: '0.5em',
          backgroundColor: '#080808',
          textAlign: 'left',
	}}
          >
          {header}
	</th>
      ))}
    </tr>
      </thead>
      <tbody>
      {data.map((log:string, index:string) => (
	<tr key={index}>
          {headers.map((field:any) => (
            <td key={field} style={{ border: '1px solid #ccc', padding: '0.5em' }}>
              {log[field]}
            </td>
          ))}
	</tr>
      ))}
    </tbody>
      </table>
      </div>
  );
  
}

export default ListLast5Logs;
