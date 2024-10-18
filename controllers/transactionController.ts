


interface Transaction {
    id: string; // Unique transaction ID
    userId: string; // ID of the user who made the transaction
    type: 'income' | 'expense' | 'investment' | 'debt' | 'savings' | 'loan' | 'refund'; // Expanded transaction types
    amount: number; // Transaction amount
    description?: string; // Optional description of the transaction
    category: 'salary' | 'rent' | 'food' | 'entertainment' | 'transportation' | 'bills' | 'investments' | 'savings' | 'debt' | 'loans'; // Categories specific to the type
    date: Date; // Date of the transaction
    createdAt: Date; // Timestamp of when the transaction was recorded
}
