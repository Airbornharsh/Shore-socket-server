import { Socket } from "socket.io";
import io_socket from "./io_socket";
import addPostLike from "./src/socketFunctions/signedUser/post/addLike";

const main = () => {
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
      console.log("sent");
      io.to(data.receiverSocketId).emit("receive-message-id", {
        receiverSocketId: data.receiverSocketId,
        senderSocketId: socket.id,
        senderUserId: data.senderUserId,
        message: data.message,
      });
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
