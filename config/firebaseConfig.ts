// Import Firebase Admin SDK for server-side applications
import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Import your Firebase service account JSON file
import serviceAccount from '../mars-financial-health-firebase-adminsdk-pbd9y-24ff7d2e8b.json';

// Initialize the Firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };