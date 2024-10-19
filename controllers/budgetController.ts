// controllers/budgetController.ts

import { Request, Response } from 'express';
import { addData, getData, updateData, deleteData } from '../data/firebaseData';

// Define the Budget interface inline
interface Budget {
  budgetId: string;
  userId: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  startDate: Date;
  endDate: Date;
}

// Function to create a budget
export const createBudget = async (req: Request, res: Response) => {
  const budget: Budget = req.body;

  try {
    // Use budgetId as the document ID
    await addData('budgets', budget, budget.budgetId);
    res.status(201).json({ message: 'Budget created successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get a budget by ID
export const getBudget = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const budget = await getData('budgets', id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json(budget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Function to update a budget
export const updateBudget = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    await updateData('budgets', id, updates);
    res.status(200).json({ message: 'Budget updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a budget
export const deleteBudget = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteData('budgets', id);
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
