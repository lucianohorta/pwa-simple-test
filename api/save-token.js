import admin from "firebase-admin";

// Evita re-inicialização no Vercel a cada request
if (!admin.apps.length) {
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
}

const db = admin.firestore();

export default async function handler(req, res) {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
    return res.status(200).end();
}

if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
}

try {
    const snapshot = await db.collection("tokens").get();
    const tokens = snapshot.docs.map((doc) => doc.data().token);

    if (!tokens.length) {
    return res.status(200).json({ message: "Nenhum token encontrado." });
    }

    const message = {
    notification: {
        title: "Lembrete diário",
        body: "Hora de se hidratar e revisar seus planos!",
    },
    tokens: tokens,
    };

    const response = await admin.messaging().sendMulticast(message);

    return res.status(200).json({
    successCount: response.successCount,
    failureCount: response.failureCount,
    responses: response.responses,
    });
} catch (err) {
    console.error("Erro ao enviar notificações:", err);
    return res.status(500).json({ error: "Erro interno ao enviar notificações." });
}
}
