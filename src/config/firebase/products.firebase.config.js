import adminFirestore from 'firebase-admin';
import firebaseCredentials from './firebaseCredentials.json' assert { type: 'json' };
import env from '../env.config.js';

const appFirestore = adminFirestore.initializeApp({
  credential: adminFirestore.credential.cert(firebaseCredentials),
  databaseURL: `https://${env.DATABASE_FIRESTORE}.firebaseio.com`,
});

export { appFirestore };
