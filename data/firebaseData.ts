import { db } from '../config/firebaseConfig';
import admin from 'firebase-admin';

// Add data to a Firestore collection
// Modify addData to accept an optional documentId parameter
export const addData = async (collection: string, data: any, documentId?: string) => {
    try {
        if (documentId) {
            // If documentId is provided, use it as the Firestore document ID
            await db.collection(collection).doc(documentId).set(data);
            return documentId; // Return the provided document ID
        } else {
            // If no documentId is provided, add a new document with auto-generated ID
            const docRef = await db.collection(collection).add(data);
            return docRef.id; // Return auto-generated Firestore ID
        }
    } catch (error:any) {
        console.error('Error adding document: ', error);
        throw new Error('Error adding document');
    }
};


// Fetch data from a Firestore collection
export const getData = async (collection: string, docId: string) => {
    try {
        const doc = await db.collection(collection).doc(docId).get();
        if (doc.exists) {
            return doc.data();
        } else {
            throw new Error('No such document');
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error getting data: ${error.message}`);
        }
        throw new Error('Error getting data: An unknown error occurred');
    }
};



// Update data in Firestore
export const updateData = async (collection: string, docId: string, data: object) => {
    try {
        await db.collection(collection).doc(docId).update(data);
        return `Document updated`;
    } catch (error) {
        // Type assertion to handle the error as an instance of Error
        if (error instanceof Error) {
            throw new Error(`Error updating data: ${error.message}`);
        }
        throw new Error('Error updating data: An unknown error occurred');
    }
};

// Delete data from Firestore
export const deleteData = async (collection: string, docId: string) => {
    try {
        await db.collection(collection).doc(docId).delete();
        return `Document deleted`;
    } catch (error) {
        // Type assertion to handle the error as an instance of Error
        if (error instanceof Error) {
            throw new Error(`Error deleting data: ${error.message}`);
        }
        throw new Error('Error deleting data: An unknown error occurred');
    }
};

// Function to get user from Firebase by token
export const getUserFromFirebase = async (token: string) => {
    try {
        // Verify the token with Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid; // Extract the user ID from the decoded token

        // Fetch user data from Firestore
        const userDoc = await db.collection('users').doc(uid).get(); // Assuming users are stored in a 'users' collection
        if (!userDoc.exists) {
            throw new Error('User not found');
        }

        return {
            uid: userDoc.id,
            ...userDoc.data(), // Spread the user data
        };
    } catch (error:any) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
};
