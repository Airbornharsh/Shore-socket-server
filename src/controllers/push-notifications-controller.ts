import { NextFunction, Request, Response } from "express";
import { FCM } from "../../firebase_config";

const SendPushNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    FCM.sendToMultipleToken(
      message,
      [
        "fagTvSMUSQ6kqeDLPHj0um:APA91bHPMx37m7Dv_m51ia5YWnRE8AYzBvS09KEFA5EyTMEG8Luklu0sVphMkNcG9WDiEzWENerZrrRo_-JNYePQ6F9NWr9jq_cEipzZoL0y6_iJJDLiHsNqhjJ9jK-0lQlNXAE9S0wu",
      ],
      function (err: any, response: any) {
        if (err) {
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      }
    );
    return res.status(500).send({ message: "OK" });
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

module.exports = {
  SendPushNotification,
};
