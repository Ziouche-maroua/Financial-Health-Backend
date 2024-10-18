import { Router } from 'express';
import { loginUser, signupUser, getUser, updateUser, deleteUser } from '../controllers/userController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// Route to create a user (public)
router.post('/signup', signupUser);

router.post('/login', loginUser);

// Route to get user by ID (protected)
router.get('/:id', verifyToken, getUser);

// Route to update user (protected)
router.put('/:id', verifyToken, updateUser);

// Route to delete user (protected)
router.delete('/:id', verifyToken, deleteUser);

export default router;
