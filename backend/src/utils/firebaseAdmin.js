import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;