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

const { token } = req.body;

if (!token) {
    return res.status(400).json({ error: 'Token obrigatório' });
}

try {
    const ref = db.collection('tokens');
    const exists = await ref.where('token', '==', token).get();

    if (exists.empty) {
    await ref.add({ token });
    console.log('Token salvo:', token);
    } else {
    console.log('Token já existente:', token);
    }

    return res.status(200).json({ success: true });
} catch (err) {
    console.error('Erro interno ao salvar token:', err);
    return res.status(500).json({ error: err.message || 'Erro interno ao salvar token.' });
}
}
