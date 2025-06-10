import admin from 'firebase-admin';

if (!admin.apps.length) {
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();

const { token } = req.body;

if (!token) {
    return res.status(400).json({ error: 'Token obrigatório' });
}

try {
    const exists = await db.collection('tokens').where('token', '==', token).get();
    if (exists.empty) {
    await db.collection('tokens').add({ token });
    return res.status(200).json({ success: true });
    } else {
    return res.status(200).json({ success: true, message: 'Token já salvo' });
    }
} catch (err) {
    console.error('Erro ao salvar token:', err);
    return res.status(500).json({ error: 'Erro interno ao salvar token' });
}
}
