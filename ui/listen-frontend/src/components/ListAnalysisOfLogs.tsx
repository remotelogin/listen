import { useQuery } from "@tanstack/react-query";
import { tableStyle, thStyle, tdStyle, rowStyle } from "../styling/TableStyles";

const runCustomSQL = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, sqlQuery] = queryKey;
  const response = await fetch(`../api/logs/custom?q=${encodeURIComponent(sqlQuery)}`);
  if (!response.ok) throw new Error('Failed to run SQL!');
  return response.json();
};

interface Props {
  autoRefresh:boolean;
}

function ListAnalysisOfLogs({ autoRefresh }: Props) {
  const sqlQuery =
    `SELECT
uuid        AS "Internal ID",
processed   AS "Processed",
convicted   AS "Convicted",
reason      AS "Reason",
details     AS "Details",
created_at  AS "Created At"
FROM analysis_log
ORDER BY created_at DESC
LIMIT 5;`;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['customSQL', sqlQuery],
    queryFn: runCustomSQL,
    refetchInterval: autoRefresh ?  2000 : false,
    enabled: autoRefresh,
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
    <table style={tableStyle}>
      <thead>
      <tr style={rowStyle}>
    {headers.map((header) => (
      <th key={header} style={thStyle}>
        {header}
      </th>
    ))}
    </tr>
    </thead>
      <tbody>
    {data.map((log:string, index:string) => (
      <tr key={index}>
        {headers.map((field:any) => (
	  <td
	  key={field}
	  style={{
	    ...tdStyle,
	    color: (
	      field === "processed" || field === "convicted" ? (log[field] ? "green" : "red") : undefined
	    ),
	    backgroundColor: (
	      field === "processed" || field === "convicted" ? (log[field] ? "green" : "red") : undefined
	    )	    
	  }}
	    >
	    {field === "created_at"
	      ? new Date(log[field]).toLocaleString()
	      : log[field].toString()}
	  </td>
	))}
      </tr>
    ))}
    </tbody>
    </table>
  );
  
}

export default ListAnalysisOfLogs;
