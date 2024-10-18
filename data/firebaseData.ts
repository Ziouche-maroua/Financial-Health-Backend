import { db } from '../config/firebaseConfig';

// Add data to a Firestore collection
export const addData = async (collection: string, data: object) => {
    try {
        const res = await db.collection(collection).add(data);
        return res.id;
    } catch (error) {
        // Type assertion to handle the error as an instance of Error
        if (error instanceof Error) {
            throw new Error(`Error adding data: ${error.message}`);
        }
        throw new Error('Error adding data: An unknown error occurred');
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
        // Type assertion to handle the error as an instance of Error
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
