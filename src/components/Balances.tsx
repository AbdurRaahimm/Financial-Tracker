
interface BalancesProps {
    balancesByCurrency: {
        [key: string]: {
            totalSavings: number;
            costBalance: number;
            currentBalance: number
        }
    };
}

export default function Balances({ balancesByCurrency }: BalancesProps) {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-center bg-gray-800 text-white py-3 rounded">Financial Tracker</h1>

            {
                Object.entries(balancesByCurrency).map(([currency, balance]) => (
                    <div className="flex flex-col md:flex-row flex-wrap -mx-4 mb-6" key={currency}>
                        <div className="flex-1 px-4 mb-4">
                            <div className="bg-blue-100 p-4 rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-2 text-blue-600">Savings Balance</h2>
                                <p className="text-3xl font-bold text-blue-600">
                                    {balance.totalSavings.toFixed(2)} {currency}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 px-4 mb-4">
                            <div className="bg-red-100 p-4 rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-2 text-red-600 ">Cost Balance</h2>
                                <p className="text-3xl font-bold text-red-600">{balance.costBalance.toFixed(2)} {currency}</p>
                            </div>
                        </div>

                        <div className=" flex-1 px-4 mb-4">
                            <div className="bg-green-100 p-4 rounded-lg shadow">
                                <h2 className="text-xl font-bold mb-2 text-green-600">Current Balance</h2>
                                <p className="text-3xl font-bold text-green-600">{balance.currentBalance.toFixed(2)} {currency}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
