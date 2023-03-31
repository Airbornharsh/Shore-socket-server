const admin = require("firebase-admin");
const fcm = require("fcm-notification");

const serviceAccount = require("../../firbaseConfig.json");
const certPath = admin.credential.cert(serviceAccount);

const FCM = new fcm(certPath);

const SendPushNotification = async (req, res, next) => {
  try {
    const { title, body, token } = req.body;

    console.log(title, body, token);

    const message = {
      // to: token,
      token,
      notification: {
        title,
        body,
      },
      data: {
        title,
        body,
      },
    };

    FCM.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!");
        return res.status(500).send({ message: err.message });
      } else {
        console.log("Successfully sent with response: ", response);
        return res.status(200).json({
          message: "Push notification sent successfully",
          response,
        });
      }
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = {
  SendPushNotification,
};
