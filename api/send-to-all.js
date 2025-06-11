import admin from 'firebase-admin';

// Verifica se já foi inicializado (evita erro em ambiente serverless)
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
    return res.status(405).json({ error: 'Method Not Allowed' });
}

try {
    const snapshot = await db.collection('tokens').get();
    const tokens = snapshot.docs.map(doc => doc.data().token).filter(Boolean);

    if (tokens.length === 0) {
    return res.status(200).json({ success: false, message: 'No tokens found' });
    }

    const message = {
    notification: {
        title: 'Lembrete Diário',
        body: 'Não se esqueça de sua tarefa de hoje!',
    },
    tokens,
    };

    const response = await admin.messaging().sendMulticast(message);

    res.status(200).json({
    success: true,
    successCount: response.successCount,
    failureCount: response.failureCount,
    });
} catch (error) {
    console.error('Erro ao enviar notificações:', error);
    res.status(500).json({ error: 'Erro interno ao enviar notificações.' });
}
}
