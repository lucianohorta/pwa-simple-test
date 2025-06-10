import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
}

const db = admin.firestore();

async function sendToAll() {
try {
    const snapshot = await db.collection('tokens').get();
    const tokens = snapshot.docs.map(doc => doc.data().token);

    if (!tokens.length) {
    console.log('Nenhum token encontrado.');
    return;
    }

    const message = {
    notification: {
        title: 'Lembrete diário',
        body: 'Hora de se hidratar e revisar seus planos!',
    },
    tokens
    };

    const response = await admin.messaging().sendMulticast(message);

    console.log(`✅ Enviadas: ${response.successCount}`);
    if (response.failureCount) {
    console.warn(`❌ Falhas: ${response.failureCount}`);
    console.warn(response.responses.filter(r => !r.success));
    }

} catch (err) {
    console.error('Erro ao enviar notificações:', err);
}
}

sendToAll();
