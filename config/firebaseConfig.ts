// Import Firebase Admin SDK for server-side applications
import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin'; // Import the ServiceAccount type

// Import your Firebase service account JSON file
import serviceAccount from '../mars-financial-health-firebase-adminsdk-pbd9y-24ff7d2e8b.json';

// Initialize the Firebase admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

// Initialize Firestore and Auth using Firebase Admin SDK
const db = admin.firestore(); // Correct Firestore initialization from Admin SDK
const auth = admin.auth(); // Authentication initialization

export { db, auth };
