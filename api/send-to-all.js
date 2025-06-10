import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
}

const db = admin.firestore();

export default async function handler(req, res) {
if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
}

try {
    const snapshot = await db.collection('tokens').get();
    const tokens = snapshot.docs.map(doc => doc.data().token);

    if (tokens.length === 0) {
    return res.status(200).json({ message: 'Nenhum token encontrado.' });
    }

    const message = {
    notification: {
        title: 'Lembrete diário',
        body: 'Hora de se hidratar e revisar seus planos!',
    },
    tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    return res.status(200).json({
    success: response.successCount,
    failure: response.failureCount,
    responses: response.responses
    });

} catch (err) {
    console.error('Erro ao enviar notificações:', err); // <-- imprime o erro completo nos logs da Vercel
    return res.status(500).json({ error: err.message || 'Erro interno ao enviar notificações.' });
}
}
