import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebaseConfig'; // Firebase Admin SDK Auth

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.body.user = decodedToken; // Attach the user info to the request
        next(); // Call next to pass control to the next middleware/handler
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
