import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config(); // carrega variáveis de ambiente do .env (caso rode localmente)

if (!admin.apps.length) {
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
}

const db = admin.firestore();

async function sendToAll() {
const snapshot = await db.collection('tokens').get();
const tokens = snapshot.docs.map(doc => doc.data().token).filter(Boolean);

if (!tokens.length) {
    console.log('Nenhum token encontrado.');
    return;
}

const message = {
    notification: {
    title: '🔔 Lembrete Diário',
    body: 'Você já bebeu água hoje? 💧',
    },
    tokens: tokens,
};

try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Enviadas: ${response.successCount}, Falhas: ${response.failureCount}`);
    response.responses.forEach((r, i) => {
    if (!r.success) {
        console.error(`→ Token com erro: ${tokens[i]}`);
        console.error(`   ${r.error.message}`);
    }
    });
} catch (err) {
    console.error('Erro inesperado ao enviar notificações:', err);
}
}

sendToAll();
