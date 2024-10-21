import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


interface StatisticsProps {
    data: { name: string; value: number }[];
    totalAmount: number;
    selectedPeriod: string;
    setSelectedPeriod: (period: string) => void;
}

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

const Statistics: React.FC<StatisticsProps> = ({ data, totalAmount, selectedPeriod, setSelectedPeriod }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Statistics</h2>
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col md:flex-row justify-around mt-4 print:flex-row">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                        <span>{entry.name}</span>
                        <span className="ml-2 font-bold">
                            {totalAmount > 0 ? Math.round((entry.value / totalAmount) * 100) : 0}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;
