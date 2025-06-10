import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
    readFileSync(path.join(__dirname, 'service-account.json'), 'utf-8')
);

const app = express();
const port = 3000;



admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota para salvar token
app.post('/api/save-token', async (req, res) => {
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

    res.status(200).json({ success: true });
} catch (err) {
    console.error('Erro ao salvar token:', err);
    res.status(500).json({ error: 'Erro interno' });
}
});

app.listen(port, () => {
console.log(`✅ Servidor rodando em http://localhost:${port}`);
});
