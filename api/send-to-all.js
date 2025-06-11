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
const messaging = admin.messaging();

export default async function handler(req, res) {
if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
}

try {
    const snapshot = await db.collection('tokens').get();
    const tokens = snapshot.docs.map(doc => doc.id).filter(Boolean);

    if (tokens.length === 0) {
    return res.status(400).json({ error: 'Nenhum token encontrado.' });
    }

    const notification = {
    notification: {
        title: 'Lembrete Diário',
        body: 'Essa é sua notificação push diária!',
    },
    };

    const results = await Promise.allSettled(
    tokens.map(token =>
        messaging.send({
        ...notification,
        token,
        })
    )
    );

    let successCount = 0;
    const invalidTokens = [];

    results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
        successCount++;
    } else {
        const errorCode = result.reason?.errorInfo?.code;
        if (errorCode === 'messaging/invalid-registration-token' || errorCode === 'messaging/registration-token-not-registered') {
        invalidTokens.push(tokens[index]);
        }
    }
    });

    // Remove tokens inválidos
    await Promise.all(
    invalidTokens.map(token =>
        db.collection('tokens').doc(token).delete()
    )
    );

    return res.status(200).json({ success: true, sent: successCount });
} catch (error) {
    console.error('Erro ao enviar notificações:', error);
    return res.status(500).json({ error: 'Erro interno ao enviar notificações.' });
}
}
