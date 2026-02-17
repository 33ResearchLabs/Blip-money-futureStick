import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let initialized = false;

function initFirebase() {
  if (initialized || admin.apps.length) {
    return;
  }

  try {
    const serviceAccount = JSON.parse(
      readFileSync(join(__dirname, "firebase-service-account.json"), "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    initialized = true;
    console.log("✅ Firebase Admin SDK initialized");
  } catch (error) {
    console.warn("⚠️ Firebase Admin SDK not configured:", error.message);
  }
}

export function getFirebaseAdminAuth() {
  initFirebase();
  if (!admin.apps.length) {
    throw new Error("Firebase Admin SDK not initialized - check firebase-service-account.json");
  }
  return admin.auth();
}
