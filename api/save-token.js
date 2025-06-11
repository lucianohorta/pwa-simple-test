import admin from 'firebase-admin';

if (!admin.apps.length) {
admin.initializeApp({
    credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});
}

const db = admin.firestore();

export default async function handler(req, res) {
if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
}

try {
    const { token } = req.body;
    if (!token) {
    return res.status(400).json({ error: 'Token required' });
    }

    await db.collection('tokens').add({
    token,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ success: true });
} catch (error) {
    console.error('Erro ao salvar token:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar token.' });
}
}
