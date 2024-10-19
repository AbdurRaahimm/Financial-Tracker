import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { DollarSign, Edit2, Trash2 } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: 'Savings' | 'Expense' | 'Investment';
  date: string;
}

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [
      { id: 1, description: 'Salary', amount: 500, category: 'Savings', date: '2023-03-01' },
      { id: 2, description: 'Electricity Bill', amount: 200, category: 'Expense', date: '2023-03-05' },
      { id: 3, description: 'Buy Stocks', amount: 50, category: 'Investment', date: '2023-03-10' },
    ];
  });

  const [newTransaction, setNewTransaction] = useState({
    id: 0,
    description: '',
    amount: '',
    category: 'Savings',
    date: new Date().toISOString().split('T')[0],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [statisticsPeriod, setStatisticsPeriod] = useState('week');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTransaction.description && newTransaction.amount) {
      if (isEditing) {
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === newTransaction.id
              ? {
                  ...t,
                  description: newTransaction.description,
                  amount: parseFloat(newTransaction.amount),
                  category: newTransaction.category as 'Savings' | 'Expense' | 'Investment',
                  date: newTransaction.date,
                }
              : t
          )
        );
        setIsEditing(false);
      } else {
        setTransactions((prev) => [
          ...prev,
          {
            id: Date.now(),
            description: newTransaction.description,
            amount: parseFloat(newTransaction.amount),
            category: newTransaction.category as 'Savings' | 'Expense' | 'Investment',
            date: newTransaction.date,
          },
        ]);
      }
      setNewTransaction({ id: 0, description: '', amount: '', category: 'Savings', date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setNewTransaction({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const filterTransactions = (period: string) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return transactions;
    }

    return transactions.filter((t) => new Date(t.date) >= startDate);
  };

  const getStatistics = (period: string) => {
    const filteredTransactions = filterTransactions(period);
    const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    const data = [
      { name: 'Savings', value: filteredTransactions.filter((t) => t.category === 'Savings').reduce((sum, t) => sum + t.amount, 0) },
      { name: 'Expense', value: filteredTransactions.filter((t) => t.category === 'Expense').reduce((sum, t) => sum + t.amount, 0) },
      { name: 'Investment', value: filteredTransactions.filter((t) => t.category === 'Investment').reduce((sum, t) => sum + t.amount, 0) },
    ];

    return { totalAmount, data };
  };

  const { totalAmount, data } = getStatistics(selectedPeriod);

  const getBarChartData = () => {
    const periods = statisticsPeriod === 'week' ? 7 : statisticsPeriod === 'month' ? 4 : 12;
    const labels = statisticsPeriod === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                   statisticsPeriod === 'month' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                   ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return labels.map((label, index) => {
      const filteredTransactions = filterTransactions(statisticsPeriod).filter((t) => {
        const transactionDate = new Date(t.date);
        if (statisticsPeriod === 'week') {
          return transactionDate.getDay() === (index + 1) % 7;
        } else if (statisticsPeriod === 'month') {
          const weekNumber = Math.floor((transactionDate.getDate() - 1) / 7);
          return weekNumber === index;
        } else {
          return transactionDate.getMonth() === index;
        }
      });

      return {
        name: label,
        Savings: filteredTransactions.filter((t) => t.category === 'Savings').reduce((sum, t) => sum + t.amount, 0),
        Expense: filteredTransactions.filter((t) => t.category === 'Expense').reduce((sum, t) => sum + t.amount, 0),
        Investment: filteredTransactions.filter((t) => t.category === 'Investment').reduce((sum, t) => sum + t.amount, 0),
      };
    });
  };

  const calculateBalances = () => {
    const totalSavings = transactions.filter(t => t.category === 'Savings').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.category === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const totalInvestments = transactions.filter(t => t.category === 'Investment').reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = totalSavings - totalExpenses - totalInvestments;
    return { totalSavings,  currentBalance };
  };

  const { totalSavings,  currentBalance } = calculateBalances();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gray-800 text-white py-3 rounded">Expense Tracker</h1>
        <div className="flex flex-wrap -mx-4 mb-6">
          <div className="w-full md:w-1/2 px-4 mb-4">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">Savings Balance</h2>
              <p className="text-3xl font-bold text-blue-600">${totalSavings.toFixed(2)}</p>
            </div>
          </div>
         
          <div className="w-full md:w-1/2 px-4 mb-4">
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">Current Balance</h2>
              <p className="text-3xl font-bold text-green-600">${currentBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-6">
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
              <div className="text-center mt-4">
                <p className="text-2xl font-bold">Total</p>
                <p className="text-3xl font-bold text-green-500">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-around mt-4">
                {data.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                    <span>{entry.name}</span>
                    <span className="ml-2 font-bold">{totalAmount > 0 ? Math.round((entry.value / totalAmount) * 100) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getBarChartData()}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Savings" fill="#0088FE" />
                  <Bar dataKey="Expense" fill="#FF8042" />
                  <Bar dataKey="Investment" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Transaction' : 'New Transaction'}</h2>
              <div className="mb-4">
                <input
                  type="text"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <select
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="Savings">Savings</option>
                  <option value="Expense">Expense</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                {isEditing ? 'Update Transaction' : 'Add Transaction'}
              </button>
            </form>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">History</h2>
              <ul className="max-h-96 overflow-y-auto">
                {transactions.slice().reverse().map((transaction) => (
                  <li key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center">
                      <DollarSign className={`mr-2 ${transaction.category === 'Expense' ? 'text-red-500' : 'text-green-500'}`} />
                      <div>
                        <span>{transaction.description}</span>
                        <span className="text-xs text-gray-500 block">{transaction.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-bold mr-2 ${transaction.category === 'Expense' ? 'text-red-500' : 'text-green-500'}`}>
                        ${transaction.amount.toFixed(2)}
                      </span>
                      <button onClick={() => handleEdit(transaction)} className="text-blue-500 hover:text-blue-700 mr-2">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(transaction.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;