import { verify } from "jsonwebtoken";
import { Socket } from "socket.io";

let io: Socket;
let sockets: String[] = [];
let socketDetails: Map<string, any> = new Map();
let userDetails: Map<string, any> = new Map();

const setIO = (tempIo: Socket) => {
  io = tempIo;
};

const getIO = () => {
  return io;
};

const addSocket = async (tempSocket: Socket) => {
  const accessToken: String = tempSocket.handshake.query["accessToken"]
    ? (tempSocket.handshake.query["accessToken"] as String)
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImhhcnNoIiwiZW1haWxJZCI6ImFkbWluQGV4YW1wbGUuY29tIiwicGhvbmVOdW1iZXIiOjkwOTA5MDkwOTAsIl9pZCI6IjYzZDc4ZjFiYjIyYTI5YzExNTMxMjBkOSIsImlhdCI6MTY4MDMzMzU4NH0.KVT1RFjCdoD9uOacgQaOVZAmMFnqhcv_37bMMqwSETw";
  const fcmToken = tempSocket.handshake.query["fcmToken"]
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
      fcmTokens: [fcmToken],
    });
  }

  //check user in User Detail
  if (userDetails.has(tempUserId)) {
    if (userDetails.get(tempUserId)["socketId"].length == 0) {
      userDetails.set(tempUserId, {
        userName: userName,
        socketId: tempSocket.id,
        fcmTokens: [fcmToken],
      });
    }
  } else {
    userDetails.set(tempUserId, {
      userName: userName,
      socketId: tempSocket.id,
      fcmTokens: [fcmToken],
    });
  }

  // console.log(socketDetails);
  // console.log(userDetails);
};

const getSocketId = (userId: string) => {
  return userDetails.get(userId)!["socketId"];
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

const getFcmTokens = (userId: string) => {
  return userDetails.get(userId)!["fcmTokens"];
};

const removeSocket = (tempSocket: Socket) => {
  const index = sockets.indexOf(tempSocket.id);

  sockets.splice(index, 1);

  const userId = socketDetails.get(tempSocket.id)!["userId"];
  const userDetail = userDetails.get(userId);
  userDetails.set(userId, {
    socketId: "",
    fcmTokens: userDetail["fcmTokens"],
  });

  socketDetails.delete(tempSocket.id);
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
  addSocket,
  getSocketId,
  getSocketDetail,
  isUserId,
  getUserId,
  getUserDetail,
  getUserName,
  getFcmTokens,
  removeSocket,
  listSockets,
  listOtherSockets,
  isSocket,
  socketLength,
};
