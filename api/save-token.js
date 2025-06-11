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
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token missing' });

    const tokensRef = db.collection('tokens');
    const existing = await tokensRef.where('token', '==', token).get();

    if (existing.empty) {
    await tokensRef.add({ token });
    }

    res.status(200).json({ success: true });
} catch (err) {
    console.error('Erro ao salvar token:', err);
    res.status(500).json({ error: 'Erro ao salvar token' });
}
}
