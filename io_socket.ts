import { verify } from "jsonwebtoken";
import { Socket } from "socket.io";
import fs from "fs";
import { DbConnect } from "./src/Db_config";

let io: Socket;
let sockets: String[] = [];
// const socketDetailsJson = fs.readFileSync(
//   "./src/jsons/socketDetails.json",
//   "utf8"
// );
// let socketDetails: Map<string, any> = socketDetailsJson
//   ? new Map(Object.entries(JSON.parse(socketDetailsJson)))
//   : new Map();
// const userDetailsJson = fs.readFileSync("./src/jsons/userDetails.json", "utf8");
// let userDetails: Map<string, any> = userDetailsJson
//   ? new Map(Object.entries(JSON.parse(userDetailsJson)))
//   : new Map();

const socketDetails: Map<string, any> = new Map();
const userDetails: Map<string, any> = new Map();

const setIO = async (tempIo: Socket) => {
  io = tempIo;
};

const getIO = () => {
  return io;
};

const userDataToMap = async () => {
  const DbModels = await DbConnect();

  const userData = await DbModels?.user
    .find({})
    .select("userName deviceTokens socketIds");

  userData?.forEach((user) => {
    userDetails.set(user._id.toString(), {
      userName: user.userName,
      deviceTokens: user.deviceTokens,
      socketIds: user.socketIds,
    });
  });
};

const addSocket = async (tempSocket: Socket) => {
  const accessToken: String = tempSocket.handshake.query["accessToken"]
    ? (tempSocket.handshake.query["accessToken"] as String)
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImhhcnNoIiwiZW1haWxJZCI6ImFkbWluQGV4YW1wbGUuY29tIiwicGhvbmVOdW1iZXIiOjkwOTA5MDkwOTAsIl9pZCI6IjYzZDc4ZjFiYjIyYTI5YzExNTMxMjBkOSIsImlhdCI6MTY4MDMzMzU4NH0.KVT1RFjCdoD9uOacgQaOVZAmMFnqhcv_37bMMqwSETw";
  const deviceToken = tempSocket.handshake.query["fcmToken"]
    ? (tempSocket.handshake.query["fcmToken"] as String)
    : "fBCsyZYpQ56U81RG-j_V_N:APA91bGcwv77rxbNQiX4t0Q3Ui-Lz6nz8NwWD0HxkIQk_nTtuEfU-L4ZyHe1b2F0Ds5QKolMItOsMVjG6cOSRetp99dKmPaMS1qrA-jZ1FnwAmcPOMylyGc6jqdD38BmsCr18FcR90h9";

  let tempUserId: any;
  let userName: any;

  await verify(
    accessToken as string,
    process.env.JWT_SECRET as string,
    (err, decoded: any) => {
      if (err) {
        console.log(err);
        return;
      }
      tempUserId = decoded["_id"];
      userName = decoded["userName"];
    }
  );

  //check socket in Sockets
  if (sockets.includes(tempSocket.id)) {
  } else {
    sockets.push(tempSocket.id);
  }

  //check socket in Socket Detail
  if (socketDetails.has(tempSocket.id)) {
  } else {
    socketDetails.set(tempSocket.id, {
      userId: tempUserId,
      deviceTokens: [deviceToken],
    });

    // fs.writeFileSync(
    // "./src/jsons/socketDetails.json",
    // JSON.stringify(Object.fromEntries(socketDetails))
    // );
  }

  const DbModels = await DbConnect();

  //check user in User Detail
  const userDetail = userDetails.get(tempUserId);
  if (userDetails.has(tempUserId)) {
    if (userDetail["socketIds"].length == 0) {
      userDetails.set(tempUserId, {
        userName: userName,
        socketIds: [tempSocket.id],
        deviceTokens: [...userDetail["deviceTokens"], deviceToken],
      });

      // fs.writeFileSync(
      //   "./src/jsons/userDetails.json",
      //   JSON.stringify(Object.fromEntries(userDetails))
      // );

      await DbModels?.user.updateOne(
        { _id: tempUserId },
        {
          $set: {
            socketIds: [tempSocket.id],
          },
        }
      );
    } else {
      userDetails.set(tempUserId, {
        userName: userName,
        socketIds: [...userDetail["socketIds"], tempSocket.id],
        deviceTokens: [...userDetail["deviceTokens"], deviceToken],
      });

      // fs.writeFileSync(
      //   "./src/jsons/userDetails.json",
      //   JSON.stringify(Object.fromEntries(userDetails))
      // );
      if (userDetail["deviceTokens"].includes(deviceToken)) {
        await DbModels?.user.updateOne(
          { _id: tempUserId },
          {
            $push: {
              socketIds: tempSocket.id,
            },
          }
        );
      } else {
        console.log("New Device 1");
        await DbModels?.user.updateOne(
          { _id: tempUserId },
          {
            $push: {
              socketIds: tempSocket.id,
              deviceTokens: deviceToken,
            },
          }
        );
      }
    }
  } else {
    userDetails.set(tempUserId, {
      userName: userName,
      socketIds: [tempSocket.id],
      deviceTokens: [, , , userDetail["deviceTokens"], deviceToken],
    });

    await DbModels?.user.updateOne(
      { _id: tempUserId },
      {
        $set: {
          socketIds: [tempSocket.id],
        },
        $push: {
          deviceTokens: deviceToken,
        },
      }
    );
  }

  // await fs.writeFileSync(
  // "./src/jsons/userDetails.json",
  // JSON.stringify(Object.fromEntries(userDetails))
  // );
};

const getsocketIds = (userId: string) => {
  return userDetails.get(userId)!["socketIds"];
};

const getSocketDetail = (socketId: string) => {
  return socketDetails.get(socketId);
};

const isUserId = (userId: string) => {
  return userDetails.has(userId);
};

const getUserId = (socketId: string) => {
  return socketDetails.get(socketId)!["userId"];
};

const getUserDetail = (userId: string) => {
  return userDetails.get(userId);
};

const getUserName = (userId: string) => {
  console.log(userDetails.get(userId));
  return userDetails.get(userId)!["userName"];
};

const getDeviceTokens = (userId: string) => {
  return userDetails.get(userId)!["deviceTokens"];
};

const removeSocket = async (tempSocket: Socket) => {
  const index = sockets.indexOf(tempSocket.id);

  sockets.splice(index, 1);

  const userId = socketDetails.get(tempSocket.id)!["userId"];
  const userDetail = userDetails.get(userId);
  userDetail["socketIds"].splice(
    userDetail["socketIds"].indexOf(tempSocket.id),
    1
  );
  userDetails.set(userId, {
    socketIds: [...userDetail["socketIds"]],
    deviceTokens: userDetail["deviceTokens"],
  });

  // read file and make object
  // let userJson = JSON.parse(
  //   fs.readFileSync("./src/jsons/userDetails.json", "utf8")
  // );
  // // edit or add property
  // userJson[userId]["socketIds"] = "";
  // //write file
  // fs.writeFileSync("./src/jsons/userDetails.json", JSON.stringify(userJson));

  console.log(socketDetails);
  socketDetails.delete(tempSocket.id);
  console.log(socketDetails);

  //write file
  // fs.writeFileSync(
  //   "./src/jsons/socketDetails.json",
  //   JSON.stringify(Object.fromEntries(socketDetails))
  // );

  const DbModels = await DbConnect();

  console.log(tempSocket.id);

  DbModels?.user.updateOne(
    { _id: userId },
    {
      $pull: {
        socketIds: tempSocket.id,
      },
    }
  );
};

const listSockets = () => {
  return sockets;
};

const listOtherSockets = (tempSocket: Socket) => {
  return sockets.filter((socket) => socket != tempSocket.id);
};

const isSocket = (tempSocket: Socket) => {
  return sockets.includes(tempSocket.id);
};

const socketLength = () => {
  return sockets.length;
};

export default {
  setIO,
  getIO,
  userDataToMap,
  addSocket,
  getsocketIds,
  getSocketDetail,
  isUserId,
  getUserId,
  getUserDetail,
  getUserName,
  getDeviceTokens,
  removeSocket,
  listSockets,
  listOtherSockets,
  isSocket,
  socketLength,
};
