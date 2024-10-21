// TransactionForm.tsx
import React from 'react';

interface TransactionFormProps {
  newTransaction: {
    id: number;
    description: string;
    amount: string;
    category: 'Savings' | 'Expense' | 'Investment';
    date: string;
    currency: string;
  };
  isEditing: boolean;
  currencies: string[];
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  newTransaction,
  isEditing,
  currencies,
  onSubmit,
  onInputChange,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow mb-6 print:hidden">
      <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Transaction' : 'New Transaction'}</h2>
      <div className="mb-4">
        <input
          type="text"
          name="description"
          value={newTransaction.description}
          onChange={onInputChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <select
          name="category"
          value={newTransaction.category}
          onChange={onInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Savings">Savings</option>
          <option value="Expense">Expense</option>
          <option value="Investment">Investment</option>
        </select>
      </div>
      <div className="mb-4 flex">
        <input
          type="number"
          name="amount"
          value={newTransaction.amount}
          onChange={onInputChange}
          placeholder="Amount"
          className="w-2/3 p-2 border rounded"
          required
        />
        <select
          name="currency"
          value={newTransaction.currency}
          onChange={onInputChange}
          className="w-1/3 p-2 border rounded"
          required
        >
          {currencies.map((currency, i) => (
            <option key={i} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <input
          type="date"
          name="date"
          value={newTransaction.date}
          onChange={onInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        {isEditing ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
