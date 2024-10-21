import TrendChart from "./TrendChart";

interface TrendProps {
    statisticsPeriod: string;
    setStatisticsPeriod: (period: string) => void;
    getBarChartData: () => { name: string; Savings: number; Expense: number; Investment: number }[];
}   

export default function Trend({ statisticsPeriod, setStatisticsPeriod, getBarChartData }: TrendProps) {
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Trend</h2>
                <select
                    value={statisticsPeriod}
                    onChange={(e) => setStatisticsPeriod(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                </select>
            </div>
            <TrendChart data={getBarChartData()} />
        </>
    )
}
