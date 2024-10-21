import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';


interface TrendChartProps {
    data: { name: string; Savings: number; Expense: number; Investment: number }[];
  }
  
  const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Savings" fill="#0088FE" />
          <Bar dataKey="Expense" fill="#FF8042" />
          <Bar dataKey="Investment" fill="#FFBB28" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

export default TrendChart;
  