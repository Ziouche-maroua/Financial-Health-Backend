import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes'; 
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import reportRoutes from './routes/reportRoutes';
import {verifyToken} from './middlewares/authMiddleware'; // (optional) for global route protection
import dotenv from 'dotenv'; // For loading environment variables

dotenv.config(); // Load environment variables from .env file

const app: Application = express();

// Middleware for CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods if needed
    credentials: true, // Allow cookies or authorization headers (if necessary)
}));


// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(verifyToken);

// Route for health check (optional)
app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Routes
app.use('/api', userRoutes);
app.use('/api', transactionRoutes);
app.use('/api', budgetRoutes);
app.use('/api', reportRoutes);


// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
