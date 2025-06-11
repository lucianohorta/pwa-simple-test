import admin from 'firebase-admin';

const tokensRef = admin.firestore().collection('tokens');

export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();

try {
    const snapshot = await tokensRef.get();
    const tokens = snapshot.docs.map(doc => doc.data().token).filter(Boolean);

    if (tokens.length === 0) {
    return res.status(400).json({ error: 'Nenhum token disponível.' });
    }

    const message = {
    notification: {
        title: 'Lembrete Diário',
        body: 'Essa é sua notificação diária!',
    },
    tokens, // ← corretamente usado para enviar para vários
    };

    const response = await admin.messaging().sendMulticast(message);
    res.json({ success: true, response });
} catch (error) {
    console.error('Erro ao enviar notificações:', error);
    res.status(500).json({ error: 'Erro interno ao enviar notificações.' });
}
}
