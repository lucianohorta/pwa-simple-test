import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin using env variables
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Fix newline chars
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

// Save token endpoint
app.post('/api/save-token', async (req, res) => {
try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });

    await db.collection('tokens').add({
    token,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
}
});

// Vercel requires module.exports for serverless
export default app;