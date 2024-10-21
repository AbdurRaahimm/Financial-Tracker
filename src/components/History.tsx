import TransactionList from "./TransactionList";
import { Transaction } from "../types/types";

interface HistoryProps {
    historyFilter: string;
    setHistoryFilter: (filter: string) => void;
    filteredTransactions: Transaction[];
    handleEdit: (transaction: Transaction) => void;
    handleDelete: (id: number) => void;
}

export default function History({ historyFilter, setHistoryFilter, filteredTransactions, handleEdit, handleDelete }: HistoryProps) {
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">History</h2>
                <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="All">All</option>
                    <option value="Savings">Savings</option>
                    <option value="Expense">Expense</option>
                    <option value="Investment">Investment</option>
                </select>
            </div>
            <TransactionList transactions={filteredTransactions} onEdit={handleEdit} onDelete={handleDelete} />
        </>
    )
}
