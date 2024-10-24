import React, { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import TransactionForm from './components/TransactionForm';
import Statistics from './components/Statistics';
import History from './components/History';
import Trend from './components/Trend';
import { Transaction, NewTransaction } from './types/types';
import Balances from './components/Balances';
import { CURRENCIES } from './data/currencies';
import Layout from './components/Layout';



const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    id: 0,
    description: '',
    amount: '',
    category: 'Savings',
    date: new Date().toISOString().split('T')[0],
    currency: 'BDT',
  });
  

  const [isEditing, setIsEditing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [statisticsPeriod, setStatisticsPeriod] = useState('week');
  const [historyFilter, setHistoryFilter] = useState('All');

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
                currency: newTransaction.currency,
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
            currency: newTransaction.currency,
          },
        ]);
      }
      setNewTransaction({ id: 0, description: '', amount: '', category: 'Savings', date: new Date().toISOString().split('T')[0], currency: 'BDT' });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setNewTransaction({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
      currency: transaction.currency,
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
    // Group transactions by currency
    const balancesByCurrency = CURRENCIES.reduce((acc, currency) => {
      const currencyTransactions = transactions.filter(t => t.currency === currency);

      if (currencyTransactions.length > 0) {
        const totalSavings = currencyTransactions
          .filter(t => t.category === 'Savings')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = currencyTransactions
          .filter(t => t.category === 'Expense')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalInvestments = currencyTransactions
          .filter(t => t.category === 'Investment')
          .reduce((sum, t) => sum + t.amount, 0);
        const costBalance = totalExpenses + totalInvestments;
        const currentBalance = totalSavings - costBalance;

        acc[currency] = { totalSavings, costBalance, currentBalance };
      }
      return acc;
    }, {} as Record<string, { totalSavings: number; costBalance: number; currentBalance: number }>);

    return balancesByCurrency;
  };

  const balancesByCurrency = calculateBalances();

  const filteredTransactions = historyFilter === 'All' ? transactions : transactions.filter(t => t.category === historyFilter);


  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>  
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div title='Print Document' className="fixed top-4 right-4 bg-white p-2 rounded-full shadow-md print:hidden">
        <Printer size={24} className="text-gray-600 cursor-pointer " onClick={handlePrint} />
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <Balances balancesByCurrency={balancesByCurrency} />  

        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-6">
           <Statistics 
           data={data}
           totalAmount={totalAmount}
           selectedPeriod={selectedPeriod}
           setSelectedPeriod={setSelectedPeriod}
           />
            <div className="bg-white p-6 rounded-lg shadow">
              <Trend 
              statisticsPeriod={statisticsPeriod} 
              setStatisticsPeriod={setStatisticsPeriod} 
              getBarChartData={getBarChartData}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4  ">
            <TransactionForm
              newTransaction={newTransaction}
              isEditing={isEditing}
              currencies={CURRENCIES}
              onSubmit={handleSubmit}
              onInputChange={handleInputChange}
            />
           
            <div className="bg-white p-6 rounded-lg shadow">
              <History historyFilter={historyFilter} setHistoryFilter={setHistoryFilter} filteredTransactions={filteredTransactions} handleEdit={handleEdit} handleDelete={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default App;