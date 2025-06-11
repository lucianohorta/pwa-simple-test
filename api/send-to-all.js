import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
}

const db = admin.firestore();

export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();

try {
    const snapshot = await db.collection('tokens').get();
    const tokens = snapshot.docs.map(doc => doc.data().token);

    if (!tokens.length) return res.status(200).json({ message: 'No tokens' });

    const message = {
    notification: {
        title: 'Daily Reminder',
        body: 'Time to hydrate and check your goals!'
    },
    tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    res.status(200).json({ success: response.successCount, failure: response.failureCount });
} catch (err) {
    console.error('Erro ao enviar notificacoes:', err);
    res.status(500).json({ error: 'Erro interno ao enviar notificacoes.' });
}
}
