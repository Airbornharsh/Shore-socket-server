const admin = require("firebase-admin");
const fcm = require("fcm-notification");

const serviceAccount = require("../../firbaseConfig.json");
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
