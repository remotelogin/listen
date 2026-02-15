import { useQuery } from '@tanstack/react-query'

const fetchStoredLogs = async() => {
  const response = await fetch('../api/logs/count');
  if (!response.ok) {
    throw new Error('Failed to fetch logs')
  }
  return response.json()
}

interface Props {
  autoRefresh:boolean;
}

function StoredLogCount({ autoRefresh }: Props) {

  console.log("fetching from api...");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['storedLogs'],
    queryFn: fetchStoredLogs,
    refetchInterval: 2000,
    enabled: autoRefresh,
  })
  
  if (isLoading) return <p>Loading users...</p>
  if (error) return <p>Error: {error.message}</p>

  return (<p> Total number of logged requests: {data[0].total_entries}</p>)
  
}
export default StoredLogCount;
