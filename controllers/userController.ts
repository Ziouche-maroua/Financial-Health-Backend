import { Request, Response } from 'express';
import { addData, getData, updateData, deleteData } from '../data/firebaseData';
import { auth } from '../config/firebaseConfig'; // Import Firebase Auth

// User Interface
interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    photoURL?: string;
    lastLogin?: Date;
    role?: string;
}

// Create a new user and sign up
export const signupUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    try {
        // Create a user with email and password in Firebase Authentication
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        // Save the user to Firestore with additional info
        await addData('users', {
            id: userRecord.uid,
            name,
            email,
            role,
            createdAt: new Date(),
        });

        res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Login User (Authentication)
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Sign in user with Firebase Auth
        const userRecord = await auth.getUserByEmail(email);

        if (userRecord) {
            res.status(200).json({ message: 'User authenticated', userId: userRecord.uid });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await getData('users', id);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// Update User (name, role, etc.)
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        await updateData('users', id, updates);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Delete from Firebase Auth
        await auth.deleteUser(id);
        // Delete from Firestore
        await deleteData('users', id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
