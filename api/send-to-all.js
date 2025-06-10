import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
}

const db = admin.firestore();

export default async function handler(req, res) {
if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
}

try {
    const snapshot = await db.collection('tokens').get();
    const tokens = snapshot.docs.map(doc => doc.data().token);

    if (!tokens.length) {
    return res.status(200).json({ message: 'Nenhum token registrado.' });
    }

    const message = {
    notification: {
        title: 'Lembrete Diário',
        body: 'Você já tomou água hoje?',
    },
    tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    res.status(200).json({
    successCount: response.successCount,
    failureCount: response.failureCount,
    failed: response.responses.filter(r => !r.success),
    });
} catch (error) {
    console.error('Erro ao enviar notificações:', error);
    res.status(500).json({ error: 'Erro interno ao enviar notificações.' });
}
}
