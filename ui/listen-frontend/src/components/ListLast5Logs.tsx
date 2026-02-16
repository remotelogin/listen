import { useQuery } from "@tanstack/react-query";
import { tableStyle, thStyle, tdStyle, rowStyle } from "../styling/TableStyles";

const runCustomSQL = async ({ queryKey }: { queryKey: [string, string] }) => {
	const [, sqlQuery] = queryKey;
	const response = await fetch(`../api/logs/custom?q=${encodeURIComponent(sqlQuery)}`);
	if (!response.ok) throw new Error('Failed to run SQL!');
	return response.json();
};

interface Props {
  autoRefresh: boolean;
  excludeReferer: boolean;
}

function ListLast5Logs({ autoRefresh, excludeReferer }: Props) {

  const sqlQuery =
    `SELECT ts AS "Time", remote_addr AS "Client IP", request_method AS "Method", request_uri AS "URI", status AS "Status", body_bytes_sent AS "Bytes Sent", uuid AS "Internal ID", upstream_addr AS "Upstream Server", upstream_status AS "Upstream Status", h_user_agent AS "User Agent", h_referer AS "Referer" FROM nginxlogs ORDER BY ts DESC LIMIT 5;`;
const sqlQueryNoReferer =
    `SELECT
ts AS "Time",
remote_addr AS "Client IP",
request_method AS "Method",
request_uri AS "URI",
status AS "Status",
body_bytes_sent AS "Bytes Sent",
uuid AS "Internal ID",
upstream_addr AS "Upstream Server",
upstream_status AS "Upstream Status",
h_user_agent AS "User Agent",
h_referer AS "Referer"
FROM nginxlogs
WHERE h_referer <> '"https://gamma.pm/panel/"'
OR h_referer IS NULL
ORDER BY ts DESC
LIMIT 5;`;
  
	const { data, isLoading, error } = useQuery({
	  queryKey: ['customSQL', excludeReferer ? sqlQuery : sqlQueryNoReferer],
		queryFn: runCustomSQL,
		refetchInterval: autoRefresh ? 2000 : false,
		enabled: autoRefresh,
	});

	if (isLoading) return <p>Loading logs...</p>;
	if (error) return <p>Error: {error.message}</p>;


	const log = Array.isArray(data) ? data[0] : data;

	if (!log) return <p>No log found.</p>;

	console.log(data);
	let fields: string[] = Object.keys(data[0]);

	for (let field of fields) {
		console.log(field);
	}

	const headers: string[] = Object.keys(data[0]);

	return (
		<div>
			<table style={tableStyle}>
				<thead>
					<tr>
						{headers.map((header) => (
							<th key={header} style={thStyle} > {header} </th>
						))}

					</tr>
				</thead>
				<tbody>
					{data.map((log: string, index: string) => (
						<tr key={index} style={rowStyle}>
							{headers.map((field: any) => (
								<td key={field} style={tdStyle}>
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
