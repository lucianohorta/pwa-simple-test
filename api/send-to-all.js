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

try {
    const snapshot = await db.collection('tokens').get();
    const tokens = snapshot.docs.map(doc => doc.data().token).filter(Boolean);

    if (tokens.length === 0) {
    return res.status(200).json({ success: false, message: 'No tokens to send.' });
    }

    const payload = {
    notification: {
        title: 'Lembrete Diário',
        body: 'Já tomou água hoje?',
    },
    };

    const response = await admin.messaging().sendToDevice(tokens, payload);
    res.status(200).json({ success: true, response });
} catch (error) {
    console.error('Erro ao enviar notificações:', error);
    res.status(500).json({ error: 'Erro interno ao enviar notificações.' });
}
}
