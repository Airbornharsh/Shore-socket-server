const admin = require("firebase-admin");
const fcm = require("fcm-notification");
// const serviceAccount = require("../../envFirebaseConfig");

// console.log(process.env);

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

serviceAccount.private_key = serviceAccount.private_key!.replace(/\\n/g, "");

const certPath = admin.credential.cert(serviceAccount);

const FCM = new fcm(certPath);

export const pushNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data: any
) => {
  const message = {
    // to: fcmToken,
    token: fcmToken,
    notification: {
      title: title,
      body: body,
    },
    data: data,
  };

  console.log(message);

  FCM.send(message, function (err: any, response: any) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
