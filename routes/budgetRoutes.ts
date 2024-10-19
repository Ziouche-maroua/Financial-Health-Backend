// routes/budgetRoutes.ts

import express from 'express';
import { Request, Response } from 'express';
import {
  createBudget,
  getBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController';

const router = express.Router();

router.post('/budgets', createBudget);

router.get('/:id', async (req: Request, res: Response) => {
    await getBudget(req, res);
  });
router.put('/budgets/:id', updateBudget);
router.delete('/budgets/:id', deleteBudget);

export default router;
