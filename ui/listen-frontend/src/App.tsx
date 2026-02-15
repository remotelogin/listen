import './App.css'
import ListAnalysisOfLogs from './components/ListAnalysisOfLogs'
import ListLast5Logs from './components/ListLast5Logs'
import StoredLogCount from './components/StoredLogCount'

function App() {
  
  return (<>
    <StoredLogCount/>
    <ListLast5Logs/>
    <ListAnalysisOfLogs/>
    </>)

}

export default App

