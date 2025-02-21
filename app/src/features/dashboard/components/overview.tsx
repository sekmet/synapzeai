//import { useEffect } from 'react'
import { Bar, BarChart, Line, LineChart, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { getAgentEngagedSessions, getAgentHandleTime, getAgentCustomerSatisfactionScore, getAgentSentimentScore } from "@/lib/api/reports";
import { useQuery } from "@tanstack/react-query";
import { useAgentActiveStore } from '@/stores/agentActive'

/*const engagedData = [
  { date: 'Jan 31', sessions: 15 },
  { date: 'Feb 14', sessions: 5 },
]*/

/*const handleTimeData = [
  { date: 'Jan 31', avg_handle_time_min: 7 },
  { date: 'Feb 14', avg_handle_time_min: 5 },
]*/

/*const csatData = [
  { date: 'Jan 31', avg_csat: 4 },
  { date: 'Feb 14', avg_csat: 3 },
]*/

/*const sentimentData = [
  { name: 'Negative', percentage: 11.67 },
  { name: 'Neutral', percentage: 83.33 },
  { name: 'Positive', percentage: 5.0 },
]*/

function LoadingWidget() {
  return (
    <div className="flex flex-col justify-center items-center h-32">
    <svg
      className="animate-spin h-24 w-24 text-gray-400 dark:text-blue-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
  )
}


const COLORS = ['#ff4d4f', '#faad14', '#52c41a']

interface OverviewProps {
  chartType: 'engaged' | 'handleTime' | 'csat' | 'sentiment'
}

export function Overview({ chartType }: OverviewProps) {
  const { getAgentContainerId, refresh } = useAgentActiveStore((state) => state);

  const { data: engagedData } = useQuery({
    queryKey: ['engagedData', refresh],
    queryFn: () => getAgentEngagedSessions(getAgentContainerId() ?? ''),
  })

  const { data: handleTimeData } = useQuery({
    queryKey: ['handleTimeData', refresh],
    queryFn: () => getAgentHandleTime(getAgentContainerId() ?? ''),
  })

  const { data: csatData } = useQuery({
    queryKey: ['csatData', refresh],
    queryFn: () => getAgentCustomerSatisfactionScore(getAgentContainerId() ?? ''),
  })

  const { data: sentimentData } = useQuery({
    queryKey: ['sentimentData', refresh],
    queryFn: () => getAgentSentimentScore(getAgentContainerId() ?? ''),
  })


  const renderChart = () => {
    switch (chartType) {
      case 'engaged':
        return engagedData ?(
          <BarChart data={engagedData}>
            <XAxis
              dataKey='date'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Bar
              dataKey='sessions'
              fill='currentColor'
              radius={[4, 4, 0, 0]}
              className='fill-chart-1'
            />
          </BarChart>
        ) : <LoadingWidget />
      case 'handleTime':
        return handleTimeData ? (
          <LineChart data={handleTimeData}>
            <XAxis
              dataKey='date'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='avg_handle_time_min'
              stroke='currentColor'
              strokeWidth={2}
              dot={{ fill: 'currentColor' }}
            />
          </LineChart>
        ) : <LoadingWidget />
      case 'csat':
        return csatData ? (
          <LineChart data={csatData}>
            <XAxis
              dataKey='date'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 5]}
            />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='avg_csat'
              stroke='currentColor'
              strokeWidth={2}
              dot={{ fill: 'currentColor' }}
            />
          </LineChart>
        ) : <LoadingWidget />
      case 'sentiment':
        return sentimentData ? (
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={sentimentData}
              cx='50%'
              cy='50%'
              innerRadius='60%'
              outerRadius='80%'
              fill='#8884d8'
              paddingAngle={5}
              dataKey='percentage'
            >
              {sentimentData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}>
                  {entry.name}: {entry.percentage}%
                </Cell>
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : <LoadingWidget />
    }
  }

  return (
    <ResponsiveContainer width='100%' height={200}>
      {renderChart()}
    </ResponsiveContainer>
  )
}
