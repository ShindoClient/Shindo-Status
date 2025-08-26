import admin from 'firebase-admin';

let app: admin.app.App | null = null;

export function getAdminApp(): admin.app.App | null {
  if (app) return app;
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) return null;
  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
  } catch (e) {
    try { app = admin.app(); } catch {}
  }
  return app;
}

export const db: admin.firestore.Firestore | null = getAdminApp() ? admin.firestore() : null;
export { admin };
