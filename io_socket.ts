import { Socket } from "socket.io";

let io: Socket;
let sockets: String[] = [];

const setIO = (tempIo: Socket) => {
  io = tempIo;
};

const getIO = () => {
  return io;
};

const addSocket = (tempSocket: Socket) => {
  console.log(tempSocket.id);
  sockets.push(tempSocket.id);
};

const removeSocket = (tempSocket: Socket) => {
  const index = sockets.indexOf(tempSocket.id);

  sockets.splice(index, 1);
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
  removeSocket,
  listSockets,
  listOtherSockets,
  isSocket,
  socketLength,
};
