import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!getApps().length) {
initializeApp({
    credential: cert(serviceAccount)
});
}

const db = getFirestore();
const messaging = getMessaging();

export default async function handler(req, res) {
if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
}

try {
    const snapshot = await db.collection('tokens').get();
    const tokens = snapshot.docs.map(doc => doc.data().token).filter(Boolean);

    if (tokens.length === 0) {
    return res.status(200).json({ message: 'Nenhum token encontrado.' });
    }

    const message = {
    notification: {
        title: 'Lembrete diário',
        body: 'Hora de se hidratar e revisar seus planos!'
    },
    tokens
    };

    const response = await messaging.sendMulticast(message);
    res.status(200).json({
    success: response.successCount,
    failure: response.failureCount,
    failedTokens: response.responses
        .map((r, i) => (!r.success ? tokens[i] : null))
        .filter(Boolean)
    });
} catch (err) {
    console.error('Erro ao enviar notificações:', err);
    res.status(500).json({ error: 'Erro interno ao enviar notificações.' });
}
}
