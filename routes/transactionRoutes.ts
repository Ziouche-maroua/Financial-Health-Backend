// routes/transactionRoutes.ts
import express from 'express';
import { Request, Response } from 'express';
import {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController';

import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Apply the authMiddleware to the routes that require authentication
router.post('/transactions', verifyToken, createTransaction); // Protect the createTransaction route

router.get('/:id', verifyToken, async (req: Request, res: Response) => {
    await getTransaction(req, res);
});

// If you're defining the same route multiple times (like for updating), ensure to use the correct HTTP method
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
    await updateTransaction(req, res);
});

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    await deleteTransaction(req, res);
});

export default router;
