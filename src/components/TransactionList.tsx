import { DollarSign, Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '../types/types';


interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
  }
  
 const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
    return (
      <ul className="max-h-96 overflow-y-auto">
        {transactions.slice().reverse().map((transaction) => (
          <li key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center">
              <DollarSign
                className={`mr-2 ${transaction.category === 'Expense' ? 'text-red-500' : transaction.category === 'Savings' ? 'text-green-500' : 'text-yellow-500'}`}
              />
              <div>
                <span>{transaction.description}</span>
                <span className="text-xs text-gray-500 block">{transaction.date}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className={`font-bold mr-2 ${transaction.category === 'Expense' ? 'text-red-500' : transaction.category === 'Savings' ? 'text-green-500' : 'text-yellow-500'}`}>
                {transaction.amount.toFixed(2)} {transaction.currency}
              </span>
              <button onClick={() => onEdit(transaction)} className="text-blue-500 hover:text-blue-700 mr-2 print:hidden">
                <Edit2 size={16} />
              </button>
              <button onClick={() => onDelete(transaction.id)} className="text-red-500 hover:text-red-700 print:hidden">
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
  export default TransactionList;