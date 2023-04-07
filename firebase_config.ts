const admin = require("firebase-admin");
const fcm = require("fcm-notification");

let FCM: any;

const setFirebase = () => {
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  serviceAccount.private_key = serviceAccount
    .private_key!.split(String.raw`\n`)
    .join("\n");

  const certPath = admin.credential.cert(serviceAccount); 

  FCM = new fcm(certPath);
};

export { setFirebase, FCM };
