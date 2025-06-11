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

export default async function handler(req, res) {
if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
}

try {
    const snapshot = await admin.firestore().collection('tokens').get();
    const tokens = snapshot.docs.map(doc => doc.data().token).filter(Boolean);

    if (tokens.length === 0) {
    return res.status(400).json({ error: 'Nenhum token disponível para notificação.' });
    }

    const message = {
    notification: {
        title: 'Lembrete Diário',
        body: 'Essa é sua notificação push diária!',
    },
    tokens: tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    res.status(200).json({ success: true, response });
} catch (error) {
    console.error('Erro ao enviar notificações:', error);
    res.status(500).json({ error: 'Erro interno ao enviar notificações.' });
}
}
