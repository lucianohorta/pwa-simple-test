app.use(cors({
    origin: true,
    credentials: true
}));

import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
readFileSync(path.join(__dirname, 'service-account.json'), 'utf-8')
);

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: `https://pwa-ios-bba82.firebaseio.com`
});

const db = admin.firestore();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Endpoints
app.post('/api/save-token', async (req, res) => {
    console.log("Received request to save token");

    const { token } = req.body;
    if (!token) {
        console.error("Token missing in request");
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const tokensRef = db.collection('tokens');
        const existing = await tokensRef.where('token', '==', token).get();

        if (existing.empty) {
        await tokensRef.add({ 
            token,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            userAgent: req.headers['user-agent'] || 'unknown'
        });
        console.log("New token saved:", token);
        } else {
        console.log("Token already exists:", token);
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error saving token:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
});

app.post('/api/send-to-all', async (req, res) => {
    try {
        const { title, body } = req.body;
        
        if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' });
        }

        const snapshot = await db.collection('tokens').get();
        const tokens = snapshot.docs.map(doc => doc.data().token);

        if (tokens.length === 0) {
        return res.status(200).json({ message: 'No devices registered' });
        }

        const message = {
        notification: { title, body },
        tokens
        };

        const response = await admin.messaging().sendMulticast(message);
        
        res.status(200).json({ 
        success: response.successCount, 
        failure: response.failureCount,
        responses: response.responses
        });
    } catch (err) {
        console.error('Error sending notifications:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});