import admin from "firebase-admin";

const hasValidConfig =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_PRIVATE_KEY !== "YOUR_PRIVATE_KEY_HERE" &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_CLIENT_EMAIL !== "YOUR_CLIENT_EMAIL_HERE";

if (hasValidConfig && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
} else if (!admin.apps.length) {
  console.warn("WARNING: Firebase credentials not configured. Auth endpoints will not work.");
  console.warn("Update FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in backend/.env");
}

export default admin;
