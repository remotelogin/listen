import { useQuery } from '@tanstack/react-query'

const fetchStoredLogs = async() => {
  const response = await fetch('../api/logs/count');
  if (!response.ok) {
    throw new Error('Failed to fetch logs')
  }
  return response.json()
}

function StoredLogCount() {

  console.log("fetching from api...");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['storedLogs'],
    queryFn: fetchStoredLogs,
  })
  
  if (isLoading) return <p>Loading users...</p>
  if (error) return <p>Error: {error.message}</p>

  return (<p> {data.total_entries}</p>)
  
}
export default StoredLogCount;
