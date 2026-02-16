import { useState } from "react";
import ListLast5Logs from "./ListLast5Logs";
import ListAnalysisOfLogs from "./ListAnalysisOfLogs";
import ListLastConvicted from "./ListLastConvicted";
import StoredLogCount from "./StoredLogCount";
import { controlPanelStyle } from '../styling/PanelStyle'


import { buttonColors, pulseAnimation, floatingButtonInner } from "../styling/ButtonStyle";
import { floatingPanelLabel } from "../styling/PanelStyle";
import Orb from "./Orb";
import '../styling/TextHoverBlink.css'

function AutoRefreshButton() {
	const [autoRefresh, setAutoRefresh] = useState(true);
	const [excludeReferer, setExcludeReferer] = useState(true);

	const toggleAutoRefresh = () => setAutoRefresh(!autoRefresh);
	const toggleExcludeReferer = () => setExcludeReferer(!excludeReferer);

	return (<>
		<div style={{ backdropFilter: 'blur(50px)', width: '100%', height: '100%', zIndex: '-9', position: "fixed", top: '0', left: '0', backgroundColor: 'rgba(255, 255, 255, 0.1)', }}>
			<Orb />
		</div>

		<div style={{ padding: '1em', width: '100%' }}>
			<h3>Last 5 processed requests to server and associated analysis logs.</h3>
			<ListLast5Logs autoRefresh={autoRefresh} excludeReferer={excludeReferer} />
			<br />
			<ListAnalysisOfLogs autoRefresh={autoRefresh} excludeReferer={excludeReferer} />
			<br />
			<h3>Last 5 malicious requests to server. | <a href="https://www.abuseipdb.com/user/150383" className="smooth-blink-hover"> View on abuseIPDB</a></h3>
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
		<StoredLogCount autoRefresh={autoRefresh} />
	</>
	);
}

export default AutoRefreshButton;
