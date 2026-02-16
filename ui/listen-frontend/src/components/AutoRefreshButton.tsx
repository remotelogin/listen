import { useState } from "react";
import ListLast5Logs from "./ListLast5Logs";
import ListAnalysisOfLogs from "./ListAnalysisOfLogs";
import ListLastConvicted from "./ListLastConvicted";
import StoredLogCount from "./StoredLogCount";
import { controlPanelStyle } from '../styling/PanelStyle'


import { buttonColors, pulseAnimation, floatingButtonInner } from "../styling/ButtonStyle";
import { floatingPanelLabel } from "../styling/PanelStyle";
import Orb from "./Orb";

function AutoRefreshButton() {
	const [autoRefresh, setAutoRefresh] = useState(true);
	const [excludeReferer, setExcludeReferer] = useState(true);

	const toggleAutoRefresh = () => setAutoRefresh(!autoRefresh);
	const toggleExcludeReferer = () => setExcludeReferer(!excludeReferer);

	return (<>
	  <Orb/>
	    <div style={{ padding: '1em', width: '100%'}}>
			<StoredLogCount autoRefresh={autoRefresh} />
			<h3>Last 5 processed requests to server and associated analysis logs.</h3>
			<ListLast5Logs autoRefresh={autoRefresh} excludeReferer={excludeReferer} />
			<br />
			<ListAnalysisOfLogs autoRefresh={autoRefresh} excludeReferer={excludeReferer} />
			<br />
			<h3>Last 5 malicious requests to server.</h3>
			<ListLastConvicted autoRefresh={autoRefresh} />

			<div style={controlPanelStyle}>
				<div style={floatingPanelLabel}>Auto Refresh</div>

				<button
					onClick={toggleAutoRefresh}
					style={{
						...floatingButtonInner,
						backgroundColor: autoRefresh ? buttonColors.on : buttonColors.off,
						animation: autoRefresh ? 'pulse 2s ease-in-out infinite' : 'none',
						marginBottom: '0.5em'
					}}
				>
					{autoRefresh ? 'ON' : 'OFF'}
				</button>

				<div style={floatingPanelLabel}>Include Panel</div>

				<button
					onClick={toggleExcludeReferer}
					style={{
						...floatingButtonInner,
						backgroundColor: excludeReferer ? buttonColors.on : buttonColors.off,
					}}
				>
					{excludeReferer ? 'ON' : 'OFF'}
				</button>
			</div>
			<style>{pulseAnimation}</style>
	  </div>
	  </>
	  );
}

export default AutoRefreshButton;
