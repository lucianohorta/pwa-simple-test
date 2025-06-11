import admin from 'firebase-admin';

const appInitialized = admin.apps.length;

if (!appInitialized) {
admin.initializeApp({
    credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});
}

const db = admin.firestore();

export default async function handler(req, res) {
if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
}

const { token } = req.body;

if (!token) {
    return res.status(400).json({ error: 'Token is required.' });
}

try {
    await db.collection('tokens').add({
    token,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ success: true });
} catch (error) {
    console.error('Erro ao salvar token:', error);
    res.status(500).json({ error: 'Erro interno ao salvar token.' });
}
}
