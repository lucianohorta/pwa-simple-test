// /api/send-to-all.js
import admin from 'firebase-admin';

if (!admin.apps.length) {
admin.initializeApp({
    credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});
}

export default async function handler(req, res) {
if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
}

try {
    const db = admin.firestore();
    const snapshot = await db.collection('tokens').get();

    const tokens = snapshot.docs.map(doc => doc.data().token).filter(Boolean);

    if (!tokens.length) {
    return res.status(400).json({ error: 'No tokens available to send notifications.' });
    }

    const message = {
    notification: {
        title: 'Lembrete Diário!',
        body: 'Não se esqueça do seu compromisso hoje!',
    },
    tokens,
    };

    const response = await admin.messaging().sendMulticast(message);

    return res.status(200).json({
    success: true,
    sent: response.successCount,
    failed: response.failureCount,
    responses: response.responses,
    });

} catch (error) {
    console.error('Erro ao enviar notificações:', error);
    return res.status(500).json({ error: 'Erro interno ao enviar notificações.' });
}
}
