// controllers/transactionController.ts

import { Request, Response } from 'express';
import { addData, getData, updateData, deleteData } from '../data/firebaseData';

// Define the Transaction interface inline
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


// Function to create a transaction

// Create a new transaction
export const createTransaction = async (req: any, res: Response) => {
  const transaction: Omit<Transaction, 'id' | 'userId'> = req.body;

  try {
    const newTransaction = {
      ...transaction,
      userId: req.user.uid, // Link to authenticated user
      createdAt: new Date(),
    };

    const transactionId = await addData('transactions', newTransaction); // Save to Firebase
    res.status(201).json({ message: 'Transaction created successfully', id: transactionId });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// Function to get a transaction by ID
// Get a transaction by ID
export const getTransaction = async (req: any, res: Response) => {
    const { id } = req.params;
  
    try {
      const transaction = await getData('transactions', id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Ensure only the owner or an admin can access the transaction
      if (transaction.userId !== req.user.uid ) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      res.status(200).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Function to update a transaction
// Update a transaction
export const updateTransaction = async (req: any, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const transaction = await getData('transactions', id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Ensure only the owner or an admin can update the transaction
      if (transaction.userId !== req.user.uid && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      await updateData('transactions', id, updates);
      res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Function to delete a transaction
// Delete a transaction
export const deleteTransaction = async (req: any, res: Response) => {
    const { id } = req.params;
  
    try {
      const transaction = await getData('transactions', id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Ensure only the owner or an admin can delete the transaction
      if (transaction.userId !== req.user.uid && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      await deleteData('transactions', id);
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
