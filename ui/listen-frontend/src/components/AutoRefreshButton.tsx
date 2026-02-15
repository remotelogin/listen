import { useState } from "react";
import ListLast5Logs from "./ListLast5Logs";
import ListAnalysisOfLogs from "./ListAnalysisOfLogs";
import ListLastConvicted from "./ListLastConvicted";
import StoredLogCount from "./StoredLogCount";

import { floatingButton, buttonColors, pulseAnimation } from "../styling/ButtonStyle";

function AutoRefreshButton() {
	const [autoRefresh, setAutoRefresh] = useState(true);

	const toggleAutoRefresh = () => setAutoRefresh(!autoRefresh);

	return (
		<div style={{ padding: '1em' }}>
			<StoredLogCount autoRefresh={autoRefresh} />
			<h3>Last 5 processed requests to server and associated analysis logs.</h3>
			<ListLast5Logs autoRefresh={autoRefresh} />
			<br />
			<ListAnalysisOfLogs autoRefresh={autoRefresh} />
			<br />
			<h3>Last 5 malicious requests to server.</h3>
			<ListLastConvicted autoRefresh={autoRefresh} />

			<button
				onClick={toggleAutoRefresh}
				style={{
					...floatingButton,
					backgroundColor: autoRefresh ? buttonColors.on : buttonColors.off,
					animation: autoRefresh ? 'pulse 2s ease-in-out infinite' : 'none',
				}}
			>
				{autoRefresh ? 'ON' : 'OFF'}
			</button>

			<style>{pulseAnimation}</style>
		</div>
	);
}

export default AutoRefreshButton;
