import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
import io_socket from "../../io_socket";

const main = async (req: Request, res: Response, next: NextFunction) => {
  try {
      
    res.send({ ok: "OK" });
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ message: e.message });
  }
};

export default main;
