export type Transaction = {
    id: number;
    description: string;
    amount: number;
    category: 'Savings' | 'Expense' | 'Investment';
    date: string;
    currency: string;
}

export type NewTransaction = {
    id: number;
    description: string;
    amount: string;
    category: 'Savings' | 'Expense' | 'Investment';
    date: string;
    currency: string;
}
