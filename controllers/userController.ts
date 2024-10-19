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


// Function to handle user signup with email and password
export const signupUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Firebase create user (Authentication)
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        // Prepare user data for Firestore
        const userData = {
            firebaseUid: userRecord.uid, // Store Firebase UID in Firestore for future reference
            name,
            email,
            role,
            createdAt: new Date(),
        };

        // Use Firebase UID as the Firestore document ID
        const firestoreId = await addData('users', userData, userRecord.uid); // Pass the UID as document ID
        console.log('Firestore Document ID:', firestoreId); // Log the Firestore document ID

        // Return response with Firestore document ID (which is the same as Firebase UID)
        res.status(201).json({ message: 'User created successfully', firestoreId });
    } catch (error: any) {
        console.error('Error during signup:', error); // Log full error for debugging
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ message: 'Email already in use' });
        } else if (error.code === 'auth/invalid-password') {
            return res.status(400).json({ message: 'Invalid password' });
        } else {
            return res.status(500).json({ message: error.message });
        }
    }
}

// Function to handle user login with email and password
export const loginUser = async (req: Request, res: Response) => {
    const { idToken } = req.body; // Get ID token from the request

    try {
        // Verify the ID token
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid; // Get UID from the decoded token

        // Retrieve the corresponding Firestore document using the Firebase UID
        const userDoc = await getData('users', uid); // Use UID to get the user document

        if (!userDoc) {
            return res.status(404).json({ message: 'User not found in Firestore' });
        }

        // Optionally: Get additional user data from Firebase Authentication
        const userRecord = await auth.getUser(uid); // This will give you the Firebase user record

        res.status(200).json({ message: 'User authenticated', user: userRecord, firestoreId: userDoc.id });
    } catch (error: any) {
        console.error('Error verifying ID token:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Function to handle user signup with Google
export const signupWithGoogle = async (req: Request, res: Response) => {
    const { tokenId } = req.body; // Get the Google OAuth token from the client

    try {
        // Verify the Google ID token and get the user info
        const decodedToken = await auth.verifyIdToken(tokenId);

        const { name, email, uid } = decodedToken;

        // Check if the user already exists in Firestore
        const existingUser = await getData('users',  uid);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Save new user data to Firestore
        const userData = {
            firebaseUid: uid,
            name,
            email,
            role: 'user', // Set default role, or receive from the request body
            createdAt: new Date(),
        };
        const firestoreId = await addData('users', userData);

        res.status(201).json({
            message: 'Signup with Google successful',
            firestoreId,
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// Function to get user by ID
export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const user = await getData('users', id); // Retrieve user by Firestore ID (UID)
        console.log(user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error: any) {
        if (error.message === 'No such document') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Function to update user details (name, role, etc.)
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

// Function to delete a user
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
