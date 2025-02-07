import { Bar, BarChart, Line, LineChart, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'

const engagedData = [
  { date: 'Jan 31', sessions: 15 },
  { date: 'Feb 14', sessions: 5 },
]

const handleTimeData = [
  { date: 'Jan 31', time: 7 },
  { date: 'Feb 14', time: 5 },
]

const csatData = [
  { date: 'Jan 31', score: 4 },
  { date: 'Feb 14', score: 3 },
]

const sentimentData = [
  { name: 'Negative', value: 11.67 },
  { name: 'Neutral', value: 83.33 },
  { name: 'Positive', value: 5.0 },
]

const COLORS = ['#ff4d4f', '#faad14', '#52c41a']

interface OverviewProps {
  chartType: 'engaged' | 'handleTime' | 'csat' | 'sentiment'
}

export function Overview({ chartType }: OverviewProps) {
  const renderChart = () => {
    switch (chartType) {
      case 'engaged':
        return (
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
        )
      case 'handleTime':
        return (
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
              dataKey='time'
              stroke='currentColor'
              strokeWidth={2}
              dot={{ fill: 'currentColor' }}
            />
          </LineChart>
        )
      case 'csat':
        return (
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
              dataKey='score'
              stroke='currentColor'
              strokeWidth={2}
              dot={{ fill: 'currentColor' }}
            />
          </LineChart>
        )
      case 'sentiment':
        return (
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={sentimentData}
              cx='50%'
              cy='50%'
              innerRadius='60%'
              outerRadius='80%'
              fill='#8884d8'
              paddingAngle={5}
              dataKey='value'
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}>
                  {entry.name}: {entry.value}%
                </Cell>
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )
    }
  }

  return (
    <ResponsiveContainer width='100%' height={200}>
      {renderChart()}
    </ResponsiveContainer>
  )
}
