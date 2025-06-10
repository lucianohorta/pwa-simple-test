import admin from "firebase-admin";

if (!admin.apps.length) {
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
}

const db = admin.firestore();

export default async function handler(req, res) {
// CORS headers
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
    let body = "";
    req.on("data", chunk => {
    body += chunk.toString();
    });

    req.on("end", async () => {
    try {
        const data = JSON.parse(body);
        const token = data.token;

        if (!token) {
        return res.status(400).json({ error: "Token ausente" });
        }

        const ref = db.collection("tokens");
        const exists = await ref.where("token", "==", token).get();

        if (exists.empty) {
        await ref.add({ token });
        console.log("Token salvo:", token);
        } else {
        console.log("Token já existe:", token);
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Erro ao salvar token:", err);
        return res.status(500).json({ error: "Erro ao salvar token" });
    }
    });
} catch (err) {
    console.error("Erro interno:", err);
    return res.status(500).json({ error: "Erro interno ao salvar token" });
}
}
