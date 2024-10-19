import { Router } from 'express';
import { signupUser, loginUser, getUser, updateUser, deleteUser } from '../controllers/userController';
import { Request, Response } from 'express';

const router = Router();

// Signup Route
router.post('/signup', async (req: Request, res: Response) => {
  await signupUser(req, res);
});

// Login Route
router.post('/login', async (req: Request, res: Response) => {
  await loginUser(req, res);
});

// Get User Route
router.get('/:id', async (req: Request, res: Response) => {
  await getUser(req, res);
});

// Update User Route
router.put('/:id', async (req: Request, res: Response) => {
  await updateUser(req, res);
});

// Delete User Route
router.delete('/:id', async (req: Request, res: Response) => {
  await deleteUser(req, res);
});

export default router;
