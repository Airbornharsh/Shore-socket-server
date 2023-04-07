import { Socket } from "socket.io";
import io_socket from "../../io_socket";
import { pushNotification } from "./pushNotification";

const main = async (io: Socket, socket: Socket, data: any) => {
  console.log("Message Sent");

  //receiverUserId
  //message

  if (io_socket.isUserId(data.receiverUserId)) {
    console.log("User is online");
  } else {
    console.log("User is not There");
    return;
  }

  const receiverSocketIds = io_socket.getsocketIds(data.receiverUserId);
  const senderSocketId = socket.id;
  const senderUserId = io_socket.getUserId(senderSocketId);
  const senderUserName = io_socket.getUserName(senderUserId);
  const deviceTokens = await io_socket.getDeviceTokens(data.receiverUserId);

  if (receiverSocketIds.length == 0) {
    deviceTokens.forEach(async (deviceToken: string) => {
      console.log(deviceToken);
      await pushNotification(deviceToken, senderUserName, data.message, {
        senderUserId: senderUserId,
        senderSocketId: socket.id,
        receiverUserId: data.receiverUserId,
        receiverSocketId: "",
        message: data.message,
      });
    });
  } else {
    deviceTokens.forEach(async (deviceToken: string) => {
      console.log(deviceToken);
      await pushNotification(deviceToken, senderUserName, data.message, {
        senderUserId: senderUserId,
        senderSocketId: socket.id,
        receiverUserId: data.receiverUserId,
        receiverSocketId: "",
        message: data.message,
      });
    });

    receiverSocketIds.forEach((receiverSocketId: string) => {
      io.to(receiverSocketId).emit("receive-message-id", {
        receiverUserId: data.receiverUserId,
        receiverSocketId: receiverSocketId,
        senderSocketId: socket.id,
        senderUserId: senderUserId,
        message: data.message,
      });
    });
  }
};

export default main;
