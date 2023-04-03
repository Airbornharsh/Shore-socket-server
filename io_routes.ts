import { Socket } from "socket.io";
import io_socket from "./io_socket";
import addPostLike from "./src/socketControllers/signedUser/post/addLike";
import sendMessageId from "./src/socketFunctions/sendMesaageId";
import { DbConnect } from "./src/Db_config";

const main = async () => {
  await io_socket.userDataToMap();

  const io = io_socket.getIO();

  let count = 0;

  io.on("connection", (socket: Socket) => {
    console.log("connected");
    count++;
    console.log(count);
    io_socket.addSocket(socket);
    // socket.on("postLikeAdd", (data) => addPostLike(data, socket));
    // socket.on("check", (data: any) => {
    // console.log(data);
    // });
    socket.on("list-ids-request", (data) => {
      io.to(socket.id).emit("list-ids-response", {
        ids: io_socket.listOtherSockets(socket),
      });
    });

    socket.on("send-message-id", (data) => {
      sendMessageId(io, socket, data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      count--;
      console.log(count);
      if (count == 0) {
        console.log("None");
      }
      io_socket.removeSocket(socket);
    });
  });
};

export default main;
