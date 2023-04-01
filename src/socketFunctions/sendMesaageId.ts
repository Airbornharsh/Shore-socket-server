import { Socket } from "socket.io";
import io_socket from "../../io_socket";
import { pushNotification } from "./pushNotification";

const main = async (io: Socket, socket: Socket, data: any) => {
  console.log("Message Sent");

  //receiverUserId
  //message

  const receiverSocketId = io_socket.getSocketId(data.receiverUserId);
  const senderSocketId = socket.id;
  const senderUserId = io_socket.getUserId(senderSocketId);
  const senderUserName = io_socket.getUserName(senderUserId);
  const fcmTokens = await io_socket.getFcmTokens(data.receiverUserId);

  if (receiverSocketId.length == 0) {
    fcmTokens.forEach(async (fcmToken: string) => {
      await pushNotification(fcmToken, senderUserName, data.message, {
        senderUserId: senderUserId,
        senderSocketId: socket.id,
        receiverUserId: data.receiverUserId,
        receiverSocketId: "",
        message: data.message,
      });
    });
  } else {
    fcmTokens.forEach(async (fcmToken: string) => {
      await pushNotification(fcmToken, senderUserName, data.message, {
        senderUserId: senderUserId,
        senderSocketId: socket.id,
        receiverUserId: data.receiverUserId,
        receiverSocketId: receiverSocketId,
        message: data.message,
      });
    });

    io.to(receiverSocketId).emit("receive-message-id", {
      receiverUserId: data.receiverUserId,
      receiverSocketId: receiverSocketId,
      senderSocketId: socket.id,
      senderUserId: senderUserId,
      message: data.message,
    });
  }
};

export default main;
