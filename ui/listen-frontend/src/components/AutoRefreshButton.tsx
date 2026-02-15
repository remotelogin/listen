import { useState } from "react";
import ListLast5Logs from "./ListLast5Logs";
import ListAnalysisOfLogs from "./ListAnalysisOfLogs";
import ListLastConvicted from "./ListLastConvicted";
import StoredLogCount from "./StoredLogCount";

function AutoRefreshButton() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div>
      <button
        onClick={() => setAutoRefresh(!autoRefresh)}
        style={{ marginBottom: '1em', padding: '0.5em 1em' }}
      >
        {autoRefresh ? "Stop Auto-Refresh" : "Start Auto-Refresh"}
      </button>

      <ListLast5Logs autoRefresh={autoRefresh} />
      <ListAnalysisOfLogs autoRefresh={autoRefresh} />
      <ListLastConvicted autoRefresh={autoRefresh} />
      <StoredLogCount autoRefresh={autoRefresh} />
      </div>
  );
}

export default AutoRefreshButton;
